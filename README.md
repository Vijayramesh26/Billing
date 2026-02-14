# Seyyal (செயல்) - Billing & Inventory Management System

**Seyyal** (Tamil for "Action" or "Execution") is a comprehensive, web-based billing and inventory management solution designed for retail businesses. It streamlines operations by integrating point-of-sale (POS) billing, inventory tracking, customer management, and multi-role employee access into a single, modern platform.

---

## 📚 Documentation Index

For detailed information, please refer to the following documents in the `docs/` folder:

1.  **[Business Requirements (BRD)](./docs/BRD.md)**: Goals, Scope, User Roles, and Functional Requirements.
2.  **[User Guide](./docs/USER_GUIDE.md)**: Step-by-step manual for Admins, Managers, Billers, and Inventory Staff.
3.  **[Developer Guide](./docs/DEVELOPER_GUIDE.md)**: Setup instructions, Tech Stack, and Deployment Guide.
4.  **[API Documentation](./docs/API_DOCUMENTATION.md)**: Detailed API endpoints, authentication, and request formats.
5.  **[Technical Reference](./docs/TECHNICAL_REFERENCE.md)**: Database Schema, Table Structures, and System Architecture.

---

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Secure login for Admin, Manager, Inventory, and Biller roles.
*   **Intuitive POS:** Fast billing interface with product search, stock checks, and PDF invoice generation.
*   **Smart Inventory:** Real-time stock tracking with low-stock alerts.
*   **Customer Management:** Database of customers with purchase history and loyalty discounts.
*   **Public Catalog:** Public-facing shop page for customers to browse products and place preliminary orders.
*   **Actionable Dashboards:** Role-specific dashboards with relevant metrics (Sales, Stock, Staff Performance).
*   **Modern UI:** Responsive design built with Vue.js 3 and Vuetify (Material Design).

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
*   **Framework:** Vue.js 3 (Composition & Options API)
*   **UI Library:** Vuetify 3
*   **Build Tool:** Vite
*   **State Management:** Pinia
*   **HTTP Client:** Axios
*   **Hosting:** Firebase Hosting

### Backend (Server-Side)
*   **Language:** Go (Golang) 1.21+
*   **Framework:** Gin Web Framework
*   **ORM:** GORM
*   **Database:** MySQL (Production) / SQLite (Dev)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Hosting:** Render (Dockerized)

---

## ⚡ Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/Billing.git
cd Billing
```

### 2. Backend Setup
```bash
cd backend
# Create .env file with DB creds
go mod download
go run cmd/server/main.go
# Server starts at http://localhost:8080
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## 📦 Deployment Overview

### Backend (Render)
The backend is containerized using **Docker**.
*   **Dockerfile:** Defines the multi-stage build process.
*   **render.yaml:** Configuration for automatic deployment on Render.
*   **Environment Variables:** Managed via Render Dashboard (`DB_DSN`, `JWT_SECRET`, etc.).

### Frontend (Firebase)
The frontend is built as a static SPA.
*   **Build Command:** `npm run build` (Outputs to `dist/`).
*   **Deploy Command:** `firebase deploy`.
*   **Configuration:** `firebase.json` handles rewrites for SPA routing.

---

## 📂 Project Structure

```bash
Billing/
├── backend/                # Go Backend Code
│   ├── cmd/server/         # Main entry point
│   ├── config/             # Config loader (Viper)
│   ├── internal/handler/   # API Controllers
│   ├── internal/models/    # Database Models
│   ├── internal/middleware/# Auth & CORS Middleware
│   └── Dockerfile          # Container config
├── frontend/               # Vue.js Frontend Code
│   ├── public/             # Static Assets (Logo)
│   ├── src/components/     # Reusable UI Components
│   ├── src/views/          # Page Views (Admin, POS, etc.)
│   ├── src/services/       # API Integration
│   └── vite.config.js      # Build config
└── docs/                   # Detailed Documentation
```
