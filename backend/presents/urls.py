from django.urls import path, include
from rest_framework.routers import SimpleRouter
from presents.views import PresentViewSet, WishlistViewSet

router = SimpleRouter()
router.register(r'gifts', PresentViewSet, basename="gift")
router.register(r'wishlists', WishlistViewSet, basename="wishlist")

urlpatterns = [
    path("api/", include(router.urls)),
]
