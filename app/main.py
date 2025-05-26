from fastapi import FastAPI
from app.schemas import InputFeatures
import joblib
import pandas as pd
from app.predict import make_prediction

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Volatility prediction API is running"}

@app.post("/predict")
def predict(data: InputFeatures):
    input_df = pd.DataFrame([data.dict()])
    prediction = make_prediction(input_df)
    return {"predicted_volatility": prediction}


#venv\Scripts\activate