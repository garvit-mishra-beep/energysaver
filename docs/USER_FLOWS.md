# User Flows & Interaction Workflows

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/FEATURES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/FEATURES.md)

---

## 1. Flow 1: Registration, Login & First-Time Onboarding

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser as Client UI
    participant Server as Express Server
    participant DB as MySQL Database

    User->>Browser: Enters email, name, password on /register.html
    Browser->>Browser: Validates client inputs (email format, pass >= 8 chars)
    Browser->>Server: POST /api/auth/register {email, name, password}
    Server->>DB: Check if email exists
    alt Email already registered
        DB-->>Server: Duplicate record found
        Server-->>Browser: 409 Conflict {"message": "Email is already registered"}
        Browser-->>User: Displays inline error on email field
    else Email available
        Server->>Server: Hash password with bcrypt (10 rounds)
        Server->>DB: INSERT INTO users & INSERT INTO user_settings (defaults)
        DB-->>Server: Success (user_id generated)
        Server->>Server: Create session (req.session.userId = user_id)
        Server-->>Browser: 201 Created {"success": true, "user": {...}}
        Browser->>Browser: Redirects to /index.html (My Home)
        Browser-->>User: Displays Welcome Banner + Empty State with "Add Your First Appliance"
    end
```

### Detailed Steps:
1. **Entry Point:** User visits `/login.html` or `/register.html`.
2. **Input Fields:** Display Name, Email Address, Password, Confirm Password.
3. **Client Validation:** Instant visual feedback (red border + message) if passwords mismatch or password is $<8$ characters.
4. **Onboarding State:** Upon first login, user has 0 appliances. Dashboard displays a warm onboarding card:
   > *"Welcome to EnergySaver! To begin understanding your home's electricity usage, start by adding your major appliances (fans, refrigerator, geyser) or choose from common presets."*
   > **[Add Your First Appliance]** (Primary green button)

---

## 2. Flow 2: Appliance Inventory Management

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Appliances Page
    participant Modal as Appliance Modal
    participant API as Express API
    participant DB as MySQL

    User->>UI: Clicks "Add Appliance"
    UI->>Modal: Opens with default blank fields
    alt User clicks a Preset (e.g., "Ceiling Fan (75W)")
        User->>Modal: Selects Preset from dropdown
        Modal->>Modal: Auto-populates Name="Ceiling Fan", Category="Cooling", Watts=75, Hours=10
        Modal->>Modal: Displays badge: "Sample average values. Check label on your fan."
    end
    User->>Modal: Modifies Quantity=2, Daily Hours=8, Days/Month=30
    Modal->>Modal: Live Preview updates: "1.20 kWh/day • 36.00 kWh/month • ₹288.00/month"
    User->>Modal: Clicks "Save Appliance"
    Modal->>API: POST /api/appliances {name, category, room, wattage, quantity, daily_hours, days_used}
    API->>API: Server-side validation (types, ranges, session auth)
    API->>DB: INSERT INTO appliances (user_id, ...)
    DB-->>API: 201 Created (insertId)
    API-->>Modal: 201 Created {appliance}
    Modal->>UI: Closes modal, inserts new row into table, updates summary banner
    UI-->>User: Toast alert: "Ceiling Fan added to Living Room"
```

### Edge Cases & Alternate Paths:
- **Validation Failure:** User inputs $0$ or negative wattage. Frontend highlights input in red: *"Wattage must be between 1 and 10,000 Watts"*. Form submission is blocked.
- **Editing Appliance:** User clicks "Edit" icon on table row. Modal loads existing appliance values. Submits `PUT /api/appliances/:id`. Backend verifies `appliance.user_id === session.userId`.
- **Deleting Appliance:** User clicks "Delete" icon. Modal asks: *"Are you sure you want to remove 'Water Heater'? This will update your monthly estimates immediately."* User confirms $\rightarrow$ `DELETE /api/appliances/:id` $\rightarrow$ Row fades out, summary metrics recalculate.

---

## 3. Flow 3: Dashboard Overview & Budget Monitoring

```mermaid
graph TD
    A[User visits /index.html] --> B{Authenticated?}
    B -- No --> C[Redirect to /login.html]
    B -- Yes --> D[Fetch /api/dashboard/summary]
    D --> E{Any appliances exist?}
    E -- No --> F[Render Helpful Empty State Card]
    E -- Yes --> G[Render Summary Cards: Total kWh, Estimated Bill, Top Appliance]
    G --> H{Budget configured?}
    H -- No --> I[Show 'Set a monthly budget' link]
    H -- Yes --> J{Check Budget Ratio}
    J -- Estimated < 80% --> K[Display Green Status: Budget on track]
    J -- 80% <= Estimated <= 100% --> L[Display Amber Alert: Approaching monthly budget]
    J -- Estimated > 100% --> M[Display Red Alert: You're ₹X over your budget]
    G --> N[Render Room Breakdown Donut Chart & Top 5 Bar Chart]
```

