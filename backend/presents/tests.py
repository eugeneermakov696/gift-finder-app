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
        response = self.client.get(reverse("gift-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertTrue(len(response.data["results"]) > 0)

    def test_get_gift_by_asin(self):
        url = reverse("gift-detail", kwargs={"asin": self.present.asin})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.present.id)
        self.assertEqual(response.data["asin"], self.present.asin)

    def test_get_gift_by_id_fails_404(self):
        url = reverse("gift-detail", kwargs={"asin": str(self.present.id)})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_gift_not_found(self):
        url = reverse("gift-detail", kwargs={"asin": "NONEXISTENT_ASIN"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_gifts_list_unauthenticated_returns_200(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("gift-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertTrue(len(response.data["results"]) > 0)

    def test_post_create_gift_unauthenticated_returns_401(self):
        self.client.force_authenticate(user=None)
        payload = {
            "title": "Mechanical Keyboard",
            "asin": "B08N5LNXCZ",
            "amazon_url": "https://amazon.com",
            "price": 89.99,
            "category": "Computers"
        }
        response = self.client.post(reverse("gift-list"), data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_create_gift(self):
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
        url = reverse("gift-scrape")
        payload = {"amazon_url": "https://amazon.com"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        scraped = Present.objects.filter(asin="B07ZPKZSSC").first()
        self.assertIsNotNone(scraped)
        self.assertTrue(bool(scraped.description))

    def test_add_item_to_wishlist(self):
        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(self.wishlist.items.filter(id=self.present.id).exists())

    def test_trigger_price_tracker_calculation(self):
        url = reverse("gift-price-check", kwargs={"asin": self.present.asin})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.present.refresh_from_db()
        self.assertEqual(float(self.present.original_price), 49.99)
        self.assertTrue(float(self.present.price) < 49.99)

    def test_add_item_missing_token_returns_401(self):
        self.client.force_authenticate(user=None)
        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_item_wrong_user_token_returns_403(self):
        rogue_user = User.objects.create_user(username="rogue_hacker", password="password123")
        self.client.force_authenticate(user=rogue_user)

        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_wishlist_wrong_user_returns_403(self):
        rogue_user = User.objects.create_user(username="rogue_reader", password="password123")
        self.client.force_authenticate(user=rogue_user)

        url = reverse("wishlist-detail", kwargs={"pk": self.wishlist.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_export_csv_wrong_user_returns_403(self):
        rogue_user = User.objects.create_user(username="rogue_exporter", password="password123")
        self.client.force_authenticate(user=rogue_user)

        url = reverse("wishlist-export-csv", kwargs={"pk": self.wishlist.id})
        response = self.client.get(url)
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

        url = reverse("wishlist-manage-item", kwargs={"pk": self.wishlist.id})
        payload = {"present_id": self.present.id, "action": "add"}
        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("Wishlist capacity limit reached", response.data["message"])

    def test_smart_filters_matching(self):
        Present.objects.create(
            title="Men Running Shoes",
            asin="BMEN123456",
            amazon_url="https://amazon.com/men",
            price=75.00,
            category="Fashion",
            gender_target="Men",
            recipient="For Him",
            age_group="Adults",
            interests="Sports, The Active & Outdoor Explorer",
            occasion="Birthday, Christmas",
            is_available=True
        )
        Present.objects.create(
            title="Women Floral Blouse",
            asin="BWOM123456",
            amazon_url="https://amazon.com/women",
            price=45.00,
            category="Clothing & Accessories",
            gender_target="Women",
            recipient="For Her",
            age_group="Adults",
            interests="The Creative & Artsy Soul",
            occasion="Mother’s Day, Birthday",
            is_available=True
        )

        # Test gender mapping (Male should match Men and exclude Women)
        res = self.client.get(reverse("gift-list"), {"gender_target": "Male"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        asins = [p["asin"] for p in res.data["results"]]
        self.assertIn("BMEN123456", asins)
        self.assertNotIn("BWOM123456", asins)

        # Test gift type mapping (Practical / Useful maps to Clothing & Accessories)
        res_cat = self.client.get(reverse("gift-list"), {"category": "Practical / Useful"})
        self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
        asins_cat = [p["asin"] for p in res_cat.data["results"]]
        self.assertIn("BMEN123456", asins_cat)

        # Test interest mapping (Sports maps to The Active & Outdoor Explorer)
        res_int = self.client.get(reverse("gift-list"), {"interests": "Sports"})
        self.assertEqual(res_int.status_code, status.HTTP_200_OK)
        asins_int = [p["asin"] for p in res_int.data["results"]]
        self.assertIn("BMEN123456", asins_int)

        Present.objects.create(
            title="Standard Catalog Gift Item",
            asin="BCAT123456",
            amazon_url="https://amazon.com/cat",
            price=29.99,
            category="Toys",
            gender_target="Unisex",
            recipient="Partner, Friend, Relatives, Other",
            age_group="Adults, Teens, Olds",
            interests="Gaming, Tech",
            occasion="Birthday, Christmas, mother_day, anniversary, wedding_or_engagement",
            is_available=True
        )

        # Test occasion matching with apostrophe normalization ("Mother's Day" vs "Mother’s Day" vs "mother_day")
        res_occ = self.client.get(reverse("gift-list"), {"occasion": "Mother's Day"})
        self.assertEqual(res_occ.status_code, status.HTTP_200_OK)
        asins_occ = [p["asin"] for p in res_occ.data["results"]]
        self.assertIn("BWOM123456", asins_occ)
        self.assertIn("BCAT123456", asins_occ)

        # Test occasion matching for wedding_or_engagement
        res_wed = self.client.get(reverse("gift-list"), {"occasion": "wedding_or_engagement"})
        self.assertEqual(res_wed.status_code, status.HTTP_200_OK)
        self.assertIn("BCAT123456", [p["asin"] for p in res_wed.data["results"]])

        # Test catalog recipient queries directly against recipient column
        for rec_val in ["Partner", "Friend", "Relatives", "Other"]:
            res_rec = self.client.get(reverse("gift-list"), {"recipient": rec_val})
            self.assertEqual(res_rec.status_code, status.HTTP_200_OK)
            asins_rec = [p["asin"] for p in res_rec.data["results"]]
            self.assertIn("BCAT123456", asins_rec)

        # Test catalog unique category query
        res_cat_exact = self.client.get(reverse("gift-list"), {"category": "Toys"})
        self.assertEqual(res_cat_exact.status_code, status.HTTP_200_OK)
        self.assertIn("BCAT123456", [p["asin"] for p in res_cat_exact.data["results"]])

        # Test catalog unique interests query
        res_int_exact = self.client.get(reverse("gift-list"), {"interests": "Gaming"})
        self.assertEqual(res_int_exact.status_code, status.HTTP_200_OK)
        self.assertIn("BCAT123456", [p["asin"] for p in res_int_exact.data["results"]])

        # Test catalog age_group queries
        for ag_val in ["Teens", "Olds", "Adults"]:
            res_ag = self.client.get(reverse("gift-list"), {"age_group": ag_val})
            self.assertEqual(res_ag.status_code, status.HTTP_200_OK)
            self.assertIn("BCAT123456", [p["asin"] for p in res_ag.data["results"]])

    def test_wishlist_self_healing_creates_default_if_none(self):
        new_user = User.objects.create_user(username="nowishlist_user", password="password123")
        # Explicitly remove any auto-created wishlists for this user
        Wishlist.objects.filter(user=new_user).delete()
        self.assertEqual(Wishlist.objects.filter(user=new_user).count(), 0)

        self.client.force_authenticate(user=new_user)
        response = self.client.get(reverse("wishlist-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Liked Ideas")
        self.assertEqual(Wishlist.objects.filter(user=new_user).count(), 1)
