from django.urls import path
from .views import RequestCreateView, PhotoUploadView, PhotoRetrieveView


urlpatterns = [
    path('requests/', RequestCreateView.as_view(), name='create_request'),
    path('photos/', PhotoUploadView.as_view(), name='photo_upload'),  # Публикация фото
    path('photos/<str:photo_id>/', PhotoRetrieveView.as_view(), name='photo_retrieve'),  # Получение фото по ID
]
