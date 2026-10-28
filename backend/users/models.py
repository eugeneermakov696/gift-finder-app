import random
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("admin", "Admin"),
    )
    image_url = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
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


import secrets


def get_expiry_time():
    return timezone.now() + settings.VERIFICATION_CODE_LIFETIME


def generate_numeric_code():
    return f"{secrets.randbelow(900000) + 100000}"


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
        indexes = [
            models.Index(fields=["user", "scenario"], name="user_verif_user_scen_idx"),
            models.Index(fields=["code"], name="user_verif_code_idx"),
        ]

    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.user.email} - {self.scenario} - {self.code}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField(max_length=254)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contact_messages"
        ordering = ["-created_at"]
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"Message from {self.name} ({self.email}) - {self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''}"

