from rest_framework import serializers
from .models import Request, Photo

class PhotoSerializer(serializers.Serializer):
    id = serializers.CharField()
    data = serializers.CharField()

class StatusSerializer(serializers.Serializer):
    type = serializers.CharField()
    timestamp = serializers.DateTimeField()
    price = serializers.FloatField(required=False)  # Цена только для "price_offer"
    user_id = serializers.CharField(required=False)  # ID пользователя только для статуса с взаимодействием

class RequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    address = serializers.CharField()
    category = serializers.ChoiceField(choices=[
        'laptop', 'smartphone', 'tablet', 'pc', 'tv', 'audio', 'console', 'periphery', 'other'
    ])
    price = serializers.FloatField()
    photos = serializers.ListField(
        child=serializers.CharField()  # Идентификаторы фото (ObjectId в виде строки)
    )
    user_id = serializers.CharField()  # ID пользователя (ObjectId в виде строки)
    statuses = serializers.ListField(
        child=StatusSerializer()  # Вложенные объекты статусов
    )

    def create(self, validated_data):
        return Request(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        return instance