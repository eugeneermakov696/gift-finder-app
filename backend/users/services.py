from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from users.models import UserVerificationCode, VerificationScenario, ContactMessage

User = get_user_model()


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

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
            recipient_list=[user.email],
            fail_silently=True,
        )
    except Exception:
        pass
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
    if user:
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
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
            recipient_list=[recipient],
            fail_silently=True,
        )
    except Exception:
        # Fallback to silent error handling to avoid disrupting user experience
        pass

