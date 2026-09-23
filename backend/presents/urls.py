from django.urls import path
from presents.views import product_gift_list, product_gift_detail


urlpatterns = [
    path("api/gifts/", product_gift_list, name="gift-list"),
    path("api/gifts/<int:pk>/", product_gift_detail, name="gift-detail"),
]
