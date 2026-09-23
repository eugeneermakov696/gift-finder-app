import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from presents.models import Present, Wishlist


class GiftFinderAPITestCase(TestCase):
    def setUp(self):
        self.client = Client()

        # Create a test master user account
        self.user = User.objects.create_user(username="test_dev_user", password="password123")

        # Instantiate a reference product record in PostgreSQL
        self.present = Present.objects.create(
            title="Test Amazon Echo Speaker",
            asin="B09B8V1VHC",
            amazon_url="https://amazon.com",
            price=49.99,
            category="Electronics",
            is_available=True
        )

        # Instantiate an empty wishlist container linked to our user
        self.wishlist = Wishlist.objects.create(user=self.user, name="My Birthday List")

    def test_get_gifts_list(self):
        """Checks if the main GET route fetches entries from the database successfully."""
        response = self.client.get(reverse("gift-list"))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["status"], "success")
        self.assertTrue(len(data["presents"]) > 0)

    def test_post_create_gift(self):
        """Checks if passing a valid JSON payload adds a new Present record."""
        payload = {
            "title": "Mechanical Keyboard",
            "asin": "B08N5LNXCZ",
            "amazon_url": "https://amazon.com",
            "price": 89.99,
            "category": "Computers"
        }
        response = self.client.post(
            reverse("gift-list"),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Present.objects.filter(asin="B08N5LNXCZ").exists())

    def test_scrape_endpoint_auto_saves(self):
        """Verifies the mock parser engine successfully extracts ASIN sequences and registers records."""
        payload = {"amazon_url": "https://amazon.com"}
        response = self.client.post(
            reverse("gift-scrape"),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["status"], "success")
        # Check if the extracted ASIN is now securely inside PostgreSQL
        self.assertTrue(Present.objects.filter(asin="B07ZPKZSSC").exists())

    def test_add_item_to_wishlist(self):
        """Verifies assigning a product item modifies the user's Wishlist dataset container."""
        payload = {
            "present_id": self.present.id,
            "action": "add"
        }
        response = self.client.post(
            reverse("wishlist-detail", kwargs={"pk": self.wishlist.id}),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.wishlist.items.filter(id=self.present.id).exists())

    def test_trigger_price_tracker_calculation(self):
        """Validates that running a price check modifies pricing properties cleanly."""
        response = self.client.post(reverse("gift-price-check", kwargs={"pk": self.present.id}))
        self.assertEqual(response.status_code, 200)

        # Refresh properties from database context layers
        self.present.refresh_from_db()
        self.assertEqual(float(self.present.original_price), 49.99)
        self.assertTrue(float(self.present.price) < 49.99)
