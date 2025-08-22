from fastapi import FastAPI, UploadFile, File, HTTPException
)


@app.get("/treatments")
async def get_treatment(disease: str):
item = TREATMENTS.get(disease)
if not item:
raise HTTPException(status_code=404, detail="Unknown disease")
return item


@app.post("/predict", response_model=Prediction)
async def predict(file: UploadFile = File(...)):
if not file.content_type or not file.content_type.startswith("image/"):
raise HTTPException(status_code=400, detail="Please upload an image file")


raw = await file.read()
try:
img = Image.open(io.BytesIO(raw))
except Exception:
raise HTTPException(status_code=400, detail="Invalid image data")


t0 = time.time()
label, conf = MODEL.predict(img)
latency = (time.time() - t0) * 1000.0


treatment = TREATMENTS.get(label, {}).get("treatment")


return Prediction(
disease=label,
confidence=round(conf, 4),
treatment=treatment,
latency_ms=round(latency, 2),
)


@app.post("/predict-batch", response_model=List[Prediction])
async def predict_batch(files: List[UploadFile] = File(...)):
results: List[Prediction] = []
for f in files:
try:
raw = await f.read()
img = Image.open(io.BytesIO(raw))
t0 = time.time()
label, conf = MODEL.predict(img)
latency = (time.time() - t0) * 1000.0
treatment = TREATMENTS.get(label, {}).get("treatment")
results.append(Prediction(
disease=label,
confidence=round(conf, 4),
treatment=treatment,
latency_ms=round(latency, 2),
))
except Exception:
results.append(Prediction(disease="error", confidence=0.0, treatment=None, latency_ms=None))
return results


# Root convenience
@app.get("/")
async def root():
return {"name": APP_NAME, "docs": "/docs", "health": "/health"}