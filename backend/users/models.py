from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )
    address = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=CustomUser)
def create_user_wishlist(sender, instance, created, **kwargs):
    """Automatically create a default 'Liked Ideas' wishlist for every new user."""
    if created:
        from presents.models import Wishlist
        Wishlist.objects.create(user=instance, name="Liked Ideas")
