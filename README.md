### 🎁 Gift Finder Application (Monorepo)

A production-ready, cloud-native **Gift Registry & Recommendation System** built with a microservices-inspired serverless backend on **AWS (Amazon Web Services)** and a responsive single-page frontend client application. 

### 🏗️ Architecture & Stack Blueprint

The project follows a decoupled monorepo architecture separating the visual interface from the underlying microservice business logic: 

* **Frontend Client (/frontend):** Modern Single Page Application (SPA) driven by **Node.js v20**, **Vue 3 (< script setup >)**, and **Tailwind CSS**. It communicates asynchronously with the cloud tier via the native browser **Fetch API** to keep dependencies minimal and performant.
* **Backend Platform (/backend):** High-throughput serverless API built on **Node.js v18**, **AWS Lambda**, and **Amazon API Gateway**, orchestrated natively via the **Serverless Framework**.
* **Database & Messaging Layers:** **Amazon DynamoDB** handles fast persistence with concurrent race-condition prevention, while **AWS SNS/SQS** decouples secondary transactional event notifications.

### 📁 Repository Structure

```text
gift-finder-app/
├── .github/workflows/        # Automated Monorepo CI/CD pipelines
├── backend/                  # Serverless AWS Lambda Backend Framework
│   ├── config/               # Stage environment configuration variables (dev/prod)
│   ├── src/
│   │   ├── handlers/         # HTTP Controller layer (auth.js, items.js, lists.js)
│   │   ├── services/         # Domain business logic (amazonApi.js, dbService.js)
│   │   └── utils/            # Common Utilities (logger.js, httpResponses.js)
│   ├── tests/                # Automated unit test suites & mock seed engines
│   └── serverless.yml        # AWS Infrastructure as Code (IaC) configuration
└── frontend/                 # Reactive SPA Web Client
    ├── src/
    │   ├── components/       # Reusable UI widgets
    │   ├── services/         # Network service client layer (api.js)
    │   └── views/            # Full-page routed components (RegistryView.vue)
    └── tailwind.config.js    # Global styling themes configuration
```

### 🛠️ Local Sandbox Pre-requisites

Ensure you have the following frameworks installed on your host machine before initializing development mode: 

* **Node.js** (v18.x or v20.x recommended)
* **Docker** & **Docker Compose**
* **Java Runtime Environment (JRE)** (Only needed if running backend bare-metal without Docker for local DynamoDB emulation)

### 🚀 Quick Start: Running with Docker (Recommended)

To spin up the entire application stack—including the frontend web client, the local AWS Lambda API gateway proxy, and a localized memory-mocked DynamoDB database pre-populated with test seeds—run the following command in the project root: 

```bash
docker compose up --build
```

### Active Local Environs Mapping

* 💻 **Frontend Web User Interface Portal:** [http://localhost:5173](http://localhost:5173)
* ⚡ **Local API Gateway Simulation Engine:** [http://localhost:3000](http://localhost:3000)
* 🗄️ **Localized NoSQL DynamoDB Database Engine:** [http://localhost:8000](http://localhost:8000)

### 💻 Manual Local Development Workflow

If you prefer to run the applications directly on your bare metal machine without using containerization wrappers, run the two layers in separate terminal tabs: 

#### 1. Booting the Backend Serverless Stack

```bash
cd backend

# Install project infrastructure dependencies
npm install

# Download standalone DynamoDB Java binaries
npm run local:db-install

# Launch the offline server alongside automated seeds hydration
npm run start:local
```

#### 2. Booting the Frontend Client App

```bash
cd frontend

# Install client packages
npm install

# Launch Vite development hot-reloading server
npm run dev
```

### 🧪 Running Automated Test Suites

The backend includes isolated unit tests driven by Jest, which mock all live AWS resources and external API rate limits for speed and reliability. 

```bash
cd backend

# Execute all test matching files
npm test

# Generate complete code coverage diagnostics logs
npm run test:coverage
```

### 🛡️ CI/CD Git Automation Pipeline

The repository includes a unified, parallelized GitHub Actions automation loop inside `.github/workflows/monorepo-pipeline.yml`. 

* **Frontend Gate:** Code changes inside `/frontend` automatically trigger checking scripts (`npm run lint`), build validations, and push continuous deployments onto **GitHub Pages** whenever pushes occur on the `develop` branch.
* **Backend Gate:** Infrastructure or system updates inside `/backend` run automated testing pipelines. Successful code reviews automatically compile deployment workflows onto **AWS Cloud Datacenters** using OpenID Connect (OIDC) authentication federation based on your stage targets (`dev` vs `prod`).

### 🔒 Security Best Practices

* Sensitive tokens (such as your **Amazon Product API Keys**) are never committed to git history. They reside in protected cloud storage keys (`ssm:/amazon-gift/...`) or isolated local `.env` mock files.
* Database actions use conditional transactional variables (`ConditionExpression`) to defend against inventory concurrency race conflicts if multiple guests try to claim the same product simultaneously.
