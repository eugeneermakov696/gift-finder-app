from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import timedelta

from users.models import UserVerificationCode, VerificationScenario, ContactMessage
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

    def test_password_reset_confirm_success(self):
        code_entry = create_and_send_verification_code(self.user, VerificationScenario.PASSWORD_RESET)
        payload = {
            "email": self.user.email.upper(),
            "code": code_entry.code,
            "new_password": "NewSecretPassword2026!"
        }
        response = self.client.post(self.password_reset_confirm_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("detail"), "Password updated successfully.")

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewSecretPassword2026!"))

    def test_password_reset_confirm_missing_fields(self):
        payload = {
            "email": self.user.email,
            "token": "123456",
            "password": "SecretPassword123!"
        }
        response = self.client.post(self.password_reset_confirm_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("code", response.data)
        self.assertIn("new_password", response.data)



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

    def test_patch_me_image_url_and_email(self):
        self.client.force_authenticate(user=self.user)
        payload = {"image_url": "https://example.com/avatar.png", "email": "new.dev@example.com"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["image_url"], "https://example.com/avatar.png")
        self.assertEqual(response.data["email"], "new.dev@example.com")
        self.assertNotIn("address", response.data)

        self.user.refresh_from_db()
        self.assertEqual(self.user.image_url, "https://example.com/avatar.png")
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


class ContactFormAPITests(APITestCase):

    def setUp(self):
        self.url = reverse("contact-form")
        self.valid_payload = {
            "name": "Jane Doe",
            "email": "jane.doe@example.com",
            "message": "We would like to partner with Gift Finder to showcase our products."
        }

    def test_submit_contact_form_success(self):
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("detail"), "Your message has been sent successfully!")

        # Verify DB entry
        message_obj = ContactMessage.objects.filter(email="jane.doe@example.com").first()
        self.assertIsNotNone(message_obj)
        self.assertEqual(message_obj.name, "Jane Doe")
        self.assertEqual(message_obj.message, self.valid_payload["message"])
        self.assertFalse(message_obj.is_resolved)

        # Verify email dispatch
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Jane Doe", mail.outbox[0].subject)
        self.assertIn(self.valid_payload["message"], mail.outbox[0].body)

    def test_submit_contact_form_missing_fields(self):
        # Missing message
        response = self.client.post(self.url, {"name": "Jane", "email": "jane@example.com"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

        # Missing name
        response = self.client.post(self.url, {"email": "jane@example.com", "message": "Hello"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

        # Missing email
        response = self.client.post(self.url, {"name": "Jane", "message": "Hello"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_submit_contact_form_blank_strings(self):
        response = self.client.post(self.url, {"name": "   ", "email": "jane@example.com", "message": "   "}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_submit_contact_form_invalid_email(self):
        payload = {
            "name": "Jane Doe",
            "email": "not-an-email",
            "message": "Hello there"
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_submit_contact_form_authenticated_user(self):
        user = User.objects.create_user(username="auth_user", email="auth@example.com", password="Password123!")
        self.client.force_authenticate(user=user)
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("detail"), "Your message has been sent successfully!")

