# RESTful API Specification

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Base URL:** `/api`  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/DATABASE.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/DATABASE.md)

---

## 1. Global API Conventions

### 1.1 Content Negotiation & Authentication
- All request bodies and response payloads must use `application/json; charset=utf-8`.
- Authentication is strictly stateful via `express-session` cookies (`connect.sid`).
- CSRF Protection: All state-changing requests (`POST`, `PUT`, `DELETE`) require the `X-CSRF-Token` header.
- Cross-User Isolation: Endpoints extract the authenticated `userId` from `req.session.userId`. Any request attempting to access or modify records owned by another user returns `403 Forbidden` or `404 Not Found`.

### 1.2 Standard Success & Error Envelopes
Every response conforms to the standard envelope structure:

```json
// Standard Success Response:
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Standard Error Response:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description of error",
    "field": "daily_hours"
  }
}
```

### 1.3 CSRF Token Endpoint
- **Method / Route:** `GET /api/csrf-token`
- **Auth Required:** No (binds to active session)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "csrfToken": "1f8e...hex"
    }
  }
  ```
- **Description:** Returns the active session's anti-CSRF token. Frontend clients include this value in the `X-CSRF-Token` HTTP header on all mutating requests (`POST`, `PUT`, `DELETE`).

---

## 2. Authentication & User Profile Endpoints

### 2.1 Register New User
- **Method / Route:** `POST /api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "display_name": "Priya Sharma"
  }
  ```
- **Validation:**
  - `email`: Valid email format, maximum 255 chars, unique in database.
  - `password`: String, minimum 8 characters, maximum 72 characters (bcrypt limit).
  - `display_name`: String, 1–100 characters, trimmed of whitespace.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "display_name": "Priya Sharma"
    },
    "message": "Account created successfully"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: `{"code": "EMAIL_EXISTS", "message": "Email is already registered"}`

---

### 2.2 User Login
- **Method / Route:** `POST /api/auth/login`
- **Auth Required:** No
- **Rate Limit:** Maximum 5 failed attempts per IP per 15 minutes.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "display_name": "Priya Sharma"
    },
    "message": "Login successful"
  }
  ```
- **Error Response:**
  - `401 Unauthorized`: `{"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}`

---

### 2.3 User Logout
- **Method / Route:** `POST /api/auth/logout`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

### 2.4 Get Current User Session (`/me`)
- **Method / Route:** `GET /api/auth/me`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "display_name": "Priya Sharma",
      "created_at": "2026-10-30T04:30:00.000Z"
    }
  }
  ```
- **Error Response:**
  - `401 Unauthorized`: User session invalid or expired.

---

### 2.5 Update User Profile
- **Method / Route:** `PUT /api/auth/profile`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "display_name": "Priya Sharma"
  }
  ```
- **Validation:**
  - `display_name`: String, 1–100 characters, trimmed of whitespace.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "display_name": "Priya Sharma"
    },
    "message": "Profile updated successfully"
  }
  ```
- **Error Response:**
  - `400 Bad Request`: `{"code": "INVALID_NAME", "message": "Display name is required (max 100 characters)"}`
  - `401 Unauthorized`: User session invalid or expired.

---

### 2.6 Change Password
- **Method / Route:** `PUT /api/auth/password`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "current_password": "Password123!",
    "new_password": "NewSecretPassword456!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```
- **Error Response:**
  - `400 Bad Request`: `{"code": "INCORRECT_PASSWORD", "message": "Current password does not match"}`

---

