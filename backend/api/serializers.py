from rest_framework_mongoengine.serializers import DocumentSerializer
from rest_framework import serializers
from bson import ObjectId
from bson.dbref import DBRef
from .models import Request, Photo, CreatedStatus, PriceOfferStatus, DateOfferStatus, DateAcceptStatus, ClosedStatus

class PhotoSerializer(DocumentSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'data']

class PhotoResponseSerializer(DocumentSerializer):
    class Meta:
        model = Photo
        fields = ['id']

class CreatedStatusSerializer(DocumentSerializer):
    class Meta:
        model = CreatedStatus
        fields = '__all__'

class PriceOfferStatusSerializer(DocumentSerializer):
    class Meta:
        model = PriceOfferStatus
        fields = '__all__'

class DateOfferStatusSerializer(DocumentSerializer):
    class Meta:
        model = DateOfferStatus
        fields = '__all__'

class DateAcceptStatusSerializer(DocumentSerializer):
    class Meta:
        model = DateAcceptStatus
        fields = '__all__'

class ClosedStatusSerializer(DocumentSerializer):
    class Meta:
        model = ClosedStatus
        fields = '__all__'

class RequestSerializer(DocumentSerializer):
    statuses = serializers.ListField(read_only=True)

    class Meta:
        model = Request
        fields = '__all__'

    def to_representation(self, instance):
        """Переопределяем метод для исключения _cls из statuses"""
        representation = super().to_representation(instance)

        if "statuses" in representation:
            updated_statuses = []
            for status in instance.statuses:
                status_data = status.to_mongo().to_dict()
                if "_cls" in status_data:
                    del status_data["_cls"]
                updated_statuses.append(status_data)
            representation["statuses"] = updated_statuses

        return representation

    def validate_user_id(self, value):
        """Проверка, что ID пользователя соответствует токену"""
        if isinstance(value, DBRef):
            value = value.id

        if not ObjectId.is_valid(value):
            raise serializers.ValidationError("Invalid User ID format.")

        request_user = self.context['request'].user
        if str(request_user.id) != str(value):
            raise serializers.ValidationError("User ID does not match the authenticated user.")
        return value

    def validate_photos(self, value):
        """Проверка, что все фото существуют в базе данных"""
        invalid_photos = []
        for photo_id in value:
            if isinstance(photo_id, DBRef):
                photo_id = photo_id.id

            if not ObjectId.is_valid(photo_id):
                invalid_photos.append(photo_id)
                continue

            if not Photo.objects.filter(id=photo_id).count():
                invalid_photos.append(photo_id)

        if invalid_photos:
            raise serializers.ValidationError(f"Invalid photo IDs: {invalid_photos}")
        return value

    def validate_price(self, value):
        """Проверка, что цена - положительное число"""
        if value <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value

    def validate_category(self, value):
        """Проверка, что категория указана верно"""
        allowed_categories = [
            'laptop', 'smartphone', 'tablet', 'pc', 'tv', 'audio', 'console', 'periphery', 'other'
        ]
        if value not in allowed_categories:
            raise serializers.ValidationError(f"Invalid category. Allowed values are: {', '.join(allowed_categories)}.")
        return value

    def validate_title(self, value):
        """Проверка, что заголовок - строка"""
        if not isinstance(value, str):
            raise serializers.ValidationError("Title must be a string.")
        return value

    def validate_description(self, value):
        """Проверка, что описание - строка"""
        if not isinstance(value, str):
            raise serializers.ValidationError("Description must be a string.")
        return value

    def validate_address(self, value):
        """Проверка, что адрес - строка"""
        if not isinstance(value, str):
            raise serializers.ValidationError("Address must be a string.")
        return value