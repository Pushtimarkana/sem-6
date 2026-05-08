import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

/* ═══════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Exo+2:wght@300;400;600;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080c10;--surface:#0d1117;--card:#111820;--border:#1e2d3d;
  --accent:#00d4ff;--accent2:#ff6b35;--text:#e8f4f8;--muted:#4a6274;
  --danger:#ff3b5c;--warn:#ffb800;--good:#39ff14;
}
body{background:var(--bg);color:var(--text);font-family:'Exo 2',sans-serif}

/* ── APP SHELL ── */
.app{
  min-height:100vh;background:var(--bg);
  background-image:
    radial-gradient(ellipse at 20% 10%,rgba(0,212,255,.05) 0%,transparent 55%),
    radial-gradient(ellipse at 80% 90%,rgba(255,107,53,.04) 0%,transparent 55%),
    repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(30,45,61,.25) 39px,rgba(30,45,61,.25) 40px),
    repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(30,45,61,.25) 39px,rgba(30,45,61,.25) 40px);
}
.scanlines{position:fixed;inset:0;pointer-events:none;z-index:9999;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px)}

/* ── HEADER ── */
.header{
  position:relative;padding:24px 32px;border-bottom:1px solid var(--border);
  background:linear-gradient(180deg,rgba(0,212,255,.07) 0%,transparent 100%);
  display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;
}
.header::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--accent),var(--accent2),transparent)}
.logo-wrap{display:flex;align-items:center;gap:14px}
.logo-icon{width:46px;height:46px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;
  box-shadow:0 0 28px rgba(0,212,255,.35);animation:pulse-logo 3s ease-in-out infinite}
@keyframes pulse-logo{0%,100%{box-shadow:0 0 20px rgba(0,212,255,.3)}50%{box-shadow:0 0 44px rgba(0,212,255,.55),0 0 60px rgba(255,107,53,.2)}}
.logo-title{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:24px;letter-spacing:2px}
.logo-sub{font-family:'Space Mono',monospace;font-size:10px;color:var(--accent);letter-spacing:3px;margin-top:2px}
.status-pill{display:flex;align-items:center;gap:8px;padding:7px 14px;border:1px solid var(--border);
  border-radius:20px;background:rgba(57,255,20,.05);font-family:'Space Mono',monospace;font-size:10px;color:var(--good)}
.blink-dot{width:6px;height:6px;border-radius:50%;background:var(--good);animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}

/* ── NAV TABS ── */
.nav{display:flex;gap:0;border-bottom:1px solid var(--border);background:var(--surface);overflow-x:auto}
.nav-tab{
  padding:14px 24px;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:14px;letter-spacing:1px;
  color:var(--muted);border:none;background:none;cursor:pointer;border-bottom:2px solid transparent;
  transition:all .25s;white-space:nowrap;display:flex;align-items:center;gap:8px
}
.nav-tab:hover{color:var(--text)}
.nav-tab.active{color:var(--accent);border-bottom-color:var(--accent)}

/* ── MAIN ── */
.main{max-width:1200px;margin:0 auto;padding:32px 24px 60px}

