from django.urls import path
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    LogoutView,
    user_register,
    get_me,
    VerifyEmailView,
    ResendEmailCodeView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    AvatarUploadView,
)

urlpatterns = [
    path('api/auth/login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/register/', user_register, name="auth-register"),
    path('api/auth/me/', get_me, name='auth-me'),
    path('api/auth/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('api/auth/resend-email-code/', ResendEmailCodeView.as_view(), name='resend-email-code'),
    path('api/auth/password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('api/auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('api/auth/avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
]