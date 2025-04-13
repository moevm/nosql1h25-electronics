import os
from dotenv import load_dotenv
from mongoengine import connect

load_dotenv()

MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')

connect(MONGO_DB_NAME, host=f"{MONGO_HOST}:{MONGO_PORT}")

# Create your models here.
