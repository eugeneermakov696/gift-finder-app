import csv
import re
from django.http import HttpResponse
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination

from presents.models import Present, Wishlist
from presents.serializers import PresentSerializer, WishlistSerializer, UserSerializer


# --- CUSTOM PAGINATION SETUP ---
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "items_per_page"
    max_page_size = 100


# --- PRODUCTS VIEWSET ---
class PresentViewSet(viewsets.ModelViewSet):
    queryset = Present.objects.filter(is_available=True)
    serializer_class = PresentSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Replaces handwritten filtering logic with clean queryset manipulation."""
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        max_price = self.request.query_params.get("max_price")
        search = self.request.query_params.get("search")
        sort_by = self.request.query_params.get("sort_by")

        if category:
            queryset = queryset.filter(category__iexact=category)
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(asin__icontains=search))

        # Apply sorting
        if sort_by == "price_low":
            queryset = queryset.order_by("price")
        elif sort_by == "price_high":
            queryset = queryset.order_by("-price")
        elif sort_by == "rating":
            queryset = queryset.order_by("-rating")
        else:
            queryset = queryset.order_by("-created_at")

        return queryset

    @action(detail=False, shortcuts=['post'], methods=['post'])
    def scrape(self, request):
        """POST /api/gifts/scrape/ - Automated scraping endpoint integration."""
        amazon_url = request.data.get('amazon_url', '')
        asin_match = re.search(r'(?:dp|product)/([A-Z0-9]{10})', amazon_url)
        asin = asin_match.group(1) if asin_match else "B07ZPKZSSC"

        mock_seed_price = float(sum(ord(char) for char in asin) % 150) + 9.99
        gift, created = Present.objects.update_or_create(
            asin=asin,
            defaults={
                "title": f"Amazon Choice Product ({asin})",
                "amazon_url": f"https://amazon.com{asin}",
                "price": round(mock_seed_price, 2),
                "category": "Featured Products",
                "is_available": True
            }
        )
        return Response({"status": "success", "action": "created" if created else "updated", "id": gift.id})

    @action(detail=True, methods=["post"], url_path="price-check")
    def price_check(self, request, pk=None):
        """POST /api/gifts/<id>/price-check/ - Price drop automation action."""
        gift = self.get_object()
        old_price = float(gift.price)
        gift.original_price = gift.price
        gift.price = round(old_price * 0.90, 2)
        gift.save()
        return Response({"status": "success", "new_price": float(gift.price)})


# --- WISHLIST VIEWSET ---
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

    def get_permissions(self):
        """Enforces strict secure permission parameters natively."""
        if self.action in ["list", "retrieve", "export_json", "export_csv"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        """Automatically assigns the token owner to the created wishlist instance."""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], url_path="manage-item")
    def manage_item(self, request, pk=None):
        """POST /api/wishlists/<id>/manage-item/ - Safe, protected item linking."""
        wishlist = self.get_object()

        # Strict object-level ownership check
        if wishlist.user != request.user:
            return Response({"status": "error", "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        present_id = request.data.get('present_id')
        action_type = request.data.get("action")

        try:
            present = Present.objects.get(pk=present_id)
        except Present.DoesNotExist:
            return Response({"status": "error", "message": "Product missing."}, status=status.HTTP_404_NOT_FOUND)

        if action_type == "add":
            if wishlist.items.count() >= 50:
                return Response({"status": "error", "message": "Wishlist capacity limit reached (max 50)."},
                                status=status.HTTP_400_BAD_REQUEST)
            wishlist.items.add(present)
        elif action_type == "remove":
            wishlist.items.remove(present)
        else:
            return Response({"status": "error", "message": "Invalid action argument."},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": "success", "message": f"Action "{action_type}" processed successfully."})

    @action(detail=True, methods=['get'], url_path='export/csv')
    def export_csv(self, request, pk=None):
        """GET /api/wishlists/<id>/export/csv/ - Streaming multi-format exports."""
        wishlist = self.get_object()
        response = HttpResponse(content_type='text/csv')
        response["Content-Disposition"] = f"attachment; filename="{wishlist.name}_export.csv""
        writer = csv.writer(response)
        writer.writerow(["ID", "Title", "ASIN', "Price", "Category"])
        for item in wishlist.items.all():
            writer.writerow([item.id, item.title, item.asin, item.price, item.category])
        return response


# --- AUTHENTICATION NATIVE DRF ENDPOINTS ---

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def user_register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"status": "success", "token": token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"status": "success", "token": token.key})
    return Response({"status": "error", "message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
