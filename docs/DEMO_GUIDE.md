# Academic Demonstration & Viva Examination Guide

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Target Audience:** Project Evaluators, Professors, and Student Presenters  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/CALCULATIONS.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/CALCULATIONS.md)

---

## 1. Teacher Demonstration Script (5–7 Minute Walkthrough)

### Step 1: The Problem & Opening Pitch (Time: 0:00 – 1:00)
> *"Good morning, Professor. In almost every household, we receive a single electricity bill at the end of the month showing total units consumed and total money owed. However, that bill is a black box—it doesn't tell us how much our refrigerator, air conditioner, or water heater contributed.*  
> *EnergySaver is an educational web application that solves this by disaggregating household electricity usage, helping families understand where energy goes, visualize room-by-room costs, test what-if savings habits, and compare estimates against actual bills."*

---

### Step 2: Account Creation & Onboarding (Time: 1:00 – 2:00)
- **Action:** Open browser at `http://localhost:3000`. Navigate to **Sign Up**.
- **Demonstration:** Register an account:
  - Name: `Priya Sharma`
  - Email: `priya@example.com`
  - Password: `Password123!`
- **Highlight:** Show the welcoming empty state on the **My Home** dashboard:
  > *"Notice how the interface immediately guides the user without assuming prior electrical engineering knowledge. It displays an empty state explaining how to get started."*

---

### Step 3: Appliance Inventory & Presets (Time: 2:00 – 3:30)
- **Action:** Navigate to **Appliances** $\rightarrow$ Click **[+ Add Appliance]**.
- **Demonstration:**
  1. Open Preset dropdown $\rightarrow$ Select **"Ceiling Fan (75W)"**.
  2. Point out the educational badge: *"Sample average value. Check your appliance label."*
  3. Set Quantity = `2`, Daily Hours = `10.0`, Room = `Living Room`.
  4. Show the **Live Preview** updating instantly: `1.50 kWh/day • 45.00 kWh/month • ₹360.00/month`. Click **Save**.
  5. Add **Water Heater** (2000W, Qty: 1, Hours: 3.0, Room: Bathroom).
  6. Add **Refrigerator** (150W, Qty: 1, Hours: 16.0, Room: Kitchen).
- **Talking Point:**
  > *"All inputs are validated both client-side for immediate feedback and server-side using parameterized queries to protect against invalid data or SQL injection."*

---

### Step 4: Dashboard, Budgeting & Visualizations (Time: 3:30 – 4:30)
- **Action:** Return to **My Home** (`/index.html`).
- **Demonstration:**
  - Total Monthly Consumption: `322.80 kWh`.
  - Estimated Monthly Bill: `₹2,582.40` (calculated at user-configured ₹8.00/kWh).
  - Monthly Budget: `₹3,500.00` $\rightarrow$ Status: **Within Budget (₹917.60 remaining)**.
  - Show the **Chart.js Donut Chart** illustrating that the Bathroom (Water Heater) accounts for over $55\%$ of total household electricity.

---

### Step 5: What-If Savings Planner (Time: 4:30 – 5:30)
- **Action:** Click the **"Savings Experiment"** button in the header (or modal launcher on My Home).
- **Demonstration:**
  1. Select **Water Heater** from the dropdown.
  2. Adjust daily operating hours slider from `3.0 hrs` down to `2.0 hrs` (reducing heating by 1 hour/day).
  3. Show the side-by-side comparison:
     - Baseline: `322.80 kWh` (`₹2,582.40`)
     - Proposed: `262.80 kWh` (`₹2,102.40`)
     - **Estimated Monthly Savings: 60.00 kWh (Save ₹480.00 / month)**.
  4. **Key Examiner Emphasis:** 
     > *"Notice that moving these sliders does not alter our active database records. It runs in an isolated sandbox until the user deliberately clicks 'Apply Changes to Appliances'."*

---

### Step 6: Reports, Snapshots & Actual Bill Reconciliation (Time: 5:30 – 6:30)
- **Action:** Navigate to **Reports** (`/reports.html`).
- **Demonstration:**
  1. Click **"Save Current Estimate as Snapshot"** for `October 2026`.
  2. Explain that the snapshot is stored in immutable tables (`report_snapshots` and `report_snapshot_items`). Future edits to appliances will never alter this historical record.
  3. Click **"Log Actual Utility Bill"**:
     - Dates: `Oct 1, 2026 - Oct 31, 2026`
     - Billed Units: `340.00 kWh`
     - Billed Amount: `₹2,720.00`
  4. Click **Reconcile**: Show variance ($+17.20\text{ kWh}$, $+₹137.60$) alongside the educational checklist explaining typical reasons for variance (weather shifts, unlisted festive lights, or utility meter fees).
  5. Demonstrate **Print View** (clean A4 layout hiding navigation) and **Export CSV**.

