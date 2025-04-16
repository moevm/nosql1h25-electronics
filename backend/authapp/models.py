from mongoengine import Document, StringField, DateTimeField
from datetime import datetime
import hashlib
import secrets


class User(Document):
    fullname = StringField(required=True)
    role = StringField(default='client')
    creation_date = DateTimeField(default=datetime.utcnow)
    edit_date = DateTimeField(default=datetime.utcnow)
    phone = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    salt = StringField(required=True)

    meta = {
        'collection': 'users',
        'indexes': [
            {'fields': ['phone'], 'unique': True},
        ]
    }

    @property
    def id(self):
        return str(self.pk)

    @staticmethod
    def hash_password(password, salt):
        return hashlib.sha256((password + salt).encode()).hexdigest()

    @classmethod
    def create_user(cls, fullname, phone, password):
        salt = secrets.token_hex(16)
        password_hash = cls.hash_password(password, salt)
        return cls(
            fullname=fullname,
            phone=phone,
            password_hash=password_hash,
            salt=salt
        )

    def set_password(self, password):
        self.salt = secrets.token_hex(16)
        self.password_hash = self.hash_password(password, self.salt)
        self.save()

    def check_password(self, password):
        hashed_password = self.hash_password(password, self.salt)
        return hashed_password == self.password_hash

    def __str__(self):
        return self.phone
