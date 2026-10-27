import os
import sys
import logging
from django.contrib.auth import get_user_model
from rest_framework import views, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.utils import swagger_auto_schema, no_body
from drf_yasg import openapi

logger = logging.getLogger(__name__)

from config.swagger import (
    ERROR_400_BAD_REQUEST,
    ERROR_401_UNAUTHORIZED,
    ERROR_500_INTERNAL_SERVER_ERROR,
)

from users.serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    VerifyEmailSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserProfileUpdateSerializer,
    ContactFormSerializer,
)
from users.models import VerificationScenario
from users.services import (
    verify_code,
    create_and_send_verification_code,
    request_password_reset_code,
    send_contact_form_notification
)

User = get_user_model()


def set_auth_cookie(response, key, value, request, max_age):
    is_secure = request.is_secure() or request.headers.get("x-forwarded-proto") == "https"
    samesite = "None" if is_secure else "Lax"
    response.set_cookie(
        key,
        value,
        httponly=True,
        secure=is_secure,
        samesite=samesite,
        max_age=max_age,
    )


def delete_auth_cookie(response, key, request):
    is_secure = request.is_secure() or request.headers.get("x-forwarded-proto") == "https"
    samesite = "None" if is_secure else "Lax"
    response.delete_cookie(
        key,
        samesite=samesite,
    )


class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="User Login",
        operation_description="Authenticate user with email and password. Returns a success message and sets HTTP-only "
                              "cookies containing the access and refresh tokens.",
        request_body=CustomTokenObtainPairSerializer,
        responses={
            200: openapi.Response(
                description="Tokens set in cookies successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING, example="Login successful")
                    }
                )
            ),
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
        }
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")

        set_auth_cookie(response, "access_token", access_token, request, max_age=60 * 15)
        set_auth_cookie(response, "refresh_token", refresh_token, request, max_age=60 * 60 * 24 * 7)

        del response.data["access"]
        del response.data["refresh"]

        response.data["message"] = "Login successful"
        return response


class CookieTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Refresh Access Token",
        operation_description="Issues a new access token using the refresh token stored in HTTP-only cookies. "
                              "The new access token is set as a cookie. No request body is needed.",
        request_body=no_body,
        responses={
            200: openapi.Response("Access token refreshed in cookies"),
            401: ERROR_401_UNAUTHORIZED,
        }
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response("No refresh token provided", status=status.HTTP_401_UNAUTHORIZED)

        mutable_data = request.data.copy() if hasattr(request.data, "copy") else dict(request.data)
        mutable_data["refresh"] = refresh_token
        request._full_data = mutable_data

        response = super().post(request, *args, **kwargs)
        access_token = response.data.get("access")

        set_auth_cookie(response, "access_token", access_token, request, max_age=60 * 15)
        del response.data["access"]

        response.data["message"] = "Token refreshed successfully"
        return response


class LogoutView(views.APIView):
    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="User Logout",
        operation_description="Logs out the user by deleting the access and refresh token cookies.",
        responses={200: openapi.Response("Logout successful. Cookies deleted.")}
    )
    def post(self, request, *args, **kwargs):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        delete_auth_cookie(response, "access_token", request)
        delete_auth_cookie(response, "refresh_token", request)
        return response


