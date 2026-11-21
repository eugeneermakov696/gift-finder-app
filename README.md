# 🎁 Giftly — Personalized Gift Discovery Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_App-2ea44f?style=for-the-badge&logo=vercel)](https://www.giftly.cloud)
https://www.giftly.cloud
**Giftly** is a full-stack web service designed to save users from the never-ending headache of choosing the right gift. Instead of spending hours browsing dozens of online stores, users answer a few targeted questions about the recipient and budget to immediately receive tailored gift recommendations with direct purchase links.

## ✨ Core Functionality

- **Smart Gift Search Quiz:** Multi-criteria filtering by recipient's age, gender, relationship, interests (13 categories), and a dynamic budget slider ($5–$1,000) with real-time validation.
- **Curated Ready Ideas:** Pre-built gift guides grouped by recipient (Mom, Dad, Partner, Friends, Coworkers, etc.) and occasion for quick browsing without taking the quiz.
- **Product Catalog & Details:** Responsive two-column product grid with pagination, skeleton loaders, discount indicators, detailed descriptions, and direct redirection to external stores (e.g., Amazon).
- **Dual-Mode Wishlist:** Seamless saving of favorite gift ideas—persisted locally in `localStorage` for guest users and synchronized with the server database for authenticated accounts.
- **Full User Account & Auth System:**
  - Account registration, login, and password recovery flows.
  - 6-digit email verification modal.
  - Profile management with drag-and-drop avatar upload, zoom adjustment, and image cropping.
- **Interactive Landing Page:** Smooth scroll navigation, multi-expandable FAQ accordion, popular gifts showcase, and a validated support contact modal.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite, Redux Toolkit, SCSS Modules, Axios
- **Backend:** REST API, Phyton, Django, Database, Authentication & Gift Filtering Engine
- **DevOps & Infrastructure:** Docker, Docker Compose, Terraform, Helm Charts

## 📚 Documentation

For detailed technical documentation, please refer to the specific guides below:

- 🏛 **[System Architecture](./ARCHITECTURE.md)** — High-level system design, client-server interaction, and infrastructure overview.
- 🎨 **[Frontend Documentation](./frontend/README.md)** — Client-side architecture, state management, directory structure, and local setup.
- ⚙️ **[Backend Documentation](./backend/INSTRUCTION-backend.md)** — Server architecture, API endpoints, and database setup.

## 🚀 Quick Start (Docker)

To run the entire application stack locally using Docker Compose:

```bash
docker-compose up --build
```
