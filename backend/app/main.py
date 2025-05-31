from fastapi import FastAPI
from app.schemas import InputFeatures
import joblib
import pandas as pd
from app.predict import make_prediction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def serve_react_index():
    #return FileResponse(os.path.join("static", "index.html"))
    return "Hello Hello"

@app.post("/predict")
def predict(data: InputFeatures):
    input_df = pd.DataFrame([data.dict()])
    prediction = make_prediction(input_df)
    return {"predicted_volatility": prediction}


#venv\Scripts\activate