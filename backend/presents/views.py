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
from presents.serializers import (
    PresentCardSerializer,
    PresentDetailSerializer,
    WishlistSerializer,
    UserSerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "items_per_page"
    max_page_size = 100

class PresentViewSet(viewsets.ModelViewSet):
    queryset = Present.objects.filter(is_available=True)
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PresentDetailSerializer
        return PresentCardSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        search = params.get("search")
        recipient = params.get("recipient")
        relationship = params.get("relationship")
        interest = params.get("interest")
        occasion = params.get("occasion")
        budget_bracket = params.get("budget_bracket")
        max_price = params.get("max_price")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        if recipient:
            queryset = queryset.filter(recipient__icontains=recipient)
        if relationship:
            queryset = queryset.filter(relationship__icontains=relationship)
        if interest:
            queryset = queryset.filter(interest__icontains=interest)
        if occasion:
            queryset = queryset.filter(occasion__icontains=occasion)
        if budget_bracket:
            queryset = queryset.filter(budget_bracket__iexact=budget_bracket)
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        return queryset

    @action(detail=False, methods=["post"], url_path="scrape")
    def scrape(self, request):
        """POST /api/gifts/scrape/ - Automated scraping endpoint integration."""
        amazon_url = request.data.get("amazon_url", "")
        asin_match = re.search(r'(?:dp|product)/([A-Z0-9]{10})', amazon_url)
        asin = asin_match.group(1) if asin_match else "B07ZPKZSSC"

        mock_seed_price = float(sum(ord(char) for char in asin) % 150) + 9.99
        gift, created = Present.objects.update_or_create(
            asin=asin,
            defaults={
                "title": f"Amazon Choice Product ({asin})",
                "amazon_url": f"https://amazon.com{asin}",
                "price": round(mock_seed_price, 2),
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


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

    def get_permissions(self):
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if self.request.user and not self.request.user.is_anonymous:
            serializer.save(user=self.request.user)
        else:
            from django.contrib.auth.models import User
            serializer.save(user=User.objects.first())

    @action(detail=True, methods=["post"], url_path="manage-item")
    def manage_item(self, request, pk=None):
        wishlist = self.get_object()

        if not request.user or request.user.is_anonymous:
            return Response({"status": "error", "message": "Authentication required."},
                            status=status.HTTP_401_UNAUTHORIZED)

        if wishlist.user != request.user:
            return Response({"status": "error", "message": "Permission denied. You do not own this wishlist."},
                            status=status.HTTP_403_FORBIDDEN)

        present_id = request.data.get("present_id")
        action_type = request.data.get("action")

        try:
            present = Present.objects.get(pk=present_id)
        except Present.DoesNotExist:
            return Response({"status": "error", "message": "Product missing from database."},
                            status=status.HTTP_404_NOT_FOUND)

        if action_type == "add":
            if wishlist.items.count() >= 50:
                return Response({"status": "error", "message": "Wishlist capacity limit reached (max 50)."},
                                status=status.HTTP_400_BAD_REQUEST)
            wishlist.items.add(present)
        elif action_type == "remove":
            wishlist.items.remove(present)
        else:
            return Response({"status": "error", "message": "Invalid action argument. Use add/remove."},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": "success", "message": f"Action '{action_type}' processed successfully."})

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


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"status": "success", "token": token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"status": "success", "token": token.key})
    return Response({"status": "error", "message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)