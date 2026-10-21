from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import CustomUser, UserVerificationCode, ContactMessage


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "email_is_confirmed", "is_staff", "is_active")
    list_filter = ("role", "email_is_confirmed", "is_staff", "is_active")
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {
            "fields": ("role", "email_is_confirmed", "avatar", "image_url")
        }),
    )


@admin.register(UserVerificationCode)
class UserVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "scenario", "created_at", "expires_at")
    list_filter = ("scenario", "created_at")
    search_fields = ("user__email", "user__username", "code")
    readonly_fields = ("created_at",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "is_resolved")
    list_filter = ("is_resolved", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("created_at",)
