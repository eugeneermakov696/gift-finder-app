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
    PasswordResetCheckCodeView,
    PasswordResetChangeView,
    PasswordResetConfirmView,
    AvatarUploadView,
    ContactFormView,
)

urlpatterns = [
    path("api/auth/login/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),
    path("api/auth/register/", user_register, name="auth-register"),
    path("api/auth/me/", get_me, name="auth-me"),
    path("api/auth/verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("api/auth/resend-email-code/", ResendEmailCodeView.as_view(), name="resend-email-code"),
    path("api/auth/password-reset-request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("api/auth/password-reset-check-code/", PasswordResetCheckCodeView.as_view(), name="password-reset-check-code"),
    path("api/auth/password-reset-change/", PasswordResetChangeView.as_view(), name="password-reset-change"),
    path("api/auth/password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("api/auth/avatar/", AvatarUploadView.as_view(), name="avatar-upload"),
    path("api/contact-form/", ContactFormView.as_view(), name="contact-form"),
]
