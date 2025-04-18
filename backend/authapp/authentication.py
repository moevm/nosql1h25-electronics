from rest_framework_simplejwt_mongoengine.authentication import JWTAuthentication
from .models import User

class AuthenticatedUser:
    def __init__(self, user):
        self.user = user
        self.is_authenticated = True

    def __getattr__(self, name):
        return getattr(self.user, name)

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        token_version = validated_token.get('token_version', -1)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

        if user.token_version != token_version:
            return None

        return AuthenticatedUser(user)
