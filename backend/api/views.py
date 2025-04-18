from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Request, Photo
from .serializers import RequestSerializer

class RequestCreateView(APIView):
    """Создание заявки"""

    def post(self, request):
        # Проверка авторизации
        user = request.user
        if not user.is_authenticated:
            return Response({"details": "Authorization required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Запрет для администраторов
        if hasattr(user, 'is_admin') and user.is_admin:
            return Response({"details": "Admins cant create requests"}, status=status.HTTP_403_FORBIDDEN)

        # Сериализация данных
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user)  # Привязываем заявку к автору
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhotoUploadView(APIView):
    """Публикация фото"""

    def post(self, request):
        # Проверка авторизации
        user = request.user
        if not user.is_authenticated:
            return Response({"details": "Authorization required"}, status=status.HTTP_401_UNAUTHORIZED)

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
    """Получение фото по ID"""

    def get(self, request, photo_id):
        # Проверка авторизации
        user = request.user
        if not user.is_authenticated:
            return Response({"details": "Authorization required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            photo = Photo.objects.get(id=photo_id)  # Ищем фото по ID
        except Photo.DoesNotExist:
            return Response({"details": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Отправляем фото как бинарные данные
        return HttpResponse(photo.data, content_type="image/jpeg")
