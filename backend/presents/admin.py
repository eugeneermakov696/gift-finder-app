from django.contrib import admin
from .models import Present, Wishlist

@admin.register(Present)
class PresentAdmin(admin.ModelAdmin):
    list_display = ("title", "asin", "price", "budget_bracket", "recipient", "is_available")
    list_filter = ("is_available", "budget_bracket", "recipient", "occasion")
    search_fields = ("title", "asin", "description")

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at", "items_count")
    
    def items_count(self, obj):
        return obj.items.count()