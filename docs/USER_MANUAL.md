# Seyyal User Manual (செயல்)

This manual provides detailed instructions for each role in the Seyyal Billing System, covering public access, billing, management, inventory, and administration.

> **Note:** This document is written in Markdown format. To save as **PDF**, open this file in VS Code or a Markdown editor, press `Cmd+Shift+P`, type "Markdown PDF: Export", and select PDF.

---

## 1. Public Store (`/shop`) - Customer Experience
**Goal:** Allow customers to browse products and place preliminary orders directly from their mobile or computer.

### Steps:
1.  **Access:** Open the application URL and navigate to `/shop` (e.g., `https://seyal-app.web.app/shop`).
2.  **Browse:** Scroll through the list of available products. Use the **Search Bar** at the top to find specific items quickly.
3.  **Add to Cart:** Click the **"Add"** button on any product. You can increase quantities as needed.
4.  **Review Order:** Click the **Cart Icon** (top right) to see your selected items and total estimated cost.
5.  **Checkout:**
    *   Enter your **Name** and **Mobile Number**.
    *   (Optional) Enter your **Address** for delivery.
    *   Click **"Place Order"**.
6.  **Confirmation:** You will see a success message with an **Order Number** (e.g., `ORD-20240214-001`).
    *   A **WhatsApp button** will appear. Click it to send your order details directly to the store for faster processing.

---

## 2. Biller - Point of Sale (POS)
**Goal:** Process sales quickly for walk-in customers or finalize online orders.

### Steps:
1.  **Login:** Enter your Biller credentials (e.g., `BIL001` / `password`).
2.  **Dashboard/Billing Screen:** You will land directly on the **Billing Screen**.
3.  **Add Items:**
    *   **Search**: Type a product name or scan a barcode in the search bar.
    *   **Select**: Click a product card to add it to the bill.
    *   **Quantity**: Adjust quantity using the `+` / `-` buttons.
4.  **Customer Details:**
    *   **Search**: Enter a mobile number to see if the customer exists.
    *   **New**: If not found, click **"Add Customer"** and enter their Name/Mobile.
5.  **Finalize Bill:**
    *   Review the **Total Amount**, **Discount**, and **Net Payable**.
    *   Select **Payment Mode** (Cash, Online, Card).
    *   Click **"Confirm & Print"**.
6.  **Print:** A PDF invoice will be generated automatically for printing.

---

## 3. Manager - Eagle View (Dashboard)
**Goal:** High-level overview of store performance and strategic decision-making.

### Eagle View Dashboard:
1.  **Login:** Enter Manager credentials (e.g., `MGR001` / `password`).
2.  **Top Metrics:** At a glance, see:
    *   **Today's Revenue:** Total sales for the current day.
    *   **Total Orders:** Number of bills generated.
    *   **Low Stock Alerts:** Number of items needing re-order.
    *   **New Customers:** Count of new sign-ups today.
3.  **Charts & Trends:**
    *   **Sales Trend:** Graph showing revenue over the last 7 days.
    *   **Category Performance:** Pie chart of sales by Brand/Category.
    *   **Biller Performance:** Bar chart comparing sales by each biller.
4.  **Actions:**
    *   Navigate to **Reports** for detailed sales history.
    *   Go to **Settings** to set a **Store-Wide Discount** (e.g., "Flat 10% Off").

---

## 4. Inventory - Stock Management
**Goal:** Ensure products are available and catalog is up-to-date.

### Steps:
1.  **Login:** Enter Inventory Manager credentials (e.g., `INV001` / `password`).
2.  **Update Stock (Inward Entry):**
    *   Go to **"Stock Entry"** / **"Add Stock"**.
    *   Select the **Product** from the dropdown.
    *   Enter the **Quantity Received**.
    *   Click **"Update Stock"**. The current stock level will increase instantly.
3.  **Add New Product:**
    *   Go to **"Products"** -> **"Add Product"**.
    *   Fill in **Name**, **Brand**, **Price**, and **Low Stock Limit**.
    *   Click **Save**.
4.  **Check Alerts:**
    *   The **"Low Stock"** tab highlights items that are running out. Prioritize re-ordering these.

---

## 5. Admin - Employee & Security Management
**Goal:** Manage system access and audit logs.

### Steps:
1.  **Login:** Enter Admin credentials (e.g., `ADM001` / `password`).
2.  **Add Employee:**
    *   Go to **"Employees"**.
    *   Click **"Add New Employee"**.
    *   Enter **Username**, **Password**, and select **Role** (Manager, Biller, etc.).
    *   Click **Create**. The system will generate a unique **Employee ID** (e.g., `BIL005`).
3.  **Login History:**
    *   Go to **"Login/Audit Logs"**.
    *   View a list of who logged in, at what time, and from which IP address.
    *   Use this to monitor unusual activity.
4.  **Deactivate Staff:**
    *   If an employee leaves, find them in the list and toggle **"Active"** to **OFF**. They can no longer log in.
