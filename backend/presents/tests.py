from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from presents.models import Present, Wishlist

User = get_user_model()


class GiftFinderAPITestCase(APITestCase):
    def setUp(self):
        # Create user with role='admin' to satisfy IsCustomAdminOrReadOnly/IsCustomAdminUser checks
        self.user = User.objects.create_user(
            username="test_dev_user",
            password="password123",
            role="admin"
        )
        # Authenticate client directly
        self.client.force_authenticate(user=self.user)

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
        response = self.client.get(reverse('gift-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertTrue(len(response.data['results']) > 0)

    def test_get_gifts_list_unauthenticated_returns_401(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('gift-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_create_gift(self):
        payload = {
            "title": "Mechanical Keyboard",
            "asin": "B08N5LNXCZ",
            "amazon_url": "https://amazon.com",
            "price": 89.99,
            "category": "Computers"
        }
        response = self.client.post(reverse('gift-list'), data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Present.objects.filter(asin="B08N5LNXCZ").exists())

    def test_scrape_endpoint_auto_saves(self):
        url = reverse('gift-scrape')
        payload = {"amazon_url": "https://amazon.com"}
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertTrue(Present.objects.filter(asin="B07ZPKZSSC").exists())

    def test_add_item_to_wishlist(self):
        url = reverse('wishlist-manage-item', kwargs={'pk': self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertTrue(self.wishlist.items.filter(id=self.present.id).exists())

    def test_trigger_price_tracker_calculation(self):
        url = reverse('gift-price-check', kwargs={'pk': self.present.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.present.refresh_from_db()
        self.assertEqual(float(self.present.original_price), 49.99)
        self.assertTrue(float(self.present.price) < 49.99)

    def test_add_item_missing_token_returns_401(self):
        self.client.force_authenticate(user=None)
        url = reverse('wishlist-manage-item', kwargs={'pk': self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_item_wrong_user_token_returns_403(self):
        rogue_user = User.objects.create_user(username="rogue_hacker", password="password123")
        self.client.force_authenticate(user=rogue_user)

        url = reverse('wishlist-manage-item', kwargs={'pk': self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_wishlist_max_capacity_limit(self):
        for i in range(50):
            mock_gift = Present.objects.create(
                title=f"Bulk Present Item {i}",
                asin=f"MOCKASIN{i:02d}",
                amazon_url="https://amazon.com",
                price=10.00
            )
            self.wishlist.items.add(mock_gift)

        url = reverse('wishlist-manage-item', kwargs={'pk': self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertIn("Wishlist capacity limit reached", response.data['message'])