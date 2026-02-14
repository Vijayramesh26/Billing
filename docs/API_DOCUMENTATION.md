# API Documentation v1.1

**Base URL:**
*   **Local Development:** `http://localhost:8080/api/v1`
*   **Production:** `https://billing-k0lz.onrender.com/api/v1`

**Authentication:**
For most endpoints, include the JWT token in the Authorization header:
*   **Header:** `Authorization`
*   **Value:** `Bearer <your_token_here>`

---

## 1. Authentication

### Login
*   **Endpoint:** `/auth/login`
*   **Method:** `POST`
*   **Description:** Authenticate user and receive access token.
*   **Request Body:**
    ```json
    {
      "employee_id": "ADM001",
      "password": "password123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...",
      "role": "admin",
      "username": "Vijay Admin"
    }
    ```
*   **Error Response (401 Unauthorized):**
    ```json
    { "error": "Invalid credentials" }
    ```

---

## 2. Admin (Role: admin)

### Create Employee
*   **Endpoint:** `/admin/employees`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "username": "New Biller",
      "password": "securepassword",
      "role_id": 3
    }
    ```
*   **Success Response (201 Created):**
    ```json
    { "message": "User created successfully", "user_id": 5, "employee_id": "BIL005" }
    ```

### List Employees
*   **Endpoint:** `/admin/employees`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    [
      { "id": 1, "employee_id": "ADM001", "username": "Vijay Admin", "is_active": true, "role": { "name": "admin" } }
    ]
    ```

### Update Employee Role
*   **Endpoint:** `/admin/employees/:id/role`
*   **Method:** `PUT`
*   **Request Body:** `{ "role_id": 2 }`
*   **Success Response (200 OK):** `{ "message": "Role updated successfully" }`

### Update Employee Status
*   **Endpoint:** `/admin/employees/:id/status`
*   **Method:** `PUT`
*   **Request Body:**
    ```json
    {
      "is_active": false,
      "inactive_reason": "Resigned"
    }
    ```
*   **Success Response (200 OK):** `{ "message": "Status updated successfully" }`

### Reset Password
*   **Endpoint:** `/admin/employees/:id/password`
*   **Method:** `PUT`
*   **Request Body:** `{ "password": "newpassword123" }`
*   **Success Response (200 OK):** `{ "message": "Password reset successfully" }`

### Login History
*   **Endpoint:** `/admin/login-history`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    [
      { "id": 1, "user": { "username": "Vijay" }, "login_time": "2024-02-13T10:00:00Z", "ip_address": "127.0.0.1" }
    ]
    ```

### Admin Dashboard Stats
*   **Endpoint:** `/admin/dashboard`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    {
      "total_employees": 15,
      "active_users": 14,
      "role_distribution": [ { "Name": "admin", "Count": 2 } ]
    }
    ```

---

## 3. Inventory (Roles: admin, manager, inventory)

### List Products
*   **Endpoint:** `/inventory/products`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    [
      { "id": 101, "name": "Paracetamol", "unit_price": 5.00, "current_stock": 450, "brand": { "name": "Cipla" } }
    ]
    ```

### List Brands
*   **Endpoint:** `/inventory/brands`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    [ { "id": 1, "name": "Cipla" }, { "id": 2, "name": "Sun Pharma" } ]
    ```

### Add Product
*   **Endpoint:** `/inventory/products`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "name": "Generic Medicine",
      "brand_name": "Cipla",
      "unit_price": 10.50,
      "low_stock_threshold": 20,
      "barcode": "8901234567890"
    }
    ```
*   **Success Response (201 Created):** `{ "id": 102, "name": "Generic Medicine", ... }`

### Add Stock
*   **Endpoint:** `/inventory/stock`
*   **Method:** `POST`
*   **Request Body:** `{ "product_id": 101, "quantity": 50 }`
*   **Success Response (200 OK):** `{ "message": "Stock added successfully" }`

### Low Stock Alerts
*   **Endpoint:** `/inventory/alerts`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    [ { "id": 105, "name": "Bandage", "current_stock": 5, "low_stock_threshold": 10 } ]
    ```

---

## 4. Billing & POS (Roles: admin, manager, biller)

