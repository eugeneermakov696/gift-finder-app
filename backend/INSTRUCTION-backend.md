# 🎁 Gift Finder App — Backend Engine Documentation

Welcome to the backend service engine for the **Gift of Presents on Amazon** project. This service provides a containerized, secure, and test-driven RESTful API built with **Django** and powered by an isolated **PostgreSQL** database.

---

## 🛠️ Architecture Stack & Ports

*   **Django Backend Engine:** Runs inside Docker, exposed on `http://localhost:8000`
*   **PostgreSQL Database:** Containerized service on isolated Docker volumes, listening on port `5432`
*   **Interactive Documentation (Swagger UI):** Available at `http://localhost:8000/swagger/`
*   **Alternative Documentation (ReDoc):** Available at `http://localhost:8000/redoc/`

---

## 📦 Project Structure

```text
gift-finder-app/
├── .flake8                     # Code quality linter rules profile
├── .gitignore                  # Wipes untracked files (.env, .venv) from Git
├── docker-compose.yml          # Orchestrates DB & Backend containers
├── README.md                   # Global application landing details
└── backend/                    # Django Application Directory
    ├── .env                    # Security and database environment configurations
    ├── api_test.http           # Native PyCharm manual routing test execution scratchpad
    ├── Dockerfile              # Python slim multi-stage container build manifest
    ├── INSTRUCTION-backend.md  # This documentation file
    ├── manage.py               # Django master entry point execution script
    ├── requirements.txt        # Backend dependencies manifest
    ├── gift_of_presents/       # Core project settings and configurations
    │   ├── settings.py         # App configuration (CORS, Token Auth, Env loader)
    │   └── urls.py             # Global route mapping rules (includes Swagger UI)
    └── presents/               # Core application domain layer
        ├── migrations/         # Auto-generated database structural changes
        │   ├──0001_initial.py  # Present/Product schema setup script
        │   ├──0002_wishlist.py # Wishlist model integration database script
        │   └──__init__.py
        ├── admin.py            # Custom visual models layout panel tracking
        ├── apps.py             # Domain registration meta-profile
        ├── models.py           # PostgreSQL database relational schemas
        ├── services.py         # Mock Amazon scraper pattern processing utilities
        ├── tests.py            # Automated integration test suite matrix
        ├── urls.py             # Application endpoint router rules
        └── views.py            # CRUD view logic with security validation checks
```

---

## 🚀 Quick Start Instructions

Follow these instructions to start the ecosystem inside your IDE terminal workspace:

### 1. Build and Start the Container Network
Compile the environment layers and start the database and application servers in background detached mode:
```bash
docker compose up --build -d
```

### 2. Turn Off the System Services
To gracefully stop all running services and network routing paths:
```bash
docker compose down
```

### 3. Check Real-Time Execution Logs
If you encounter runtime exceptions or want to verify data transmission steps:
```bash
docker compose logs -f backend
```

---

## 🧪 Running the Test Matrix

The backend is backed by an automated integration testing suite covering **8 validation vectors** (Filtering parameters, custom sorting matrices, automated scraping hooks, max-50 item constraints, and Token authorization loops).

Run this validation command to test your active code baseline:
```bash
docker compose exec backend python manage.py test presents
```

---

## 🔑 Environment Settings (`backend/.env`)

The project uses a secure `.env` file to decouple secrets from code execution loops. Ensure your `backend/.env` file matches this setup:

```ini
# Security Secrets
SECRET_KEY=django-insecure-prod-ready-crypto-key-replace-this-in-live-prod
DEBUG=True

# Database Configuration Context
DB_NAME=gift_of_presents
DB_USER=postgres_user
DB_PASSWORD=secure_dev_password_2026
DB_HOST=db
DB_PORT=5432

# CORS Origin Allowed Frameworks
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🌐 API Endpoint Index Guide

### 🛒 Product & Scraper Actions
*   `GET /api/gifts/` - View all items. Supports filtering (`?category=X&max_price=Y`), full-text search (`?search=Keyword`), pagination (`?page=1&items_per_page=10`), and sorting parameters (`?sort_by=price_low|price_high|rating`).
*   `POST /api/gifts/` - Create a manual item tracking entry.
*   `GET | PUT | DELETE /api/gifts/<id>/` - Core target operations for specific product IDs.
*   `POST /api/gifts/scrape/` - Accepts an `amazon_url`, extracts the ASIN identifier, and parses product parameters straight into PostgreSQL.
*   `POST /api/gifts/<id>/price-check/` - Simulates checking Amazon for active price tracking changes.

### 🔐 User Profile & Token Verification
*   `POST /api/auth/register/` - Register a unique profile account; returns a cryptographic authentication token key.
*   `POST /api/auth/login/` - Validate credentials to receive an authentication token.

### 🧱 Wishlist Data Containers
*   `GET /api/wishlists/` - Public view layout indexing wishlists platform-wide.
*   `POST /api/wishlists/` - Initialize an empty wishlist container.
*   `GET /api/wishlists/<id>/` - Retrieve presents stored in a targeted list.
*   `POST /api/wishlists/<id>/` - Add/Remove items (`"action": "add|remove"`). **Requires explicit Header injection:** `Authorization: Token <your_token_key>`. *Enforces a 50-item limit per container.*
*   `GET /api/wishlists/<id>/export/csv/` - Stream out wishlist records as an instant browser attachment file download.
*   `GET /api/wishlists/<id>/export/json/` - Stream out raw JSON records for third-party platforms.
