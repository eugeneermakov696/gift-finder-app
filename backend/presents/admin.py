from django.contrib import admin
from django.utils.html import format_html
from presents.models import Present


@admin.register(Present)
class PresentAdmin(admin.ModelAdmin):
    list_display = ("title", "asin", "price", "category", "rating", "is_available", "created_at")

    list_link_fields = ("title", "asin")

    search_fields = ("title", "asin", "category")

    list_filter = ("is_available", "category", "age_group", "gender_target")

    fieldsets = (
        ("Core Information", {
            "fields": ("title", "asin", "amazon_url", "image_url", "image_preview")
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

    readonly_fields = ("created_at", "updated_at", "image_preview")

    @admin.display(description="Image Preview")
    def image_preview(self, obj):
        if obj and obj.image_url:
            return format_html(
                '<div class="admin-image-preview-container">'
                '<a href="{0}" target="_blank" rel="noopener noreferrer" title="Click to view full image">'
                '<img id="admin-preview-img" src="{0}" alt="{1}" class="admin-preview-image" />'
                '</a>'
                '<span class="admin-preview-hint">Click image to open in full size</span>'
                '</div>',
                obj.image_url,
                obj.title or "Present Image"
            )
        return format_html(
            '<div class="admin-image-preview-container">'
            '<div id="admin-preview-img-placeholder" class="admin-preview-placeholder">No image specified</div>'
            '<img id="admin-preview-img" src="" style="display:none;" class="admin-preview-image" />'
            '</div>'
        )