### Get Next Bill Number
*   **Endpoint:** `/billing/next-bill-no`
*   **Method:** `GET`
*   **Success Response (200 OK):** `{ "next_bill_no": "BIL-20240213-00045" }`

### Create Bill
*   **Endpoint:** `/billing/bills`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "customer_id": 10,
      "total_amount": 100.00,
      "net_payable": 95.00,
      "payment_mode": "CASH",
      "items": [ { "product_id": 101, "quantity": 2, "unit_price": 5.00, "total": 10.00 } ]
    }
    ```
*   **Success Response (201 Created):** `{ "message": "Bill created", "bill_no": "..." }`

### List Bills
*   **Endpoint:** `/billing/bills?page=1&limit=10`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    {
      "data": [ ...bills... ],
      "total": 150,
      "page": 1,
      "limit": 10
    }
    ```

### Create Customer
*   **Endpoint:** `/billing/customers`
*   **Method:** `POST`
*   **Request Body:** `{ "name": "Ramesh", "mobile": "9988776655" }`
*   **Success Response (201 Created):** `{ "id": 11, "name": "Ramesh", ... }`

### Search Customers
*   **Endpoint:** `/billing/customers?q=search_term`
*   **Method:** `GET`
*   **Success Response (200 OK):** `[ ...customer list... ]`

### My Sales (Today)
*   **Endpoint:** `/billing/my-sales`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    { "sales": 1500.50, "hourly_sales": [ ... ], "recent_bills": [ ... ] }
    ```

### Get Customer Orders
*   **Endpoint:** `/billing/orders`
*   **Method:** `GET`
*   **Success Response (200 OK):** `[ ...list of online orders... ]`

### Update Order Status
*   **Endpoint:** `/billing/orders/:id/status`
*   **Method:** `PUT`
*   **Request Body:** `{ "status": "COMPLETED" }`
*   **Success Response (200 OK):** `{ "message": "Order status updated" }`

---

## 5. Manager (Roles: admin, manager)

### Manager Dashboard
*   **Endpoint:** `/manager/dashboard`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    { "metrics": { ... }, "charts": { ... } }
    ```

### Sales Report
*   **Endpoint:** `/manager/reports/sales?start_date=2024-02-01&end_date=2024-02-10`
*   **Method:** `GET`
*   **Success Response (200 OK):**
    ```json
    { "summary": { "total_revenue": 5000.0 }, "transactions": [ ... ] }
    ```

### Get Store Discount
*   **Endpoint:** `/manager/settings/discount`
*   **Method:** `GET`
*   **Success Response (200 OK):** `{ "percentage": 10.0 }`

### Set Store Discount
*   **Endpoint:** `/manager/settings/discount`
*   **Method:** `POST`
*   **Request Body:** `{ "percentage": 10.0 }`
*   **Success Response (200 OK):** `{ "message": "Global discount updated" }`

### Update Customer Discount
*   **Endpoint:** `/manager/customers/:id/discount`
*   **Method:** `PUT`
*   **Request Body:** `{ "discount_percent": 15.0 }`
*   **Success Response (200 OK):** `{ "message": "Customer discount updated" }`

### Get Customer Rankings
*   **Endpoint:** `/manager/customers`
*   **Method:** `GET`
*   **Description:** List customers sorted by total spend.
*   **Success Response (200 OK):**
    ```json
    [ { "id": 5, "name": "Best Customer", "total_spend": 50000.0, "rank": 1 } ]
    ```

---

## 6. Public (No Auth)

### Get Public Config
*   **Endpoint:** `/public/config`
*   **Method:** `GET`
*   **Description:** Get company logo, name, phone.
*   **Success Response (200 OK):**
    ```json
    { "company_name": "Seyyal", "company_logo": "logo.svg", ... }
    ```

### List Products (Shop)
*   **Endpoint:** `/public/products`
*   **Method:** `GET`
*   **Success Response (200 OK):** `[ ...active products... ]`

### Submit Order
*   **Endpoint:** `/public/orders`
*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "customer_mobile": "9876543210",
      "items": [ { "product_id": 101, "quantity": 5 } ]
    }
    ```
*   **Success Response (200 OK):**
    ```json
    { "message": "Order placed", "order_no": "ORD-...", "whatsapp_url": "..." }
    ```
