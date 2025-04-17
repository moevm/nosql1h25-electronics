import re
from rest_framework import serializers
from .models import User

PHONE_REGEX = re.compile(r'^\+7\d{10}$')


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    fullname = serializers.CharField(max_length=255)
    role = serializers.CharField(read_only=True)
    creation_date = serializers.CharField(read_only=True)
    edit_date = serializers.CharField(read_only=True)
    phone = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate_phone(self, value):
        if not isinstance(value, str):
            raise serializers.ValidationError("Phone must be a string")
        if not PHONE_REGEX.match(value):
            raise serializers.ValidationError("Phone number format is invalid. Expected format: +7XXXXXXXXXX")

        user = User.objects(phone=value).first()
        if user:
            if self.instance is None or user.id != self.instance.id:
                raise serializers.ValidationError("Phone number already exists")
        return value

    def create(self, validated_data):
        user = User.create(
            fullname=validated_data['fullname'],
            phone=validated_data['phone'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        update_data = validated_data.copy()
        instance.update(**update_data)
        return instance

    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'fullname': instance.fullname,
            'role': instance.role,
            'creation_date': str(instance.creation_date),
            'edit_date': str(instance.edit_date),
            'phone': instance.phone,
        }


class CustomTokenObtainPairSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone = attrs.get('phone')
        password = attrs.get('password')

        try:
            user = User.objects.get(phone=phone)
        except Exception:
            raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')

        if not user.check_password(password):
            raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')

        self.user = user
        return attrs


class TokenResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()
    user_id = serializers.CharField()


class ErrorResponseSerializer(serializers.Serializer):
    details = serializers.CharField(help_text="Error message")


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True, help_text="Refresh token")
