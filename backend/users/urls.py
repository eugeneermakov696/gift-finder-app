from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, user_register, get_me

urlpatterns = [
    path('api/auth/login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/register/', user_register, name="auth-register"),
    path('api/auth/me/', get_me, name='auth-me'),
]
