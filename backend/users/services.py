import sys
import threading
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from users.models import UserVerificationCode, VerificationScenario, ContactMessage

logger = logging.getLogger(__name__)
User = get_user_model()


def send_mail_async(subject: str, message: str, recipient_list: list, from_email: str = None) -> threading.Thread | None:
    """
    Dispatches email asynchronously in a daemon thread so SMTP latency never blocks the HTTP request.
    In testing environments (locmem backend), executes synchronously for predictable outbox assertions.
    """
    from_email = from_email or getattr(settings, "DEFAULT_FROM_EMAIL", None)

    is_testing = (
        getattr(settings, "EMAIL_BACKEND", "").endswith("locmem.EmailBackend")
        or "test" in sys.argv
    )

    def _deliver():
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                fail_silently=True,
            )
        except Exception as exc:
            logger.warning(f"Failed to dispatch async email to {recipient_list}: {exc}")

    if is_testing:
        _deliver()
        return None

    thread = threading.Thread(target=_deliver, daemon=True)
    thread.start()
    return thread


def create_and_send_verification_code(user, scenario: VerificationScenario) -> UserVerificationCode:
    """Flushes stale un-used codes of the same scenario, spins up a new one, and sends an email."""
    UserVerificationCode.objects.filter(user=user, scenario=scenario).delete()

    verification_entry = UserVerificationCode.objects.create(user=user, scenario=scenario)

    if scenario == VerificationScenario.EMAIL_CONFIRMATION:
        subject = "Confirm Your Email Address"
        message = f"Your verification code is: {verification_entry.code}. Valid for 15 minutes."
    else:
        subject = "Reset Your Password"
        message = f"Your password reset code is: {verification_entry.code}. Valid for 15 minutes."

    send_mail_async(
        subject=subject,
        message=message,
        recipient_list=[user.email],
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
    )
    return verification_entry


def verify_code(user, code: str, scenario: VerificationScenario) -> bool:
    """Verifies token validity. Deletes the database instance upon validation or expiration."""
    try:
        verification_entry = UserVerificationCode.objects.get(
            user=user, code=code, scenario=scenario
        )
        if verification_entry.is_expired():
            verification_entry.delete()
            return False

        verification_entry.delete()
        return True
    except UserVerificationCode.DoesNotExist:
        return False


def request_password_reset_code(email: str) -> bool:
    """Fetches user context safely. Returns True unconditionally to neutralize enumeration attacks."""
    user = User.objects.filter(email__iexact=email.strip()).first()
    if user and user.email_is_confirmed:
        create_and_send_verification_code(user, VerificationScenario.PASSWORD_RESET)
    return True


def send_contact_form_notification(contact_message: ContactMessage) -> None:
    """Sends notification about contact form submission to administrators."""
    subject = f"New Contact Message from {contact_message.name}"
    body = (
        f"You received a new contact message:\n\n"
        f"Name: {contact_message.name}\n"
        f"Email: {contact_message.email}\n"
        f"Submitted at: {contact_message.created_at}\n\n"
        f"Message:\n{contact_message.message}\n"
    )
    recipient = getattr(settings, "CONTACT_FORM_RECIPIENT_EMAIL", None) or getattr(settings, "DEFAULT_FROM_EMAIL", "admin@giftfinder.com")
    send_mail_async(
        subject=subject,
        message=body,
        recipient_list=[recipient],
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
    )