@swagger_auto_schema(
    tags=["api/auth"],
    method='post',
    operation_summary="User Registration",
    operation_description="Registers a new customer. Requires email, password, confirm_password, and full_name. "
                          "Dispatches an email verification code immediately upon creation.",
    request_body=RegisterSerializer,
    responses={
        201: openapi.Response("User successfully registered"),
        400: ERROR_400_BAD_REQUEST,
    }
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def user_register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "success", "detail": "Registration successful."},
                        status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserMeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Get Current User",
        operation_description="Returns the details of the currently authenticated user based on the access token.",
        responses={
            200: UserSerializer,
            401: ERROR_401_UNAUTHORIZED,
        }
    )
    def get(self, request):
        """
        Returns data of the currently authenticated user.
        Used by the frontend during application initialization to check auth state.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Update Current User Profile",
        operation_description="Partially updates personal profile information of the currently authenticated user.",
        request_body=UserProfileUpdateSerializer,
        responses={
            200: UserSerializer,
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
        }
    )
    def patch(self, request):
        """
        Partially updates user details (such as first_name, last_name, full_name, email, password, image_url).
        """
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Update Current User Profile (Full)",
        operation_description="Updates personal profile information of the currently authenticated user.",
        request_body=UserProfileUpdateSerializer,
        responses={
            200: UserSerializer,
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
        }
    )
    def put(self, request):
        """
        Updates full user details.
        """
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


get_me = UserMeView.as_view()


class VerifyEmailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Verify Email Code",
        operation_description="Validates the 6-digit numeric verification code for the logged-in user to confirm their "
                              "email address.",
        request_body=VerifyEmailSerializer,
        responses={
            200: openapi.Response("Email verified successfully."),
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
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
        tags=["api/auth"],
        operation_summary="Resend Email Verification Code",
        operation_description="Generates and emails a new 6-digit verification token "
                              "if the user's account is unverified.",
        request_body=no_body,
        responses={
            200: openapi.Response("New verification code dispatched."),
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
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
        tags=["api/auth"],
        operation_summary="Request Password Reset",
        operation_description="Accepts an account email and sends a recovery token if the account exists, "
                              "safe from enumeration scanning.",
        request_body=PasswordResetRequestSerializer,
        responses={
            200: openapi.Response("If the account exists, a reset code has been dispatched."),
            400: ERROR_400_BAD_REQUEST,
        }
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
        tags=["api/auth"],
        operation_summary="Confirm Password Reset",
        operation_description="Validates the recovery token against user email context "
                              "and commits the updated custom user password.",
        request_body=PasswordResetConfirmSerializer,
        responses={
            200: openapi.Response("Password updated successfully."),
            400: ERROR_400_BAD_REQUEST,
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email__iexact=serializer.validated_data["email"].strip()).first()
        if not user or not user.email_is_confirmed:
            return Response({"detail": "Invalid parameters or token."}, status=status.HTTP_400_BAD_REQUEST)

        if verify_code(user, serializer.validated_data["code"], VerificationScenario.PASSWORD_RESET):
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid parameters or token."}, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Upload User Avatar",
        operation_description="Uploads an image file to be used as the user's avatar. Saves to S3.",
        manual_parameters=[
            openapi.Parameter(
                name='avatar',
                in_=openapi.IN_FORM,
                description='The avatar image file (JPG, PNG, WebP up to 5MB)',
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        responses={
            200: openapi.Response("Avatar uploaded successfully."),
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
            500: ERROR_500_INTERNAL_SERVER_ERROR,
        }
    )
    def post(self, request, *args, **kwargs):
        if "avatar" not in request.FILES:
            return Response({"detail": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        avatar_file = request.FILES["avatar"]

        # 1. Validate file size (max 5 MB)
        if avatar_file.size > self.MAX_AVATAR_SIZE:
            return Response(
                {"detail": "File size exceeds the 5 MB limit."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Validate file extension
        _, ext = os.path.splitext(avatar_file.name.lower())
        if ext not in self.ALLOWED_EXTENSIONS:
            return Response(
                {"detail": "Invalid file format. Allowed formats: JPG, PNG, WebP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Validate content type if supplied
        content_type = getattr(avatar_file, "content_type", "")
        if content_type and content_type.lower() not in self.ALLOWED_CONTENT_TYPES:
            return Response(
                {"detail": "Invalid file content type. Expected an image (JPG, PNG, WebP)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        try:
            # Save the file to the avatar field (this uses django-storages/boto3 automatically)
            user.avatar.save(avatar_file.name, avatar_file, save=False)

            cdn_url = user.avatar.url if user.avatar else ""

            # Validate that the avatar URL is a valid Cloudflare R2 / remote URL and not a localhost fallback
            if "test" not in sys.argv and (not cdn_url.startswith("http") or "localhost" in cdn_url):
                return Response(
                    {
                        "detail": "Cloud storage (Cloudflare R2) is misconfigured or missing environment variables. "
                                  "Localhost avatar storage is not allowed."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Save direct CDN URL to image_url in the database
            user.image_url = cdn_url
            user.save()

            return Response({
                "detail": "Avatar uploaded successfully.",
                "avatar_url": cdn_url
            }, status=status.HTTP_200_OK)

        except Exception as exc:
            logger.error("Failed to upload avatar to cloud storage: %s", exc, exc_info=True)
            return Response(
                {
                    "detail": f"Failed to upload avatar to cloud storage: {str(exc)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        tags=["api/auth"],
        operation_summary="Delete User Avatar",
        operation_description="Deletes the current user's avatar and clears the avatar and image_url fields.",
        responses={
            200: openapi.Response("Avatar deleted successfully."),
            401: ERROR_401_UNAUTHORIZED,
        }
    )
    def delete(self, request, *args, **kwargs):
        user = request.user
        if user.avatar:
            user.avatar.delete(save=False)
        user.avatar = None
        user.image_url = None
        user.save()

        return Response({
            "detail": "Avatar deleted successfully.",
            "avatar_url": None
        }, status=status.HTTP_200_OK)


class ContactFormView(views.APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        tags=["api/contact-form"],
        operation_summary="Submit Contact Form",
        operation_description="Submit a contact inquiry or message from the website contact form. "
                              "Saves the message and sends an email notification to site administrators.",
        request_body=ContactFormSerializer,
        responses={
            201: openapi.Response(
                description="Message submitted successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Your message has been sent successfully!")
                    }
                )
            ),
            400: openapi.Response(
                description="Invalid contact form data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "detail": openapi.Schema(type=openapi.TYPE_STRING, example="Enter a valid email address."),
                        "errors": openapi.Schema(type=openapi.TYPE_OBJECT)
                    }
                )
            )
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = ContactFormSerializer(data=request.data)
        if not serializer.is_valid():
            first_error_msg = None
            for field, errors in serializer.errors.items():
                if errors and isinstance(errors, list):
                    first_error_msg = f"{errors[0]}"
                    break
                elif errors:
                    first_error_msg = f"{errors}"
                    break
            return Response(
                {
                    "detail": first_error_msg or "Invalid form data.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        contact_message = serializer.save()
        send_contact_form_notification(contact_message)

        return Response(
            {"detail": "Your message has been sent successfully!"},
            status=status.HTTP_201_CREATED
        )

