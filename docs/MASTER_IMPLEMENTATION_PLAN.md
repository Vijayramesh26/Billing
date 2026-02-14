# Master Implementation Plan: Seyyal Billing System (Detailed)

This document serves as the **definitive historical record** of the implementation of the Seyyal Billing System. It details every technical decision, code refactoring step, feature implementation, and deployment action taken from the project's inception to its current production state.

---

## Phase 0: Initial Assessment & Project Setup

### 0.1. Codebase Analysis
**Objective:** Understand the existing architecture and identify technical debt.
*   **Findings:**
    *   **Frontend:** The Vue.js application had a mix of **Options API** (Vue 2 style) and **Composition API** (Vue 3 `<script setup>`). This inconsistency made state management difficult to debug.
    *   **Backend:** A robust Go (Golang) backend using the **Gin framework** and **GORM** for ORM. However, configuration was hardcoded or relied on a `config.toml` file, which is not suitable for modern cloud deployments (12-Factor App methodology).
    *   **Database:** Structured for a billing system but lacked specific features for inventory tracking (Stock Entries) and customer order management.

### 0.2. Strategic Decisions
1.  **Refactoring Strategy:** Standardize the entire frontend to **Vue 3 Options API** for consistency and ease of maintenance, given the team's familiarity.
2.  **Deployment Strategy:**
    *   **Frontend:** Host as a Static Single Page Application (SPA) on **Firebase Hosting** for global CDN delivery.
    *   **Backend:** Containerize using **Docker** and deploy on **Render** (Platform as a Service) for scalability and ease of management.
    *   **Database:** Use a managed **PostgreSQL/MySQL** instance (via Render) for production data reliability.

---

## Phase 1: Core Architecture Refactoring

### 1.1. Frontend Standardization (Options API)
**Objective:** Rewrite components to use `data()`, `methods()`, `computed()`, and `mounted()` lifecycles.
*   **Authentication Module:**
    *   **File:** `src/views/auth/Login.vue`
    *   **Action:** Converted from `<script setup>` to `export default`. Implemented `login()` method to call the API and store the JWT in `localStorage`.
*   **Inventory Module:**
    *   **Files:** `ProductList.vue`, `StockView.vue`, `StockEntry.vue`.
    *   **Action:** Refactored data fetching logic. Moved API calls from `onMounted` to `created()` lifecycle hook.
*   **Billing Module:**
    *   **Files:** `Billing.vue` (POS), `MySales.vue`.
    *   **Action:** Complex state logic for the "Cart" (adding items, calculating totals) was moved to component `data`. Watchers were added to recalculate `netPayable` whenever `items` changed.

### 1.2. Service Layer Abstraction
**Objective:** Decouple UI components from direct API implementation details.
*   **Action:** Created `src/services/EventServices.js`.
*   **Implementation:**
    *   Configured a central **Axios** instance.
    *   Added **Request Interceptors** to automatically attach the `Authorization: Bearer <token>` header to every outgoing request.
    *   Added **Response Interceptors** to globally handle `401 Unauthorized` errors (redirecting users to login).
*   **Result:** Components now call `EventServices.getProducts()` instead of `axios.get('/api/v1/inventory/products')`.

---

## Phase 2: Feature Engineering & Business Logic

### 2.1. The Public Shop (`/shop`)
**Objective:** Create a customer-facing digital catalog.
*   **Design:** Modern, card-based layout with product images, prices, and an "Add to Cart" button.
*   **Features:**
    *   **Search:** Implemented a real-time search bar filtering the product list.
    *   **Cart Management:** Local state management to track selected items and quantities.
    *   **WhatsApp Integration:**
        *   **Logic:** When a user clicks "Place Order", the system constructs a pre-filled WhatsApp message string:
            ```text
            Hello *, I would like to order:
            - Paracetamol x 2
            - Cough Syrup x 1
            Total: ₹150.00
            Address: 123 Main St...
            ```
        *   **Implementation:** Uses `window.open` with the `https://wa.me/` API, properly URL-encoded.

### 2.2. Advanced Point of Sale (POS)
**Objective:** Empower billers to process transactions efficiently.
*   **Stock Validation:**
    *   **Backend:** Added a check in `CreateBill` handler. If `RequestedQty > CurrentStock`, the transaction is rolled back with an error.
    *   **Frontend:** The POS UI now shows available stock validation before adding an item.
*   **Online Order Fulfillment:**
    *   **Feature:** "Complete in POS" button added to the **Customer Orders** screen.
    *   **Logic:** When clicked, it redirects the biller to the POS screen (`/billing`) with the `orderId` as a query parameter. The POS then auto-loads the customer details and items from that pending order.

### 2.3. Inventory Management Enhancements
*   **Stock Entry:** Created a dedicated flow for adding *new* stock (Inward) separate from sales (Outward).
*   **Low Stock Alerts:**
    *   **Backend:** Created API endpoint `/inventory/alerts` that queries `WHERE current_stock <= low_stock_threshold`.
    *   **Frontend:** Displayed these alerts prominently on the Inventory Dashboard.

