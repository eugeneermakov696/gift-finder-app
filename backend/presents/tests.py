from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from presents.models import Present, Wishlist


class GiftFinderAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="test_dev_user", password="password123")

        self.present = Present.objects.create(
            title="Test Amazon Echo Speaker",
            asin="B09B8V1VHC",
            amazon_url="https://amazon.com",
            price=49.99,
            category="Electronics",
            is_available=True
        )

        self.wishlist = Wishlist.objects.create(user=self.user, name="My Birthday List")

    def test_get_gifts_list(self):
        """Checks if the main GET route fetches entries from the database successfully."""
        # DRF Router maps list views onto '<basename>-list'
        response = self.client.get(reverse("gift-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # DRF PageNumberPagination nests items inside a 'results' key array
        self.assertIn("results", response.data)
        self.assertTrue(len(response.data["results"]) > 0)

    def test_post_create_gift(self):
        """Checks if passing a valid JSON payload adds a new Present record."""
        payload = {
            "title": "Mechanical Keyboard",
            "asin": "B08N5LNXCZ",
            "amazon_url": "https://amazon.com",
            "price": 89.99,
            "category": "Computers"
        }
        response = self.client.post(reverse("gift-list"), data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Present.objects.filter(asin="B08N5LNXCZ").exists())

    def test_scrape_endpoint_auto_saves(self):
        """Verifies the mock parser engine successfully extracts ASIN sequences and registers records."""
        url = reverse("gift-scrape")
        payload = {"amazon_url": "https://amazon.com"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(Present.objects.filter(asin="B07ZPKZSSC").exists())

    def test_add_item_to_wishlist(self):
        """Verifies assigning a product item modifies the user's Wishlist dataset container securely."""
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {
            "present_id": self.present.id,
            "action": "add"
        }
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(self.wishlist.items.filter(id=self.present.id).exists())

    def test_trigger_price_tracker_calculation(self):
        """Validates that running a price check modifies pricing properties cleanly."""
        url = reverse("gift-price-check", kwargs={"pk": self.present.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.present.refresh_from_db()
        self.assertEqual(float(self.present.original_price), 49.99)
        self.assertTrue(float(self.present.price) < 49.99)

    def test_add_item_missing_token_returns_401(self):
        """Verifies that making requests without token metadata fields yields an explicit 401 response."""
        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_item_wrong_user_token_returns_403(self):
        """Verifies that an authenticated user trying to edit someone else's wishlist triggers a 403 response."""
        rogue_user = User.objects.create_user(username="rogue_hacker", password="password123")
        rogue_token, _ = Token.objects.get_or_create(user=rogue_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {rogue_token.key}")

        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_wishlist_max_capacity_limit(self):
        """Verifies that trying to add a 51st item to a wishlist is blocked by a 400 error."""
        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        for i in range(50):
            mock_gift = Present.objects.create(
                title=f"Bulk Present Item {i}",
                asin=f"MOCKASIN{i:02d}",
                amazon_url="https://amazon.com",
                price=10.00
            )
            self.wishlist.items.add(mock_gift)

        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("Wishlist capacity limit reached", response.data["message"])
