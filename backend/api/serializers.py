from rest_framework import serializers
from .models import Request, Photo

class PhotoSerializer(serializers.Serializer):
    id = serializers.CharField()
    data = serializers.CharField()

class RequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    address = serializers.CharField()
    category = serializers.ChoiceField(choices=[
        'laptop', 'smartphone', 'tablet', 'pc', 'tv', 'audio', 'console', 'periphery', 'other'
    ])
    price = serializers.FloatField()
    photos = PhotoSerializer(many=True)
    statuses = serializers.ListField(child=serializers.DictField())
    user_id = serializers.CharField()

    def create(self, validated_data):
        return Request(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        return instance
