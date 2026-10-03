# 🎁 Gift Finder App - Frontend

This directory contains the client-side of the "Gift Finder" application, built with React, TypeScript, and Vite.

## 🛠 Prerequisites

Before running the project, ensure you have **Node.js** installed on your machine. 
Without it, `npm` commands will not work.

* Download Node.js from the [official website](https://nodejs.org/).
* Recommended version: 18.x or higher (LTS).

## 🚀 Getting Started

1. **Navigate to the frontend directory:**
   If you are in the root of the monorepo, you must first enter this folder in your terminal:
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   This command will download all the necessary libraries (React, Vite, etc.) into the `node_modules` folder.
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   After running this, the project will automatically open in your default browser at `http://localhost:3000`.

## 💻 Available Scripts

All commands must be executed from within the `frontend` directory.

* `npm start` — starts the project in development mode with Hot Module Replacement (HMR).
* `npm run build` — builds the optimized production version of the app into the `dist` folder.
* `npm run lint` — checks the code for issues and errors using ESLint.
* `npm run deploy` — deploys the site on GitHub pages.

## 📁 Folder Structure

* `public/` — static files (`index.html`, favicons) that the server serves "as is", without additional processing by the bundler.
* `src/assets/` — images, SVG icons, and local fonts. These are imported directly into the code and automatically optimized during the project build.
* `src/api/` — backend communication logic: Axios configuration, API endpoints, and functions for network requests.
* `src/modules/` — large isolated features and full website pages (e.g., HomePage, ProfilePage).
* `src/shared/` — universal UI "building blocks" (Header, Footer, standard buttons, inputs) used across multiple pages.
* `src/store/` — global data storage (Redux Toolkit). This holds information accessible from anywhere in the app (e.g., user authentication status or saved search filters).
* `src/styles/` — global SCSS styles, base variables (colors, sizing), and theme configuration.
* `src/shared/hooks/` — reusable logic for React components (e.g., hooks for detecting clicks outside an element or debouncing inputs).
* `src/shared/types/` — global TypeScript interfaces (blueprints for data objects like `User` or `Gift`) to keep the code clean and type-safe.
