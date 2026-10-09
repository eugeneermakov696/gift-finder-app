from rest_framework import serializers
from django.contrib.auth import get_user_model
from presents.models import Present, Wishlist

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "image_url", "avatar", "role", "email_is_confirmed", "first_name", "last_name"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


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
