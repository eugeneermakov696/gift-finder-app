from rest_framework import serializers
from presents.models import Present, Wishlist

from users.serializers import UserSerializer


class PresentSerializer(serializers.ModelSerializer):
    price = serializers.FloatField()
    original_price = serializers.FloatField(required=False, allow_null=True)
    rating = serializers.FloatField(required=False, allow_null=True)

    class Meta:
        model = Present
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="user.username", read_only=True)
    items = PresentSerializer(many=True, read_only=True)
    items_count = serializers.IntegerField(source="items.count", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "name", "owner", "items_count", "items"]
