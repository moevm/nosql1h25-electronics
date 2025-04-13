from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        try:
            user = User.objects.filter(id=user_id).first()
        except Exception:
            return None
        return user
