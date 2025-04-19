from rest_framework_mongoengine.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema
from authapp.serializers import ErrorResponseSerializer
from authapp.models import User
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from .models import Request, Photo, CreatedStatus
from .serializers import RequestSerializer, PhotoSerializer, PhotoResponseSerializer
from datetime import datetime, time
from bson import ObjectId
import json
import base64

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
        user = request.user
        if user.is_admin:
            return Response(
                {"details": "You do not have permission to create request"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(
                {"details": "Invalid request data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        validated_data = serializer.validated_data


        created_status = CreatedStatus.create()
        validated_data['statuses'] = [created_status]

        validated_data["user_id"] = request.user.id

        try:
            request_obj = Request(**validated_data)
            request_obj.save()
        except Exception as e:
            return Response(
                {"details": f"Failed to save request"},
                status=status.HTTP_400_BAD_REQUEST
            )

        response_serializer = self.get_serializer(request_obj)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        user = request.user

        # Получаем параметры фильтрации
        title = str(request.query_params.get('title')) if request.query_params.get('title') is not None else None
        description = str(request.query_params.get('description')) if request.query_params.get(
            'description') is not None else None
        from_date = str(request.query_params.get('from')) if request.query_params.get('from') is not None else None
        to_date = str(request.query_params.get('to')) if request.query_params.get('to') is not None else None
        custom_status = str(request.query_params.get('status')) if request.query_params.get(
            'status') is not None else None
        category = str(request.query_params.get('category')) if request.query_params.get(
            'category') is not None else None
        author = str(request.query_params.get('author')) if request.query_params.get('author') is not None else None
        me = str(request.query_params.get('me')) if request.query_params.get('me') is not None else None

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

    def retrieve(self, request, pk=None, *args, **kwargs):
        try:
            instance = Request.objects.get(id=pk)
        except:
            return Response(
                {"details": "Request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        if not user.is_admin and str(instance.user_id.id) != str(user.id):
            return Response(
                {"details": "You do not have permission to view this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RequestSerializer(instance)
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

        photo = Photo.create(data=photo_data.read())
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


class DatabaseBackupViewSet(ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

    def export_backup(self, request, *args, **kwargs):
        """Экспорт данных всех коллекций базы данных"""
        user = request.user
        if not user.is_admin:
            return Response(
                {"details": "You do not have permission to do backup"},
                status=status.HTTP_403_FORBIDDEN
            )

        backup_data = {
            "requests": [],
            "photos": [],
            "users": []
        }

        # Экспорт requests

        for obj in Request.objects.all():
            obj_data = obj.to_mongo().to_dict()

            def handle_objectid(value):
                if isinstance(value, ObjectId):
                    return str(value)
                elif isinstance(value, list):
                    return [handle_objectid(item) for item in value]
                elif isinstance(value, dict):
                    return {k: handle_objectid(v) for k, v in value.items()}
                return value

            obj_data = {key: handle_objectid(value) for key, value in obj_data.items()}
            backup_data["requests"].append(obj_data)

        # Экспорт photos

        for obj in Photo.objects.all():
            obj_data = obj.to_mongo().to_dict()
            obj_data["data"] = base64.b64encode(obj_data["data"]).decode("utf-8")
            obj_data = {key: handle_objectid(value) for key, value in obj_data.items()}
            backup_data["photos"].append(obj_data)

        # Экспорт users

        for obj in User.objects.all():
            obj_data = obj.to_mongo().to_dict()
            obj_data = {key: handle_objectid(value) for key, value in obj_data.items()}
            backup_data["users"].append(obj_data)

        response = JsonResponse(backup_data, safe=False)
        response['Content-Disposition'] = 'attachment; filename=backup.json'
        return response

    def import_backup(self, request, *args, **kwargs):
        """Импорт данных всех коллекций из файла"""
        user = request.user
        if not user.is_admin:
            return Response(
                {"details": "You do not have permission to do backup"},
                status=status.HTTP_403_FORBIDDEN
            )

        file = request.FILES.get('file')
        if not file:
            return JsonResponse({"details": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = json.load(file)

            for obj_data in data.get("requests", []):
                if "_id" in obj_data:
                    obj_data["id"] = ObjectId(obj_data.pop("_id"))

                if "statuses" in obj_data:
                    for custom_status in obj_data["statuses"]:
                        if "timestamp" in custom_status:
                            try:
                                custom_status["timestamp"] = datetime.strptime(custom_status["timestamp"], "%Y-%m-%dT%H:%M:%S.%f")
                            except ValueError:
                                custom_status["timestamp"] = datetime.strptime(custom_status["timestamp"], "%Y-%m-%dT%H:%M:%S")
                Request(**obj_data).save()

            for obj_data in data.get("photos", []):
                if "_id" in obj_data:
                    obj_data["id"] = ObjectId(obj_data.pop("_id"))
                obj_data["data"] = base64.b64decode(obj_data["data"])
                Photo(**obj_data).save()

            for obj_data in data.get("users", []):
                if "_id" in obj_data:
                    obj_data["id"] = ObjectId(obj_data.pop("_id"))

                for date_field in ["creation_date", "edit_date"]:
                    if date_field in obj_data:
                        try:
                            obj_data[date_field] = datetime.strptime(obj_data[date_field], "%Y-%m-%dT%H:%M:%S.%f")
                        except ValueError:
                            obj_data[date_field] = datetime.strptime(obj_data[date_field], "%Y-%m-%dT%H:%M:%S")
                User(**obj_data).save()

        except Exception as e:
            return JsonResponse({"details": f"Failed to import backup: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse({"details": "Backup successfully imported"}, status=status.HTTP_200_OK)