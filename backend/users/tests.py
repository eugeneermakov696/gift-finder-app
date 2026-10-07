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