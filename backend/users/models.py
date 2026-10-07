import random
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )
    address = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    email_is_confirmed = models.BooleanField(default=False)

    class Meta:
        db_table = "auth_users"


@receiver(post_save, sender=CustomUser)
def create_user_wishlist(sender, instance, created, **kwargs):
    """Automatically creates a default 'Liked Ideas' wishlist for every new user."""
    if created:
        from presents.models import Wishlist
        Wishlist.objects.create(user=instance, name="Liked Ideas")


class VerificationScenario(models.TextChoices):
    PASSWORD_RESET = "password_reset", "Password Reset"
    EMAIL_CONFIRMATION = "email_confirmation", "Email Confirmation"

def get_expiry_time():
    return timezone.now() + settings.VERIFICATION_CODE_LIFETIME

def generate_numeric_code():
    return f"{random.randint(100000, 999999)}"

class UserVerificationCode(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="verification_codes"
    )
    code = models.CharField(max_length=6, default=generate_numeric_code)
    scenario = models.CharField(
        max_length=20,
        choices=VerificationScenario.choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_expiry_time)

    class Meta:
        db_table = "user_verification_codes"
        ordering = ["-created_at"]

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.scenario} - {self.code}"
