from django.contrib import admin
from presents.models import Present


@admin.register(Present)
class PresentAdmin(admin.ModelAdmin):
    # Columns to show in the list view table
    list_display = ('title', 'asin', 'price', 'category', 'rating', 'is_available', 'created_at')

    # Clickable fields to open the edit page
    list_link_fields = ('title', 'asin')

    # Add a search bar to search through names and ASIN identifiers
    search_fields = ('title', 'asin', 'category')

    # Add a quick filter sidebar on the right
    list_filter = ('is_available', 'category', 'age_group', 'gender_target')

    # Organize the layout when editing a specific gift item
    fieldsets = (
        ("Core Information", {
            'fields': ('title', 'asin', 'amazon_url', 'image_url')
        }),
        ("Pricing & Status", {
            'fields': ('price', 'original_price', 'is_available')
        }),
        ("Ratings & Analytics", {
            'fields': ('rating', 'reviews_count')
        }),
        ("Target Demographics", {
            'fields': ('category', 'age_group', 'gender_target')
        }),
    )

    # Automatically tracks date logic fields as read-only text flags
    readonly_fields = ('created_at', 'updated_at')
