from django.urls import path
from presents.views import product_gift_list

urlpatterns = [
    path('api/gifts/', product_gift_list, name='gift-list'),
]
