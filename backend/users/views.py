from django.contrib.auth import get_user_model
from rest_framework import views, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.utils import swagger_auto_schema, no_body
from drf_yasg import openapi

from presents.serializers import UserSerializer
from users.serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    VerifyEmailSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from users.models import VerificationScenario
from users.services import (
    verify_code,
    create_and_send_verification_code,
    request_password_reset_code
)

User = get_user_model()


class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        operation_summary="User Login",
        operation_description="Authenticate user with email and password. Returns a success message and sets HTTP-only cookies containing the access and refresh tokens.",
        request_body=CustomTokenObtainPairSerializer,
        responses={
            200: openapi.Response(
                description="Tokens set in cookies successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING, example="Login successful")
                    }
                )
            )
        }
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')

        response.set_cookie('access_token', access_token, httponly=True, secure=False, max_age=60 * 15)
        response.set_cookie('refresh_token', refresh_token, httponly=True, secure=False, max_age=60 * 60 * 24 * 7)

        del response.data['access']
        del response.data['refresh']

        response.data['message'] = "Login successful"
        return response


class CookieTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(
        operation_summary="Refresh Access Token",
        operation_description="Issues a new access token using the refresh token stored in HTTP-only cookies. The new access token is set as a cookie. No request body is needed.",
        request_body=no_body,
        responses={
            200: openapi.Response("Access token refreshed in cookies"),
            401: "No refresh token provided or token is invalid"
        }
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response("No refresh token provided", status=status.HTTP_401_UNAUTHORIZED)

        mutable_data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        mutable_data['refresh'] = refresh_token
        request._full_data = mutable_data

        response = super().post(request, *args, **kwargs)
        access_token = response.data.get('access')

        response.set_cookie('access_token', access_token, httponly=True, secure=False, max_age=60 * 15)
        del response.data['access']

        response.data['message'] = "Token refreshed successfully"
        return response


class LogoutView(views.APIView):
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
    operation_description="Registers a new customer. Requires email, password, confirm_password, and full_name. Dispatches an email verification code immediately upon creation.",
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
        create_and_send_verification_code(user, VerificationScenario.EMAIL_CONFIRMATION)
        return Response({"status": "success", "detail": "Registration successful. Verification code dispatched."},
                        status=status.HTTP_201_CREATED)
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


class VerifyEmailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Verify Email Code",
        operation_description="Validates the 6-digit numeric verification code for the logged-in user to confirm their email address.",
        request_body=VerifyEmailSerializer,
        responses={
            200: openapi.Response("Email verified successfully."),
            400: "Invalid or expired token."
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if verify_code(request.user, serializer.validated_data["code"], VerificationScenario.EMAIL_CONFIRMATION):
            request.user.email_is_confirmed = True
            request.user.save()
            return Response({"detail": "Email verified successfully."}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)


class ResendEmailCodeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Resend Email Verification Code",
        operation_description="Generates and emails a new 6-digit verification token if the user's account is unverified.",
        request_body=no_body,
        responses={
            200: openapi.Response("New verification code dispatched."),
            400: "Email already verified."
        }
    )
    def post(self, request, *args, **kwargs):
        if request.user.email_is_confirmed:
            return Response({"detail": "Email already verified."}, status=status.HTTP_400_BAD_REQUEST)

        create_and_send_verification_code(request.user, VerificationScenario.EMAIL_CONFIRMATION)
        return Response({"detail": "New verification code dispatched."}, status=status.HTTP_200_OK)


class PasswordResetRequestView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Request Password Reset",
        operation_description="Accepts an account email and sends a recovery token if the account exists, safe from enumeration scanning.",
        request_body=PasswordResetRequestSerializer,
        responses={200: openapi.Response("If the account exists, a reset code has been dispatched.")}
    )
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_password_reset_code(serializer.validated_data["email"].lower())
        return Response({"detail": "If the account exists, a reset code has been dispatched."},
                        status=status.HTTP_200_OK)


class PasswordResetConfirmView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Confirm Password Reset",
        operation_description="Validates the recovery token against user email context and commits the updated custom user password.",
        request_body=PasswordResetConfirmSerializer,
        responses={
            200: openapi.Response("Password updated successfully."),
            400: "Invalid parameters or token."
        }
    )

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data["email"].lower())
        except User.DoesNotExist:
            return Response({"detail": "Invalid parameters or token."}, status=status.HTTP_400_BAD_REQUEST)

        if verify_code(user, serializer.validated_data["code"], VerificationScenario.PASSWORD_RESET):
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid parameters or token."}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.parsers import MultiPartParser, FormParser

class AvatarUploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        operation_summary="Upload User Avatar",
        operation_description="Uploads an image file to be used as the user's avatar. Saves to S3.",
        manual_parameters=[
            openapi.Parameter(
                name='avatar',
                in_=openapi.IN_FORM,
                description='The avatar image file',
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        responses={
            200: openapi.Response("Avatar uploaded successfully."),
            400: "No file provided."
        }
    )
    def post(self, request, *args, **kwargs):
        if 'avatar' not in request.FILES:
            return Response({"detail": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        avatar_file = request.FILES['avatar']
        user = request.user
        
        # Save the file to the avatar field (this uses django-storages/boto3 automatically)
        user.avatar.save(avatar_file.name, avatar_file, save=True)
        
        # Build absolute URI for the frontend
        avatar_url = request.build_absolute_uri(user.avatar.url) if user.avatar else None
        
        return Response({
            "detail": "Avatar uploaded successfully.",
            "avatar_url": avatar_url
        }, status=status.HTTP_200_OK)

