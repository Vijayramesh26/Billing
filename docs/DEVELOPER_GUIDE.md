# Developer Guide - Seyyal Billing System

## 1. Technology Stack
*   **Frontend:**
    *   Vue.js 3 (Composition & Options API)
    *   Vuetify 3 (UI Framework)
    *   Vite (Build Tool)
    *   Axios (HTTP Client)
*   **Backend:**
    *   Go (Golang) 1.21+
    *   Gin (Web Framework)
    *   GORM (ORM)
    *   MySQL (Database) - *Can be configured for SQLite in dev*

## 2. Prerequisites
Ensure you have the following installed:
*   [Go 1.21+](https://go.dev/dl/)
*   [Node.js 20+](https://nodejs.org/)
*   [Docker](https://www.docker.com/) (Optional, for containerized run)
*   [Git](https://git-scm.com/)

## 3. Local Development Setup

### 3.1. Cloning the Repository
```bash
git clone https://github.com/your-username/Billing.git
cd Billing
```

### 3.2. Backend Setup
1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    go mod download
    ```
3.  Configure Environment:
    *   Create a `.env` file (copy from `.env.example` if available).
    *   Set `DB_USER`, `DB_PASSWORD`, `DB_NAME` etc.
4.  Run the server:
    ```bash
    go run cmd/server/main.go
    ```
    *   Server starts at `http://localhost:8080`.

### 3.3. Frontend Setup
1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm run dev
    ```
    *   App accessible at `http://localhost:5173`.

## 4. Deployment

### 4.1. Backend (Render)
The backend is configured for deployment on Render.com using Docker.
1.  Push code to GitHub.
2.  Connect repository to Render.
3.  Select **Docker** as the environment.
4.  Set Environment Variables in Render Dashboard.

### 4.2. Frontend (Firebase Hosting)
The frontend is deployed as a Single Page Application (SPA).
1.  Build for production:
    ```bash
    npm run build
    ```
2.  Deploy using Firebase CLI:
    ```bash
    firebase deploy
    ```

## 5. Folder Structure
```
Billing/
├── backend/
│   ├── cmd/server/       # Entry point
│   ├── config/           # App configuration
│   ├── internal/
│   │   ├── handler/      # HTTP Request Handlers
│   │   ├── middleware/   # Auth, CORS, Logging
│   │   ├── models/       # DB Models (GORM)
│   │   └── utils/        # Helper functions
│   ├── pkg/database/     # DB Connection
│   └── Dockerfile
├── frontend/
│   ├── public/           # Static assets (logo, favicon)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── layouts/      # App layouts
│   │   ├── services/     # API calls (Axios)
│   │   ├── views/        # Page components (Admin, Manager, Biller)
│   │   └── App.vue       # Root component
│   ├── vite.config.js    # Vite configuration
│   └── firebase.json     # Firebase Hosting config
└── docs/                 # Project documentation
```
