import re
from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer
from rest_framework_simplejwt_mongoengine.tokens import RefreshToken
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


class CustomTokenObtainPairSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        user = User.objects(login=login).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError({"details": "Invalid credentials"}, code="authorization")

        refresh = RefreshToken.for_user(user)
        refresh['token_version'] = user.token_version

        return {
            'token': str(refresh.access_token),
        }
