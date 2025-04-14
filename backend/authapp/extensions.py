from drf_spectacular.contrib.rest_framework_simplejwt import SimpleJWTScheme


class CustomJWTAuthenticationScheme(SimpleJWTScheme):
    target_class = 'authapp.authentication.CustomJWTAuthentication'
    name = 'CustomJWT'
