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

class ErrorDetailSerializer(serializers.Serializer):
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

# class UserSerializer(DocumentSerializer):
#     password = serializers.CharField(write_only=True, required=True)
#     login = serializers.CharField(required=True)
#
#     class Meta:
#         model = User
#         fields = ('id', 'login', 'fullname', 'role', 'creation_date', 'edit_date', 'phone', 'password')
#         read_only_fields = ('id', 'role', 'creation_date', 'edit_date')
#
#     def validate_login(self, value):
#         user = User.objects(login=value).first()
#         if user and (not self.instance or user.id != self.instance.id):
#             raise serializers.ValidationError("Login already exists")
#         return value
#
#     def validate_phone(self, value):
#         if value:
#             if not isinstance(value, str):
#                 raise serializers.ValidationError("Phone must be a string")
#             if not PHONE_REGEX.match(value):
#                 raise serializers.ValidationError("Phone number format is invalid. Expected format: +7XXXXXXXXXX")
#
#             user = User.objects(phone=value).first()
#             if user and (not self.instance or user.id != self.instance.id):
#                 raise serializers.ValidationError("Phone number already exists")
#         return value
#
#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         user = User.create(password=password, **validated_data)
#         return user
#
#     def update(self, instance, validated_data):
#         password = validated_data.pop('password', None)
#         instance.update(**validated_data)
#         if password:
#             instance.set_password(password)
#         return instance
#
#
# class CustomTokenObtainPairSerializer(serializers.Serializer):
#     login = serializers.CharField(max_length=150)
#     password = serializers.CharField(write_only=True)
#
#     def validate(self, attrs):
#         login = attrs.get('login')
#         password = attrs.get('password')
#
#         try:
#             user = User.objects.get(login=login)
#         except User.DoesNotExist:
#             raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')
#
#         if not user.check_password(password):
#             raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')
#
#         self.user = user
#         return attrs
#
#
# class TokenResponseSerializer(serializers.Serializer):
#     refresh = serializers.CharField()
#     access = serializers.CharField()
#     user_id = serializers.CharField()
#
#
# class ErrorResponseSerializer(serializers.Serializer):
#     details = serializers.CharField(help_text="Error message")
#
#
# class TokenRefreshSerializer(serializers.Serializer):
#     refresh = serializers.CharField(required=True, help_text="Refresh token")
