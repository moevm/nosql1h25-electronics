from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except Exception as e:
            print(f"Authentication Error: {e}")
            return None
        return user
