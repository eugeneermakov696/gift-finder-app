from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import timedelta

from users.models import UserVerificationCode, VerificationScenario
from users.services import create_and_send_verification_code

User = get_user_model()


class AuthenticationVerificationTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="dev_user",
            email="developer@example.com",
            password="SecureDevPassword2026!",
            email_is_confirmed=False
        )
        self.verify_email_url = reverse("verify-email")
        self.password_reset_request_url = reverse("password-reset-request")
        self.password_reset_confirm_url = reverse("password-reset-confirm")
        self.me_url = reverse("auth-me")

    def test_verify_email_lifecycle_success(self):
        code_entry = create_and_send_verification_code(self.user, VerificationScenario.EMAIL_CONFIRMATION)
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.verify_email_url, {"code": code_entry.code})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.email_is_confirmed)
        self.assertFalse(UserVerificationCode.objects.filter(id=code_entry.id).exists())

    def test_expired_code_fails(self):
        code_entry = create_and_send_verification_code(self.user, VerificationScenario.EMAIL_CONFIRMATION)
        code_entry.expires_at = timezone.now() - timedelta(seconds=1)
        code_entry.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.verify_email_url, {"code": code_entry.code})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_enumeration_mitigation(self):
        response = self.client.post(self.password_reset_request_url, {"email": "missing-profile@example.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_get_me_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "developer@example.com")
        self.assertEqual(response.data["username"], "dev_user")

    def test_get_me_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_me_first_and_last_name(self):
        self.client.force_authenticate(user=self.user)
        payload = {"first_name": "Alexander", "last_name": "Smith"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Alexander")
        self.assertEqual(response.data["last_name"], "Smith")

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Alexander")
        self.assertEqual(self.user.last_name, "Smith")

    def test_patch_me_full_name(self):
        self.client.force_authenticate(user=self.user)
        payload = {"full_name": "John Doe Junior"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "John")
        self.assertEqual(response.data["last_name"], "Doe Junior")

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "John")
        self.assertEqual(self.user.last_name, "Doe Junior")

    def test_patch_me_address_and_email(self):
        self.client.force_authenticate(user=self.user)
        payload = {"address": "123 Innovation Way", "email": "new.dev@example.com"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["address"], "123 Innovation Way")
        self.assertEqual(response.data["email"], "new.dev@example.com")

        self.user.refresh_from_db()
        self.assertEqual(self.user.address, "123 Innovation Way")
        self.assertEqual(self.user.email, "new.dev@example.com")

    def test_patch_me_email_duplicate_fails(self):
        User.objects.create_user(username="other_dev", email="existing@example.com", password="SecurePass123!")
        self.client.force_authenticate(user=self.user)
        payload = {"email": "existing@example.com"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_patch_me_password(self):
        self.client.force_authenticate(user=self.user)
        payload = {"password": "NewSecretPassword2026!"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewSecretPassword2026!"))

    def test_patch_me_unauthenticated_fails(self):
        payload = {"first_name": "Hacker"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
