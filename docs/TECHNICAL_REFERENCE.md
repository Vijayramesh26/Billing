# Technical Reference - Seyyal Billing System

## 1. System Architecture
**Seyyal** follows a client-server architecture:
*   **Frontend:** Vue.js (SPA) served via Firebase Hosting.
*   **Backend:** Go (Gin Framework) REST API hosted on Render.
*   **Database:** Relational Database (MySQL compatible) for structured data storage.

---

## 2. Database Schema
The database consists of the following normalized tables.

### 2.1. `roles`
Defines user access levels.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | Unique Role ID |
| `name` | VARCHAR(50) | Unique, Not Null | e.g., 'admin', 'manager', 'biller' |
| `created_at` | DATETIME | | Timestamp |

**Example Data:**
| id | name |
| :--- | :--- |
| 1 | admin |
| 2 | manager |
| 3 | biller |

### 2.2. `users`
System employees and login credentials.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | Unique User ID |
| `employee_id` | VARCHAR(20) | Unique, Not Null | Login ID (e.g., ADM001) |
| `username` | VARCHAR(50) | Not Null | Display Name |
| `password_hash` | VARCHAR(255) | Not Null | Argon2 Encrypted Password |
| `role_id` | INT | FK -> roles(id) | Associated Role |
| `is_active` | BOOLEAN | Default: true | Account Status |

**Example Data:**
| id | employee_id | username | role_id | is_active |
| :--- | :--- | :--- | :--- | :--- |
| 1 | ADM001 | Vijay Admin | 1 | true |
| 2 | BIL001 | Saravanan | 3 | true |

### 2.3. `products`
Inventory items available for sale.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | Product ID |
| `name` | VARCHAR(150) | Not Null | Product Name |
| `unit_price` | DECIMAL(10,2) | Not Null | Selling Price |
| `current_stock` | INT | Default: 0 | Quantity on Hand |
| `barcode` | VARCHAR(50) | Indexed | Scan Code |
| `brand_id` | INT | FK -> brands(id) | Brand Reference |

**Example Data:**
| id | name | unit_price | current_stock | barcode |
| :--- | :--- | :--- | :--- | :--- |
| 101 | Paracetamol 500mg | 15.00 | 500 | 890123... |
| 102 | Cough Syrup 100ml | 85.50 | 45 | 890456... |

### 2.4. `bills`
Sales transactions (Invoices).
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | Internal ID |
| `bill_no` | VARCHAR(50) | Unique, Not Null | Invoice # (BIL-20240213-00001) |
| `customer_id` | INT | FK -> customers(id) | Linked Customer (Nullable) |
| `user_id` | INT | FK -> users(id) | Biller who created it |
| `total_amount` | DECIMAL(10,2) | Not Null | Gross Total |
| `net_payable` | DECIMAL(10,2) | Not Null | Final Amount (after tax/disc) |
| `status` | ENUM | 'PAID', 'CANCELLED' | Payment Status |

### 2.5. `bill_items`
Line items for each bill.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PK, Auto Increment | Item ID |
| `bill_id` | INT | FK -> bills(id) | Parent Bill |
| `product_id` | INT | FK -> products(id)| Sold Product |
| `quantity` | INT | Not Null | Qty Sold |
| `unit_price` | DECIMAL(10,2) | Not Null | Price at time of sale |
| `total` | DECIMAL(10,2) | Not Null | Qty * UnitPrice |

---

## 3. Frontend-Backend Integration

### 3.1. API Service Layer (`src/services/EventServices.js`)
The frontend communicates with the backend via a centralized service layer using **Axios**.
*   **Base URL Config:**
    *   Development: `/api/v1` (Proxied to localhost:8080)
    *   Production: `https://billing-k0lz.onrender.com/api/v1`
*   **Authentication:**
    *   On Login, the backend returns a `token`.
    *   This token is stored in `localStorage`.
    *   Axios Interceptor automatically attaches `Authorization: Bearer <token>` to every subsequent request.

### 3.2. Example: Creating a Bill
**Frontend Action:**
1.  User adds items to cart in `Billing.vue`.
2.  Clicks "Confirm & Print".
3.  Calls `EventServices.createBill(payload)`.

**Request Payload:**
```json
{
  "customer_id": 5,
  "total_amount": 100.50,
  "discount_amount": 10.00,
  "gst_amount": 5.50,
  "net_payable": 96.00,
  "payment_mode": "CASH",
  "items": [
    {
      "product_id": 101,
      "quantity": 2,
      "unit_price": 15.00,
      "total": 30.00
    }
  ]
}
```

**Backend Processing (`BillingHandler.CreateBill`):**
1.  Validates JSON body.
2.  Starts a **Database Transaction**.
3.  Creates `Bill` record.
4.  Iterates through `items`:
    *   Checks `product.current_stock`.
    *   **Deducts Stock:** `current_stock = current_stock - quantity`.
    *   Creates `BillItem` record.
5.  Commits Transaction.
6.  Returns `bill_no`.

---

## 4. API Reference Guide

### 4.1. Authentication
*   **Endpoint:** `POST /auth/login`
*   **Description:** Authenticates user and returns JWT.
*   **Payload:**
    ```json
    {
      "employee_id": "ADM001",
      "password": "password123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUz...",
      "role": "admin",
      "username": "Vijay Admin"
    }
    ```

### 4.2. Get Products (Inventory)
*   **Endpoint:** `GET /inventory/products`
*   **Headers:** `Authorization: Bearer <token>`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 101,
        "name": "Paracetamol",
        "unit_price": 15.00,
        "current_stock": 498,
        "brand": { "name": "Cipla" }
      }
    ]
    ```

### 4.3. Dashboard Stats (Manager)
*   **Endpoint:** `GET /manager/dashboard`
*   **Description:** Aggregates real-time business metrics.
*   **Response (200 OK):**
    ```json
    {
      "metrics": {
        "todayRevenue": 15000.50,
        "totalOrders": 45,
        "lowStock": 3
      },
      "charts": {
        "monthly": { "labels": [...], "data": [...] },
        "category": { "labels": [...], "data": [...] }
      }
    }
    ```
