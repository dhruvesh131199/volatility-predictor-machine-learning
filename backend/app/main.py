from fastapi import FastAPI
from app.schemas import InputFeatures
import joblib
import pandas as pd
from app.predict import make_prediction
from fastapi.middleware.cors import CORSMiddleware
from app.helperFunctions import fetchandcleanXGboost
import json

app = FastAPI()

# Allow requests from ANY origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.post("/fetch-and-predict")
def fetch_and_predict():
    #collect data from the fetchandcleanXGboost function
    dfs = fetchandcleanXGboost()

    raw = dfs[0].reset_index()
    raw["Date"] = raw['Date'].dt.strftime('%Y-%m-%d')
    raw = raw.to_json(orient='records')

    processed_features = dfs[1].reset_index()
    processed_features["Date"] = processed_features['Date'].dt.strftime('%Y-%m-%d')
    processed_features = processed_features.to_json(orient="records")


    input_df = dfs[1].reset_index(drop=True).tail(1)
    print(input_df)
    prediction = make_prediction(input_df)

    return{
    "raw": json.loads(raw),
    "processed": json.loads(processed_features),
    "predicted_volatility": prediction,
    }


#venv\Scripts\activate
