from django.db import models
from django.contrib.auth.models import User

class Present(models.Model):
    asin = models.CharField(max_length=20, unique=True, db_index=True)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, default="")
    amazon_url = models.TextField()
    image_url = models.TextField(blank=True, default="")
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    reviews_count = models.IntegerField(default=0)

    budget_bracket = models.CharField(max_length=50, blank=True, db_index=True)
    recipient = models.CharField(max_length=100, blank=True, db_index=True)
    relationship = models.CharField(max_length=150, blank=True, db_index=True)
    interest = models.CharField(max_length=150, blank=True, db_index=True)
    occasion = models.CharField(max_length=150, blank=True, db_index=True)

    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    name = models.CharField(max_length=100, default="My Wishlist")
    items = models.ManyToManyField(Present, blank=True, related_name="in_wishlists")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.username}'s List - {self.name}"