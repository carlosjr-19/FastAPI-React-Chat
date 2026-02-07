# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 1. Install dependencies
# Buscamos el requirements.txt DENTRO de la carpeta backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy backend code
# Copiamos todo el contenido de la carpeta backend al contenedor
COPY backend/ .

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]