/* ── CARDS ── */
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.card-head{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.02)}
.card-head span{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:1px}
.dot-r{width:8px;height:8px;border-radius:50%;background:#ff5f56}
.dot-y{width:8px;height:8px;border-radius:50%;background:#ffbd2e}
.dot-g{width:8px;height:8px;border-radius:50%;background:#27c93f}

/* ── UPLOAD ── */
.upload-zone{
  border:1.5px dashed var(--border);border-radius:14px;padding:48px 32px;
  text-align:center;cursor:pointer;transition:all .3s;background:var(--card);position:relative;overflow:hidden
}
.upload-zone::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,212,255,.03) 0%,transparent 60%);pointer-events:none}
.upload-zone:hover,.upload-zone.drag{border-color:var(--accent);background:rgba(0,212,255,.04);transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,212,255,.1)}
.upload-icon{font-size:48px;margin-bottom:14px;display:block}
.upload-title{font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:600;margin-bottom:8px;letter-spacing:1px}
.upload-sub{font-size:13px;color:var(--muted);margin-bottom:20px}
.btn-primary{display:inline-flex;align-items:center;gap:8px;padding:11px 26px;
  background:linear-gradient(135deg,var(--accent) 0%,#0099bb 100%);color:#000;border:none;border-radius:8px;
  font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;letter-spacing:1px;cursor:pointer;
  transition:all .2s;box-shadow:0 4px 20px rgba(0,212,255,.3)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(0,212,255,.45)}
.btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.btn-danger{background:linear-gradient(135deg,var(--danger),#cc0020);color:#fff;box-shadow:0 4px 20px rgba(255,59,92,.3)}
.btn-danger:hover{box-shadow:0 6px 28px rgba(255,59,92,.45)}
.btn-ghost{background:none;border:1px solid var(--border);color:var(--muted);padding:9px 20px;border-radius:8px;
  cursor:pointer;font-family:'Exo 2',sans-serif;font-size:13px;transition:all .2s}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
.tags{display:flex;gap:8px;justify-content:center;margin-top:14px;flex-wrap:wrap}
.tag{padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-family:'Space Mono',monospace;font-size:10px;color:var(--muted)}
input[type=file]{display:none}

/* ── PREVIEW AREA ── */
.preview-grid{margin-top:24px;display:grid;grid-template-columns:1fr 152px;gap:20px;align-items:start}
.card img,.card video{width:100%;display:block;max-height:380px;object-fit:contain;background:#05090d}
.detect-col{display:flex;flex-direction:column;align-items:center;gap:14px}
.detect-btn{
  width:136px;height:136px;border-radius:50%;border:2px solid var(--accent);
  background:radial-gradient(circle at 40% 40%,rgba(0,212,255,.15),rgba(0,212,255,.03));
  color:var(--accent);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:14px;letter-spacing:2px;
  cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  transition:all .3s;box-shadow:0 0 28px rgba(0,212,255,.15),inset 0 0 28px rgba(0,212,255,.03);position:relative
}
.detect-btn:hover:not(:disabled){background:radial-gradient(circle at 40% 40%,rgba(0,212,255,.28),rgba(0,212,255,.06));
  box-shadow:0 0 48px rgba(0,212,255,.35),inset 0 0 28px rgba(0,212,255,.1);transform:scale(1.05)}
.detect-btn:disabled{opacity:.35;cursor:not-allowed}
.detect-btn .icon{font-size:26px}
.spin-ring{position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;
  border-top-color:var(--accent);border-right-color:var(--accent2);animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── WARNING ── */
.warn-bar{margin-top:20px;padding:14px 22px;border-radius:12px;border:1px solid var(--danger);
  background:rgba(255,59,92,.08);display:flex;align-items:center;gap:12px;animation:slideDown .4s ease}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.warn-bar .wi{font-size:26px}
.warn-bar .wt{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:16px;color:var(--danger)}

/* ── STATS GRID ── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px;animation:fadeUp .5s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px 16px;position:relative;overflow:hidden;transition:transform .2s}
.stat-card:hover{transform:translateY(-3px)}
.stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.sc-blue::after{background:linear-gradient(90deg,var(--accent),transparent)}
.sc-orange::after{background:linear-gradient(90deg,var(--accent2),transparent)}
.sc-green::after{background:linear-gradient(90deg,var(--good),transparent)}
.sc-red::after{background:linear-gradient(90deg,var(--danger),transparent)}
.stat-label{font-family:'Space Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.stat-val{font-family:'Rajdhani',sans-serif;font-size:30px;font-weight:700;line-height:1}
.cv-blue{color:var(--accent)}.cv-orange{color:var(--accent2)}.cv-green{color:var(--good)}.cv-red{color:var(--danger)}
.stat-sub{font-size:11px;color:var(--muted);margin-top:4px}
.cond-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:6px;
  font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;letter-spacing:1px;margin-top:6px}
.cb-good{background:rgba(57,255,20,.1);border:1px solid var(--good);color:var(--good)}
.cb-damaged{background:rgba(255,184,0,.1);border:1px solid var(--warn);color:var(--warn)}
.cb-dangerous{background:rgba(255,59,92,.1);border:1px solid var(--danger);color:var(--danger)}

/* ── SECTION HEADER ── */
.sec-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.sec-head h3{font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;letter-spacing:1px;white-space:nowrap}
.sec-line{flex:1;height:1px;background:var(--border)}
.sec-tag{font-family:'Space Mono',monospace;font-size:9px;color:var(--accent);letter-spacing:2px;white-space:nowrap}

/* ── POTHOLE TABLE ── */
.ptable{width:100%;border-collapse:collapse;background:var(--card);border-radius:12px;overflow:hidden;border:1px solid var(--border)}
.ptable th{padding:11px 14px;background:rgba(255,255,255,.03);font-family:'Space Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;text-align:left;border-bottom:1px solid var(--border)}
.ptable td{padding:12px 14px;font-size:13px;border-bottom:1px solid rgba(30,45,61,.45)}
.ptable tr:last-child td{border-bottom:none}
.ptable tr:hover td{background:rgba(0,212,255,.02)}
.depth-pill{padding:3px 9px;border-radius:20px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
.dp-s{background:rgba(57,255,20,.1);color:var(--good);border:1px solid rgba(57,255,20,.3)}
.dp-m{background:rgba(255,184,0,.1);color:var(--warn);border:1px solid rgba(255,184,0,.3)}
.dp-d{background:rgba(255,59,92,.1);color:var(--danger);border:1px solid rgba(255,59,92,.3)}
.row-num{width:26px;height:26px;border-radius:5px;background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.2);
  display:inline-flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:10px;color:var(--accent)}

/* ── WEBCAM ── */
.webcam-grid{display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start}
.webcam-feed{position:relative;background:#05090d;border-radius:12px;overflow:hidden;min-height:300px;display:flex;align-items:center;justify-content:center}
.webcam-feed canvas{width:100%;display:block}
.webcam-feed .no-feed{color:var(--muted);font-family:'Space Mono',monospace;font-size:12px;text-align:center;padding:40px}
.scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);animation:scan-anim 2s linear infinite;pointer-events:none}
@keyframes scan-anim{from{top:0}to{top:100%}}
.webcam-stats{display:flex;flex-direction:column;gap:12px}
.live-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;
  background:rgba(255,59,92,.1);border:1px solid var(--danger);
  font-family:'Space Mono',monospace;font-size:10px;color:var(--danger)}
.live-badge .ld{width:6px;height:6px;border-radius:50%;background:var(--danger);animation:blink .8s ease-in-out infinite}
.ws-stat{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px}
.ws-stat .wsl{font-family:'Space Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.ws-stat .wsv{font-family:'Rajdhani',sans-serif;font-size:24px;font-weight:700}
.webcam-warn{margin-top:8px;padding:10px 14px;border-radius:8px;border:1px solid var(--danger);background:rgba(255,59,92,.08);font-family:'Rajdhani',sans-serif;font-weight:600;font-size:13px;color:var(--danger)}
.btn-row{display:flex;gap:10px;flex-wrap:wrap}

/* ── MAP ── */
.map-container{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--border)}
.map-placeholder{
  min-height:420px;background:var(--card);
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 29px,rgba(30,45,61,.6) 29px,rgba(30,45,61,.6) 30px),
    repeating-linear-gradient(90deg,transparent,transparent 29px,rgba(30,45,61,.6) 29px,rgba(30,45,61,.6) 30px);
  display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;
  font-family:'Space Mono',monospace;font-size:12px;color:var(--muted);text-align:center;padding:32px
}
.leaflet-container{height:440px;width:100%;border-radius:12px}
.map-controls{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
.map-legend{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:10px 16px;
  background:var(--card);border:1px solid var(--border);border-radius:10px;margin-bottom:14px}
.legend-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text)}
.legend-dot{width:12px;height:12px;border-radius:50%}

/* ── REPORT ── */
.report-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
.report-form{display:flex;flex-direction:column;gap:16px}
.form-field label{display:block;font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.form-field input,.form-field select{
  width:100%;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:8px;
  color:var(--text);font-family:'Exo 2',sans-serif;font-size:14px;outline:none;transition:border-color .2s
}
.form-field input:focus,.form-field select:focus{border-color:var(--accent)}
.form-field select option{background:var(--surface)}
.report-preview{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px}
.rp-title{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;letter-spacing:1px;margin-bottom:16px;color:var(--accent)}
.rp-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px}
.rp-row:last-child{border-bottom:none}
.rp-key{color:var(--muted);font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1px}
.rp-val{font-weight:600;font-family:'Rajdhani',sans-serif;font-size:15px}
.report-success{padding:20px;border-radius:12px;border:1px solid var(--good);background:rgba(57,255,20,.06);margin-top:12px;text-align:center}
.report-success .rs-icon{font-size:36px;margin-bottom:8px}
.report-success .rs-title{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;color:var(--good);margin-bottom:6px}
.report-success a{color:var(--accent);font-size:13px}

/* ── LOADING ── */
.loading-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:52px;gap:16px}
.spinner{width:52px;height:52px;border-radius:50%;border:3px solid var(--border);border-top-color:var(--accent);animation:spin .8s linear infinite}
.loading-txt{font-family:'Space Mono',monospace;font-size:11px;color:var(--accent);letter-spacing:3px;animation:blink 1.5s ease-in-out infinite}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .preview-grid{grid-template-columns:1fr}
  .webcam-grid{grid-template-columns:1fr}
  .report-grid{grid-template-columns:1fr}
}
@media(max-width:600px){
  .header{padding:16px}
  .main{padding:20px 14px 40px}
  .stats-grid{grid-template-columns:repeat(2,1fr)}
}
`;

/* ═══════════════════════════════════════════════════════
   CONSTANTS & HELPERS
═══════════════════════════════════════════════════════ */
const BASE = "http://127.0.0.1:8000";
const WS   = "ws://127.0.0.1:8000/ws/webcam";

const conditionClass = {"Good Road":"cb-good","Damaged Road":"cb-damaged","Dangerous Road":"cb-dangerous"};
const conditionIcon  = {"Good Road":"✅","Damaged Road":"⚠️","Dangerous Road":"🚫"};
const depthPill      = {Shallow:"dp-s",Medium:"dp-m",Deep:"dp-d"};

function StatCard({label, value, sub, col, children}){
  return(
    <div className={`stat-card sc-${col}`}>
      <div className="stat-label">{label}</div>
      {value !== undefined && <div className={`stat-val cv-${col}`}>{value}</div>}
      {children}
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function SectionHead({title, tag}){
  return(
    <div className="sec-head">
      <h3>{title}</h3>
      <div className="sec-line"/>
      {tag && <div className="sec-tag">{tag}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DETECTION RESULTS BLOCK (shared by file & webcam)
═══════════════════════════════════════════════════════ */
function DetectionResults({count, road, speed, score, warning, potholes, resultUrl, fileType}){
  if(!road) return null;
  return(
    <>
      {warning && (
        <div className="warn-bar">
          <span className="wi">⚠️</span>
          <span className="wt">{warning}</span>
        </div>
      )}
      <div className="stats-grid">
        <StatCard label="Potholes Detected" value={count} sub="total" col="blue"/>
        <StatCard label="Road Condition" col="orange">
          <span className={`cond-badge ${conditionClass[road]||"cb-good"}`}>{conditionIcon[road]} {road}</span>
        </StatCard>
        <StatCard label="Recommended Speed" value={speed} sub="safe speed" col="green"/>
        <StatCard label="Damage Score" value={score} sub="severity index" col="red"/>
      </div>

      {resultUrl && (
        <div style={{marginTop:24,animation:"fadeUp .5s ease .1s both"}}>
          <SectionHead title="DETECTION OUTPUT" tag="ANNOTATED"/>
          <div className="card">
            {fileType==="image"
              ? <img src={resultUrl} alt="result"/>
              : <video controls><source src={resultUrl} type="video/mp4"/></video>}
          </div>
        </div>
      )}

      {potholes?.length > 0 && (
        <div style={{marginTop:24,animation:"fadeUp .5s ease .2s both"}}>
          <SectionHead title="POTHOLE ANALYSIS" tag={`${potholes.length} DETECTED`}/>
          <table className="ptable">
            <thead>
              <tr>
                <th>#</th><th>Width (m)</th><th>Height (m)</th>
                <th>Area (m²)</th><th>Depth</th><th>Distance (m)</th>
              </tr>
            </thead>
            <tbody>
              {potholes.map((p,i)=>(
                <tr key={i}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td>{p.width_m}</td><td>{p.height_m}</td><td>{p.area_m2}</td>
                  <td><span className={`depth-pill ${depthPill[p.depth]||""}`}>{p.depth}</span></td>
                  <td>{p.distance_m} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: FILE DETECTION  (state is LIFTED to root — survives tab switches)
═══════════════════════════════════════════════════════ */
function FileTab({ fileObj, setFileObj, previewUrl, setPreviewUrl, fileMimeType, setFileMimeType, detData, setDetData }){
  const [loading,  setLoading]  = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const newRef  = useRef();

  const pick = (f)=>{
    if(!f) return;
    setFileObj(f);
    setPreviewUrl(URL.createObjectURL(f));
    setDetData(null);       // reset result AND clears the header badge + report preview
    setFileMimeType(f.type.startsWith("image")?"image":"video");
  };

  const detect = async()=>{
    if(!fileObj) return;
    setLoading(true);
    try{
      const fd = new FormData(); fd.append("file", fileObj);
      const res = await axios.post(`${BASE}/detect`, fd, {headers:{"Content-Type":"multipart/form-data"}});
      setDetData({...res.data, resultUrl: BASE+"/"+res.data.result});
    }catch{ alert("Detection failed. Is the backend running at http://127.0.0.1:8000 ?"); }
    finally{ setLoading(false); }
  };

  const clear=()=>{ setFileObj(null); setPreviewUrl(null); setDetData(null); setFileMimeType(null); };

  return(
    <div>
      {!previewUrl ? (
        <div
          className={`upload-zone${dragging?" drag":""}`}
          onClick={()=>fileRef.current.click()}
          onDragOver={e=>{e.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false);pick(e.dataTransfer.files[0])}}
        >
          <span className="upload-icon">📡</span>
          <div className="upload-title">DROP FILE OR CLICK TO UPLOAD</div>
          <div className="upload-sub">Road image or video for AI pothole detection</div>
          <button className="btn-primary" onClick={e=>{e.stopPropagation();fileRef.current.click()}}>📂 Choose File</button>
          <div className="tags">{["JPG","PNG","MP4","AVI","MOV"].map(t=><span key={t} className="tag">.{t}</span>)}</div>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={e=>pick(e.target.files[0])}/>
        </div>
      ) : (
        <div className="preview-grid">
          <div className="card">
            <div className="card-head">
              <div className="dot-r"/><div className="dot-y"/><div className="dot-g"/>
              <span style={{marginLeft:8}}>{fileObj?.name} · {fileMimeType?.toUpperCase()}</span>
              <button onClick={clear} style={{marginLeft:"auto",background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            {fileMimeType==="image" ? <img src={previewUrl} alt="preview"/> : <video controls><source src={previewUrl}/></video>}
          </div>
          <div className="detect-col">
            <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
              {loading && <div className="spin-ring"/>}
              <button className="detect-btn" onClick={detect} disabled={loading||!fileObj}>
                <span className="icon">{loading?"⏳":"🔍"}</span>
                <span>{loading?"SCANNING":"DETECT"}</span>
              </button>
            </div>
            <button className="btn-ghost" onClick={()=>newRef.current.click()} style={{width:"100%"}}>↩ New File</button>
            <input ref={newRef} type="file" accept="image/*,video/*" onChange={e=>pick(e.target.files[0])}/>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-wrap">
          <div className="spinner"/><div className="loading-txt">ANALYZING ROAD SURFACE...</div>
        </div>
      )}

      {/* ── Logged confirmation banner ── */}
      {!loading && detData && (
        <div style={{
          margin:"16px 0 0",padding:"12px 20px",borderRadius:10,
          border:"1px solid var(--good)",background:"rgba(57,255,20,.06)",
          display:"flex",alignItems:"center",gap:12,animation:"slideDown .4s ease"
        }}>
          <span style={{fontSize:20}}>✅</span>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:14,color:"var(--good)"}}>
            {detData.pothole_count} pothole{detData.pothole_count!==1?"s":""} detected and saved to the report log.
          </span>
          <span style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:10,color:"var(--muted)"}}>
            Switch to Generate Report →
          </span>
        </div>
      )}

      {!loading && detData && (
        <DetectionResults
          count={detData.pothole_count} road={detData.road_condition} speed={detData.recommended_speed}
          score={detData.road_damage_score} warning={detData.warning_message}
          potholes={detData.potholes} resultUrl={detData.resultUrl} fileType={detData.type}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: WEBCAM LIVE DETECTION
═══════════════════════════════════════════════════════ */
function WebcamTab(){
  const [running,setRunning]   = useState(false);
  const [liveData,setLiveData] = useState(null);
  const [fps,setFps]           = useState(0);
  const canvasRef  = useRef();
  const videoRef   = useRef();
  const wsRef      = useRef(null);
  const streamRef  = useRef(null);
  const frameTimer = useRef(null);
  const fpsCount   = useRef(0);
  const fpsTimer   = useRef(null);

  const start = async()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:{width:640,height:480}});
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const ws = new WebSocket(WS);
      wsRef.current = ws;

      ws.onmessage = (evt)=>{
        const msg = JSON.parse(evt.data);
        // draw annotated frame
        const img = new Image();
        img.onload = ()=>{
          const ctx = canvasRef.current?.getContext("2d");
          if(ctx){ ctx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height); }
        };
        img.src = "data:image/jpeg;base64,"+msg.frame;
        setLiveData(msg);
        fpsCount.current++;
      };

      ws.onerror = ()=> alert("WebSocket error — is the backend running?");

      setRunning(true);
      fpsTimer.current = setInterval(()=>{ setFps(fpsCount.current); fpsCount.current=0; },1000);

      // send frames every 200ms
      const sendFrame = ()=>{
        if(!videoRef.current||!wsRef.current||wsRef.current.readyState!==1) return;
        const canvas = document.createElement("canvas");
        canvas.width=640; canvas.height=480;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current,0,0,640,480);
        canvas.toBlob(blob=>{
          const reader = new FileReader();
          reader.onload = ()=>{
            const b64 = reader.result.split(",")[1];
            if(wsRef.current?.readyState===1){
              wsRef.current.send(JSON.stringify({frame:b64, lat:null, lng:null}));
            }
          };
          reader.readAsDataURL(blob);
        },"image/jpeg",0.6);
      };
      frameTimer.current = setInterval(sendFrame,200);

    }catch(e){ alert("Cannot access webcam: "+e.message); }
  };

  const stop = ()=>{
    clearInterval(frameTimer.current);
    clearInterval(fpsTimer.current);
    wsRef.current?.close();
    streamRef.current?.getTracks().forEach(t=>t.stop());
    videoRef.current && (videoRef.current.srcObject=null);
    setRunning(false); setLiveData(null); setFps(0);
  };

  useEffect(()=>()=>stop(),[]);

  const cond = liveData?.road_condition;

  return(
    <div>
      <div className="btn-row" style={{marginBottom:20}}>
        {!running
          ? <button className="btn-primary" onClick={start}>📷 Start Webcam</button>
          : <button className="btn-primary btn-danger" onClick={stop}>⏹ Stop Webcam</button>
        }
        {running && <span className="live-badge"><span className="ld"/>LIVE DETECTION</span>}
      </div>

      <div className="webcam-grid">
        <div className="webcam-feed">
          {running && <div className="scan-line"/>}
          <video ref={videoRef} style={{display:"none"}}/>
          <canvas ref={canvasRef} width={640} height={480} style={{width:"100%",display:running?"block":"none"}}/>
          {!running && (
            <div className="no-feed">
              <div style={{fontSize:48,marginBottom:12}}>📷</div>
              <div>WEBCAM OFFLINE</div>
              <div style={{marginTop:6,fontSize:11}}>Click "Start Webcam" to begin live detection</div>
            </div>
          )}
        </div>

        <div className="webcam-stats">
          <div className="ws-stat">
            <div className="wsl">Potholes / Frame</div>
            <div className={`wsv cv-blue`}>{liveData?.pothole_count ?? "—"}</div>
          </div>
          <div className="ws-stat">
            <div className="wsl">Road Condition</div>
            {cond
              ? <span className={`cond-badge ${conditionClass[cond]||"cb-good"}`} style={{marginTop:4}}>{conditionIcon[cond]} {cond}</span>
              : <div className="wsv" style={{color:"var(--muted)"}}>—</div>}
          </div>
          <div className="ws-stat">
            <div className="wsl">Speed Limit</div>
            <div className="wsv cv-green">{liveData?.recommended_speed ?? "—"}</div>
          </div>
          <div className="ws-stat">
            <div className="wsl">Damage Score</div>
            <div className="wsv cv-red">{liveData?.road_damage_score ?? "—"}</div>
          </div>
          <div className="ws-stat">
            <div className="wsl">FPS</div>
            <div className="wsv cv-orange">{fps}</div>
          </div>
          {liveData?.warning_message && (
            <div className="webcam-warn">⚠️ {liveData.warning_message}</div>
          )}
        </div>
      </div>

      {liveData?.potholes?.length > 0 && (
        <div style={{marginTop:20}}>
          <SectionHead title="LIVE POTHOLE DATA" tag={`${liveData.potholes.length} DETECTED`}/>
          <table className="ptable">
            <thead><tr><th>#</th><th>Width</th><th>Height</th><th>Area</th><th>Depth</th><th>Distance</th></tr></thead>
            <tbody>
              {liveData.potholes.map((p,i)=>(
                <tr key={i}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td>{p.width_m}m</td><td>{p.height_m}m</td><td>{p.area_m2}m²</td>
                  <td><span className={`depth-pill ${depthPill[p.depth]||""}`}>{p.depth}</span></td>
                  <td>{p.distance_m}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: MAP VIEW
═══════════════════════════════════════════════════════ */
function MapTab(){
  const [potholes,setPotholes]   = useState([]);
  const [loading,setLoading]     = useState(false);
  const [mapLoaded,setMapLoaded] = useState(false);
  const mapRef   = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);

  const fetchPotholes = async()=>{
    setLoading(true);
    try{
      const res = await axios.get(`${BASE}/map/potholes`);
      setPotholes(res.data.potholes||[]);
    }catch{ /* backend may not be reachable */ }
    setLoading(false);
  };

  const clearMap = async()=>{
    await axios.delete(`${BASE}/map/potholes`);
    setPotholes([]);
  };

  // Load Leaflet dynamically
  useEffect(()=>{
    if(window.L){ setMapLoaded(true); return; }
    const link = document.createElement("link");
    link.rel="stylesheet"; link.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload=()=>setMapLoaded(true);
    document.head.appendChild(script);
  },[]);

  // Init map
  useEffect(()=>{
    if(!mapLoaded||leafletRef.current) return;
    leafletRef.current = window.L.map(mapRef.current).setView([23.02,72.57],12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      attribution:"© OpenStreetMap contributors"
    }).addTo(leafletRef.current);
    fetchPotholes();
  },[mapLoaded]);

  // Update markers
  useEffect(()=>{
    if(!leafletRef.current||!window.L) return;
    markersRef.current.forEach(m=>m.remove());
    markersRef.current=[];
    potholes.forEach(p=>{
      if(!p.lat||!p.lng) return;
      const colorMap={low:"#39ff14",medium:"#ffb800",high:"#ff3b5c"};
      const c = colorMap[p.severity]||"#39ff14";
      const icon = window.L.divIcon({
        className:"",
        html:`<div style="width:16px;height:16px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 0 8px ${c}"></div>`,
        iconSize:[16,16],iconAnchor:[8,8]
      });
      const m = window.L.marker([p.lat,p.lng],{icon})
        .addTo(leafletRef.current)
        .bindPopup(`<b>${p.depth} Pothole</b><br>Area: ${p.area_m2}m²<br>Score: ${p.score}<br>${p.timestamp?.slice(0,16)?.replace("T"," ")}`);
      markersRef.current.push(m);
    });
  },[potholes]);

  const stats = {
    total: potholes.length,
    high:  potholes.filter(p=>p.severity==="high").length,
    medium:potholes.filter(p=>p.severity==="medium").length,
    low:   potholes.filter(p=>p.severity==="low").length,
  };

  return(
    <div>
      <div className="map-controls">
        <button className="btn-primary" onClick={fetchPotholes}>🔄 Refresh</button>
        <button className="btn-ghost" onClick={clearMap}>🗑 Clear All</button>
        <span style={{marginLeft:"auto",fontFamily:"'Space Mono',monospace",fontSize:11,color:"var(--muted)"}}>
          {stats.total} potholes logged
        </span>
      </div>

      <div className="map-legend">
        <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"var(--muted)",letterSpacing:"1px",marginRight:4}}>SEVERITY:</span>
        {[["#ff3b5c","HIGH / Deep"],["#ffb800","MEDIUM"],["#39ff14","LOW / Shallow"]].map(([c,l])=>(
          <span key={l} className="legend-item">
            <span className="legend-dot" style={{background:c,boxShadow:`0 0 6px ${c}`}}/>
            {l}
          </span>
        ))}
      </div>

      <div className="map-container">
        {!mapLoaded
          ? <div className="map-placeholder"><div style={{fontSize:40}}>🗺</div><div>Loading map...</div></div>
          : <div ref={mapRef} className="leaflet-container"/>
        }
      </div>

      {potholes.length===0 && !loading && (
        <div style={{textAlign:"center",padding:"32px",color:"var(--muted)",fontFamily:"'Space Mono',monospace",fontSize:12}}>
          No pothole locations logged yet. Upload images or use webcam to start mapping.
        </div>
      )}

      {potholes.length>0 && (
        <div style={{marginTop:20}}>
          <SectionHead title="POTHOLE LOG" tag={`${stats.total} TOTAL`}/>
          <table className="ptable">
            <thead><tr><th>#</th><th>Severity</th><th>Depth</th><th>Area</th><th>Score</th><th>Source</th><th>Detected</th></tr></thead>
            <tbody>
              {potholes.slice(0,30).map((p,i)=>(
                <tr key={p.id||i}>
                  <td><span className="row-num">{i+1}</span></td>
                  <td><span className={`depth-pill ${depthPill[p.depth]||""}`}>{p.severity?.toUpperCase()}</span></td>
                  <td>{p.depth}</td>
                  <td>{p.area_m2}m²</td>
                  <td>{p.score}</td>
                  <td style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"var(--muted)"}}>{p.source?.toUpperCase()}</td>
                  <td style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"var(--muted)"}}>{p.timestamp?.slice(0,16)?.replace("T"," ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: REPORT GENERATION
═══════════════════════════════════════════════════════ */
function ReportTab({ loggedCount }){
  const [location, setLocation] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [report,   setReport]   = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [fetching, setFetching] = useState(false);

  // Always fetch fresh when this tab mounts
  const fetchPreview = async()=>{
    setFetching(true);
    try{
      const res = await axios.get(`${BASE}/map/potholes`);
      const pts  = res.data.potholes||[];
      const total  = pts.length;
      const high   = pts.filter(p=>p.severity==="high").length;
      const medium = pts.filter(p=>p.severity==="medium").length;
      const low    = pts.filter(p=>p.severity==="low").length;
      const score  = pts.reduce((s,p)=>s+p.score,0);
      setPreview({total,high,medium,low,score:score.toFixed(2)});
    }catch{}
    setFetching(false);
  };

  useEffect(()=>{ fetchPreview(); },[]);   // runs on every tab mount

  const generate = async()=>{
    if(!location){ alert("Please enter a location name."); return; }
    setLoading(true);
    try{
      const res = await axios.get(`${BASE}/report/generate?location=${encodeURIComponent(location)}`);
      if(res.data.error){ alert("Backend says: "+res.data.error); return; }
      setReport(res.data);
    }catch(e){ alert("Report generation failed: "+(e.response?.data?.error||e.message)); }
    finally{ setLoading(false); }
  };

  const total      = preview?.total || 0;
  const hasData    = total > 0;
  const statusCls  = preview?.high > total*.4 ? "cb-dangerous" : preview?.medium > total*.3 ? "cb-damaged" : "cb-good";
  const statusTxt  = preview?.high > total*.4 ? "🚫 DANGEROUS" : preview?.medium > total*.3 ? "⚠️ DAMAGED"  : "✅ FAIR";

  return(
    <div>
      {/* No-data warning */}
      {!hasData && !fetching && (
        <div style={{
          padding:"16px 22px",borderRadius:12,border:"1px solid var(--warn)",
          background:"rgba(255,184,0,.07)",display:"flex",alignItems:"flex-start",
          gap:14,marginBottom:24,animation:"slideDown .4s ease"
        }}>
          <span style={{fontSize:26}}>⚠️</span>
          <div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:"var(--warn)",marginBottom:4}}>
              No Detections Logged Yet
            </div>
            <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>
              Go to the <b style={{color:"var(--text)"}}>File Detection</b> tab, upload a road image and click <b style={{color:"var(--text)"}}>Detect</b>.
              Results are automatically saved to the report log — no GPS required.
              Then come back here to generate the PDF.
            </div>
          </div>
        </div>
      )}

      <div className="report-grid">
        <div className="report-form">
          <SectionHead title="GENERATE REPORT" tag="PDF"/>

          <div className="form-field">
            <label>Road / Location Name</label>
            <input
              placeholder="e.g. MG Road, Rajkot, Gujarat"
              value={location}
              onChange={e=>setLocation(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            onClick={generate}
            disabled={loading || !location || !hasData}
            title={!hasData?"Run detection first — no data logged yet":""}
          >
            {loading ? "⏳ Generating..." : "📄 Generate PDF Report"}
          </button>

          {!hasData && (
            <div style={{fontSize:12,color:"var(--danger)",fontFamily:"'Space Mono',monospace",letterSpacing:1}}>
              ✗ No pothole data — detect an image first
            </div>
          )}

          <button className="btn-ghost" onClick={fetchPreview} disabled={fetching}>
            {fetching ? "⏳ Refreshing…" : "🔄 Refresh Preview"}
          </button>

          {report && (
            <div className="report-success">
              <div className="rs-icon">✅</div>
              <div className="rs-title">Report Generated!</div>
              <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>ID: {report.report_id}</div>
              <a href={`${BASE}/${report.report_url}`} target="_blank" rel="noreferrer">
                📥 Download PDF Report
              </a>
            </div>
          )}
        </div>

        <div>
          <SectionHead title="REPORT PREVIEW" tag="LIVE SUMMARY"/>
          <div className="report-preview">
            <div className="rp-title">📋 Road Damage Report</div>
            {fetching && (
              <div style={{color:"var(--muted)",fontFamily:"'Space Mono',monospace",fontSize:11,textAlign:"center",padding:"24px"}}>
                Loading…
              </div>
            )}
            {!fetching && hasData && (
              <>
                <div className="rp-row"><span className="rp-key">LOCATION</span><span className="rp-val">{location||"—"}</span></div>
                <div className="rp-row"><span className="rp-key">TOTAL POTHOLES</span><span className="rp-val cv-blue">{preview.total}</span></div>
                <div className="rp-row"><span className="rp-key">HIGH SEVERITY 🔴</span><span className="rp-val cv-red">{preview.high}</span></div>
                <div className="rp-row"><span className="rp-key">MEDIUM SEVERITY 🟡</span><span className="rp-val" style={{color:"var(--warn)"}}>{preview.medium}</span></div>
                <div className="rp-row"><span className="rp-key">LOW SEVERITY 🟢</span><span className="rp-val cv-green">{preview.low}</span></div>
                <div className="rp-row"><span className="rp-key">TOTAL DAMAGE SCORE</span><span className="rp-val cv-orange">{preview.score}</span></div>
                <div className="rp-row">
                  <span className="rp-key">OVERALL STATUS</span>
                  <span className={`cond-badge ${statusCls}`} style={{fontSize:11,padding:"4px 10px"}}>{statusTxt}</span>
                </div>
              </>
            )}
            {!fetching && !hasData && (
              <div style={{color:"var(--muted)",fontFamily:"'Space Mono',monospace",fontSize:11,textAlign:"center",padding:"24px 12px"}}>
                Waiting for detection data…<br/>
                <span style={{fontSize:10,marginTop:6,display:"block"}}>Upload &amp; detect an image first.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
const TABS = [
  {id:"file",    label:"File Detection",  icon:"📂"},
  {id:"webcam",  label:"Live Webcam",     icon:"📷"},
  {id:"map",     label:"Map View",        icon:"🗺"},
  {id:"report",  label:"Generate Report", icon:"📄"},
];

export default function PotholeDetector(){
  const [tab, setTab]                 = useState("file");
  // Lifted state — survives tab switches
  const [fileDetData,  setFileDetData]  = useState(null);
  const [fileObj,      setFileObj]      = useState(null);
  const [previewUrl,   setPreviewUrl]   = useState(null);
  const [fileMimeType, setFileMimeType] = useState(null);
  const [detectionKey, setDetectionKey] = useState(0); // increments on each new detection

  return(
    <>
      <style>{CSS}</style>
      <div className="scanlines"/>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="logo-wrap">
            <div className="logo-icon">🕳️</div>
            <div>
              <div className="logo-title">POTHOLE DETECTOR</div>
              <div className="logo-sub">AI-Powered Road Analysis System</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {fileDetData && (
              <span style={{
                fontFamily:"'Space Mono',monospace",fontSize:10,color:"var(--good)",
                border:"1px solid var(--good)",borderRadius:20,padding:"5px 12px",
                background:"rgba(57,255,20,.07)",letterSpacing:1
              }}>
                ✅ {fileDetData.pothole_count} POTHOLES LOGGED
              </span>
            )}
            <div className="status-pill"><div className="blink-dot"/>SYSTEM ONLINE</div>
          </div>
        </div>

        {/* TABS */}
        <div className="nav">
          {TABS.map(t=>(
            <button key={t.id} className={`nav-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              {t.icon} {t.label}
              {t.id==="report" && fileDetData?.pothole_count>0 && (
                <span style={{background:"var(--accent)",color:"#000",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700,marginLeft:2}}>
                  {fileDetData.pothole_count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="main">
          {tab==="file" && (
            <FileTab
              fileObj={fileObj}      setFileObj={setFileObj}
              previewUrl={previewUrl} setPreviewUrl={setPreviewUrl}
              fileMimeType={fileMimeType} setFileMimeType={setFileMimeType}
              detData={fileDetData}  setDetData={(d)=>{ setFileDetData(d); if(d) setDetectionKey(k=>k+1); }}
            />
          )}
          {tab==="webcam" && <WebcamTab/>}
          {tab==="map"    && <MapTab/>}
          {tab==="report" && <ReportTab key={detectionKey} loggedCount={fileDetData?.pothole_count||0}/>}
        </div>

      </div>
    </>
  );
}