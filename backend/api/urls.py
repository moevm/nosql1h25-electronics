from django.urls import path
from .views import RequestViewSet, PhotoViewSet

urlpatterns = [
    path('requests/', RequestViewSet.as_view({'post': 'create', 'get': 'list'}), name='request_list_create'),
    path('requests/<str:pk>/', RequestViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='request_detail'),

    path('photos/', PhotoViewSet.as_view({'post': 'create', 'get': 'list'}), name='photo_list_create'),
    path('photos/<str:pk>/', PhotoViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='photo_detail'),

]
