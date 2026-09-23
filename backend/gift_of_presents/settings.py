import os
from pathlib import Path
import environ

# 1. Initialize environment variable parser
env = environ.Env(
    DEBUG=(bool, False)  # Sets default fallback cast type
)

BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Read the .env file if it exists
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# 3. Pull configuration values safely from the env engine
SECRET_KEY = env("SECRET_KEY", default="django-insecure-dev-key-change-this-in-production")
DEBUG = env("DEBUG", default=True)

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "backend"]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-Party Apps
    "corsheaders",
    "rest_framework",            # For token authentication architecture
    "rest_framework.authtoken",  # Enables native database token strings

    # Local Apps
    "presents",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Crucial: Must be placed first!
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "gift_of_presents.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "gift_of_presents.wsgi.application"

# 4. Database Configuration dynamically built from your environment variables
DATABASES = {
    'default': env.db(
        'DATABASE_URL',
        default=(
            f"postgres://{env('DB_USER', default='postgres_user')}:"
            f"{env('DB_PASSWORD', default='secure_dev_password_2026')}@"
            f"{env('DB_HOST', default='db')}:"
            f"{env('DB_PORT', default='5432')}/"
            f"{env('DB_NAME', default='gift_of_presents')}"
        )
    )
}

# 5. Cross-Origin Resource Sharing (CORS) rules parsed from your environment setup
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"])
CORS_ALLOW_CREDENTIALS = True

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
