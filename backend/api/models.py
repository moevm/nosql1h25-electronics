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
    def create(cls, data):
        return cls(data=data)

    def update(self, **kwargs):
        for field in ['data']:
            if field in kwargs:
                setattr(self, field, kwargs[field])
        self.save()


class Status(EmbeddedDocument):
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {'allow_inheritance': True}

    @classmethod
    def create(cls, **kwargs):
        if 'timestamp' not in kwargs:
            kwargs['timestamp'] = datetime.utcnow()
        return cls(**kwargs)

    def update(self, **kwargs):
        # Обновление полей статуса (если нужно)
        for key, value in kwargs.items():
            setattr(self, key, value)


class CreatedStatus(Status):
    @classmethod
    def create(cls):
        return super().create()


class PriceOfferStatus(Status):
    price = FloatField(required=True)
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, price, user_id, **kwargs):
        return super().create(price=price, user_id=user_id, **kwargs)


class PriceAcceptStatus(Status):
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, user_id, **kwargs):
        return super().create(user_id=user_id, **kwargs)


class DateOfferStatus(Status):
    date = DateTimeField(required=True)
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, date, user_id, **kwargs):
        return super().create(date=date, user_id=user_id, **kwargs)


class DateAcceptStatus(Status):
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, user_id, **kwargs):
        return super().create(user_id=user_id, **kwargs)


class ClosedStatus(Status):
    success = BooleanField(required=True)
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, success, user_id, **kwargs):
        return super().create(success=success, user_id=user_id, **kwargs)


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
    def create(cls, title, description, address, category, price, user_id, photos=None, statuses=None):
        instance = cls(
            title=title,
            description=description,
            address=address,
            category=category,
            price=price,
            user_id=user_id,
            photos=photos if photos else [],
            statuses=statuses if statuses else []
        )
        instance.save()
        return instance

    def update(self, **kwargs):
        for field in ['title', 'description', 'address', 'category', 'price']:
            if field in kwargs:
                setattr(self, field, kwargs[field])
        if 'photos' in kwargs:
            self.photos = kwargs['photos']
        if 'statuses' in kwargs:
            self.statuses = kwargs['statuses']
        self.save()

    def add_status(self, status):
        self.statuses.append(status)
        self.save()
