from django.urls import path
from .views import AuthViewSet

auth_register = AuthViewSet.as_view({'post': 'register'})
auth_login = AuthViewSet.as_view({'post': 'login'})
auth_me = AuthViewSet.as_view({'get': 'getMe', 'put': 'putMe'})
auth_logout = AuthViewSet.as_view({'post': 'logout'})

urlpatterns = [
    path('register/', auth_register, name='register'),
    path('login/', auth_login, name='login'),
    path('me/', auth_me, name='me'),
    path('logout/', auth_logout, name='logout'),
]
