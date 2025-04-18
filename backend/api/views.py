from drf_spectacular.utils import extend_schema
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Request, Photo, CreatedStatus
from .serializers import RequestSerializer, PhotoResponseSerializer
from authapp.serializers import ErrorResponseSerializer

class RequestCreateView(APIView):
    @extend_schema(
        summary="Создать новую заявку",
        description="Позволяет пользователю создать новую заявку. Пользователь должен быть аутентифицирован.",
        request=RequestSerializer,
        responses={
            201: RequestSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
        },
        auth=[]
    )
    def post(self, request):
        # Проверка авторизации
        user = request.user

        # Сериализация данных
        serializer = RequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            validated_data = serializer.validated_data

            # Генерация статуса "created"
            created_status = CreatedStatus.create()
            validated_data['statuses'] = [created_status]

            # Привязываем пользователя
            validated_data["user_id"] = user.id

            # Сохраняем заявку
            request_obj = Request(**validated_data)
            request_obj.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhotoUploadView(APIView):
    @extend_schema(
        summary="Загрузить фото",
        description="Загружает фото в базу данных. Пользователь должен быть аутентифицирован.",
        request=None,
        responses={
            200: PhotoResponseSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
        },
        auth=[]
    )
    def post(self, request):
        # Проверка авторизации
        user = request.user

        # Запрет для администраторов
        if hasattr(user, 'is_admin') and user.is_admin:
            return Response({"details": "Admins are not allowed to public photos"}, status=status.HTTP_403_FORBIDDEN)

        # Проверяем наличие файла
        photo_data = request.FILES.get('photo')
        if not photo_data:
            return Response({"details": "No photo provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Сохраняем фото в базу
        photo = Photo.create(data=photo_data.read())
        photo.save()

        return Response({"photo_id": str(photo.id)}, status=status.HTTP_200_OK)


class PhotoRetrieveView(APIView):
    @extend_schema(
        summary="Получить фото",
        description="Позволяет получить фото по его ID. Пользователь должен быть аутентифицирован.",
        responses={
            200: None,
            401: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        },
        auth=[]
    )
    def get(self, request, photo_id):
        # Проверка авторизации
        user = request.user

        try:
            photo = Photo.objects.get(id=photo_id)
        except Photo.DoesNotExist:
            return Response({"details": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Отправляем фото как бинарные данные
        return HttpResponse(photo.data, content_type="image/jpeg")
