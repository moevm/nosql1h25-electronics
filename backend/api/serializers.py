from rest_framework import serializers
from .models import Request, Photo, CreatedStatus, PriceOfferStatus, DateOfferStatus, DateAcceptStatus, ClosedStatus

class PhotoSerializer(serializers.Serializer):
    id = serializers.CharField()
    data = serializers.CharField()


class PhotoResponseSerializer(serializers.Serializer):
    photo_id = serializers.CharField()

class CreatedStatusSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()


class PriceOfferStatusSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    price = serializers.FloatField(required=True)
    user_id = serializers.CharField(required=True)


class DateOfferStatusSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    date = serializers.DateTimeField(required=True)
    user_id = serializers.CharField(required=True)


class DateAcceptStatusSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    user_id = serializers.CharField(required=True)


class ClosedStatusSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    success = serializers.BooleanField(required=True)
    user_id = serializers.CharField(required=True)


class StatusSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        result = []
        for item in data:
            if isinstance(item, CreatedStatus):
                result.append(CreatedStatusSerializer(item).data)
            elif isinstance(item, PriceOfferStatus):
                result.append(PriceOfferStatusSerializer(item).data)
            elif isinstance(item, DateOfferStatus):
                result.append(DateOfferStatusSerializer(item).data)
            elif isinstance(item, DateAcceptStatus):
                result.append(DateAcceptStatusSerializer(item).data)
            elif isinstance(item, ClosedStatus):
                result.append(ClosedStatusSerializer(item).data)
        return result

    def to_internal_value(self, data):
        statuses = []
        for item in data:
            type_ = item.pop("_cls")
            if type_ == "created":
                statuses.append(CreatedStatus(**item))
            elif type_ == "price_offer":
                statuses.append(PriceOfferStatus(**item))
            elif type_ == "date_offer":
                statuses.append(DateOfferStatus(**item))
            elif type_ == "date_accept":
                statuses.append(DateAcceptStatus(**item))
            elif type_ == "closed":
                statuses.append(ClosedStatus(**item))
            else:
                raise serializers.ValidationError(f"Unknown status type: {type_}")
        return statuses


class RequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    address = serializers.CharField()
    category = serializers.ChoiceField(choices=[
        'laptop', 'smartphone', 'tablet', 'pc', 'tv', 'audio', 'console', 'periphery', 'other'
    ])
    price = serializers.FloatField()
    photos = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    user_id = serializers.CharField()

    def validate_user_id(self, value):
        """Проверка, что ID пользователя соответствует токену"""
        request_user = self.context['request'].user
        if str(request_user.id) != value:
            raise serializers.ValidationError("User ID does not match the authenticated user.")
        return value

    def validate_photos(self, value):
        """Проверка, что все фото существуют в базе данных"""
        invalid_photos = [photo_id for photo_id in value if Photo.objects.filter(id=photo_id).count() == 0]
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
