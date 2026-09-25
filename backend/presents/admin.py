from django.contrib import admin
from presents.models import Present


@admin.register(Present)
class PresentAdmin(admin.ModelAdmin):
    list_display = ("title", "asin", "price", "category", "rating", "is_available", "created_at")

    list_link_fields = ("title", "asin")

    search_fields = ("title", "asin", "category")

    list_filter = ("is_available", "category", "age_group", "gender_target")

    fieldsets = (
        ("Core Information", {
            "fields": ("title", "asin", "amazon_url", "image_url")
        }),
        ("Pricing & Status", {
            "fields": ("price", "original_price", "is_available")
        }),
        ("Ratings & Analytics", {
            "fields": ("rating", "reviews_count")
        }),
        ("Target Demographics", {
            "fields": ("category", "age_group", "gender_target")
        }),
    )

    readonly_fields = ("created_at", "updated_at")
