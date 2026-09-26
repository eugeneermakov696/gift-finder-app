# 🎁 Gift Finder App — Backend Engine Documentation

Welcome to the backend service engine for the **Gift of Presents on Amazon** project. This service provides a containerized, secure, and test-driven RESTful API built natively with **Django REST Framework (DRF)** and backed by an isolated **PostgreSQL** database.

---

## 🛠️ Architecture Stack & Ports

*   **DRF Backend Engine:** Containerized application service running on `http://localhost:8000`
*   **PostgreSQL Database Engine:** Containerized `postgres:15-alpine` database volume listening on port `5432`
*   **OpenAPI Interactive Sandbox UI (Swagger):** Available locally at `http://localhost:8000/swagger/`
*   **Alternative Spec Portal (ReDoc):** Available locally at `http://localhost:8000/redoc/`

---

## 📦 Project Structure

```text
gift-finder-app/
├── docker-compose.yml          # Local container orchestration matrix
├── README.md                   # Global application landing index configuration
└── backend/                    # Django Application Workspace Directory
    ├── .flake8                 # Code quality linter configuration profile
    ├── .gitignore              # Wipes untracked files (.env, .venv) from Git
    ├── .env                    # Decoupled system secrets (Database keys, Debug flags) - IGNORED BY GIT
    ├── .env.example            # Environment configuration template blueprint for onboarding
    ├── api_test.http           # Native PyCharm HTTP client automated scratchpad entries
    ├── Dockerfile              # Python slim multi-stage image generation manifest
    ├── INSTRUCTION-backend.md  # This documentation file
    ├── manage.py               # Django master administrative execution script
    ├── requirements.txt        # Backend third-party packages baseline manifest
    ├── gift_of_presents/       # Core system settings and routing contexts
    │   ├── settings.py         # DRF Global configurations (Token Auth, Cors rules)
    │   └── urls.py             # Global application path maps (Swagger definitions)
    └── presents/               # Application domain business logic layer
        ├── migrations/         # Auto-generated database table structural schemas
        │   ├──0001_initial.py  # Instantiates the Present model schema
        │   ├──0002_wishlist.py # Instantiates the secure Wishlist relationship tables
        │   └── __init__.py
        ├── management/
        │   └── commands/
        │       ├── __init__.py
        │       └── import_excel.py # Importer script mapping Excel sheets into PostgreSQL
        ├── admin.py            # Visual object metrics model customization settings
        ├── apps.py             # Module framework metadata hook
        ├── models.py           # Relational object database structural design layout
        ├── serializers.py      # DRF serializers converting row entries to JSON output
        ├── services.py         # Mock Amazon scraper pattern processing utilities
        ├── tests.py            # Automated integration unit test suite matrix
        ├── urls.py             # DRF ViewSet endpoint registration mapping
        └── views.py            # Secure ModelViewSets handling backend CRUD actions
```

---

## 🚀 Environment Initialization (Onboarding)

The project completely decouples sensitive database variables and security credentials from the runtime engine using environmental configuration maps. 

When configuring a clean repository setup loop from scratch:
1. Navigate into the `backend/` application workspace directory.
2. Duplicate the `.env.example` template to initialize your active local `.env` settings file:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` and securely adapt your `SECRET_KEY` and target `DB_PASSWORD` parameters if necessary.

---

## 🛠️ Quick Start Instructions

Follow these instructions to spin up the local microservices stack inside your IDE workspace terminal:

### 1. Build and Start the Container Stack
Compile the environment layers and start the database and application servers in background detached mode:
```bash
docker compose up --build -d
```

### 2. Apply Relational Migrations
On the initial configuration initialization check or when schema fields adjust, push the structural tables into PostgreSQL:
```bash
docker compose exec backend python manage.py migrate
```

### 3. Generate a Graphical Administrative Account
Create a master access profile to securely enter the Django graphic board interface panel:
```bash
docker compose exec backend python manage.py createsuperuser
```

### 4. Turn Off the System Services
To gracefully stop all running container environments and clear network ports:
```bash
docker compose down
```

---

## 🧪 Running the Test Matrix

The engine features an automated integration suite checking **8 safety validation vectors** (Dynamic query parsing metrics, field ordering layouts, scraper link extraction exceptions, max-50 structural ceilings, and Token authentication boundaries).

Run this validation command to verify your active codebase:
```bash
docker compose exec backend python manage.py test presents
```
*Note: This identical test block is triggered automatically in the cloud by your **GitHub Actions CI/CD Pipeline** on every branch push.*

---

## 📊 Excel Sheet Database Importer

The app includes a command utility tool that streams Excel tables (`.xlsx`) straight into PostgreSQL. If rows lack image links, it dynamically structures a deterministic path from the product code identifier fields.

1. Ensure your spreadsheet contains these exact header labels: `title`, `asin`, `amazon_url`, `price`, `category`.
2. Move the file into your local `backend/` folder directory (e.g., `gifts_data.xlsx`).
3. Run the import engine directly within the active container runtime environment:
```bash
docker compose exec backend python manage.py import_excel gifts_data.xlsx
```

---

## 🌐 DRF Restful Endpoint Routing Directory

All core CRUD logic blocks route through automatic Django REST Framework pathways mounted under the primary base context route mapping:

| Area | HTTP Method | REST Endpoint Pathway | Description / Scope | Security Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Gifts** | `GET` | `/api/gifts/` | View products chunked by pagination (`?page=1`). Supports filtering (`?category=X`), keyword text search (`?search=Y`), and price ordering parameter logic (`?sort_by=price_low\|price_high\|rating`). | Public Access |
| **Gifts** | `POST` | `/api/gifts/` | Manually insert a product record item mapping frame into the database. | Public Access |
| **Gifts** | `POST` | `/api/gifts/scrape/` | Submits an `amazon_url`, extracts the ASIN tracking key, and records the item in PostgreSQL. | Public Access |
| **Gifts** | `POST` | `/api/gifts/<id>/price-check/` | Simulates scanning an item and logs a 10% price drop markdown. | Public Access |
| **Auth** | `POST` | `/api/auth/register/` | Register profile account; returns a cryptographic access token string signature key. | Public Access |
| **Auth** | `POST` | `/api/auth/login/` | Exchange account credentials for a persistent access validation token string. | Public Access |
| **Wishlist** | `GET` | `/api/wishlists/` | View all active wishlist configuration titles across the engine. | Public Access |
| **Wishlist** | `POST` | `/api/wishlists/` | Initialize an empty wishlist container. | **Requires Header:** <br>`Authorization: Token <key>` |
| **Wishlist** | `POST` | `/api/wishlists/<id>/manage-item/` | Append or remove items inside the wishlist (`"action": "add\|remove"`). | **Requires Header:** <br>`Authorization: Token <key>` <br>*Enforces 50-item limit check.* |
| **Export** | `GET` | `/api/wishlists/<id>/export_csv/` | Download a clean spreadsheet file sheet directly via the browser layout. | Public Access |
