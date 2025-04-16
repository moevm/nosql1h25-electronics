import os
from dotenv import load_dotenv
from datetime import datetime
from mongoengine import connect, Document, StringField, DateTimeField, FloatField, BinaryField, ListField, \
    ReferenceField, EmbeddedDocument, EmbeddedDocumentField, BooleanField
from authapp.models import User

load_dotenv()

MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_HOST = os.getenv('MONGO_HOST')
MONGO_PORT = os.getenv('MONGO_PORT')
MONGO_USER = os.getenv('MONGO_USER')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')

connect(host=f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}")


class Photo(Document):
    data = BinaryField(required=True)

    meta = {'collection': 'photos'}

    @classmethod
    def create_photo(cls, data):
        return cls(data=data)


class Status(EmbeddedDocument):
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {'allow_inheritance': True}


class CreatedStatus(Status):
    pass


class PriceOfferStatus(Status):
    price = FloatField(required=True)
    user_id = ReferenceField(User, required=True)


class PriceAcceptStatus(Status):
    user_id = ReferenceField(User, required=True)


class DateOfferStatus(Status):
    date = DateTimeField(required=True)
    user_id = ReferenceField(User, required=True)


class DateAcceptStatus(Status):
    user_id = ReferenceField(User, required=True)


class ClosedStatus(Status):
    success = BooleanField(required=True)
    user_id = ReferenceField(User, required=True)


class Request(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    address = StringField(required=True)
    category = StringField(choices=[
        'laptop', 'smartphone', 'tablet', 'pc', 'tv', 'audio', 'console', 'periphery', 'other'
    ], required=True)
    price = FloatField(required=True)
    photos = ListField(ReferenceField(Photo), required=True)
    statuses = ListField(EmbeddedDocumentField(Status), required=True)
    user_id = ReferenceField(User, required=True)

    meta = {'collection': 'requests'}

    @classmethod
    def create_request(cls, title, description, address,
                       category, price, user_id, photos=None, statuses=None):
        return cls(
            title=title,
            description=description,
            address=address,
            category=category,
            price=price,
            user_id=user_id,
            photos=photos if photos else [],
            statuses=statuses if statuses else []
        )
