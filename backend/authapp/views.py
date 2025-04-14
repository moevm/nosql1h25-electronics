from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from mongoengine.errors import NotUniqueError


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=UserSerializer,
        responses={201: UserSerializer, 403: None, 400: None}
    )

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=201)
            except NotUniqueError:
                return Response({'details': 'Phone number already exists'},status=403)
        return Response(serializer.errors, status=400)


class MyTokenObtainPairView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=CustomTokenObtainPairSerializer,
        responses={200: CustomTokenObtainPairSerializer, 400: None}
    )

    def post(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.validated_data, status=200)
        else:
            return Response(serializer.errors, status=400)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses=UserSerializer
    )

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=None,
        responses={200: {'type': 'object', 'properties': {'access_token': {'type': 'string'}}},
                   400: None}
    )

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({'access_token': access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
