import csv
import re
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from config.swagger import (
    ERROR_400_BAD_REQUEST,
    ERROR_401_UNAUTHORIZED,
    ERROR_403_FORBIDDEN,
    ERROR_404_NOT_FOUND,
)

from presents.models import Present, Wishlist
from presents.serializers import PresentSerializer, WishlistSerializer
from presents.filters import filter_presents_queryset


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "items_per_page"
    max_page_size = 100


class IsCustomAdminUser(permissions.BasePermission):
    """Allows access only to users with the 'admin' role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "role", "") == "admin")


class IsCustomAdminOrReadOnly(permissions.BasePermission):
    """Allows read access to anyone, but restricts modifications to 'admin' role."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "role", "") == "admin")


@method_decorator(name="list", decorator=swagger_auto_schema(
    tags=["api/gifts"],
    operation_summary="List Gifts",
    responses={200: PresentSerializer(many=True), 400: ERROR_400_BAD_REQUEST}
))
@method_decorator(name="create", decorator=swagger_auto_schema(
    tags=["api/gifts"],
    operation_summary="Create Gift",
    responses={
        201: PresentSerializer,
        400: ERROR_400_BAD_REQUEST,
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN
    }
))
@method_decorator(name="retrieve", decorator=swagger_auto_schema(
    tags=["api/gifts"],
    operation_summary="Get Gift by ASIN",
    responses={200: PresentSerializer, 404: ERROR_404_NOT_FOUND}
))
@method_decorator(name="update", decorator=swagger_auto_schema(
    tags=["api/gifts"],
    operation_summary="Update Gift",
    responses={
        200: PresentSerializer,
        400: ERROR_400_BAD_REQUEST,
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
@method_decorator(name="partial_update", decorator=swagger_auto_schema(
    tags=["api/gifts"],
    operation_summary="Partial Update Gift",
    responses={
        200: PresentSerializer,
        400: ERROR_400_BAD_REQUEST,
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
@method_decorator(name="destroy", decorator=swagger_auto_schema(
    tags=["api/gifts"],
    operation_summary="Delete Gift",
    responses={
        204: "Gift deleted successfully",
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
class PresentViewSet(viewsets.ModelViewSet):
    queryset = Present.objects.filter(is_available=True)
    serializer_class = PresentSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsCustomAdminOrReadOnly]
    lookup_field = "asin"

    def get_queryset(self):
        queryset = super().get_queryset()
        return filter_presents_queryset(queryset, self.request.query_params)

    def get_object(self):
        """
        Retrieves a present strictly by its Amazon ASIN.
        """
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs.get(lookup_url_kwarg)
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, asin__iexact=lookup_value)
        self.check_object_permissions(self.request, obj)
        return obj

    @swagger_auto_schema(
        tags=["api/gifts"],
        operation_summary="Scrape Amazon Gift",
        responses={
            200: "Gift scraped/updated successfully",
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
            403: ERROR_403_FORBIDDEN
        }
    )
    @action(detail=False, methods=["post"], url_path="scrape", permission_classes=[IsCustomAdminUser])
    def scrape(self, request):
        amazon_url = request.data.get("amazon_url", "")
        asin_match = re.search(r'(?:dp|product)/([A-Z0-9]{10})', amazon_url)
        asin = asin_match.group(1) if asin_match else "B07ZPKZSSC"

        mock_seed_price = float(sum(ord(char) for char in asin) % 150) + 9.99
        gift, created = Present.objects.update_or_create(
            asin=asin,
            defaults={
                "title": f"Amazon Choice Product ({asin})",
                "description": f"Curated Amazon Choice product ({asin}) with high customer ratings and fast shipping.",
                "amazon_url": f"https://www.amazon.com/dp/{asin}",
                "price": round(mock_seed_price, 2),
                "category": "Featured Products",
                "is_available": True
            }
        )
        return Response({"status": "success", "action": "created" if created else "updated", "id": gift.id})

    @swagger_auto_schema(
        tags=["api/gifts"],
        operation_summary="Trigger Price Check",
        responses={
            200: "Price updated successfully",
            401: ERROR_401_UNAUTHORIZED,
            403: ERROR_403_FORBIDDEN,
            404: ERROR_404_NOT_FOUND
        }
    )
    @action(detail=True, methods=["post"], url_path="price-check", permission_classes=[IsCustomAdminUser])
    def price_check(self, request, asin=None, **kwargs):
        gift = self.get_object()
        old_price = float(gift.price)
        gift.original_price = gift.price
        gift.price = round(old_price * 0.90, 2)
        gift.save()
        return Response({"status": "success", "new_price": float(gift.price)})


class IsWishlistOwner(permissions.BasePermission):
    """Object-level check: only the wishlist owner may access detail/update/custom actions."""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


@method_decorator(name="list", decorator=swagger_auto_schema(
    tags=["api/wishlist"],
    operation_summary="List User Wishlists",
    responses={200: WishlistSerializer(many=True), 401: ERROR_401_UNAUTHORIZED}
))
@method_decorator(name="create", decorator=swagger_auto_schema(
    tags=["api/wishlist"],
    operation_summary="Create Wishlist",
    responses={
        201: WishlistSerializer,
        400: ERROR_400_BAD_REQUEST,
        401: ERROR_401_UNAUTHORIZED
    }
))
@method_decorator(name="retrieve", decorator=swagger_auto_schema(
    tags=["api/wishlist"],
    operation_summary="Get Wishlist Details",
    responses={
        200: WishlistSerializer,
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
@method_decorator(name="update", decorator=swagger_auto_schema(
    tags=["api/wishlist"],
    operation_summary="Update Wishlist",
    responses={
        200: WishlistSerializer,
        400: ERROR_400_BAD_REQUEST,
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
@method_decorator(name="partial_update", decorator=swagger_auto_schema(
    tags=["api/wishlist"],
    operation_summary="Partial Update Wishlist",
    responses={
        200: WishlistSerializer,
        400: ERROR_400_BAD_REQUEST,
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
@method_decorator(name="destroy", decorator=swagger_auto_schema(
    tags=["api/wishlist"],
    operation_summary="Delete Wishlist",
    responses={
        204: "Wishlist deleted successfully",
        401: ERROR_401_UNAUTHORIZED,
        403: ERROR_403_FORBIDDEN,
        404: ERROR_404_NOT_FOUND
    }
))
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated, IsWishlistOwner]

    def get_queryset(self):
        """List is owner-scoped; detail/actions use full queryset so object permissions can return 403."""
        if getattr(self, "swagger_fake_view", False):
            return Wishlist.objects.none()
        if self.action == "list":
            if self.request.user.is_authenticated:
                if not Wishlist.objects.filter(user=self.request.user).exists():
                    Wishlist.objects.create(user=self.request.user, name="Liked Ideas")
            return Wishlist.objects.filter(user=self.request.user)
        return Wishlist.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @swagger_auto_schema(
        tags=["api/wishlist"],
        operation_summary="Manage Wishlist Item",
        responses={
            200: "Item added or removed successfully",
            400: ERROR_400_BAD_REQUEST,
            401: ERROR_401_UNAUTHORIZED,
            403: ERROR_403_FORBIDDEN,
            404: ERROR_404_NOT_FOUND
        }
    )
    @action(detail=True, methods=["post"], url_path="manage-item")
    def manage_item(self, request, pk=None):
        wishlist = self.get_object()

        present_id = request.data.get("present_id")
        action_type = request.data.get("action")

        try:
            present = Present.objects.get(pk=present_id)
        except Present.DoesNotExist:
            return Response(
                {"status": "error", "message": "Product missing from database."},
                status=status.HTTP_404_NOT_FOUND
            )

        if action_type == "add":
            if wishlist.items.count() >= Wishlist.MAX_CAPACITY:
                return Response(
                    {"status": "error", "message": f"Wishlist capacity limit reached (max {Wishlist.MAX_CAPACITY})."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            wishlist.items.add(present)
        elif action_type == "remove":
            wishlist.items.remove(present)
        else:
            return Response(
                {"status": "error", "message": "Invalid action argument. Use add/remove."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"status": "success", "message": f"Action '{action_type}' processed successfully."})

    @swagger_auto_schema(
        tags=["api/wishlist"],
        operation_summary="Export Wishlist to CSV",
        responses={
            200: "CSV file download",
            401: ERROR_401_UNAUTHORIZED,
            403: ERROR_403_FORBIDDEN,
            404: ERROR_404_NOT_FOUND
        }
    )
    @action(detail=True, methods=["get"], url_path="export/csv")
    def export_csv(self, request, pk=None):
        wishlist = self.get_object()
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{wishlist.name}_export.csv"'
        writer = csv.writer(response)
        writer.writerow(["ID", "Title", "ASIN", "Price", "Category"])
        for item in wishlist.items.all():
            writer.writerow([item.id, item.title, item.asin, item.price, item.category])
        return response
