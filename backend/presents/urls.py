from django.urls import path
from presents.views import (
    product_gift_list, product_gift_detail, scrape_amazon_item,
    wishlist_list, wishlist_detail,
    user_register, user_login, export_wishlist_csv,
    export_wishlist_json, trigger_price_check  # <-- Import the new views
)

urlpatterns = [
    path('api/gifts/', product_gift_list, name='gift-list'),
    path('api/gifts/<int:pk>/', product_gift_detail, name='gift-detail'),
    path('api/gifts/scrape/', scrape_amazon_item, name='gift-scrape'),
    path('api/gifts/<int:pk>/price-check/', trigger_price_check, name='gift-price-check'),  # <-- Price tracking route

    path('api/wishlists/', wishlist_list, name='wishlist-list'),
    path('api/wishlists/<int:pk>/', wishlist_detail, name='wishlist-detail'),
    path('api/wishlists/<int:pk>/export/csv/', export_wishlist_csv, name='wishlist-export-csv'),
    path('api/wishlists/<int:pk>/export/json/', export_wishlist_json, name='wishlist-export-json'),
    # <-- JSON Stream route

    path('api/auth/register/', user_register, name='auth-register'),
    path('api/auth/login/', user_login, name='auth-login'),
]
