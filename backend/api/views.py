from rest_framework_mongoengine.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema
from authapp.serializers import ErrorResponseSerializer
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from .models import Request, Photo, CreatedStatus
from .serializers import RequestSerializer, PhotoSerializer, PhotoResponseSerializer

class RequestViewSet(ModelViewSet):
    """ViewSet для работы с заявками"""
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

    @extend_schema(
        summary="Создать новую заявку",
        description="Позволяет пользователю создать новую заявку.",
        request=RequestSerializer,
        responses={
            201: RequestSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
        },
        auth=[]
    )
    def create(self, request, *args, **kwargs):
        """POST запрос для создания заявки с кастомной логикой"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        created_status = CreatedStatus.create()
        validated_data['statuses'] = [created_status]

        validated_data["user_id"] = request.user.id

        request_obj = Request(**validated_data)
        request_obj.save()

        response_serializer = self.get_serializer(request_obj)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class PhotoViewSet(ModelViewSet):
    """ViewSet для работы с фотографиями"""
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

    @extend_schema(
        summary="Загрузить фото",
        description="Загружает фото в базу данных.",
        request=None,
        responses={
            200: PhotoResponseSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
        }
    )
    def create(self, request, *args, **kwargs):
        """POST запрос для загрузки фотографии"""
        user = request.user

        photo_data = request.FILES.get('photo')
        if not photo_data:
            return Response({"details": "No photo provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not photo_data.content_type.startswith('image/'):
            return Response({"details": "Uploaded file is not an image."}, status=status.HTTP_400_BAD_REQUEST)

        max_file_size = 5 * 1024 * 1024
        if photo_data.size > max_file_size:
            return Response({"details": "Image file size exceeds 5MB."}, status=status.HTTP_400_BAD_REQUEST)

        photo = Photo.create(data=photo_data.read(), content_type=photo_data.content_type)
        photo.save()

        return Response({"photo_id": str(photo.id)}, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Получить фото",
        description="Позволяет получить фото по его ID.",
        responses={
            200: None,
            401: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        }
    )
    def retrieve(self, request, *args, **kwargs):
        """GET запрос для получения фотографии по ID"""
        user = request.user

        photo_id = kwargs.get('pk')
        try:
            photo = Photo.objects.get(id=photo_id)
        except Photo.DoesNotExist:
            return Response({"details": "Photo not found"}, status=status.HTTP_404_NOT_FOUND)

        return HttpResponse(photo.data, content_type="image/jpeg")
