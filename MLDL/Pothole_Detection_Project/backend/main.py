from fastapi import FastAPI, UploadFile, WebSocket, WebSocketDisconnect, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from ultralytics import YOLO
import shutil
import subprocess
import os
import uuid
import cv2
import json
import base64
import numpy as np
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = YOLO("best.pt")

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"
REPORT_FOLDER = "reports"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

app.mount("/results", StaticFiles(directory="results"), name="results")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# ──────────────────────────────────────────────
# In-memory pothole map log  (survives one session)
# ──────────────────────────────────────────────
pothole_log: list[dict] = []


# ─────────────────────── HELPERS ───────────────────────

def get_severity(depth: str) -> str:
    return {"Shallow": "low", "Medium": "medium", "Deep": "high"}.get(depth, "low")

def get_severity_color(depth: str) -> str:
    return {"Shallow": "#39ff14", "Medium": "#ffb800", "Deep": "#ff3b5c"}.get(depth, "#39ff14")

def analyze_boxes(boxes):
    """Shared box-analysis logic. Returns list of pothole dicts."""
    results_list = []
    for box in boxes:
        x1, y1, x2, y2 = box
        width_px  = max(int(x2 - x1), 1)
        height_px = max(int(y2 - y1), 1)

        real_pothole_width = 0.6
        focal_length       = 800
        distance = (real_pothole_width * focal_length) / width_px

        pixel_to_meter = 0.01
        width_m  = width_px  * pixel_to_meter
        height_m = height_px * pixel_to_meter
        area_m2  = width_m * height_m

        if area_m2 > 1.0:
            depth = "Deep"
        elif area_m2 > 0.4:
            depth = "Medium"
        else:
            depth = "Shallow"

        severity_factor = {"Shallow": 1, "Medium": 2, "Deep": 3}[depth]
        score = area_m2 * severity_factor

        results_list.append({
            "width_m":    round(width_m,   2),
            "height_m":   round(height_m,  2),
            "area_m2":    round(area_m2,   2),
            "depth":      depth,
            "severity":   get_severity(depth),
            "color":      get_severity_color(depth),
            "distance_m": round(distance,  2),
            "score":      round(score,     2),
        })
    return results_list


def compute_road_stats(pothole_data: list[dict]):
    pothole_count = len(pothole_data)
    total_area    = sum(p["area_m2"] for p in pothole_data)
    total_score   = sum(p["score"]   for p in pothole_data)

    if pothole_count <= 2 and total_area < 1:
        road_condition = "Good Road"
    elif pothole_count <= 5 and total_area < 3:
        road_condition = "Damaged Road"
    else:
        road_condition = "Dangerous Road"

    speed_map = {"Good Road": "60 km/h", "Damaged Road": "40 km/h", "Dangerous Road": "20 km/h"}
    recommended_speed = speed_map[road_condition]

    warning_message = None
    for p in pothole_data:
        if p["depth"] == "Deep" and p["distance_m"] < 3:
            warning_message = "⚠ Severe pothole ahead! Reduce speed immediately."
            break
        elif p["depth"] == "Medium" and p["distance_m"] < 5:
            warning_message = "⚠ Pothole ahead! Drive carefully."
    if pothole_count > 5 and not warning_message:
        warning_message = "⚠ Multiple potholes detected. Road is unsafe."

    return road_condition, recommended_speed, round(total_score, 2), warning_message


# ─────────────────────── IMAGE DETECTION ───────────────────────

