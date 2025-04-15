import os
from dotenv import load_dotenv
import datetime
from mongoengine import connect, StringField, FloatField, BinaryField, DateTimeField, Document, ListField, ReferenceField

load_dotenv()

MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')

connect(MONGO_DB_NAME, host=f"{MONGO_HOST}:{MONGO_PORT}")

class Photo(Document):
    data_photo = BinaryField()

    def create_photo(cls, data_photo):
        return cls(
            data_photo=data_photo
        )


class Status(Document):
    type = StringField(required=True)
    timestamp = DateTimeField(default=datetime.now)

    def create_status(cls, type, timestamp):
        return cls(
            type=type,
            timestamp=timestamp
        )


# Create your models here.
class Request(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    address = StringField(required=True)
    #todo
    # добавить категории
    price = FloatField(required=True)
    #todo
    # добавить Photo
    photos = ListField(ReferenceField(Photo))
    #todo
    # добавить user_id

    #todo
    # добавить statuses
    statuses = ListField(ReferenceField(Status))
    @classmethod
    def create_request(cls, title, description, address, price, categories=None, photos=None, statuses=None):
        return cls(
            title=title,
            description=description,
            price=price,
            address=address,
            categories = categories if categories else [],
            photos = photos if photos else [],
            statuses = statuses if statuses else []
        )

