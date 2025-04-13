# authapp/urls.py
from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, MeView, RefreshTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
]
