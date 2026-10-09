import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "confirm_password", "full_name"]

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def validate_email(self, value):
        normalized_email = value.lower().strip()
        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return normalized_email

    def create(self, validated_data):
        full_name = validated_data.pop("full_name", "")
        name_parts = full_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        base_username = f"{first_name}_{last_name}".lower().replace(" ", "")
        username = f"{base_username}_{uuid.uuid4().hex[:6]}"

        user = User.objects.create_user(
            username=username,
            email=validated_data.get("email"),
            password=validated_data.get("password"),
            first_name=first_name,
            last_name=last_name,
            role="customer"
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"] = serializers.EmailField()
        if "username" in self.fields:
            del self.fields["username"]

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            try:
                user = User.objects.get(email=email.lower().strip())
            except User.DoesNotExist:
                raise AuthenticationFailed(
                    "No active account found with the given credentials",
                    code="no_active_account"
                )

            if not user.check_password(password):
                raise AuthenticationFailed(
                    "No active account found with the given credentials",
                    code="no_active_account"
                )
            attrs["username"] = user.username

        return super().validate(attrs)


class VerifyEmailSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, min_length=6, required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        return value.lower().strip()


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    code = serializers.CharField(max_length=6, min_length=6, required=True)
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    def validate_email(self, value):
        return value.lower().strip()
