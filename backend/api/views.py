from rest_framework_mongoengine.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema
from authapp.serializers import ErrorResponseSerializer
from authapp.models import User
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework import status
from django.http import HttpResponse
from django.db.models import Q
from .models import Request, Photo, Status, CreatedStatus
from .serializers import RequestSerializer, PhotoSerializer, PhotoResponseSerializer
from datetime import datetime, time

class RequestViewSet(ModelViewSet):
    """ViewSet для работы с заявками"""
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filter_backends = [OrderingFilter]

    @extend_schema(
        summary="Создать новую заявку",
        description="Позволяет пользователю создать новую заявку.",
        request=RequestSerializer,
        responses={
            201: RequestSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
        },
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

    def list(self, request, *args, **kwargs):
        user = request.user

        # Получаем параметры фильтрации
        title = request.query_params.get('title')
        description = request.query_params.get('description')
        from_date = request.query_params.get('from')
        to_date = request.query_params.get('to')
        custom_status = request.query_params.get('status')
        category = request.query_params.get('category')
        author = request.query_params.get('author')
        me = request.query_params.get('me')

        if user.role == "client":
            if author:
                return Response(
                    {"details": "You do not have permission to filter by author."},
                    status=status.HTTP_403_FORBIDDEN
                )
            me = True

        queryset = Request.objects.all()

        if title:
            queryset = queryset.filter(title__icontains=title)

        if description:
            queryset = queryset.filter(description__icontains=description)

        if from_date:
            try:
                from_date = datetime.strptime(from_date, "%Y-%m-%d")
                from_date = datetime.combine(from_date, time.min)
            except ValueError:
                return Response({"details": "Invalid 'from' date format"}, status=status.HTTP_400_BAD_REQUEST)

        if to_date:
            try:
                to_date = datetime.strptime(to_date, "%Y-%m-%d")
                to_date = datetime.combine(to_date, time.max)
            except ValueError:
                return Response({"details": "Invalid 'to' date format"}, status=status.HTTP_400_BAD_REQUEST)

        if from_date or to_date:
            filtered_queryset = []
            for request_obj in queryset:
                if request_obj.statuses:
                    last_status = request_obj.statuses[-1]
                    timestamp = last_status["timestamp"]

                    if timestamp:
                        if from_date and timestamp < from_date:
                            continue
                        if to_date and timestamp > to_date:
                            continue

                        filtered_queryset.append(request_obj)
            queryset = queryset.filter(id__in=[obj.id for obj in filtered_queryset])

        if custom_status:
            filtered_queryset = []
            for request_obj in queryset:
                if request_obj.statuses:
                    last_status = request_obj.statuses[-1]
                    type_field = last_status["type"]

                    if type_field and type_field != custom_status:
                        continue

                    filtered_queryset.append(request_obj)
            queryset = queryset.filter(id__in=[obj.id for obj in filtered_queryset])

        if category:
            queryset = queryset.filter(category=category)

        if author:
            matching_users = [
                user.id for user in User.objects.filter(fullname=author)
            ]

            queryset = queryset.filter(user_id__in=matching_users)

        if me:
            filtered_queryset = []
            for request_obj in queryset:
                if str(request_obj.user_id.id) == str(user.id):
                    filtered_queryset.append(request_obj)
                elif request_obj.statuses:
                    for custom_status in request_obj.statuses:
                        if "user_id" in custom_status and str(custom_status.user_id.id) == str(user.id):
                            filtered_queryset.append(request_obj)
                            break
            queryset = queryset.filter(id__in=[obj.id for obj in filtered_queryset])

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
