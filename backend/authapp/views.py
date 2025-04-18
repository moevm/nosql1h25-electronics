from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserResponseSerializer, \
    ErrorDetailSerializer, TokenResponseSerializer


class AuthViewSet(viewsets.GenericViewSet):

    def get_permissions(self):
        if self.action in ['login', 'register']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @extend_schema(
        request=RegisterSerializer,
        responses={
            204: OpenApiResponse(description="No content. Registration successful."),
            403: OpenApiResponse(response=ErrorDetailSerializer, description="Validation error"),
            400: OpenApiResponse(response=ErrorDetailSerializer, description="Login already exists"),
        },
        auth=[],
        description="Register a new user",
    )
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        errors = serializer.errors
        for field in ['login', 'phone', 'password', 'fullname']:
            if field in errors:
                return Response({"details": f"{field} - {errors[field][0]}"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"details": "Incorrect field"}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=CustomTokenObtainPairSerializer,
        responses={
            200: OpenApiResponse(response=TokenResponseSerializer, description="Login successful. Returns token."),
            403: OpenApiResponse(response=ErrorDetailSerializer, description="Invalid credentials"),
            400: OpenApiResponse(response=ErrorDetailSerializer, description="Bad request"),
        },
        auth=[],
        description="User login",
    )
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        errors = serializer.errors
        for field in ['login', 'password']:
            if field in errors:
                return Response({"details": errors[field][0]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"details": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        responses={
            200: OpenApiResponse(response=UserResponseSerializer, description="Current user info"),
            401: OpenApiResponse(response=ErrorDetailSerializer, description="Authentication required"),
        },
    )
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        serializer = UserResponseSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=serializers.Serializer,
        responses={
            204: OpenApiResponse(description="Logged out. No content."),
            401: OpenApiResponse(response=ErrorDetailSerializer, description="Authentication required"),
        },
    )
    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        user = getattr(request.user, 'user', None) or request.user
        user.increment_token_version()
        return Response(status=status.HTTP_204_NO_CONTENT)
