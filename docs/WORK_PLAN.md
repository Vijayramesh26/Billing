# Project Work Plan - Seyyal Billing System

This document outlines the strategic phases and key milestones executed during the development and refinement of the Seyyal Billing System.

## Phase 1: Codebase Analysis & Refactoring
**Objective:** Modernize the codebase and improve maintainability by transitioning to Vue 3 Options API.
*   **Audit:** Identified components using Composition API vs Options API.
*   **Refactoring:**
    *   systematically converted `Inventory`, `Billing`, `Manager`, and `Admin` views to **Options API**.
    *   Refactored `Auth` components (Login) for better state management.
    *   Centralized API calls into `EventServices.js`.
*   **Bug Fixes:** Resolved issues with POS order persistence, logout functionality, and mobile responsiveness.

## Phase 2: Feature Enhancement
**Objective:** Improve user experience and add critical business features.
*   **Public Shop (`/shop`):**
    *   Redesigned for a modern, premium look.
    *   Added **Search Bar** and **Cart** functionality.
    *   Integrated **WhatsApp Ordering** for direct customer engagement.
*   **Billing POS:**
    *   Added "Complete in POS" button for handling online orders.
    *   Implemented logic to handle `orderId` query parameters.
    *    ensured customer details persist via LocalStorage.

## Phase 3: Rebranding (Seyyal)
**Objective:** Establish a unique brand identity.
*   **Naming:** Renamed application to **"Seyyal" (செயல்)**.
*   **Visual Identity:**
    *   Designed and integrated new **SVG Logo** and **Favicon**.
    *   Updated App Bar, Sidebar, and Login screen branding.
    *   Removed redundant text to focus on the new logo.

## Phase 4: Deployment Preparation
**Objective:** Make the application production-ready.
*   **Configuration:**
    *   Moved hardcoded backend values to `.env` files.
    *   Configured **CORS** in backend to allow production frontend requests.
*   **Backend (Render):**
    *   Created `Dockerfile` for containerization.
    *   Created `render.yaml` for automated deployment.
    *   Downgraded Go version to 1.21 for compatibility.
*   **Frontend (Firebase):**
    *   Configured `firebase.json` for SPA hosting.
    *   Set up production API base URL (`https://billing-k0lz.onrender.com`).

## Phase 5: Documentation
**Objective:** Provide comprehensive guides for all stakeholders.
*   **Business:** Created **BRD** (Business Requirement Document).
*   **Technical:** Created **Technical Reference** (DB Schema, API details) and **Developer Guide**.
*   **End-Users:** Created **User Manual** with role-specific workflows (Biller, Manager, Admin).
*   **Master Guide:** Created **README.md** as the central project hub.

---

## Future Roadmap (Post-Deployment)
1.  **Mobile App:** Wrap the responsive frontend into a native app (Capacitor/Cordova).
2.  **Advanced Analytics:** Add AI-driven sales forecasting to Manager Dashboard.
3.  **Payment Gateway:** Integrate Razorpay/Stripe for direct online payments in `/shop`.
