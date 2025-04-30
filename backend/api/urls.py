from django.urls import path
from .views import RequestViewSet, PhotoViewSet, DatabaseBackupViewSet, UserViewSet

urlpatterns = [
    path('requests/', RequestViewSet.as_view({'post': 'postRequests', 'get': 'getRequests'}), name='request_list_create'),
    path('requests/<str:pk>/', RequestViewSet.as_view({'get': 'getRequestsByID'}), name='request_detail'),

    path('photos/', PhotoViewSet.as_view({'post': 'postPhotos'}), name='photo_list_create'),
    path('photos/<str:pk>/', PhotoViewSet.as_view({'get': 'getPhotos'}), name='photo_detail'),

    path('backup/', DatabaseBackupViewSet.as_view({'get': 'getBackup', 'post': 'postBackup'}), name='backup'),
    path('users/<str:pk>/', UserViewSet.as_view({'get': 'getUserById'}), name='user_detail')
]
