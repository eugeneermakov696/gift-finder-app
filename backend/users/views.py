from rest_framework import permissions
from presents.serializers import UserSerializer
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from users.serializers import RegisterSerializer, CustomTokenObtainPairSerializer

class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        operation_summary="User Login",
        operation_description="Authenticate user with email and password. Returns an empty JSON response, but sets HTTP-only cookies containing the access and refresh tokens.",
        responses={200: openapi.Response("Tokens set in cookies successfully")}
    )
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
    @swagger_auto_schema(
        operation_summary="Refresh Access Token",
        operation_description="Issues a new access token using the refresh token stored in HTTP-only cookies. The new access token is set as a cookie.",
        responses={
            200: openapi.Response("Access token refreshed in cookies"),
            401: "No refresh token provided or token is invalid"
        }
    )
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
    @swagger_auto_schema(
        operation_summary="User Logout",
        operation_description="Logs out the user by deleting the access and refresh token cookies.",
        responses={200: openapi.Response("Logout successful. Cookies deleted.")}
    )
    def post(self, request, *args, **kwargs):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response

@swagger_auto_schema(
    method='post',
    operation_summary="User Registration",
    operation_description="Registers a new customer. Requires email, password, first_name, and last_name. The username is generated automatically.",
    request_body=RegisterSerializer,
    responses={
        201: openapi.Response("User successfully registered"),
        400: "Validation errors (e.g. email already exists)"
    }
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # No tokens are created during registration. User must log in separately.
        return Response({"status": "success"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    operation_summary="Get Current User",
    operation_description="Returns the details of the currently authenticated user based on the access token.",
    responses={
        200: UserSerializer,
        401: "Unauthorized"
    }
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_me(request):
    """
    Returns data of the currently authenticated user.
    Used by the frontend during application initialization to check auth state.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