@app.post("/detect")
async def detect(
    file: UploadFile,
    lat:  float = Query(default=None),
    lng:  float = Query(default=None),
):
    unique_id   = str(uuid.uuid4())
    upload_path = f"{UPLOAD_FOLDER}/{unique_id}_{file.filename}"

    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_ext = file.filename.split(".")[-1].lower()

    # ── IMAGE ──
    if file_ext in ["jpg", "jpeg", "png"]:
        results      = model(upload_path, conf=0.25)
        boxes        = results[0].boxes.xyxy
        pothole_data = analyze_boxes(boxes)

        road_condition, recommended_speed, road_damage_score, warning_message = compute_road_stats(pothole_data)

        annotated_frame  = results[0].plot()
        result_filename  = f"{unique_id}.jpg"
        result_path      = f"{RESULT_FOLDER}/{result_filename}"
        cv2.imwrite(result_path, annotated_frame)

            # Clear previous session and log only THIS image's potholes
        pothole_log.clear()
        for p in pothole_data:
            pothole_log.append({
                "id":        str(uuid.uuid4()),
                "lat":       lat,
                "lng":       lng,
                "depth":     p["depth"],
                "severity":  p["severity"],
                "color":     p["color"],
                "area_m2":   p["area_m2"],
                "score":     p["score"],
                "timestamp": datetime.now().isoformat(),
                "source":    "image",
                "filename":  file.filename,
            })

        return {
            "type":              "image",
            "result":            f"results/{result_filename}",
            "pothole_count":     len(pothole_data),
            "road_condition":    road_condition,
            "recommended_speed": recommended_speed,
            "road_damage_score": road_damage_score,
            "warning_message":   warning_message,
            "potholes":          pothole_data,
        }

    # ── VIDEO ──
    elif file_ext in ["mp4", "avi", "mov"]:
        cap = cv2.VideoCapture(upload_path)
        if not cap.isOpened():
            return {"error": "Cannot open video"}

        width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps    = cap.get(cv2.CAP_PROP_FPS) or 25

        result_filename_avi = f"{unique_id}.avi"
        result_path_avi     = f"{RESULT_FOLDER}/{result_filename_avi}"
        fourcc = cv2.VideoWriter_fourcc(*"XVID")
        out    = cv2.VideoWriter(result_path_avi, fourcc, fps, (width, height))

        all_potholes: list[dict] = []
        warning_message          = None

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            results      = model(frame, conf=0.25)
            pothole_data = analyze_boxes(results[0].boxes.xyxy)
            all_potholes.extend(pothole_data)
            out.write(results[0].plot())

        cap.release()
        out.release()

        road_condition, recommended_speed, road_damage_score, warning_message = compute_road_stats(all_potholes)

        result_filename_mp4 = f"{unique_id}.mp4"
        result_path_mp4     = f"{RESULT_FOLDER}/{result_filename_mp4}"
        ffmpeg_path = r"D:\ffmpeg\ffmpeg-8.0.1-essentials_build\bin\ffmpeg.exe"
        subprocess.run([ffmpeg_path, "-y", "-i", result_path_avi, result_path_mp4])

        # Clear previous session and log only THIS video's potholes
        pothole_log.clear()
        for p in all_potholes:
            pothole_log.append({
                "id":        str(uuid.uuid4()),
                "lat":       lat,
                "lng":       lng,
                "depth":     p["depth"],
                "severity":  p["severity"],
                "color":     p["color"],
                "area_m2":   p["area_m2"],
                "score":     p["score"],
                "timestamp": datetime.now().isoformat(),
                "source":    "video",
                "filename":  file.filename,
            })

        return {
            "type":              "video",
            "result":            f"results/{result_filename_mp4}",
            "pothole_count":     len(all_potholes),
            "road_condition":    road_condition,
            "recommended_speed": recommended_speed,
            "road_damage_score": road_damage_score,
            "warning_message":   warning_message,
            "potholes":          [],
        }

    else:
        return {"error": "Unsupported file format"}


# ─────────────────────── WEBCAM WEBSOCKET ───────────────────────

@app.websocket("/ws/webcam")
async def webcam_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive base64-encoded JPEG frame from browser
            data = await websocket.receive_text()
            msg  = json.loads(data)

            img_b64 = msg.get("frame", "")
            lat     = msg.get("lat")
            lng     = msg.get("lng")

            img_bytes = base64.b64decode(img_b64)
            np_arr    = np.frombuffer(img_bytes, np.uint8)
            frame     = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                continue

            results      = model(frame, conf=0.25)
            pothole_data = analyze_boxes(results[0].boxes.xyxy)
            road_condition, recommended_speed, road_damage_score, warning_message = compute_road_stats(pothole_data)

            annotated = results[0].plot()
            _, buf    = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 75])
            out_b64   = base64.b64encode(buf).decode("utf-8")

            # Log detected potholes to map
            if lat and lng and pothole_data:
                for p in pothole_data:
                    pothole_log.append({
                        "id":        str(uuid.uuid4()),
                        "lat":       float(lat),
                        "lng":       float(lng),
                        "depth":     p["depth"],
                        "severity":  p["severity"],
                        "color":     p["color"],
                        "area_m2":   p["area_m2"],
                        "score":     p["score"],
                        "timestamp": datetime.now().isoformat(),
                        "source":    "webcam",
                    })

            await websocket.send_text(json.dumps({
                "frame":             out_b64,
                "pothole_count":     len(pothole_data),
                "road_condition":    road_condition,
                "recommended_speed": recommended_speed,
                "road_damage_score": road_damage_score,
                "warning_message":   warning_message,
                "potholes":          pothole_data,
            }))

    except WebSocketDisconnect:
        pass


