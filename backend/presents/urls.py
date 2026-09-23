from django.urls import path
from .views import product_gift_list

urlpatterns = [
    path('api/gifts/', product_gift_list, name='gift-list'),
]