---

## 2. Standard Demonstration Test Data

The following benchmark dataset reflects the reference household specified in docs/CALCULATIONS.md (Total: **322.80 kWh**, **₹2,582.40** at ₹8.00/kWh, Budget: **₹3,500.00**):

| Appliance Name | Room | Category | Rated Watts | Qty | Hours/Day | Days/Mo | Monthly kWh | Est. Cost (@ ₹8/u) | Share (%) |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Water Heater** | Bathroom | Heating | 2000 W | 1 | 3.0 | 30 | 180.00 kWh | ₹1,440.00 | 55.76% |
| **Refrigerator** | Kitchen | Refrigeration | 250 W | 1 | 12.0 | 30 | 90.00 kWh | ₹720.00 | 27.88% |
| **Ceiling Fans** | Living Room | Cooling | 75 W | 2 | 8.0 | 30 | 36.00 kWh | ₹288.00 | 11.15% |
| **Television** | Living Room | Entertainment | 80 W | 1 | 4.0 | 30 | 9.60 kWh | ₹76.80 | 2.97% |
| **LED Bulbs** | Living Room | Lighting | 10 W | 4 | 6.0 | 30 | 7.20 kWh | ₹57.60 | 2.23% |
| **TOTALS** | - | - | - | - | - | - | **322.80 kWh** | **₹2,582.40** | **100.00%** |

---

## 3. Anticipated Viva Examination Questions & Model Answers

### Q1: Why did you choose Vanilla JavaScript instead of a modern framework like React, Vue, or Next.js?
**Model Answer:**  
> *"As a student project, using Vanilla JavaScript and HTML5 ensures that I understand the core fundamentals of the DOM, event lifecycle, and asynchronous Fetch API without abstracting them away. It also eliminates heavy build toolchains, node_modules bloat, and hydration overhead. The application loads in under 150 KB, runs blazingly fast on any device, and is completely explainable from first principles."*

---

### Q2: How does EnergySaver prevent SQL Injection attacks?
**Model Answer:**  
> *"We strictly enforce 100% parameterized queries using `mysql2/promise`. We never concatenate user inputs into SQL strings. When executing queries like `db.execute('SELECT * FROM appliances WHERE user_id = ? AND id = ?', [userId, applianceId])`, the database engine compiles the SQL execution plan first and treats user parameters purely as literals, rendering SQL injection mathematically impossible."*

---

### Q3: What happens to historical reports if a user edits or deletes an appliance next month?
**Model Answer:**  
> *"Historical reports remain completely unchanged. When a user saves an estimate, the server serializes the current calculation results and appliance parameters into dedicated, immutable snapshot tables (`report_snapshots` and `report_snapshot_items`). The active appliances table represents the present state, while snapshot tables preserve historical baselines. Even if all current appliances are deleted, past snapshots remain intact."*

---

### Q4: What is the physical difference between Watts and Kilowatt-Hours?
**Model Answer:**  
> *"Watts measure instantaneous electrical power—the rate of energy consumption at a single point in time. Kilowatt-hours (kWh) measure energy consumed over time. One kilowatt-hour equals 1,000 Watts operating continuously for one hour ($1\text{ kW}\times 1\text{ hour}$). Utility companies bill customers for energy in kilowatt-hours, commonly referred to on utility bills as 'units'."*

---

### Q5: How do you handle cross-user data authorization (IDOR)?
**Model Answer:**  
> *"Every single API endpoint that reads, updates, or deletes private data extracts the authenticated `user_id` directly from the secure server-side session (`req.session.userId`), never from the request body or URL parameters. Every SQL query includes `WHERE user_id = ?`. If an attacker attempts to modify an appliance with ID `42` belonging to another user, the query matches zero rows and returns `404 Not Found`."*

---

### Q6: What are the primary limitations of EnergySaver?
**Model Answer:**  
> *"EnergySaver is an educational estimation tool, not a live IoT monitoring platform. It does not measure physical power lines or connect to smart meters. Intermittent appliances like air conditioners and refrigerators cycle their compressors on and off depending on ambient room temperature, so nameplate wattage represents maximum peak power rather than continuous draw. We explicitly communicate these estimation assumptions to users in the interface."*
