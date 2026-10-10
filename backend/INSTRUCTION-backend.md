# 🎁 Gift Finder App — Backend Engine Documentation

Welcome to the backend service engine for the **Gift Finder App** (Gift of Presents on Amazon) project. This service provides a containerized, secure, and test-driven RESTful API built natively with **Django REST Framework (DRF)** and backed by an isolated **PostgreSQL** database.

---

## 🛠️ Architecture Stack & Ports

*   **DRF Backend Engine:** Containerized application service running on `http://localhost:8000`
*   **PostgreSQL Database Engine:** Containerized `postgres:15-alpine` database volume listening on port `5432`
*   **OpenAPI Interactive Sandbox UI (Swagger):** Available locally at `http://localhost:8000/swagger/`
*   **Alternative Spec Portal (ReDoc):** Available locally at `http://localhost:8000/redoc/`
*   **Django Administration Panel:** Available locally at `http://localhost:8000/admin/`

---

## 📦 Project Structure

```text
backend/
├── .env.example            # Environment configuration template blueprint
├── api_test.http           # PyCharm HTTP client automated scratchpad requests
├── Dockerfile              # Python 3.11 slim multi-stage container manifest
├── gifts_data.xlsx         # Seed product Excel matrix containing catalog entries
├── INSTRUCTION-backend.md  # Backend documentation guide
├── manage.py               # Django master administrative execution script
├── requirements.txt        # Third-party package dependencies manifest
├── config/                 # Core system configuration settings
│   ├── __init__.py
│   ├── settings.py         # Global Django & DRF settings (JWT, CORS, DB, Email)
│   ├── urls.py             # Root URL routing (Swagger, Admin, Presents, Users)
│   └── wsgi.py             # WSGI application entry point
├── presents/               # Product catalog & wishlist domain application
│   ├── admin.py            # Django admin interface registrations for Presents & Wishlists
│   ├── apps.py             # Application configuration metadata
│   ├── models.py           # Present and Wishlist database models
│   ├── serializers.py      # DRF serializers for gifts and wishlist transformations
│   ├── services.py         # Mock Amazon scraper pattern processing utilities
│   ├── tests.py            # Automated integration unit test suite (9 test vectors)
│   ├── urls.py             # Presents and Wishlists router endpoints
│   ├── views.py            # ModelViewSets with role-based permissions and CSV export
│   ├── management/         # Custom Django management commands
│   │   └── commands/
│   │       ├── __init__.py
│   │       └── import_excel.py # Importer mapping Excel sheets into PostgreSQL
│   └── migrations/         # Database migration schemas
└── users/                  # User identity, authentication & verification application
    ├── apps.py             # Users application configuration
    ├── authentication.py   # CustomJWTAuthentication (HTTP-only cookies + header fallback)
    ├── models.py           # CustomUser (`auth_users`) & UserVerificationCode models
    ├── serializers.py      # User registration, token, and verification serializers
    ├── services.py         # Verification code generator, email dispatcher & validators
    ├── tests.py            # Authentication & verification test suite (3 test vectors)
    ├── urls.py             # Auth endpoints (login, register, reset, verify)
    ├── views.py            # Cookie-based JWT views, email verification, password reset
    └── migrations/         # User and verification code database schemas
```

---

## 🛠️ Quick Start Instructions

Follow these instructions to spin up the local microservices stack inside your IDE workspace terminal:

### 1. Build and Start the Container Stack
Compile the environment layers and start the database and backend servers in detached mode:
```bash
docker compose up --build -d
```

### 2. Apply Relational Migrations
Push database schemas and model tables into PostgreSQL:
```bash
docker compose exec backend python manage.py migrate
```

### 3. Generate a Superuser Account
Create an administrative user to access the Django admin dashboard:
```bash
docker compose exec backend python manage.py createsuperuser
```

### 4. Seed Product Catalog Data
Populate the PostgreSQL database with initial catalog entries from `gifts_data.xlsx`:
```bash
docker compose exec backend python manage.py import_excel gifts_data.xlsx
```

### 5. Stop the System Services
To gracefully stop all running containers:
```bash
docker compose down
```

To stop containers and reset the PostgreSQL volume (clean database wipe):
```bash
docker compose down -v
```

---

## 🔐 Authentication & Security Model

The backend employs a robust authentication architecture:

*   **Dual Authentication Support:** `CustomJWTAuthentication` automatically reads JWT access tokens from HTTP-only cookies (`access_token`, `refresh_token`) for browser frontend security and also supports `Authorization: Bearer <token>` and `Authorization: Token <token>` request headers for direct API calls.
*   **Custom User Model:** Inherits from `AbstractUser` stored in the `auth_users` table with configurable roles (`customer` and `admin`) and `email_is_confirmed` tracking.
*   **Automated Wishlist Provisioning:** A `post_save` signal automatically creates a default "Liked Ideas" wishlist container for every newly registered user.
*   **Email Verification & Password Recovery:** Secure 6-digit numeric codes generated via `users.services` with configurable expiration lifetimes (`VERIFICATION_CODE_LIFETIME = 15 minutes`). In `DEBUG=True` mode, outgoing emails print to the container console (`ConsoleBackend`).
*   **Role-Based Access Control (RBAC):**
    *   `IsCustomAdminUser`: Restricts sensitive endpoints (such as scraping and price manipulation) strictly to users with the `admin` role.
    *   `IsCustomAdminOrReadOnly`: Requires authentication for catalog queries and restricts product mutations to `admin` accounts.
    *   `IsAuthenticated`: Protects user profile and wishlist management routes, ensuring strict user-ownership validation.

