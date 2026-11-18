# Test Plan & Quality Assurance Specifications

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/FEATURES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/FEATURES.md)

---

## 1. Testing Strategy Overview

This document outlines the comprehensive test suite designed to verify the functional correctness, mathematical accuracy, security posture, accessibility, and resilience of EnergySaver. Every test case is explicitly mapped to a stable requirement ID from [docs/FEATURES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/FEATURES.md).

---

## 2. Test Case Traceability Matrix

### 2.1 Mathematical Calculation Test Suite (CALC)

| Test ID | Req ID | Test Description | Inputs & Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-CALC-01** | REQ-CALC-01 | Standard Daily kWh Calculation | $W = 2000, Q = 1, H = 3.0$ | $\text{Daily kWh} = 6.00\text{ kWh}$. |
| **TC-CALC-02** | REQ-CALC-02 | Standard Monthly kWh Calculation | $\text{Daily kWh} = 6.00, D = 30$ | $\text{Monthly kWh} = 180.00\text{ kWh}$. |
| **TC-CALC-03** | REQ-CALC-03 | Flat-Rate Energy Cost Calculation | $E = 180.00\text{ kWh}, \text{Rate} = \text{₹}8.00$ | $\text{Monthly Cost} = \text{₹}1,440.00$. |
| **TC-CALC-04** | REQ-CALC-05 | Fractional Wattage & Precision | $W = 8.5\text{ W}, Q = 3, H = 4.25\text{ hrs}, D = 30$ | Daily: $0.108375\text{ kWh}$; Monthly: $3.25125\text{ kWh}$; Rounded Display: `3.25 kWh`. |
| **TC-CALC-05** | REQ-ENH-01 | Progressive Tariff Slab Computation | Total kWh: $322.80$. Slab 1 (0–100 @ ₹4.50), Slab 2 (101–300 @ ₹7.00), Slab 3 (>300 @ ₹9.50). | Slab 1: ₹450.00; Slab 2: ₹1400.00; Slab 3: ₹216.60. Total Base Cost: ₹2,066.60. |
| **TC-CALC-06** | REQ-ENH-01 | Fixed Charge and Tax Order | Base Cost: ₹2066.60, Fixed Fee: ₹100.00, Tax: 5%. | Subtotal: ₹2166.60; Tax: ₹108.33; Total Bill: `₹2,274.93`. |
| **TC-CALC-07** | REQ-ENH-02 | Duty Cycle Calculation | $W = 150, Q = 1, H = 24.0, DC = 50\%$. | Effective Hours: $12.0\text{ hrs}$; Daily: $1.80\text{ kWh}$; Monthly (30d): $54.00\text{ kWh}$. |
| **TC-CALC-08** | REQ-ENH-05 | Simple Payback Period | Old: $150\text{ kWh/mo}$, New: $75\text{ kWh/mo}$, Rate: ₹8.00, Cost: ₹18,000. | Monthly Saved: ₹600.00; Annual Saved: ₹7,200.00; Payback: $18000 / 7200 = \mathbf{2.5\text{ years}}$. |
| **TC-CALC-09** | REQ-ENH-05 | Zero or Negative Payback Edge Case | Old: $50\text{ kWh}$, New: $60\text{ kWh}$ (New uses more energy). | Annual Savings: Negative; Payback Display: **"Not Applicable"**. |

---

### 2.2 Boundary & Input Validation Test Suite (VAL)

| Test ID | Req ID | Test Description | Inputs & Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-VAL-01** | REQ-APP-01 | Zero or Negative Wattage | Submit appliance with $W = 0$ or $W = -50$. | Form submission blocked; error: *"Wattage must be between 1 and 10,000 Watts"*. |
| **TC-VAL-02** | REQ-APP-01 | Excessive Daily Hours | Submit appliance with $H = 25.0$. | Form submission blocked; error: *"Daily hours cannot exceed 24.0"*. |
| **TC-VAL-03** | REQ-APP-01 | Negative Days Used | Submit appliance with $D = 0$ or $D = 32$. | Form submission blocked; error: *"Days used must be between 1 and 31"*. |
| **TC-VAL-04** | REQ-SETT-01 | Negative Tariff Rate | Submit settings with $\text{rate} = -5.0$. | API returns `400 Bad Request`; error: *"Tariff rate must be positive"*. |

---

### 2.3 Authentication & Security Test Suite (SEC)

