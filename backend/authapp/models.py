from mongoengine import Document, StringField, DateTimeField
from datetime import datetime
import hashlib
import secrets

class User(Document):
    fullname = StringField(required=True)
    role = StringField(default='client')
    creation_date = DateTimeField(default=datetime.now)
    edit_date = DateTimeField(default=datetime.now)
    phone = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    salt = StringField(required=True)

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