---

## 🧪 Running the Test Matrix

The backend includes comprehensive test suites covering security policies, permissions, capacity constraints, code verification lifecycles, and user enumeration mitigation:

### Run Complete Test Suite
```bash
docker compose exec backend python manage.py test
```

### Run Domain-Specific Test Suites
*   **Presents & Wishlists Suite (9 tests):**
    ```bash
    docker compose exec backend python manage.py test presents
    ```
*   **Users & Verification Suite (3 tests):**
    ```bash
    docker compose exec backend python manage.py test users
    ```

---

## 📊 Excel Sheet Database Importer

The backend features an automated management command (`import_excel`) that parses `.xlsx` spreadsheets and updates the PostgreSQL database:

1. Ensure the spreadsheet contains the expected columns: `title`, `asin`, `amazon_url`, `price`, `category`.
2. Ensure the spreadsheet resides in the `backend/` directory (`gifts_data.xlsx`).
3. Execute the import command:
   ```bash
   docker compose exec backend python manage.py import_excel gifts_data.xlsx
   ```

---

## 🌐 DRF RESTful Endpoint Directory

All endpoints are registered under their respective routing modules:

| Domain | HTTP Method | Route Pathway | Description / Scope | Permissions / Auth |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register/` | Register new account; dispatches 6-digit email verification code. | `AllowAny` |
| **Auth** | `POST` | `/api/auth/login/` | Authenticate credentials; sets HTTP-only `access_token` and `refresh_token` cookies. | `AllowAny` |
| **Auth** | `POST` | `/api/auth/refresh/` | Issues refreshed `access_token` cookie using the valid `refresh_token` cookie. | `AllowAny` |
| **Auth** | `POST` | `/api/auth/logout/` | Logs out user and clears JWT authentication cookies. | `AllowAny` |
| **Auth** | `GET` | `/api/auth/me/` | Retrieves authenticated user profile information. | `IsAuthenticated` |
| **Auth** | `POST` | `/api/auth/verify-email/` | Validates 6-digit numeric verification code to mark email confirmed. | `IsAuthenticated` |
| **Auth** | `POST` | `/api/auth/resend-email-code/` | Re-generates and dispatches a new email verification code. | `IsAuthenticated` |
| **Auth** | `POST` | `/api/auth/password-reset-request/` | Dispatches password reset code (mitigates user enumeration). | `AllowAny` |
| **Auth** | `POST` | `/api/auth/password-reset-confirm/` | Validates reset code and sets a new account password. | `AllowAny` |
| **Gifts** | `GET` | `/api/gifts/` | List products with pagination. Supports `?category=`, `?max_price=`, `?search=`, and `?sort_by=price_low\|price_high\|rating`. | Authenticated Users |
| **Gifts** | `POST` | `/api/gifts/` | Create a new gift catalog item. | `Admin` Role Only |
| **Gifts** | `GET` | `/api/gifts/<id>/` | Retrieve specific gift details. | Authenticated Users |
| **Gifts** | `PUT` / `PATCH` | `/api/gifts/<id>/` | Update gift information. | `Admin` Role Only |
| **Gifts** | `DELETE` | `/api/gifts/<id>/` | Remove a gift from catalog. | `Admin` Role Only |
| **Gifts** | `POST` | `/api/gifts/scrape/` | Scrapes ASIN from Amazon URL and creates/updates gift. | `Admin` Role Only |
| **Gifts** | `POST` | `/api/gifts/<id>/price-check/` | Simulates scanning an item and logs a 10% price drop. | `Admin` Role Only |
| **Wishlist** | `GET` | `/api/wishlists/` | List all wishlists owned by the authenticated user. | `IsAuthenticated` |
| **Wishlist** | `POST` | `/api/wishlists/` | Create a new wishlist container for the authenticated user. | `IsAuthenticated` |
| **Wishlist** | `GET` | `/api/wishlists/<id>/` | Retrieve wishlist details and contained items. | `IsAuthenticated` (Owner) |
| **Wishlist** | `POST` | `/api/wishlists/<id>/manage-item/` | Add or remove items (`{"present_id": <id>, "action": "add\|remove"}`). Max 50 items. | `IsAuthenticated` (Owner) |
| **Wishlist** | `GET` | `/api/wishlists/<id>/export/csv/` | Download wishlist items as an attached CSV file. | `IsAuthenticated` (Owner) |
| **Docs** | `GET` | `/swagger/` | Interactive Swagger UI API sandbox. | `AllowAny` |
| **Docs** | `GET` | `/redoc/` | Alternative ReDoc documentation portal. | `AllowAny` |