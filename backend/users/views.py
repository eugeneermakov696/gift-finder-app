from rest_framework import permissions
from presents.serializers import UserSerializer
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')

        response.set_cookie('access_token', access_token, httponly=True, secure=False, max_age=60*15)
        response.set_cookie('refresh_token', refresh_token, httponly=True, secure=False, max_age=60*60*24*7)

        del response.data['access']
        del response.data['refresh']
        
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response("No refresh token provided", status=status.HTTP_401_UNAUTHORIZED)

        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get('access')

        response.set_cookie('access_token', access_token, httponly=True, secure=False, max_age=60*15)

        del response.data['access']

        return response

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Больше никаких токенов здесь не создаем!
        return Response({"status": "success"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

