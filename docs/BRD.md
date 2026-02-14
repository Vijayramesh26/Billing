# Business Requirement Document (BRD)
**Project Name:** Seyyal (செயல்) - Billing & Inventory System
**Version:** 1.0
**Date:** 2026-02-13

## 1. Executive Summary
Seyyal is a comprehensive web-based billing and inventory management application designed for retail businesses. It streamlines operations by integrating point-of-sale (POS) billing, inventory tracking, customer management, and multi-role employee access into a single platform. The name "Seyyal" (Tamil for "Action" or "Execution") reflects the system's focus on efficient business operations.

## 2. Project Objectives
*   **Centralize Operations:** Combine billing, inventory, and staff management.
*   **Role-Based Access Control (RBAC):** Ensure data security by restricting features based on employee roles (Admin, Manager, Biller, Inventory).
*   **Real-time Tracking:** Monitor stock levels and sales instantly.
*   **Customer Engagement:** Provide a public catalog and customer order tracking.
*   **Efficiency:** Reduce billing time and prevent stockouts with automated alerts.

## 3. Scope of Work

### 3.1. User Roles
*   **Admin:** Full system access. Manages employees, global settings, and views all reports.
*   **Manager:** Oversees sales, discounts, customer relationships, and views reports. Approval authority for certain actions.
*   **Inventory Manager:** Manages product catalog, stock entries, and monitors low stock alerts.
*   **Biller:** Handles point-of-sales (POS) billing, customer creation, and views their own sales.

### 3.2. Functional Requirements

#### Authentication
*   Secure login with Employee ID and Password.
*   JWT-based session management.
*   Role-based route protection.

#### Inventory Management
*   **Product Catalog:** Add/Edit/List products with images, prices (MRP, Selling), and categories.
*   **Stock Management:** Function to add stock (Inward entry).
*   **Low Stock Alerts:** Dashboard warnings when stock dips below threshold (default: 10).
*   **Brand Management:** Organize products by brand.

#### Billing & POS
*   **Bill Creation:** Fast product lookup, quantity adjustment, and automatic calculation of totals/taxes.
*   **Customer Association:** Link bills to existing or new customers.
*   **Invoice Generation:** Print-optimised bill format.
*   **Order Management:** Handle pending orders from the public shop.

#### Customer Management
*   **Database:** Maintain customer contact details and purchase history.
*   **Loyalty/Discounts:** Managers can set specific discounts for loyal customers.

#### Reporting & Analytics
*   **Admin Dashboard:** Overview of total sales, top products, active employees.
*   **Manager Dashboard:** Sales reports, order status tracking.
*   **Login History:** Audit logs of employee access (Admin only).

#### Public Interface
*   **Digital Catalog:** Public-facing page to view available products (`/shop`).
*   **Self-Service Ordering:** Customers can place preliminary orders to be processed by billers.

### 3.3. Non-Functional Requirements
*   **Performance:** API response time < 200ms for critical billing operations.
*   **Scalability:** Support for multiple concurrent billers.
*   **Security:** Password hashing (Argon2), HTTPS encryption.
*   **Availability:** Host backend on Render (Singapore region) and Frontend on Firebase.

## 4. Technical Stack
*   **Frontend:** Vue.js 3, Vuetify 3 (Material Design), Vite.
*   **Backend:** Go (Golang) 1.21, Gin Framework, GORM.
*   **Database:** MySQL (implied by GORM usage, currently configured as generic SQL).
*   **Deployment:** Docker (Backend), Firebase Hosting (Frontend).

## 5. Deployment Strategy
*   **Backend:** Containerized using Docker, deployed on Render.
*   **Frontend:** Static build assets deployed to Firebase Hosting.
*   **CI/CD:** Manual deployment via Git triggers/CLI.
