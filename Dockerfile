FROM node:22.14.0-alpine3.21 AS frontend

WORKDIR /app
ENV VITE_BASE_URL=""

COPY frontend/package.json .
RUN npm i

COPY frontend .
RUN npm run build

FROM python:3.11.12-alpine3.21

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .
COPY --from=frontend /app/dist ./static

CMD ["sh", "-c", "python migrate.py && python manage.py runserver 0.0.0.0:8000"]
