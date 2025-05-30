# === Frontend Stage ===
FROM node:18-alpine AS frontend

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === Backend Stage ===
FROM python:3.11-slim AS backend

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# === Final Stage ===
FROM python:3.11-slim

WORKDIR /app
COPY --from=backend /app /app
RUN pip install --no-cache-dir -r requirements.txt
RUN which uvicorn

COPY --from=frontend /frontend/dist /app/static

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
