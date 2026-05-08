from ultralytics import YOLO
import cv2

# Load trained model
model = YOLO("runs/detect/train/weights/best.pt")

# Image to test
image_path = "dataset/test/images/potholes16_png.rf.98e1456ddbacfa3c413d41844f152542.jpg"

# Run detection
results = model(image_path, conf=0.25)

# Save result image
results[0].save(filename="result.jpg")

# Show result
img = cv2.imread("result.jpg")
cv2.imshow("Detection Result", img)
cv2.waitKey(0)
cv2.destroyAllWindows()