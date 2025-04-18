from mongoengine import Document, StringField, DateTimeField, IntField
from datetime import datetime
import hashlib
import secrets


class User(Document):
    login = StringField(required=True, unique=True)
    fullname = StringField(required=True)
    role = StringField(default='client')
    creation_date = DateTimeField(default=datetime.utcnow)
    edit_date = DateTimeField(default=datetime.utcnow)
    phone = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    salt = StringField(required=True)
    token_version = IntField(default=0)

    meta = {
        'collection': 'users',
        'indexes': [
            {'fields': ['login'], 'unique': True},
            {'fields': ['phone'], 'unique': True},
        ]
    }

    @property
    def id(self):
        return str(self.pk)

    @property
    def is_admin(self):
        return self.role == 'admin'

    @staticmethod
    def hash_password(password, salt):
        return hashlib.sha256((password + salt).encode()).hexdigest()

    @classmethod
    def create(cls, login, fullname, phone, password):
        salt = secrets.token_hex(16)
        password_hash = cls.hash_password(password, salt)
        user = cls(
            login=login,
            fullname=fullname,
            phone=phone,
            password_hash=password_hash,
            salt=salt
        )
        user.save()
        return user

    def update(self, **kwargs):
        for field in ['login', 'fullname', 'phone']:
            if field in kwargs:
                setattr(self, field, kwargs[field])
        if 'password' in kwargs:
            self.set_password(kwargs['password'])
        self.edit_date = datetime.utcnow()
        self.save()

    def set_password(self, password):
        self.salt = secrets.token_hex(16)
        self.password_hash = self.hash_password(password, self.salt)
        self.save()

    def check_password(self, password):
        hashed_password = self.hash_password(password, self.salt)
        return hashed_password == self.password_hash

    def __str__(self):
        return self.phone
