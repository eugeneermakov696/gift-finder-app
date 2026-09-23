from django.urls import path
from presents.views import product_gift_list, product_gift_detail, scrape_amazon_item


urlpatterns = [
    path("api/gifts/", product_gift_list, name="gift-list"),
    path("api/gifts/<int:pk>/", product_gift_detail, name="gift-detail"),
    path("api/gifts/scrape/", scrape_amazon_item, name="gift-scrape"),
]
