import os
from dotenv import load_dotenv
from mongoengine import connect, StringField, FloatField, BinaryField, DateTimeField

load_dotenv()

MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')

connect(MONGO_DB_NAME, host=f"{MONGO_HOST}:{MONGO_PORT}")

# Create your models here.
class Request():
    title = StringField(required=True)
    description = StringField(required=True)
    address = StringField(required=True)
    #todo
    # добавить категории
    price = FloatField(required=True)
    #todo
    # добавить Photo
    # добавить user_id
    # добавить statuses
    @classmethod
    def create_request(cls, title, description, address, price):
        return cls(
            title=title,
            description=description,
            price=price,
            address=address
        )

class Photo():
    data = BinaryField()
    pass

class Status():
    type = StringField(required=True)
    timestamp = DateTimeField()#todo добавить дефолтное время
    pass

