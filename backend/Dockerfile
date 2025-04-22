FROM python:3.11.12-alpine3.21

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "python migrate.py && python manage.py runserver 0.0.0.0:8000"]
