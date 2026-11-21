# 🎨 Giftly — Frontend Documentation

## 🌐 Live Demo

👉 **[Launch Giftly Web App](https://www.giftly.cloud)**

This directory contains the client-side Single Page Application (SPA) for **Giftly**, built from scratch using **React**, **TypeScript**, **Vite**, and **Redux Toolkit**.

## 🛠 Prerequisites

- **Node.js:** Version `18.x` or higher (LTS) downloaded from the [official website](https://nodejs.org/).

## 🚀 Getting Started

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend/` directory and specify the backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   The application will automatically open in your default browser at `http://localhost:3000`.

## 📜 Available Scripts

All commands must be executed from the `frontend/` directory:

- `npm start` — Starts the development server with Hot Module Replacement (HMR).
- `npm run build` — Builds the optimized production bundle into the `dist/` folder.
- `npm run lint` — Checks the codebase for formatting and code quality issues using ESLint.
- `npm run deploy` — Deploys the production build to GitHub Pages.

## 🏗 Client-Side Architecture

The frontend is built around a **modular, feature-oriented structure** with a strict **separation of concerns (Business Logic vs. UI)**:

1. **Feature Modules (`src/modules`)**
   Every page and standalone modal window is isolated in its own directory containing the component, scoped SCSS module, subcomponents, and barrel export (`index.ts`). This prevents CSS collisions and keeps features independent.

2. **Logic Encapsulation via Custom Hooks (`src/shared/hooks`)**
   To keep UI components clean and readable, complex state transitions, multi-step form validations, and API interactions are extracted into custom hooks (such as `useAuthFlow`, `useFiltersPage`, `useAvatarUpload`, and `useVerificationModal`).

3. **Centralized State Management (`src/store`)**
   Global state is handled by **Redux Toolkit** and divided into domain slices:
   - `auth` — User session, authentication status, and profile updates.
   - `filters` — Quiz filter parameters, pagination state, and async gift fetching.
   - `wishlist` — Synchronized favorites list supporting both guest (`localStorage`) and authenticated modes.
   - `giftDetails` — Selected product state and loading indicators.
   - `contact` — Support contact form submission state.

4. **Reusable UI Kit (`src/shared/components`)**
   Common interface elements (`Header`, `Footer`, `Layout`, `ProductCard`, `Button`, `LoadingScreen`, `SkeletonCard`, `ProductDetailsSkeleton`, `Graphic`, `GlowCard`) are designed as reusable components styled with SCSS variables, mixins, and CSS custom properties.

5. **Isolated API Layer (`src/api`)**
   All HTTP requests are decoupled from the UI layer into typed service modules built on top of a configured Axios instance.

## 📂 Folder Structure

```text
frontend/
├── public/                 # Static files (index.html, favicons) served as-is
├── src/
│   ├── api/                # Axios configuration & typed API service modules
│   ├── assets/             # Optimized images, SVG icons, and local fonts
│   ├── modules/            # Isolated feature modules (pages & modal windows)
│   │   ├── CatalogPage/        # Search results grid & pagination
│   │   ├── ContactsWindow/     # Support contact modal
│   │   ├── FiltersPage/        # Multi-criteria gift search form
│   │   ├── HomePage/           # Landing page & section components
│   │   ├── NotFoundPage/       # 404 fallback page
│   │   ├── ProductDetailsPage/ # Detailed product view
│   │   ├── ProfilePage/        # Dashboard, AuthFlow, AvatarUpload, Edit & Verify modals
│   │   ├── ReadyIdeasPage/     # Curated gift guides by recipient
│   │   ├── ReadyIdeasWindow/   # Occasion selection modal
│   │   ├── RegisterModal/      # Account registration modal
│   │   ├── RightsPage/         # Privacy Policy page
│   │   ├── TermsPage/          # Terms & Conditions page
│   │   └── WishlistPage/       # Saved gift ideas page
│   ├── shared/
│   │   ├── components/     # Reusable UI Kit & skeleton loaders
│   │   ├── constants/      # App-wide constants & filter configurations
│   │   ├── hooks/          # Custom hooks encapsulating business logic
│   │   └── utils/          # Validators & image cropping helpers
│   ├── store/              # Redux Toolkit store, typed hooks & domain slices
│   ├── styles/             # Global SCSS styles, variables, mixins & reset
│   ├── App.tsx             # Root component & routing setup
│   └── index.tsx           # Application entry point
├── Dockerfile              # Frontend container configuration
├── vite.config.ts          # Vite bundler configuration
└── tsconfig.json           # TypeScript configuration
```
