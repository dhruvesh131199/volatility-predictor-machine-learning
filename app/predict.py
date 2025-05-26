import joblib
import os

# Load model once when the module loads
base_dir = os.path.dirname(os.path.dirname(__file__))
model_path = os.path.join(base_dir, "models", "volatility_model.pkl")
model = joblib.load(model_path)

def make_prediction(input_df):
    prediction = model.predict(input_df)[0]
    return float(prediction)
