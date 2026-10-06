import uuid
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def create(self, validated_data):
        # Generate username
        base_username = f"{validated_data['first_name']}_{validated_data['last_name']}".lower().replace(" ", "")
        username = f"{base_username}_{uuid.uuid4().hex[:6]}"
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role='customer'
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Change username to email
        self.fields['email'] = serializers.EmailField()
        del self.fields['username']

    def validate(self, attrs):
        # We need to authenticate using email.
        # However, SimpleJWT calls authenticate(username=email, password=password) under the hood 
        # if username_field is set to 'email'. But we need a custom auth backend for that to work!
        # Alternatively, we can find the user by email here, and pass their real username.
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('No user with this email found.')

            # Overwrite email with real username so super().validate works with default ModelBackend
            attrs['username'] = user.username
            
        return super().validate(attrs)
