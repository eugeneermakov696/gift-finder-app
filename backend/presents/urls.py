from django.urls import path, include
from rest_framework.routers import SimpleRouter
from presents.views import PresentViewSet, WishlistViewSet, user_register, user_login

router = SimpleRouter()
router.register(r'gifts', PresentViewSet, basename="gift")
router.register(r'wishlists', WishlistViewSet, basename="wishlist")

urlpatterns = [
    # Router registers: /api/gifts/, /api/gifts/<id>/, /api/wishlists/ out-of-the-box
    path("api/", include(router.urls)),

    # Simple explicit API authentication paths
    path('api/auth/register/', user_register, name="auth-register"),
    path('api/auth/login/', user_login, name="auth-login"),
]