### 2.7 Delete Account (Permanent Cascade)
- **Method / Route:** `POST /api/auth/delete-account`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "password": "Password123!",
    "confirmation": "DELETE"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Account and all associated household records permanently erased"
  }
  ```

---

## 3. Appliance Inventory Endpoints

### 3.1 List Appliances
- **Method / Route:** `GET /api/appliances`
- **Auth Required:** Yes
- **Query Parameters (Optional):**
  - `room` (string, e.g., `Kitchen`)
  - `category` (string, e.g., `Cooling`)
  - `search` (string, e.g., `Fan`)
  - `sort_by` (`name` | `monthly_kwh` | `monthly_cost` | `created_at`)
  - `sort_order` (`asc` | `desc`)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Ceiling Fan",
        "category": "Cooling",
        "room": "Living Room",
        "rated_watts": 75.00,
        "quantity": 2,
        "daily_hours": 8.00,
        "days_used_per_month": 30,
        "daily_kwh": 1.20,
        "monthly_kwh": 36.00,
        "monthly_cost": 288.00
      }
    ]
  }
  ```

---

### 3.2 Add New Appliance
- **Method / Route:** `POST /api/appliances`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "Water Heater",
    "category": "Heating",
    "room": "Bathroom",
    "rated_watts": 2000,
    "quantity": 1,
    "daily_hours": 3.0,
    "days_used_per_month": 30
  }
  ```
- **Validation Rules:**
  - `name`: string, 1–100 chars.
  - `rated_watts`: number, $1.0 \le W \le 10000.0$.
  - `quantity`: integer, $1 \le Q \le 50$.
  - `daily_hours`: number, $0.1 \le H \le 24.0$.
  - `days_used_per_month`: integer, $1 \le D \le 31$.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "name": "Water Heater",
      "category": "Heating",
      "room": "Bathroom",
      "rated_watts": 2000.00,
      "quantity": 1,
      "daily_hours": 3.00,
      "days_used_per_month": 30,
      "daily_kwh": 6.00,
      "monthly_kwh": 180.00,
      "monthly_cost": 1440.00
    },
    "message": "Appliance added successfully"
  }
  ```

---

### 3.3 Update Appliance
- **Method / Route:** `PUT /api/appliances/:id`
- **Auth Required:** Yes
- **URL Param:** `id` (integer)
- **Request Body:** Same fields as `POST /api/appliances`.
- **Ownership Verification:** Server verifies `WHERE id = ? AND user_id = ?`.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Appliance updated successfully"
  }
  ```

---

### 3.4 Delete Appliance
- **Method / Route:** `DELETE /api/appliances/:id`
- **Auth Required:** Yes
- **URL Param:** `id` (integer)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Appliance removed from inventory"
  }
  ```

---

### 3.5 Calculate Instant Preview (Stateless)
- **Method / Route:** `POST /api/appliances/preview`
- **Auth Required:** Yes
- **Request Body:** `{ rated_watts, quantity, daily_hours, days_used_per_month }`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "daily_kwh": 1.20,
      "monthly_kwh": 36.00,
      "monthly_cost": 288.00
    }
  }
  ```

---

## 4. Household Dashboard Endpoints

### 4.1 Get Dashboard Summary & Visualizations
- **Method / Route:** `GET /api/dashboard/summary`
- **Auth Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "period": "October 2026",
      "currency_symbol": "₹",
      "tariff_rate": 8.0000,
      "total_appliances": 8,
      "total_monthly_kwh": 468.75,
      "total_estimated_bill": 3750.00,
      "monthly_budget": 3500.00,
      "budget_variance": -250.00,
      "budget_percentage": 107.14,
      "budget_status": "OVER_BUDGET",
      "highest_consumer": {
        "id": 2,
        "name": "Water Heater",
        "room": "Bathroom",
        "monthly_kwh": 180.00,
        "monthly_cost": 1440.00,
        "percentage_of_total": 38.40
      },
      "room_breakdown": [
        { "room": "Bathroom", "appliance_count": 1, "monthly_kwh": 180.00, "cost": 1440.00, "percentage": 38.40 },
        { "room": "Kitchen", "appliance_count": 3, "monthly_kwh": 145.50, "cost": 1164.00, "percentage": 31.04 },
        { "room": "Living Room", "appliance_count": 3, "monthly_kwh": 105.00, "cost": 840.00, "percentage": 22.40 },
        { "room": "Bedroom", "appliance_count": 1, "monthly_kwh": 38.25, "cost": 306.00, "percentage": 8.16 }
      ],
      "top_appliances": [
        { "name": "Water Heater", "room": "Bathroom", "monthly_kwh": 180.00 },
        { "name": "Refrigerator", "room": "Kitchen", "monthly_kwh": 72.00 },
        { "name": "Window AC", "room": "Bedroom", "monthly_kwh": 54.00 },
        { "name": "Ceiling Fan", "room": "Living Room", "monthly_kwh": 36.00 },
        { "name": "Microwave", "room": "Kitchen", "monthly_kwh": 19.50 }
      ]
    }
  }
  ```

