from rest_framework_mongoengine.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse, OpenApiTypes
from drf_spectacular.types import OpenApiTypes
from authapp.serializers import ErrorResponseSerializer, UserResponseSerializer
from authapp.models import User
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from .models import ProductRequest, Photo, CreatedStatus
from .serializers import ProductRequestSerializer, PhotoSerializer, PhotoResponseSerializer
from datetime import datetime, time
from bson import ObjectId
import json
import base64

class RequestViewSet(ModelViewSet):
    """ViewSet для работы с заявками"""
    queryset = ProductRequest.objects.all()
    serializer_class = ProductRequestSerializer
    filter_backends = [OrderingFilter]

    @extend_schema(
        summary="Создать новую заявку",
        description="Позволяет пользователю создать новую заявку.",
        request=ProductRequestSerializer,
        responses={
            201: ProductRequestSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer
        },
    )
    def postRequests(self, request, *args, **kwargs):
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
            request_obj = ProductRequest(**validated_data)
            request_obj.save()
        except Exception as e:
            return Response(
                {"details": f"Failed to save request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        response_serializer = self.get_serializer(request_obj)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Получить список заявок",
        description="Возвращает список заявок с возможностью фильтрации по разным критериям.",
        parameters=[
            OpenApiParameter(name="title", description="Фильтрация по названию заявки", required=False, type=str),
            OpenApiParameter(name="description", description="Фильтрация по описанию заявки", required=False, type=str),
            OpenApiParameter(name="from", description="Фильтрация по дате начала (формат YYYY-MM-DD)", required=False,
                             type=str),
            OpenApiParameter(name="to", description="Фильтрация по дате окончания (формат YYYY-MM-DD)", required=False,
                             type=str),
            OpenApiParameter(name="status", description="Фильтрация по статусу заявки", required=False, type=str),
            OpenApiParameter(name="category", description="Фильтрация по категории заявки", required=False, type=str),
            OpenApiParameter(name="author", description="Фильтрация по автору заявки", required=False, type=str),
            OpenApiParameter(name="me", description="Фильтрация по своим заявкам", required=False, type=bool),
            OpenApiParameter(name="sort",
                             description="Сортировка записей (title, description, address, category, fullname, last_update)",
                             required=False, type=str)
        ],
        responses={
            200: ProductRequestSerializer(many=True),
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
        }
    )
    def getRequests(self, request, *args, **kwargs):
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
        sort = str(request.query_params.get('sort')) if request.query_params.get('sort') is not None else None

        if user.role == "client":
            if author:
                return Response(
                    {"details": "You do not have permission to filter by author."},
                    status=status.HTTP_403_FORBIDDEN
                )
            me = True

        queryset = ProductRequest.objects.all()

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
                user.id for user in User.objects.filter(fullname__icontains=author)
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

        if sort:
            if sort in ["title", "description", "address", "category"]:
                queryset = queryset.order_by(sort)
            elif sort == "fullname":
                queryset = sorted(queryset, key=lambda x: x.user_id.fullname.lower())
            elif sort == "last_update":
                queryset = sorted(queryset, key=lambda x: x.statuses[-1]["timestamp"], reverse=True)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Получить заявку",
        description="Позволяет получить заявку по её ID с проверкой прав доступа.",
        responses={
            200: ProductRequestSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        }
    )
    def getRequestsByID(self, request, pk=None, *args, **kwargs):
        try:
            instance = ProductRequest.objects.get(id=pk)
        except:
            return Response(
                {"details": "ProductRequest not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        user = request.user
        if not user.is_admin and str(instance.user_id.id) != str(user.id):
            return Response(
                {"details": "You do not have permission to view this request."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProductRequestSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PhotoViewSet(ModelViewSet):
    """ViewSet для работы с фотографиями"""
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

    def get_permissions(self):
        if self.action == 'getPhotos':
            return [AllowAny()]
        return [IsAuthenticated()]


    @extend_schema(
        summary="Загрузить фото",
        description="Загружает фото в базу данных.",
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'photo': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Файл изображения (до 5MB)'
                    }
                },
                'required': ['photo']
            }
        },
        responses={
            200: PhotoResponseSerializer,
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
        }
    )
    def postPhotos(self, request, *args, **kwargs):
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

        return Response({"id": str(photo.id)}, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Получить фото",
        description="Позволяет получить фото по его ID.",
        responses={
            200: OpenApiResponse(description="BINARY формат данных"),
            401: ErrorResponseSerializer,
            404: ErrorResponseSerializer,
        },
        auth=[]
    )
    def getPhotos(self, request, *args, **kwargs):
        """GET запрос для получения фотографии по ID"""
        user = request.user

        photo_id = kwargs.get('pk')
        try:
            photo = Photo.objects.get(id=photo_id)
        except Photo.DoesNotExist:
            return Response({"details": "Photo not found"}, status=status.HTTP_404_NOT_FOUND)

        return HttpResponse(photo.data, content_type="image/jpeg")


