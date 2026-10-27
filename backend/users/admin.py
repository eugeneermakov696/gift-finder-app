from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import TokenProxy
from users.models import CustomUser, ContactMessage


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "email_is_confirmed", "is_staff", "is_active")
    list_filter = ("role", "email_is_confirmed", "is_staff", "is_active")
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {
            "fields": ("role", "email_is_confirmed", "avatar", "image_url")
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "is_resolved")
    list_filter = ("is_resolved", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("created_at",)

    def has_add_permission(self, request):
        return False


# Unregister models not needed in the Giftly admin interface
for model in (Group, TokenProxy):
    if admin.site.is_registered(model):
        admin.site.unregister(model)

