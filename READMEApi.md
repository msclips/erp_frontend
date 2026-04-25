# Sonu CRM Backend API Documentation

This document provides a comprehensive guide to the API endpoints available in the Sonu CRM backend.

**Base URL**: `http://localhost:4000/api`

---

## Response Format
Most endpoints follow a standard response structure:
```json
{
  "status": true,
  "message": "Operation successful",
  "code": 200,
  "data": { ... }
}
```

---

## 1. Authentication
Endpoints for user management and access control.

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**: `{ "username": "admin", "password": "Password@123", "repeatPassword": "Password@123" }`

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**: `{ "username": "admin", "password": "Password@123" }`
- **Response**: Returns a JWT `token` and `user` object.

### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`

---

## 2. Customer Module
Manage customers and their contact/address details.

### Create Customer
- **URL**: `/customer/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "display_name": "Test Customer Inc.",
  "customer_type": 1,
  "email": "test@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zip_code": "400001",
  "country": "India",
  "contact_person": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "work_phone": "9999999999"
    }
  ]
}
```
- **Response**:
```json
{
  "status": true,
  "message": "Customer created successfully",
  "code": 201,
  "data": { "id": 1, "display_name": "Test Customer Inc.", ... }
}
```

---

## 3. Vendor Module
Manage vendors, bank details, and contact persons.

### Create Vendor
- **URL**: `/vendor/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "display_name": "Global Supplies Ltd",
  "vendor_type": "Business",
  "email": "orders@globalsupplies.com",
  "phone": "1234567890",
  "bank": [
    {
      "bank_name": "HDFC Bank",
      "account_number": "50100123456789",
      "ifsc_code": "HDFC0000123"
    }
  ],
  "contact_person": [
    {
      "first_name": "Alice",
      "last_name": "Smith",
      "email": "alice@globalsupplies.com"
    }
  ]
}
```
- **Response**:
```json
{
  "status": true,
  "message": "Vendor created successfully",
  "code": 201,
  "data": { "id": 1, "display_name": "Global Supplies Ltd", ... }
}
```

---

## 4. Quotation Module
Manage sales estimations and quotes.

### Create Quotation
- **URL**: `/quotation/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "customer_id": 1,
  "quotation_date": "2026-03-21",
  "expiry_date": "2026-04-20",
  "subject": "Quote for Project Alpha",
  "items": [
    { "item_id": 1, "quantity": 10, "rate": 500, "amount": 5000 }
  ],
  "total": 5000
}
```
- **Response**:
```json
{
  "status": true,
  "message": "QT-0001 created successfully",
  "code": 201,
  "data": { "id": 1, "quotation_no": "QT-0001", ... }
}
```

---

## 5. Purchase Order Module
Manage procurement orders.

### Create Purchase Order
- **URL**: `/purchaseorder/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "vendor_id": 1,
  "date": "2026-03-21",
  "purchase_order_detail": [
    { "item_id": 1, "quantity": 100, "rate": 80, "amount": 8000 }
  ],
  "total": 8000
}
```
- **Response**:
```json
{
  "status": true,
  "message": "PO-0001 created successfully",
  "code": 201,
  "data": { "id": 1, "purchase_order_no": "PO-0001", ... }
}
```

---

## 6. Sales Order Module
Manage confirmed customer orders.

### Create Sales Order
- **URL**: `/salesorder/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "customer_id": 1,
  "sales_order_date": "2026-03-21",
  "expected_shipment_date": "2026-03-25",
  "reference": "SO-REF-101",
  "items": [
    { "item_id": 1, "quantity": 5, "rate": 100, "amount": 500 }
  ],
  "total": 500
}
```
- **Response**:
```json
{
  "status": true,
  "message": "SO-0001 created successfully",
  "code": 201,
  "data": { "id": 1, "sales_order_no": "SO-0001", ... }
}
```

---

---

## 7. Invoice Module
Manage billing and payments tracking.

### Create Invoice
- **URL**: `/invoice/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "customer_id": 1,
  "invoice_date": "2026-03-21",
  "due_date": "2026-04-05",
  "items": [
    { "item_id": 1, "quantity": 1, "rate": 1500, "amount": 1500 }
  ],
  "total": 1500
}
```
- **Response**:
```json
{
  "status": true,
  "message": "INV-0001 created successfully",
  "code": 201,
  "data": { "id": 1, "invoice_no": "INV-0001", "amount_paid": 0, "status": "pending", ... }
}
```

---

## 8. Payment Received Module
Record and apply customer payments.

### Record Payment
- **URL**: `/payment-received/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "customer_id": 1,
  "payment_date": "2026-03-21",
  "amount_received": 1000,
  "payment_mode": "cash",
  "deposit_to": "undeposited",
  "reference": "REF-7788",
  "details": [
    { "invoice_id": 1, "amount_applied": 1000 }
  ]
}
```
- **Response**:
```json
{
  "status": true,
  "message": "PR-0001 recorded successfully",
  "code": 201,
  "data": { "id": 1, "payment_no": "PR-0001", ... }
}
```

---

---

## 9. Item Module
Manage products and services.

### Create Item
- **URL**: `/item/store`
- **Method**: `POST`
- **Request Body**:
```json
{
  "name": "Widget Pro",
  "unit_id": 1,
  "selling_price": 1500,
  "description": "High-performance widget",
  "item_type": "Sales",
  "tax_id": 1
}
```
- **Response**:
```json
{
  "status": true,
  "message": "Item created successfully",
  "code": 201,
  "data": { "id": 1, "name": "Widget Pro", ... }
}
```

---

## 10. Common Actions (All Modules)
Standard endpoints for full lifecycle management across all modules.

- **List (Datatable)**: `GET /<module>/datatable?page=1&limit=10`
- **Show Single**: `GET /<module>/show/:id`
- **Update**: `PUT/POST /<module>/update` (Include `id` in JSON body)
- **Delete**: `DELETE /<module>/delete/:id`
- **Autocomplete**: `GET /<module>/autocomplete` (Where applicable)

---

## 11. Configuration & Metadata
- **Units**: `/unit` (CRUD)
- **Account Types**: `/account-type` (CRUD)
- **Chart of Accounts**: `/chart-of-account` (CRUD)
- **GST Configuration**: `/gstconfiguration/tax-status`, `/gstconfiguration/gst-rate`
