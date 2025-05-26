import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Sample payload based on your InputFeatures
sample_input = {
    "Volume": 1234567,
    "Volume_Lag1": 1.2,
    "Volume_Lag2": 1.1,
    "Volume_Lag3": 1.3,
    "Volume_Ratio": 1.05,
    "Volume_Ratio_Lag1": 1.03,
    "Volume_Ratio_Lag2": 1.01,
    "Volume_Ratio_Lag3": 0.99,
    "High_Low_Ratio": 1.06,
    "High_Low_Ratio_Lag1": 1.04,
    "High_Low_Ratio_Lag2": 1.03,
    "High_Low_Ratio_Lag3": 1.02,
    "cur_weekly_vol": 0.025,
    "weekly_vol_Lag1": 0.023,
    "weekly_vol_Lag2": 0.021,
    "weekly_vol_Lag3": 0.020
}

def test_predict_endpoint():
    response = client.post("/predict", json=sample_input)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_volatility" in data
    assert isinstance(data["predicted_volatility"], float)