---

## 5. Savings Planner (What-If Sandbox) Endpoints

### 5.1 Simulate What-If Scenario
- **Method / Route:** `POST /api/savings/simulate`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "modifications": [
      {
        "appliance_id": 2,
        "proposed_daily_hours": 2.0
      }
    ]
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "baseline_kwh": 468.75,
      "baseline_cost": 3750.00,
      "proposed_kwh": 408.75,
      "proposed_cost": 3270.00,
      "saved_kwh": 60.00,
      "saved_cost": 480.00,
      "proposed_budget_status": "WITHIN_BUDGET"
    }
  }
  ```

---

### 5.2 Apply What-If Scenario to Baseline Records
- **Method / Route:** `POST /api/savings/apply`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "modifications": [
      {
        "appliance_id": 2,
        "daily_hours": 2.0
      }
    ]
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "1 appliance updated. New baseline is now active."
  }
  ```

---

## 6. Reports & Actual Bill Endpoints

### 6.1 Save Monthly Estimate Snapshot
- **Method / Route:** `POST /api/reports/snapshots`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "period_name": "October 2026 Estimate",
    "period_start": "2026-10-01",
    "period_end": "2026-10-31"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "snapshot_id": 12,
      "period_name": "October 2026 Estimate",
      "total_kwh": 468.75,
      "total_cost": 3750.00,
      "created_at": "2026-10-30T10:00:00.000Z"
    },
    "message": "Estimate snapshot preserved successfully"
  }
  ```

---

### 6.2 Log Actual Utility Bill
- **Method / Route:** `POST /api/actual-bills`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "billing_start_date": "2026-10-01",
    "billing_end_date": "2026-10-31",
    "billed_kwh": 490.00,
    "billed_amount": 3950.00,
    "provider_name": "State Electricity Board",
    "notes": "Diwali lighting ran for 5 extra days."
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": { "id": 5, "billed_kwh": 490.00, "billed_amount": 3950.00 },
    "message": "Actual bill recorded successfully"
  }
  ```

---

### 6.3 Reconcile Estimate Snapshot vs Actual Bill
- **Method / Route:** `GET /api/reports/reconcile`
- **Auth Required:** Yes
- **Query Params:** `snapshot_id=12&bill_id=5`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "dates_match": true,
      "period": "2026-10-01 to 2026-10-31",
      "estimate": { "kwh": 468.75, "cost": 3750.00 },
      "actual": { "kwh": 490.00, "cost": 3950.00 },
      "variance": {
        "kwh_difference": 21.25,
        "kwh_percentage": 4.53,
        "cost_difference": 200.00,
        "cost_percentage": 5.33
      },
      "educational_checklist": [
        "Unlisted temporary appliances (e.g. festive lights, room heaters)",
        "Thermostat or compressor duty cycle differences during temperature shifts",
        "Utility provider fixed charges or meter rental fees not included in flat kWh rate"
      ]
    }
  }
  ```

---

### 6.4 Export Active Inventory to CSV
- **Method / Route:** `GET /api/reports/export-csv`
- **Auth Required:** Yes
- **Response Headers:**
  - `Content-Type: text/csv; charset=utf-8`
  - `Content-Disposition: attachment; filename="energysaver_appliances_2026-10-30.csv"`
- **Response Body:** Sanitized CSV text with formula character defense.
