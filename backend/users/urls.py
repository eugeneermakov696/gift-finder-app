from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, user_register

urlpatterns = [
    path('api/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/register/', user_register, name="auth-register"),
]
