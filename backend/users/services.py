from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from users.models import UserVerificationCode, VerificationScenario

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

    send_mail(
        subject=subject,
        message=message,
        from_email=None,
        recipient_list=[user.email],
        fail_silently=False,
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
    try:
        user = User.objects.get(email=email)
        create_and_send_verification_code(user, VerificationScenario.PASSWORD_RESET)
    except User.DoesNotExist:
        pass
    return True
