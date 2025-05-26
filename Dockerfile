# Use Python 3.11 to avoid compatibility issues with pydantic
FROM python:3.11-slim

WORKDIR /app

# Copy only requirements and install first for Docker cache
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the app
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

#docker build -t volatility-predictor .