from rest_framework_mongoengine.serializers import DocumentSerializer
from rest_framework import serializers
from bson import ObjectId
from bson.dbref import DBRef
from .models import ProductRequest, Photo, Status, CreatedStatus, PriceOfferStatus, PriceAcceptStatus, DateOfferStatus, \
    DateAcceptStatus, ClosedStatus, STATUS_TYPES
import os
from django.utils import timezone


class PhotoSerializer(DocumentSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'data']


class PhotoResponseSerializer(DocumentSerializer):
    class Meta:
        model = Photo
        fields = ['id']


class StatusSerializer(DocumentSerializer):
    type = serializers.ChoiceField(
        choices=STATUS_TYPES,
        required=True
    )
    timestamp = serializers.DateTimeField(read_only=True)
    user_id = serializers.CharField(source="user_id.id", read_only=True)
    price = serializers.FloatField(required=False)
    date = serializers.DateTimeField(required=False)
    success = serializers.BooleanField(required=False)

    REQUIRED_FIELDS = {
        "price_offer_status": "price",
        "date_offer_status": "date",
        "closed_status": "success"
    }

    class Meta:
        model = Status
        fields = ['type', 'timestamp', 'user_id', 'price', 'date', 'success']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        timestamp = instance.timestamp
        if timezone.is_naive(instance.timestamp):
            timestamp = timezone.make_aware(timestamp, timezone.utc)

        local_ts = timezone.localtime(timestamp)
        representation['timestamp'] = local_ts.isoformat()

        if isinstance(instance, DateOfferStatus):
            date = instance.date
            if timezone.is_naive(instance.date):
                date = timezone.make_aware(date, timezone.utc)

            local_date = timezone.localtime(date)
            representation['date'] = local_date.isoformat()

        return representation

    def validate(self, data):
        if self.REQUIRED_FIELDS.get(data.get('type'), False) and data.get(
                self.REQUIRED_FIELDS.get(data.get('type'))) is None:
            raise serializers.ValidationError(f"Missing required field: {self.REQUIRED_FIELDS.get(data.get('type'))}")
        return data

    def validate_type(self, value):
        """Проверка, что тип статуса - строка"""
        if not isinstance(value, str):
            raise serializers.ValidationError("Status type must be a string.")
        return value

    def validate_price(self, value):
        """Проверка, что цена - положительное число"""
        if value <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value

    def validate_success(self, value):
        """Проверка, что успешность закрытия - логическое значение"""
        if not isinstance(value, bool):
            raise serializers.ValidationError("Success must be a bool.")
        return value


class CreatedStatusSerializer(DocumentSerializer):
    class Meta:
        model = CreatedStatus
        fields = '__all__'


class PriceOfferStatusSerializer(DocumentSerializer):
    class Meta:
        model = PriceOfferStatus
        fields = '__all__'


class PriceAcceptStatusSerializer(DocumentSerializer):
    class Meta:
        model = PriceAcceptStatus
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


class ProductRequestSerializer(DocumentSerializer):
    statuses = StatusSerializer(many=True, read_only=True)
    user_id = serializers.CharField(source="user_id.id", read_only=True)
    photos = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = ProductRequest
        fields = '__all__'

    def to_representation(self, instance):
        """Переопределяем метод для исключения _cls из statuses"""
        representation = super().to_representation(instance)

        if "photos" in representation:
            updated_photos = [f"{os.getenv('BASE_URL')}/api/photos/{str(photo.id)}/" for photo in instance.photos]
            representation["photos"] = updated_photos

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


class ProductRequestListResponseSerializer(serializers.Serializer):
    amount = serializers.IntegerField()
    requests = ProductRequestSerializer(many=True)