# ─────────────────────── MAP LOG API ───────────────────────

@app.get("/map/potholes")
def get_map_potholes():
    return {"potholes": pothole_log}

@app.delete("/map/potholes")
def clear_map_potholes():
    pothole_log.clear()
    return {"status": "cleared"}

@app.post("/map/potholes/manual")
async def add_manual_pothole(data: dict):
    """Manually add a pothole from the map click (no image)."""
    pothole_log.append({
        "id":        str(uuid.uuid4()),
        "lat":       data.get("lat"),
        "lng":       data.get("lng"),
        "depth":     data.get("depth", "Shallow"),
        "severity":  get_severity(data.get("depth", "Shallow")),
        "color":     get_severity_color(data.get("depth", "Shallow")),
        "area_m2":   data.get("area_m2", 0),
        "score":     data.get("score", 0),
        "timestamp": datetime.now().isoformat(),
        "source":    "manual",
    })
    return {"status": "added"}


# ─────────────────────── PDF REPORT ───────────────────────

@app.get("/report/generate")
def generate_report(location: str = Query(default="Unknown Location")):
    if not pothole_log:
        return {"error": "No pothole data to generate report"}

    report_id       = str(uuid.uuid4())[:8].upper()
    report_filename = f"road_report_{report_id}.pdf"
    report_path     = f"{REPORT_FOLDER}/{report_filename}"

    doc    = SimpleDocTemplate(report_path, pagesize=A4,
                               leftMargin=2*cm, rightMargin=2*cm,
                               topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    story  = []

    title_style = ParagraphStyle("title", parent=styles["Title"],
                                 fontSize=22, textColor=colors.HexColor("#1a1a2e"),
                                 spaceAfter=6, alignment=TA_CENTER, fontName="Helvetica-Bold")
    sub_style   = ParagraphStyle("sub", parent=styles["Normal"],
                                 fontSize=11, textColor=colors.HexColor("#555"),
                                 spaceAfter=4, alignment=TA_CENTER)
    h2_style    = ParagraphStyle("h2", parent=styles["Heading2"],
                                 fontSize=13, textColor=colors.HexColor("#1a1a2e"),
                                 spaceBefore=14, spaceAfter=6, fontName="Helvetica-Bold")
    body_style  = ParagraphStyle("body", parent=styles["Normal"],
                                 fontSize=10, textColor=colors.HexColor("#333"),
                                 spaceAfter=4, leading=15)

    # ── Title block ──
    story.append(Paragraph("🛣 ROAD DAMAGE INSPECTION REPORT", title_style))
    story.append(Paragraph(f"Generated by Pothole Detection AI System", sub_style))
    story.append(Paragraph(f"Report ID: {report_id}  |  Date: {datetime.now().strftime('%d %B %Y, %H:%M')}", sub_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#1a1a2e"), spaceAfter=12))

    # ── Summary ──
    total    = len(pothole_log)
    high     = sum(1 for p in pothole_log if p["severity"] == "high")
    medium   = sum(1 for p in pothole_log if p["severity"] == "medium")
    low      = sum(1 for p in pothole_log if p["severity"] == "low")
    avg_score = round(sum(p["score"] for p in pothole_log) / total, 2) if total else 0
    total_score = round(sum(p["score"] for p in pothole_log), 2)

    if high > total * 0.4:
        overall = "DANGEROUS — Immediate repair required"
        oc = colors.HexColor("#ff3b5c")
    elif medium > total * 0.3:
        overall = "DAMAGED — Repair recommended soon"
        oc = colors.HexColor("#ffb800")
    else:
        overall = "FAIR — Monitor and schedule maintenance"
        oc = colors.HexColor("#39a845")

    story.append(Paragraph("1. EXECUTIVE SUMMARY", h2_style))
    story.append(Paragraph(f"<b>Location:</b> {location}", body_style))
    story.append(Paragraph(f"<b>Total Potholes Detected:</b> {total}", body_style))
    story.append(Paragraph(f"<b>Overall Road Status:</b> <font color='#{oc.hexval()[2:]}'>{overall}</font>", body_style))
    story.append(Paragraph(f"<b>Cumulative Damage Score:</b> {total_score}", body_style))
    story.append(Paragraph(f"<b>Average Pothole Score:</b> {avg_score}", body_style))
    story.append(Spacer(1, 8))

    # ── Severity breakdown table ──
    story.append(Paragraph("2. SEVERITY BREAKDOWN", h2_style))
    sev_data = [
        ["Severity", "Count", "% of Total", "Color Code"],
        ["HIGH (Deep)",    str(high),   f"{round(high/total*100) if total else 0}%",   "🔴 Red"],
        ["MEDIUM (Medium)",str(medium), f"{round(medium/total*100) if total else 0}%", "🟡 Yellow"],
        ["LOW (Shallow)",  str(low),    f"{round(low/total*100) if total else 0}%",    "🟢 Green"],
    ]
    sev_table = Table(sev_data, colWidths=[5*cm, 3*cm, 3.5*cm, 4*cm])
    sev_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#1a1a2e")),
        ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 10),
        ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [colors.HexColor("#f9f9f9"), colors.white]),
        ("GRID",          (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
        ("TOPPADDING",    (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("ROUNDEDCORNERS",(0, 0), (-1, -1), [3, 3, 3, 3]),
    ]))
    story.append(sev_table)
    story.append(Spacer(1, 12))

    # ── Detailed log ──
    story.append(Paragraph("3. DETAILED POTHOLE LOG", h2_style))
    log_data = [["#", "Severity", "Depth", "Area (m²)", "Score", "Source", "Detected At"]]
    for i, p in enumerate(pothole_log[:50], 1):  # cap at 50 rows
        ts = p["timestamp"][:16].replace("T", " ")
        log_data.append([
            str(i),
            p["severity"].upper(),
            p["depth"],
            str(p["area_m2"]),
            str(p["score"]),
            p.get("source", "N/A").upper(),
            ts,
        ])

    log_table = Table(log_data, colWidths=[1*cm, 2.5*cm, 2.5*cm, 2.5*cm, 2*cm, 2.5*cm, 4*cm])
    row_colors = []
    for i, p in enumerate(pothole_log[:50], 1):
        bg = {"high": colors.HexColor("#fff0f0"), "medium": colors.HexColor("#fffbf0"), "low": colors.HexColor("#f0fff4")}.get(p["severity"], colors.white)
        row_colors.append(("BACKGROUND", (0, i), (-1, i), bg))

    log_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), colors.HexColor("#1a1a2e")),
        ("TEXTCOLOR",     (0, 0), (-1, 0), colors.white),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 8),
        ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
        ("GRID",          (0, 0), (-1, -1), 0.3, colors.HexColor("#dddddd")),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        *row_colors,
    ]))
    story.append(log_table)
    story.append(Spacer(1, 12))

    # ── Recommendations ──
    story.append(Paragraph("4. RECOMMENDATIONS", h2_style))
    recs = []
    if high > 0:
        recs.append(f"• <b>URGENT:</b> {high} deep pothole(s) detected — immediate patching required. Enforce 20 km/h speed limit.")
    if medium > 0:
        recs.append(f"• <b>SOON:</b> {medium} medium-severity pothole(s) — schedule repair within 2 weeks. Limit speed to 40 km/h.")
    if low > 0:
        recs.append(f"• <b>MONITOR:</b> {low} shallow pothole(s) — include in next routine maintenance cycle.")
    if not recs:
        recs.append("• Road is in acceptable condition. Continue regular monitoring.")

    for rec in recs:
        story.append(Paragraph(rec, body_style))

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cccccc"), spaceAfter=8))
    story.append(Paragraph("Report auto-generated by Pothole Detection AI System. For official use by road authorities only.", sub_style))

    doc.build(story)
    return {"report_url": f"reports/{report_filename}", "report_id": report_id}


# ─── Run ───
# venv\Scripts\activate
# python -m uvicorn main:app --reload