### Alert Wording Guidelines:
- **Approaching Budget:** *"Notice: Your estimated bill of ₹3,420 is approaching your monthly budget of ₹3,500 (97.7% of budget)."*
- **Over Budget:** *"Attention: Your estimated bill of ₹4,150 exceeds your monthly budget of ₹3,500 by ₹650. Explore the Savings Planner to find opportunities to reduce usage."*

---

## 4. Flow 4: What-If Savings Planner (Experimentation Sandbox)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as Savings Page (/savings.html)
    participant Engine as Client Calculation Engine
    participant API as Express API
    participant DB as MySQL

    User->>Page: Navigates to Savings Planner
    Page->>API: GET /api/appliances (fetches saved baseline appliances)
    API-->>Page: 200 OK (Array of saved appliances)
    Page->>Page: Clones baseline into in-memory sandbox array
    User->>Page: Adjusts "Water Heater" daily hours from 1.5h to 1.0h
    Page->>Engine: recalculateScenario(sandboxAppliances)
    Engine-->>Page: Proposed kWh, Proposed Bill, Net Savings
    Page->>Page: Updates Comparison UI:
    Note over Page: Baseline: 420 kWh (₹3,360)<br/>Proposed: 397.5 kWh (₹3,180)<br/>Estimated Savings: 22.5 kWh/month (₹180.00/month)
    alt User clicks "Reset Changes"
        User->>Page: Clicks "Reset"
        Page->>Page: Restores sandbox clone from saved baseline; UI resets
    else User clicks "Apply Changes to Appliances"
        User->>Page: Clicks "Apply Changes"
        Page->>Page: Displays confirmation modal: "This will update daily operating hours for Water Heater in your saved appliances list."
        User->>Page: Confirms modal
        Page->>API: POST /api/appliances/batch-update {updates: [{id: 4, daily_hours: 1.0}]}
        API->>DB: UPDATE appliances SET daily_hours = 1.0 WHERE id = 4 AND user_id = ?
        DB-->>API: Success
        API-->>Page: 200 OK
        Page-->>User: Toast alert: "Appliances updated successfully. Your new baseline is active."
    end
```

### Safety Rule:
*Under no circumstances do sliders, input changes, or trial numbers in the Savings Planner write to the database until the user explicitly confirms the "Apply Changes to Appliances" dialog.*

---

## 5. Flow 5: Report Snapshot Generation & Actual Bill Reconciliation

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Rep as Reports Page (/reports.html)
    participant API as Express API
    participant DB as MySQL

    User->>Rep: Clicks "Save Current Estimate as Snapshot"
    Rep->>Rep: Prompts for Period Name (e.g., "October 2026")
    Rep->>API: POST /api/reports/snapshots {period_name: "October 2026", period_start, period_end}
    API->>DB: Fetch user appliances & current settings
    API->>API: Calculate authoritative totals & generate immutable payload
    API->>DB: INSERT INTO report_snapshots & INSERT INTO report_snapshot_items
    DB-->>API: 201 Created (snapshot_id)
    API-->>Rep: 201 Created {snapshot}
    Rep-->>User: Toast: "Snapshot saved! Historical records will not change if you edit appliances later."

    User->>Rep: Clicks "Log Actual Utility Bill"
    Rep->>Rep: Opens modal: Dates (Oct 1 - Oct 31), Billed Units: 440 kWh, Amount: ₹3,620
    Rep->>API: POST /api/actual-bills {...}
    API->>DB: INSERT INTO actual_bills
    DB-->>API: 201 Created
    API-->>Rep: 201 Created

    User->>Rep: Selects "Compare October 2026 Estimate vs Actual"
    Rep->>API: GET /api/reports/reconcile?snapshot_id=12&bill_id=5
    API-->>Rep: 200 OK {variance_kwh: +20, variance_cost: +₹260, percentage: +4.7%}
    Rep-->>User: Displays side-by-side reconciliation card and objective educational checklist
```

---

## 6. Flow 6: User Settings, Password Change & Account Deletion

### Step-by-Step Account Deletion:
1. User navigates to `/settings.html` $\rightarrow$ scrolls to the "Danger Zone" card at the bottom.
2. User clicks red outline button: **"Delete My Account and All Data"**.
3. A modal opens with prominent cautionary styling:
   > *"Are you sure you want to delete your account? This action is permanent and cannot be undone. All your appliances, historical reports, actual bills, and settings will be permanently erased."*
4. Modal requires user to enter their current password and type the confirmation word `DELETE`.
5. User submits form $\rightarrow$ `POST /api/auth/delete-account` with `{password, confirmation: "DELETE"}`.
6. Backend verifies password hash. If verified:
   - Executes `DELETE FROM users WHERE id = ?`.
   - MySQL foreign keys with `ON DELETE CASCADE` automatically delete rows in `appliances`, `user_settings`, `report_snapshots`, `report_snapshot_items`, `actual_bills`, and active sessions in `sessions`.
7. Backend destroys session and clears cookie.
8. User is redirected to `/index.html` with a notification: *"Your account and data have been permanently removed."*
