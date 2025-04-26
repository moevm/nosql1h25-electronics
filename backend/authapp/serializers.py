import re
from datetime import timedelta, datetime
from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer
from rest_framework_simplejwt_mongoengine.tokens import AccessToken
from .models import User

PHONE_REGEX = re.compile(r'^\+7\d{10}$')


class RegisterSerializer(DocumentSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('login', 'password', 'fullname', 'phone')

    def validate_login(self, value):
        if User.objects(login=value).first():
            raise serializers.ValidationError("Login already exists")
        return value

    def validate_phone(self, value):
        if not PHONE_REGEX.match(value):
            raise serializers.ValidationError("Phone number format is invalid. Expected format: +7XXXXXXXXXX")
        if User.objects(phone=value).first():
            raise serializers.ValidationError("Phone number already exists")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.create(password=password, **validated_data)


class ErrorResponseSerializer(serializers.Serializer):
    details = serializers.CharField()


class TokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()


class UserResponseSerializer(DocumentSerializer):
    user_id = serializers.CharField(source='id')

    class Meta:
        model = User
        fields = ('user_id', 'fullname', 'role', 'phone', 'creation_date', 'edit_date')


class UserEditRequestSerializer(serializers.Serializer):
    fullname = serializers.CharField(required=False, allow_blank=True, default=None)
    phone = serializers.CharField(required=False, allow_blank=True, default=None)

    def validate_phone(self, value):
        if value is None:
            return value

        if not PHONE_REGEX.match(value):
            raise serializers.ValidationError("Phone number format is invalid. Expected format: +7XXXXXXXXXX")

        request = self.context.get('request')
        if request:
            user_exists = User.objects(phone=value).first()
            if user_exists and user_exists != request.user:
                raise serializers.ValidationError("Phone number already exists")
        return value

    def update(self, instance, validated_data):
        instance.update(**validated_data)
        return instance

    class Meta:
        model = User
        fields = ('fullname', 'phone')


class CustomTokenObtainPairSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        user = User.objects(login=login).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError({"details": "Invalid credentials"}, code="authorization")

        access = AccessToken.for_user(user)
        access.set_exp(lifetime=timedelta(days=36500))
        access['token_version'] = user.token_version

        return {
            'token': str(access),
        }
