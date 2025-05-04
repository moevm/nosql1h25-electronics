import os
from dotenv import load_dotenv
from datetime import datetime, timezone
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

STATUS_TYPES = [
    'created_status',
    'price_offer_status',
    'price_accept_status',
    'date_offer_status',
    'date_accept_status',
    'closed_status'
]

class Status(EmbeddedDocument):
    timestamp = DateTimeField(default=lambda: datetime.now(timezone.utc))
    type = StringField(choices=STATUS_TYPES, required=True)

    meta = {'allow_inheritance': True}

    @classmethod
    def create(cls, **kwargs):
        if 'timestamp' not in kwargs:
            kwargs['timestamp'] = datetime.now(timezone.utc)
        return cls(**kwargs)


class CreatedStatus(Status):
    @classmethod
    def create(cls, **kwargs):
        obj = super().create(type="created_status", **kwargs)
        return obj


class PriceOfferStatus(Status):
    price = FloatField(required=True)
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, price, user_id, **kwargs):
        obj = super().create(price=price, user_id=user_id, type="price_offer_status", **kwargs)
        return obj


class PriceAcceptStatus(Status):
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, user_id, **kwargs):
        obj = super().create(user_id=user_id, type="price_accept_status", **kwargs)
        return obj


class DateOfferStatus(Status):
    date = DateTimeField(required=True)
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, date, user_id, **kwargs):
        obj = super().create(date=date, user_id=user_id, type="date_offer_status", **kwargs)
        return obj


class DateAcceptStatus(Status):
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, user_id, **kwargs):
        obj = super().create(user_id=user_id, type="date_accept_status", **kwargs)
        return obj


class ClosedStatus(Status):
    success = BooleanField(required=True)
    user_id = ReferenceField(User, required=True)

    @classmethod
    def create(cls, success, user_id, **kwargs):
        obj = super().create(success=success, user_id=user_id, type="closed_status", **kwargs)
        return obj


class ProductRequest(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    address = StringField(required=True)
    category = StringField(choices=[
        'laptop', 'smartphone', 'tablet', 'pc', 'tv', 'audio', 'console', 'periphery', 'other'
    ], required=True)
    price = FloatField(required=True)
    photos = ListField(ReferenceField(Photo), required=True)
    statuses = ListField(EmbeddedDocumentField(Status), default=list, required=True)
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
