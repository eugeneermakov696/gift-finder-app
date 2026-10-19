from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header:
            return super().authenticate(request)

        raw_token = request.COOKIES.get("access_token")

        if raw_token is not None:
            try:
                validated_token = self.get_validated_token(raw_token.encode("utf-8"))
                return self.get_user(validated_token), validated_token
            except (InvalidToken, AuthenticationFailed):
                return None

        return None