---

## Phase 3: Brand Identity Overhaul ("Seyyal")

### 3.1. Rebranding Strategy
**Objective:** Transition from generic "Billing App" to the unique identity **"Seyyal" (செயல்)**.
*   **Naming:** "Seyyal" means "Action" or "Execution" in Tamil, reflecting the tool's efficiency.
*   **Typography:** Selected modern fonts (Inter/Roboto) for a clean, professional look.

### 3.2. Visual Assets Implementation
*   **Logo Design:**
    *   Created a custom SVG logo featuring the stylized Tamil letter **"ச"**.
    *   Integrated this SVG code directly into `public/logo.svg` for crisp rendering at any size.
*   **UI Updates:**
    *   **App Bar:** Replaced text hierarchy. Removed redundant "Billing System" text; let the Logo stand as the primary brand element.
    *   **Sidebar:** Updated the navigation drawer header to display the user's role and the new Seyyal logo.
    *   **Favicon:** Updated `public/favicon.svg` to match the brand logo.

---

## Phase 4: Production Readiness & Configuration

### 4.1. Environment Configuration (12-Factor App)
**Objective:** Securely manage configuration across environments (Dev vs Prod).
*   **Backend:**
    *   **Tool:** Replaced `config.toml` with **Viper** and `.env` files.
    *   **Variables:** `SERVER_PORT`, `DB_DSN`, `JWT_SECRET`, `COMPANY_NAME`.
    *   **Benefit:** Secrets are no longer committed to code; they are injected by the deployment platform.
*   **Frontend:**
    *   **Files:** Created `.env.development` and `.env.production`.
    *   **Variable:** `VITE_API_BASE_URL`.
    *   **Dev Value:** `/api/v1` (uses Vite Proxy to localhost:8080).
    *   **Prod Value:** `https://billing-k0lz.onrender.com/api/v1`.

### 4.2. CORS Policy (Cross-Origin Resource Sharing)
**Problem:** The frontend (on Firebase) and backend (on Render) are on different domains. Browsers block these requests by default.
**Solution:**
*   **Library:** Imported `github.com/gin-contrib/cors`.
*   **Configuration:** Added middleware to `main.go`.
*   **Settings:** Allowed Origins: `https://seyal-app.web.app` and `http://localhost:5173`. Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS`.

### 4.3. Docker Containerization
**Objective:** Create a consistent runtime environment for the backend.
*   **Dockerfile:**
    *   **Stage 1 (Builder):** Uses `golang:1.21-alpine`. Compiles the binary.
    *   **Stage 2 (Runner):** Uses `alpine:latest`. Copies the binary and `.env` file.
    *   **Optimization:** Reduced image size from ~800MB to ~20MB.

---

## Phase 5: Deployment Execution

### 5.1. Backend Deployment (Render)
1.  **Repository Setup:** Created a dedicated repository `seyalPKG` for the backend to isolate it.
2.  **Infrastructure as Code:** Created `render.yaml` to define the web service.
3.  **Deploy Hook:** Connected Render to the GitHub repository.
    *   **Build Command:** `go build -o server cmd/server/main.go`
    *   **Start Command:** `./server`
4.  **Verification:** Verified the health check endpoint `/ping`.

### 5.2. Frontend Deployment (Firebase)
1.  **Build:** Ran `npm run build` to generate the production `dist/` folder using Vite.
2.  **Configuration:**
    *   **File:** `firebase.json`.
    *   **SPA Rewrites:** Configured all traffic (`**`) to reroute to `index.html` so Vue Router can handle navigation.
3.  **Release:** Ran `firebase deploy`. The app is now live at `https://seyal-app.web.app`.

---

## Phase 6: Comprehensive Documentation

### 6.1. Technical Documentation
*   **Database Schema:** Documented every table (`users`, `products`, `bills`, etc.) with types and constraints in `TECHNICAL_REFERENCE.md`.
*   **API Guide:** Documented every endpoint with JSON request/response examples in `API_DOCUMENTATION.md`.

### 6.2. User Manuals
*   **Role-Based Guides:** Created specific workflows for Billers, Managers, and Admins in `USER_MANUAL.md`.
*   **Developer Guide:** Instructions for setting up the project locally in `DEVELOPER_GUIDE.md`.

### 6.3. Master Guide
*   **README.md:** Created a central hub linking all documents, explaining the tech stack, and providing a quick start guide.

---

## Visual Summary of Architecture

```mermaid
graph TD
    User[End User / Customer] -->|HTTPS| Frontend[Firebase Hosting (Vue.js)]
    Frontend -->|API Calls (Axios)| Backend[Render (Go/Gin)]
    Backend -->|Queries| Database[(PostgreSQL/MySQL)]
    Backend -->|Auth| JWT[JWT Token Service]
    Frontend -->|WhatsApp| WhatsApp[WhatsApp Web API]
```
