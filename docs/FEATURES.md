# Feature Inventory & Traceability Matrix

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md)

---

## 1. Feature Classification Framework

Features are categorized using the standard MoSCoW prioritization model and mapped directly to implementation release tiers:
- **Core Release (Must Have):** Critical path features required for a functional, robust student demonstration.
- **Later Enhancements (Should/Could Have):** High-value advanced modules scheduled for Phase 6 after core verification.

---

## 2. Core Release Feature Inventory

| Req ID | Feature Name | Priority | Release | Dependencies | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | Account Registration | Must Have | Core | None | User creates an account with email, display name, and password. | 1. Rejects invalid email formats.<br>2. Requires password $\ge 8$ characters.<br>3. Rejects duplicate emails with friendly error.<br>4. Redirects to dashboard upon creation. |
| **REQ-AUTH-02** | Secure Authentication | Must Have | Core | REQ-AUTH-01 | User logs in and out with bcrypt password verification and server sessions. | 1. Passwords hashed using bcrypt ($\ge 10$ salt rounds).<br>2. Session saved in MySQL session store.<br>3. Destroys session cookie on logout.<br>4. Rejects invalid credentials with generic message. |
| **REQ-AUTH-03** | User Profile & Password Change | Must Have | Core | REQ-AUTH-02 | User updates display name, preferred currency, or changes password. | 1. Password change requires verifying current password.<br>2. Currency update updates all UI formatting.<br>3. Input sanitization prevents XSS. |
| **REQ-AUTH-04** | Account Deletion | Must Have | Core | REQ-AUTH-02 | User permanently purges account and all associated household records. | 1. Requires explicit password confirmation modal.<br>2. Cascades deletion to appliances, settings, reports, bills, and active sessions.<br>3. Redirects to public home with confirmation. |
| **REQ-APP-01** | Add & Edit Appliance | Must Have | Core | REQ-AUTH-02 | Add or update appliance with name, category, room, wattage, quantity, hours/day, days/month. | 1. Validates numerical ranges ($1 \le W \le 10,000$, $1 \le Q \le 50$, $0.1 \le H \le 24$, $1 \le D \le 31$).<br>2. Enforces user ownership check in SQL.<br>3. Live preview recalculates on input change. |
| **REQ-APP-02** | Editable Presets | Must Have | Core | REQ-APP-01 | One-click preset loader with common household appliances (Fan, TV, Geyser, Fridge). | 1. Populates form fields instantly.<br>2. All values remain fully editable by user.<br>3. Displays educational disclaimer badge indicating presets are estimates. |
| **REQ-APP-03** | List, Search & Filter Appliances | Must Have | Core | REQ-APP-01 | View household inventory with dynamic filtering by Room and Category, and search by Name. | 1. Filters without full page reload.<br>2. Sorting by Name, Daily kWh, and Monthly Cost.<br>3. Displays clean empty state if no appliances match filter. |
| **REQ-APP-04** | Delete Appliance | Must Have | Core | REQ-APP-01 | Remove an appliance with confirmation. | 1. Shows confirmation dialog before deletion.<br>2. Deletes record from database.<br>3. Automatically refreshes dashboard and total sums. |
| **REQ-CALC-01** | Core Calculation Engine | Must Have | Core | REQ-APP-01 | Authoritative backend computation of Daily kWh, Monthly kWh, and Flat-Rate Cost. | 1. Daily $\text{kWh} = (W \times Q \times H) / 1000$.<br>2. Monthly $\text{kWh} = \text{Daily kWh} \times D$.<br>3. Cost $= \text{Monthly kWh} \times \text{Rate}$.<br>4. Unit test suite passes all precision tests. |
| **REQ-HOME-01** | Household Overview Dashboard | Must Have | Core | REQ-CALC-01 | Summary cards showing Total kWh, Estimated Bill, Active Budget status, and Top Consumer. | 1. Accurately sums household totals.<br>2. Identifies appliance with highest monthly kWh.<br>3. Formats all monetary values with selected currency symbol. |
| **REQ-HOME-02** | Consumption Charts | Must Have | Core | REQ-HOME-01 | Visual breakdown using Chart.js (Donut chart for Room share, Bar chart for Top 5 appliances). | 1. Accessible chart legends.<br>2. Tooltip shows both kWh and percentage share.<br>3. Gracefully handles 0 appliances with empty graphic. |
| **REQ-BUDG-01** | Monthly Budget Tracking | Must Have | Core | REQ-HOME-01 | User sets target monthly budget in Settings; dashboard displays remaining balance or deficit. | 1. Allows setting numeric budget $> 0$.<br>2. Computes difference: $\text{Budget} - \text{Estimated Bill}$.<br>3. Updates immediately upon tariff or appliance change. |
| **REQ-BUDG-02** | Budget Warning Alerts | Must Have | Core | REQ-BUDG-01 | In-app warning banners for approaching and exceeded budgets. | 1. If spend $\ge 80\%$ and $\le 100\%$: Amber warning banner.<br>2. If spend $> 100\%$: Red alert banner ("You're [Amount] over your budget").<br>3. If budget is unconfigured, displays subtle prompt to set budget. |
| **REQ-SAVE-01** | What-If Scenario Sandbox | Must Have | Core | REQ-APP-01, REQ-CALC-01 | Experiment with reducing hours/days of appliances without altering saved records. | 1. Sliders/inputs allow temporary schedule adjustments.<br>2. Shows live side-by-side comparison table (Current vs. Proposed vs. Saved).<br>3. Changes discarded on page navigate unless user clicks "Apply Changes". |
| **REQ-REP-01** | Immutable Report Snapshot | Must Have | Core | REQ-CALC-01 | Capture and store a complete, unmodifiable snapshot of household estimate for a month. | 1. Stores complete appliance array, rates, budget, and totals as JSON.<br>2. Subsequent edits to appliances or rates do not alter past snapshot records.<br>3. User can view historical snapshots from list. |
| **REQ-REP-02** | Actual Bill Logging | Must Have | Core | REQ-AUTH-02 | Manually record actual utility bills (Start Date, End Date, Billed kWh, Billed Amount, Notes). | 1. Validates End Date $\ge$ Start Date.<br>2. Stores historical actual bills linked to user account.<br>3. Allows editing or deleting past actual bill entries. |
| **REQ-REP-03** | Estimate vs. Actual Comparison | Must Have | Core | REQ-REP-01, REQ-REP-02 | Compare a saved estimate snapshot with an actual utility bill covering matching dates. | 1. Calculates absolute and percentage variance for kWh and cost.<br>2. Displays objective educational guide explaining potential variance sources.<br>3. Warns user if date ranges do not align. |
| **REQ-REP-04** | CSV Export & Print Styling | Must Have | Core | REQ-APP-01, REQ-REP-01 | Export active appliance inventory to CSV and provide clean browser print styling. | 1. CSV export sanitizes formulas (`=`, `+`, `-`, `@`).<br>2. Print stylesheet hides navigation, buttons, and optimizes layout for A4/Letter paper. |
| **REQ-TIPS-01** | Contextual Educational Tips | Must Have | Core | REQ-HOME-01 | Rule-based energy conservation tips rendered based on user's specific high consumers. | 1. Triggers geyser tip if geyser consumption $> 20\%$ of total.<br>2. Explains power (W) vs energy (kWh).<br>3. Displays potential savings using user's actual configured tariff. |
| **REQ-SETT-01** | System Settings & Tariff Config | Must Have | Core | REQ-AUTH-02 | Configure flat electricity rate per kWh, default room list, and currency symbol. | 1. Supports positive rates with up to 4 decimal places ($0.0001 \le \text{rate} \le 100$).<br>2. Configurable currency (`₹`, `$`, `€`, `£`, etc.).<br>3. Persists settings to `user_settings` table. |

