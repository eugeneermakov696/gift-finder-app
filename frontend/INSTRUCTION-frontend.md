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

## 📂 Folder Structure

* `src/modules/` — isolated components and logic for specific pages (e.g., HomePage, ProfilePage).
* `src/shared/` — shared components (Header, Footer, UI elements) used across the entire application.
* `src/styles/` — global SCSS styles and variables.