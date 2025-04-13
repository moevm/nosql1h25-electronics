from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

class UserSerializer(serializers.Serializer):
    fullname = serializers.CharField(max_length=255)
    role = serializers.CharField(read_only=True)
    creation_date = serializers.CharField(read_only=True)
    edit_date = serializers.CharField(read_only=True)
    phone = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.create_user(
            fullname=validated_data['fullname'],
            phone=validated_data['phone'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        instance.fullname = validated_data.get('fullname', instance.fullname)
        instance.phone = validated_data.get('phone', instance.phone)

        if 'password' in validated_data:
            instance.password_hash = User.hash_password(validated_data['password'], instance.salt)

        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            'fullname': instance.fullname,
            'role': instance.role,
            'creation_date': instance.creation_date,
            'edit_date': instance.edit_date,
            'phone': instance.phone,
        }

class CustomTokenObtainPairSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)

    def validate(self, attrs):
        phone = attrs.get('phone')
        password = attrs.get('password')

        user = User.objects.filter(phone=phone).first()
        if not user:
            raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')

        hashed_password = User.hash_password(password, user.salt)
        if hashed_password != user.password_hash:
            raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')

        refresh = RefreshToken.for_user(user)
        refresh['user_id'] = str(user.id)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': str(user.id)
        }
        return data
