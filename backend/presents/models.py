from django.db import models


class Present(models.Model):
    # Core Product Info
    title = models.CharField(max_length=255, help_text="The name of the Amazon product")
    asin = models.CharField(max_length=20, unique=True, db_index=True,
                            help_text="Amazon Standard Identification Number")
    amazon_url = models.URLField(max_length=500, help_text="Direct link to the Amazon product page")
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="Product main image link")

    # Financial metrics
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Current listing price on Amazon")
    original_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True,
                                         help_text="Strikethrough price if on sale")

    # Social Proof / Rating metrics
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True,
                                 help_text="Average rating (e.g. 4.50)")
    reviews_count = models.IntegerField(default=0, help_text="Total number of customer reviews")

    # Categorization attributes (Great for building frontend filter options)
    category = models.CharField(max_length=100, blank=True, null=True, db_index=True,
                                help_text="e.g. Electronics, Home, Toys")
    age_group = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. Kids, Teens, Adults")
    gender_target = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. Unisex, Men, Women")

    # Metadata & Tracking logs
    is_available = models.BooleanField(default=True, help_text="Is the item currently in stock?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
