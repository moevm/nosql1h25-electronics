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

    def validate_phone(self, value):
        if User.objects(phone=value).first():
            raise serializers.ValidationError("Phone number already exists")
        return value

    def create(self, validated_data):
        user = User.create_user(
            fullname=validated_data['fullname'],
            phone=validated_data['phone'],
            password=validated_data['password']
        )
        user.save()
        return user

    def update(self, instance, validated_data):
        new_phone = validated_data.get('phone', instance.phone)

        if new_phone != instance.phone:
            if User.objects(phone=new_phone).first():
                raise serializers.ValidationError("Phone number already exists")

        instance.fullname = validated_data.get('fullname', instance.fullname)
        instance.phone = new_phone

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()
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
        except Exception as e:
            raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')

        if not user.check_password(password):
            raise serializers.ValidationError({'details': 'Invalid credentials'}, code='invalid_credentials')

        refresh = RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': str(user.id),
        }
        return data