| Test ID | Req ID | Test Description | Inputs & Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | REQ-AUTH-01 | Duplicate Registration Attempt | Register with already registered email. | API returns `409 Conflict`; UI shows: *"Email is already registered"*. |
| **TC-SEC-02** | REQ-AUTH-02 | Invalid Password Login | Attempt login with correct email and wrong password. | API returns `401 Unauthorized`; error: *"Invalid email or password"*. |
| **TC-SEC-03** | REQ-AUTH-02 | Login Rate Limiting | Trigger 6 failed login attempts in under 2 minutes. | 6th attempt returns `429 Too Many Requests`; account locked for 15 minutes. |
| **TC-SEC-04** | REQ-AUTH-04 | Cross-User IDOR Defense | User A logs in; sends `PUT /api/appliances/:id` targeting User B's appliance ID. | API returns `404 Not Found`; User B's record remains unmodified. |
| **TC-SEC-05** | REQ-AUTH-04 | Account Deletion Cascade | User deletes account. Check database rows in `appliances`, `settings`, `snapshots`. | All corresponding rows in all tables automatically deleted via MySQL cascade. |
| **TC-SEC-06** | REQ-REP-04 | CSV Formula Injection Defense | Name appliance `=CMD\|' /C calc'!A1`. Export CSV. | Exported cell output prepends apostrophe: `'=CMD\|' /C calc'!A1`. |

---

### 2.4 Budgeting & Alert Test Suite (BUDG)

| Test ID | Req ID | Test Description | Inputs & Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-BUDG-01** | REQ-BUDG-02 | Normal Budget Status ($<80\%$) | Budget: ₹3,500. Estimated Bill: ₹2,580 ($73.7\%$). | Neutral styling; no warning banner; status: *"Budget on track"*. |
| **TC-BUDG-02** | REQ-BUDG-02 | Approaching Budget Warning ($80\%-100\%$) | Budget: ₹3,500. Estimated Bill: ₹3,150 ($90.0\%$). | Amber alert banner: *"Notice: Estimated bill of ₹3,150 is approaching monthly budget"*. |
| **TC-BUDG-03** | REQ-BUDG-02 | Over-Budget Alert ($>100\%$) | Budget: ₹3,500. Estimated Bill: ₹3,750 ($107.1\%$). | Red alert banner: *"Attention: You're ₹250.00 over your monthly budget"*. |
| **TC-BUDG-04** | REQ-BUDG-03 | Zero or Missing Budget | Set budget to 0 or leave empty. | Dashboard renders gracefully with link: *"Click here to set a monthly budget"*. |

---

### 2.5 Historical Reporting & Immutability Test Suite (REP)

| Test ID | Req ID | Test Description | Inputs & Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-REP-01** | REQ-REP-01 | Report Snapshot Creation | Click "Save Current Estimate" for October 2026. | Snapshot row created with frozen $E = 468.75\text{ kWh}$, Bill: ₹3,750.00. |
| **TC-REP-02** | REQ-REP-01 | Immutability Verification | Save snapshot. Edit Water Heater from 2000W to 500W. Reload saved snapshot. | Active dashboard updates to new 500W figures; historical snapshot remains unchanged at 2000W / ₹3,750.00. |
| **TC-REP-03** | REQ-REP-03 | Actual Bill Reconciliation | Compare Oct Estimate (468.75 kWh, ₹3,750) with Actual Bill (490 kWh, ₹3,950). | Displays variance: $+21.25\text{ kWh} (+4.5\%)$, $+₹200.00 (+5.3\%)$ with educational guidance. |
| **TC-REP-04** | REQ-REP-04 | Print Layout Verification | Open browser Print Preview on Reports page. | Navigation header and interactive action buttons are hidden; tables fit A4 page. |

---

### 2.6 Usability, Responsive & Accessibility Test Suite (UX & A11Y)

| Test ID | Req ID | Test Description | Inputs & Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UX-01** | REQ-APP-03 | Empty Inventory State | Log into fresh account with 0 appliances. | Dashboard shows friendly empty illustration and `[Add Your First Appliance]` button. |
| **TC-UX-02** | REQ-APP-02 | Preset Loading & Editing | Select "Ceiling Fan (75W)" preset. Change watts to 85W. | Fields populate; educational badge appears; wattage edits freely to 85W. |
| **TC-A11Y-01** | REQ-UI-01 | Keyboard Focus & Modal Trap | Open Add Appliance modal using `Tab` and `Enter`. Press `Tab` through fields. Press `Esc`. | Focus remains trapped inside modal; `Esc` key cleanly dismisses modal. |
| **TC-A11Y-02** | REQ-UI-01 | WCAG AA Color Contrast | Audit text colors against `#FBFBF9` and `#FFFFFF` using Lighthouse. | Contrast ratio $\ge 4.5:1$ across all text elements; Lighthouse Accessibility score $\ge 95$. |
| **TC-RESP-01** | REQ-UI-01 | Mobile Viewport Layout | View application in 360px viewport (Chrome DevTools). | Tables scroll horizontally or stack; no viewport clipping; burger menu or stacked nav works. |
