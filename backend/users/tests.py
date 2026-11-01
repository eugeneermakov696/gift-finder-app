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
        self.password_reset_check_code_url = reverse("password-reset-check-code")
        self.password_reset_change_url = reverse("password-reset-change")
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
        self.user.email_is_confirmed = True
        self.user.save()

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

    def test_password_reset_split_flow_success(self):
        self.user.email_is_confirmed = True
        self.user.save()

        code_entry = create_and_send_verification_code(self.user, VerificationScenario.PASSWORD_RESET)
        check_payload = {
            "email": self.user.email.upper(),
            "code": code_entry.code,
        }
        check_resp = self.client.post(self.password_reset_check_code_url, check_payload, format="json")
        self.assertEqual(check_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(check_resp.data.get("canChangePassword"))
        self.assertIn("canChangePassword", check_resp.cookies)

        change_payload = {
            "new_password": "SplitSecretPassword2026!",
            "confirm_new_password": "SplitSecretPassword2026!"
        }
        change_resp = self.client.post(self.password_reset_change_url, change_payload, format="json")
        self.assertEqual(change_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(change_resp.data.get("detail"), "Password updated successfully.")

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("SplitSecretPassword2026!"))

    def test_password_reset_check_code_invalid(self):
        self.user.email_is_confirmed = True
        self.user.save()

        check_payload = {
            "email": self.user.email,
            "code": "999999",
        }
        response = self.client.post(self.password_reset_check_code_url, check_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("detail"), "Invalid confirmation code.")
        self.assertNotIn("canChangePassword", response.cookies)

    def test_password_reset_change_without_cookie_fails(self):
        change_payload = {
            "new_password": "SplitSecretPassword2026!",
            "confirm_new_password": "SplitSecretPassword2026!"
        }
        response = self.client.post(self.password_reset_change_url, change_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_change_passwords_mismatch(self):
        self.user.email_is_confirmed = True
        self.user.save()

        code_entry = create_and_send_verification_code(self.user, VerificationScenario.PASSWORD_RESET)
        self.client.post(self.password_reset_check_code_url, {"email": self.user.email, "code": code_entry.code}, format="json")

        change_payload = {
            "new_password": "SplitSecretPassword2026!",
            "confirm_new_password": "MismatchPassword2026!"
        }
        response = self.client.post(self.password_reset_change_url, change_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("confirm_new_password", response.data)

    def test_unconfirmed_user_cannot_reset_password(self):
        self.user.email_is_confirmed = False
        self.user.save()

        # Request reset: safe 200 response, but no email or code dispatched
        response = self.client.post(self.password_reset_request_url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)
        self.assertFalse(UserVerificationCode.objects.filter(user=self.user, scenario=VerificationScenario.PASSWORD_RESET).exists())

        # Direct confirm attempt should fail with 400
        payload = {
            "email": self.user.email,
            "code": "123456",
            "new_password": "NewSecretPassword2026!"
        }
        response = self.client.post(self.password_reset_confirm_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("detail"), "Invalid parameters or token.")

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

    def test_send_mail_async_threaded_execution(self):
        from unittest.mock import patch
        from users.services import send_mail_async

        with patch("users.services.sys.argv", ["manage.py", "runserver"]):
            with patch("users.services.settings.EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"):
                with patch("users.services.send_mail") as mock_send_mail:
                    thread = send_mail_async(
                        subject="Threaded Subject",
                        message="Threaded Body",
                        recipient_list=["threaded@example.com"]
                    )
                    self.assertIsNotNone(thread)
                    thread.join(timeout=2.0)
                    mock_send_mail.assert_called_once()

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

    def test_patch_me_old_and_new_password_success(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "old_password": "SecureDevPassword2026!",
            "new_password": "BrandNewSecretPassword2026!"
        }
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("BrandNewSecretPassword2026!"))

    def test_patch_me_old_password_incorrect_fails(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            "old_password": "WrongPassword2026!",
            "new_password": "BrandNewSecretPassword2026!"
        }
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("old_password", response.data)

    def test_patch_me_email_resets_email_is_confirmed(self):
        self.user.email_is_confirmed = True
        self.user.save()

        self.client.force_authenticate(user=self.user)
        payload = {"email": "updated_dev@example.com"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "updated_dev@example.com")
        self.assertFalse(self.user.email_is_confirmed)

    def test_patch_me_unauthenticated_fails(self):
        payload = {"first_name": "Hacker"}
        response = self.client.patch(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_avatar_upload_oversized_file_fails(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        self.client.force_authenticate(user=self.user)
        big_content = b"x" * (5 * 1024 * 1024 + 10)
        file = SimpleUploadedFile("avatar.jpg", big_content, content_type="image/jpeg")
        response = self.client.post("/api/auth/avatar/", {"avatar": file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("File size exceeds", response.data["detail"])

    def test_avatar_upload_invalid_extension_fails(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        self.client.force_authenticate(user=self.user)
        file = SimpleUploadedFile("avatar.exe", b"fake binary", content_type="application/octet-stream")
        response = self.client.post("/api/auth/avatar/", {"avatar": file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid file format", response.data["detail"])

    def test_avatar_delete_success(self):
        self.user.image_url = "https://example.com/avatar.jpg"
        self.user.save()

        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/auth/avatar/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("avatar_url"), None)
        self.assertIn("Avatar deleted successfully", response.data.get("detail", ""))

        self.user.refresh_from_db()
        self.assertIsNone(self.user.image_url)
        self.assertFalse(bool(self.user.avatar))

    def test_avatar_delete_unauthenticated_fails(self):
        response = self.client.delete("/api/auth/avatar/")
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


class SwaggerDocumentationTests(APITestCase):

    def test_swagger_tags_categorization(self):
        from config.urls import schema_view
        from rest_framework.test import APIRequestFactory

        factory = APIRequestFactory()
        request = factory.get('/swagger/?format=openapi', HTTP_HOST='localhost')
        response = schema_view.without_ui(cache_timeout=0)(request, format='.json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        paths = response.data.get("paths", {})

        # Verify auth endpoints are under api/auth tag
        auth_paths = [
            "/api/auth/login/",
            "/api/auth/refresh/",
            "/api/auth/logout/",
            "/api/auth/register/",
            "/api/auth/me/",
            "/api/auth/verify-email/",
            "/api/auth/resend-email-code/",
            "/api/auth/password-reset-request/",
            "/api/auth/password-reset-confirm/",
            "/api/auth/avatar/",
        ]
        for p in auth_paths:
            self.assertIn(p, paths)
            for method, spec in paths[p].items():
                if isinstance(spec, dict) and "tags" in spec:
                    self.assertIn("api/auth", spec["tags"])

        # Verify gifts endpoints are under api/gifts tag
        gifts_paths = [
            "/api/gifts/",
            "/api/gifts/{asin}/",
            "/api/gifts/scrape/",
            "/api/gifts/{asin}/price-check/",
        ]
        for p in gifts_paths:
            self.assertIn(p, paths)
            for method, spec in paths[p].items():
                if isinstance(spec, dict) and "tags" in spec:
                    self.assertIn("api/gifts", spec["tags"])

        # Verify wishlist endpoints are under api/wishlist tag
        wishlist_paths = [
            "/api/wishlists/",
            "/api/wishlists/{id}/",
            "/api/wishlists/{id}/manage-item/",
            "/api/wishlists/{id}/export/csv/",
        ]
        for p in wishlist_paths:
            self.assertIn(p, paths)
            for method, spec in paths[p].items():
                if isinstance(spec, dict) and "tags" in spec:
                    self.assertIn("api/wishlist", spec["tags"])

    def test_swagger_error_responses(self):
        from config.urls import schema_view
        from rest_framework.test import APIRequestFactory

        factory = APIRequestFactory()
        request = factory.get('/swagger/?format=openapi', HTTP_HOST='localhost')
        response = schema_view.without_ui(cache_timeout=0)(request, format='.json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        paths = response.data.get("paths", {})

        # Check that error responses are documented for key endpoints
        self.assertIn("400", paths["/api/auth/register/"]["post"]["responses"])
        self.assertIn("401", paths["/api/auth/me/"]["get"]["responses"])
        self.assertIn("404", paths["/api/gifts/{asin}/"]["get"]["responses"])
        self.assertIn("401", paths["/api/wishlists/"]["get"]["responses"])