---

## 3. Later Enhancements Feature Inventory (Phase 6)

| Req ID | Feature Name | Priority | Release | Dependencies | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-ENH-01** | Progressive Tariff Slabs | Should Have | Enhancement | REQ-CALC-01, REQ-SETT-01 | Multi-tier stepped billing with optional fixed meter charges and percentage tax. | 1. Each consumption segment charged at its respective slab rate.<br>2. Supports fixed monthly charges and taxable base calculations.<br>3. Accurately recalculates total household bill for savings scenarios. |
| **REQ-ENH-02** | Duty Cycle & Compressor Modeling | Should Have | Enhancement | REQ-APP-01, REQ-CALC-01 | Duty cycle percentage ($1\%\text{--}100\%$) for cycling loads (refrigerators, ACs). | 1. Effective Hours $= \text{Total Hours} \times (\text{Duty Cycle} / 100)$.<br>2. Prevents double-multiplication.<br>3. Clearly labelled explanations of duty cycle. |
| **REQ-ENH-03** | Split Weekday/Weekend Schedules | Could Have | Enhancement | REQ-APP-01, REQ-CALC-01 | Distinct daily operating hours for weekdays (5 days) vs. weekends (2 days). | 1. Weekly $\text{Hours} = (5 \times H_{\text{weekday}}) + (2 \times H_{\text{weekend}})$.<br>2. Normalizes to monthly operating days.<br>3. Collapsed by default under advanced options. |
| **REQ-ENH-04** | Standby Power Tracking | Could Have | Enhancement | REQ-APP-01, REQ-CALC-01 | Separate standby wattage and standby hours for home entertainment/appliances. | 1. Enforces $H_{\text{active}} + H_{\text{standby}} \le 24.0$.<br>2. Calculates standby energy separately and sums into appliance total.<br>3. Highlights phantom load costs. |
| **REQ-ENH-05** | Appliance Replacement Payback | Should Have | Enhancement | REQ-APP-01, REQ-SETT-01 | Financial comparison between existing appliance and proposed high-efficiency model. | 1. Calculates Annual Savings $= (\text{Old kWh} - \text{New kWh}) \times \text{Rate} \times 12$.<br>2. Payback Years $= \text{Purchase Cost} / \text{Annual Savings}$.<br>3. Shows "Not Applicable" if savings $\le 0$. |
| **REQ-ENH-06** | Household Savings Goals | Could Have | Enhancement | REQ-BUDG-01, REQ-REP-01 | Set a percentage or absolute kWh reduction target against a saved baseline month. | 1. Links target to specific historical report snapshot.<br>2. Visual progress bar showing estimated reduction.<br>3. Explains that progress is based on estimated modeling. |
| **REQ-ENH-07** | Isolated Demo Mode | Should Have | Enhancement | None | Pre-populated 2-BHK apartment demo environment with isolated mock session. | 1. Clear persistent badge: "Demo Mode - Read Only Sample Data".<br>2. Does not touch MySQL production tables.<br>3. Reset button restores initial demo state. |
| **REQ-ENH-08** | Backup & Restore Data | Could Have | Enhancement | REQ-APP-01, REQ-SETT-01 | Export all user data as formatted JSON and import with schema validation. | 1. Validates JSON schema before import.<br>2. Prompts user to choose: "Merge with Existing" or "Replace Existing".<br>3. Enforces strict user ownership assignment. |
