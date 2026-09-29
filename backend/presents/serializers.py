from rest_framework import serializers
from django.contrib.auth.models import User
from presents.models import Present, Wishlist


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class PresentCardSerializer(serializers.ModelSerializer):
    """Card payload matching the UI card format with camelCase fields."""
    amazonUrl = serializers.CharField(source="amazon_url", read_only=True)
    imageUrl = serializers.CharField(source="image_url", read_only=True)

    class Meta:
        model = Present
        fields = ["id", "title", "description", "price", "amazonUrl", "imageUrl"]


class PresentDetailSerializer(serializers.ModelSerializer):
    """Full detail view with all stored database fields."""
    amazonUrl = serializers.CharField(source="amazon_url", read_only=True)
    imageUrl = serializers.CharField(source="image_url", read_only=True)

    class Meta:
        model = Present
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="user.username", read_only=True)
    items = PresentCardSerializer(many=True, read_only=True)
    items_count = serializers.IntegerField(source="items.count", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "name", "owner", "items_count", "items"]