from django.urls import path
from .views import RequestViewSet, PhotoViewSet, DatabaseBackupViewSet

urlpatterns = [
    path('requests/', RequestViewSet.as_view({'post': 'create', 'get': 'list'}), name='request_list_create'),
    path('requests/<str:pk>/', RequestViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='request_detail'),

    path('photos/', PhotoViewSet.as_view({'post': 'create'}), name='photo_list_create'),
    path('photos/<str:pk>/', PhotoViewSet.as_view({'get': 'retrieve'}), name='photo_detail'),

    path('backup/', DatabaseBackupViewSet.as_view({'get': 'export_backup', 'post': 'import_backup'}), name='backup')
]
