from fastapi import FastAPI
from app.schemas import InputFeatures
import joblib
import pandas as pd
from app.predict import make_prediction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Volatility prediction API is running"}

@app.post("/predict")
def predict(data: InputFeatures):
    input_df = pd.DataFrame([data.dict()])
    prediction = make_prediction(input_df)
    return {"predicted_volatility": prediction}


#venv\Scripts\activate