class DatabaseBackupViewSet(ModelViewSet):
    queryset = ProductRequest.objects.all()
    serializer_class = ProductRequestSerializer

    @extend_schema(
        summary="Экспорт резервной копии",
        description="Позволяет экспортировать данные всех коллекций базы данных в формате JSON.",
        responses={
            200: OpenApiResponse(description="JSON файл с данными для резервной копии"),
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
        }
    )
    def getBackup(self, request, *args, **kwargs):
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

        def handle_objectid(value):
            if isinstance(value, ObjectId):
                return str(value)
            elif isinstance(value, list):
                return [handle_objectid(item) for item in value]
            elif isinstance(value, dict):
                return {k: handle_objectid(v) for k, v in value.items()}
            return value

        # Экспорт requests

        for obj in ProductRequest.objects.all():
            obj_data = obj.to_mongo().to_dict()

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

    def validate_backup_data(self, data):
        """Валидация структуры и содержимого данных перед импортом"""
        try:
            required_request_fields = {"_id", "title", "description", "address", "category", "price", "statuses",
                                       "user_id", "photos"}

            required_photo_fields = {"_id", "data"}

            required_user_fields = {"_id", "login", "fullname", "role", "phone", "password_hash", "salt",
                                    "token_version", "creation_date", "edit_date"}

            for obj_data in data.get("requests", []):
                fields = set(obj_data.keys())
                if not required_request_fields.issubset(fields):
                    raise ValueError(f"Missing required fields in ProductRequest: {required_request_fields - fields}")
                if not fields.issubset(required_request_fields):
                    raise ValueError(f"Unexpected fields in ProductRequest: {fields - required_request_fields}")

                for status in obj_data.get("statuses", []):
                    required_status_fields = {"type", "timestamp", "_cls"}
                    if status["type"] not in [
                        "created_status",
                        "price_offer_status",
                        "price_accept_status",
                        "date_offer_status",
                        "date_accept_status",
                        "closed_status"
                    ]:
                        raise ValueError(f"Invalid status type: {status['type']}")
                    if status["type"] != "created_status":
                        required_status_fields.add("user_id")
                    if status["type"] == "date_offer_status":
                        required_status_fields.add("date")
                    if status["type"] == "closed_status":
                        required_status_fields.add("success")
                    if status["type"] == "price_offer_status":
                        required_status_fields.add("price")

                    status_fields = set(status.keys())

                    if not required_status_fields.issubset(status_fields):
                        raise ValueError(f"Missing required fields in Status: {required_status_fields - status_fields}")
                    if not status_fields.issubset(required_status_fields):
                        raise ValueError(
                            f"Unexpected fields in Status: {status_fields - (required_status_fields)}")

                    try:
                        datetime.strptime(status["timestamp"], "%Y-%m-%dT%H:%M:%S.%f")
                    except ValueError:
                        datetime.strptime(status["timestamp"], "%Y-%m-%dT%H:%M:%S")

            for obj_data in data.get("photos", []):
                fields = set(obj_data.keys())
                if not required_photo_fields.issubset(fields):
                    raise ValueError(f"Missing required fields in Photo: {required_photo_fields - fields}")
                if not fields.issubset(required_photo_fields):
                    raise ValueError(f"Unexpected fields in Photo: {fields - required_photo_fields}")
                base64.b64decode(obj_data["data"])

            for obj_data in data.get("users", []):
                fields = set(obj_data.keys())
                if not required_user_fields.issubset(fields):
                    raise ValueError(f"Missing required fields in User: {required_user_fields - fields}")
                if not fields.issubset(required_user_fields):
                    raise ValueError(
                        f"Unexpected fields in User: {fields - (required_user_fields)}")

                for date_field in ["creation_date", "edit_date"]:
                    if date_field in obj_data:
                        try:
                            datetime.strptime(obj_data[date_field], "%Y-%m-%dT%H:%M:%S.%f")
                        except ValueError:
                            datetime.strptime(obj_data[date_field], "%Y-%m-%dT%H:%M:%S")
            return True
        except Exception as e:
            raise ValueError(f"Validation failed: {str(e)}")

    @extend_schema(
        summary="Импорт резервной копии",
        description="Позволяет импортировать данные всех коллекций из JSON файла.",
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'JSON файл резервной копии'
                    }
                },
                'required': ['file']
            }
        },
        responses={
            200: OpenApiResponse(description="Резервная копия успешно импортирована"),
            400: ErrorResponseSerializer,
            401: ErrorResponseSerializer,
            403: ErrorResponseSerializer,
            500: ErrorResponseSerializer,
        }
    )
    def postBackup(self, request, *args, **kwargs):
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

            self.validate_backup_data(data)

            current_versions = {str(u.id): u.token_version for u in User.objects.all()}

            ProductRequest.objects.all().delete()
            Photo.objects.all().delete()
            User.objects.all().delete()

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
                ProductRequest(**obj_data).save()

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

                user_id_str = str(obj_data["id"])
                old_version = current_versions.get(user_id_str, -1)
                backup_version = obj_data.get("token_version", 0)

                obj_data["token_version"] = max(backup_version, old_version + 1)

                User(**obj_data).save()

        except ValueError as validation_error:
            return JsonResponse({"details": str(validation_error)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"details": f"Failed to import backup: {str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse({"details": "Backup successfully imported"}, status=status.HTTP_200_OK)


class UserViewSet(ModelViewSet):
    queryset = ProductRequest.objects.all()

    def getUserById(self, request, *args, **kwargs):
        try:
            instance = ProductRequest.objects.get(id=pk)
        except:
            return Response(
                {"details": "ProductRequest not found"},
                status=status.HTTP_404_NOT_FOUND
            )

