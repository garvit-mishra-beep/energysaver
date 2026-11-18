# Mathematical Calculation Engine Specifications

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/ARCHITECTURE.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ARCHITECTURE.md)

---

## 1. Fundamental Physical Constants & Units

Electricity billing in residential jurisdictions worldwide is founded upon the following physical definitions:
- **Power ($P$):** Measured in **Watts (W)** or kilowatts ($\text{kW}$), where $1\text{ kW} = 1,000\text{ W}$. Power represents the rate at which electrical energy is consumed at any instantaneous moment.
- **Energy ($E$):** Measured in **kilowatt-hours (kWh)**. Energy represents the total power consumed sustained over a duration of time:
  $$1\text{ kWh} = 1\text{ kilowatt of power for } 1\text{ hour} = 1,000\text{ Watt-hours (Wh)}$$
- **Billing Unit:** By international utility standard, **1 Electricity Unit = 1 kWh**.

---

## 2. Core Release Calculation Formulas

### 2.1 Daily Appliance Energy Consumption
For any appliance $i$ with rated wattage $W_i$, quantity $Q_i$, and daily operating hours $H_i$:

$$\text{Daily kWh}_i = \frac{W_i \times Q_i \times H_i}{1000}$$

- **Input Boundaries:**
  - $1.0 \le W_i \le 10,000.0\text{ Watts}$
  - $1 \le Q_i \le 50\text{ units}$
  - $0.10 \le H_i \le 24.00\text{ hours/day}$

---

### 2.2 Monthly Appliance Energy Consumption
For appliance $i$ operating for $D_i$ days in the selected monthly billing period:

$$\text{Monthly kWh}_i = \text{Daily kWh}_i \times D_i = \left( \frac{W_i \times Q_i \times H_i}{1000} \right) \times D_i$$

- **Input Boundaries:**
  - $1 \le D_i \le 31\text{ days}$ (Default: 30 days)

---

### 2.3 Total Household Monthly Energy Consumption
The aggregate monthly household consumption $E_{\text{total}}$ is the sum across all $N$ active appliances:

$$E_{\text{total}} = \sum_{i=1}^{N} \text{Monthly kWh}_i$$

---

### 2.4 Flat-Rate Energy Cost Calculation
Under the flat-rate tariff model (Core Release), the estimated monthly expenditure $C_{\text{flat}}$ for an electricity rate $R$ (in local currency per kWh) is:

$$C_{\text{flat}} = E_{\text{total}} \times R$$

Similarly, the individual cost attributed to an individual appliance $i$ is:

$$C_i = \text{Monthly kWh}_i \times R$$

---

### 2.5 Household Budget Tracking Formulas
Given user-defined monthly monetary budget $B$:
- **Budget Variance ($\Delta B$):**
  $$\Delta B = B - C_{\text{flat}}$$
  - If $\Delta B \ge 0$, household is within budget (Remaining: $\Delta B$).
  - If $\Delta B < 0$, household is over budget (Deficit: $|\Delta B|$).
- **Budget Utilization Percentage ($U$):**
  $$U = \left( \frac{C_{\text{flat}}}{B} \right) \times 100\%$$
- **Alert Trigger Thresholds:**
  - **Normal:** $U < 80\%$
  - **Approaching Budget Warning:** $80\% \le U \le 100\%$
  - **Over Budget Alert:** $U > 100\%$

---

## 3. Worked Numerical Example 1: Core Flat-Rate Household

### Scenario Assumptions:
- **Configured Flat Rate:** $R = \text{₹}8.00\text{ per kWh}$ (Hypothetical local rate)
- **Configured Monthly Budget:** $B = \text{₹}3,500.00$
- **Standard Month:** $D = 30\text{ days}$

### Active Household Appliance Inventory:
1. **Water Heater (Bathroom):** $W = 2000\text{ W}, Q = 1, H = 3.0\text{ hrs/day}, D = 30\text{ days}$
   $$\text{Daily kWh} = \frac{2000 \times 1 \times 3.0}{1000} = 6.00\text{ kWh/day}$$
   $$\text{Monthly kWh} = 6.00 \times 30 = 180.00\text{ kWh}$$
   $$\text{Monthly Cost} = 180.00 \times 8.00 = \text{₹}1,440.00$$

2. **Refrigerator (Kitchen):** $W = 150\text{ W}, Q = 1, H = 16.0\text{ hrs/day}, D = 30\text{ days}$
   $$\text{Daily kWh} = \frac{150 \times 1 \times 16.0}{1000} = 2.40\text{ kWh/day}$$
   $$\text{Monthly kWh} = 2.40 \times 30 = 72.00\text{ kWh}$$
   $$\text{Monthly Cost} = 72.00 \times 8.00 = \text{₹}576.00$$

3. **Ceiling Fans (Living Room):** $W = 75\text{ W}, Q = 2, H = 10.0\text{ hrs/day}, D = 30\text{ days}$
   $$\text{Daily kWh} = \frac{75 \times 2 \times 10.0}{1000} = 1.50\text{ kWh/day}$$
   $$\text{Monthly kWh} = 1.50 \times 30 = 45.00\text{ kWh}$$
   $$\text{Monthly Cost} = 45.00 \times 8.00 = \text{₹}360.00$$

4. **Television (Living Room):** $W = 100\text{ W}, Q = 1, H = 5.0\text{ hrs/day}, D = 30\text{ days}$
   $$\text{Daily kWh} = \frac{100 \times 1 \times 5.0}{1000} = 0.50\text{ kWh/day}$$
   $$\text{Monthly kWh} = 0.50 \times 30 = 15.00\text{ kWh}$$
   $$\text{Monthly Cost} = 15.00 \times 8.00 = \text{₹}120.00$$

5. **LED Lighting (Bedrooms & Hall):** $W = 10\text{ W}, Q = 6, H = 6.0\text{ hrs/day}, D = 30\text{ days}$
   $$\text{Daily kWh} = \frac{10 \times 6 \times 6.0}{1000} = 0.36\text{ kWh/day}$$
   $$\text{Monthly kWh} = 0.36 \times 30 = 10.80\text{ kWh}$$
   $$\text{Monthly Cost} = 10.80 \times 8.00 = \text{₹}86.40$$

### Aggregated Household Results:
- **Total Household Monthly Consumption:**
  $$E_{\text{total}} = 180.00 + 72.00 + 45.00 + 15.00 + 10.80 = \mathbf{322.80\text{ kWh}}$$
- **Total Estimated Monthly Bill:**
  $$C_{\text{flat}} = 322.80 \times \text{₹}8.00 = \mathbf{\text{₹}2,582.40}$$
- **Budget Analysis:**
  $$\Delta B = \text{₹}3,500.00 - \text{₹}2,582.40 = +\text{₹}917.60\text{ (Within Budget)}$$
  $$U = \left( \frac{2582.40}{3500.00} \right) \times 100\% = \mathbf{73.78\%}\text{ (Status: Normal)}$$
- **Highest Consumer:** Water Heater ($180.00\text{ kWh}$, representing $55.76\%$ of total).

---

## 4. What-If Savings Scenario Modeling

When evaluating a scenario (e.g., reducing the Water Heater operating hours from $3.0\text{ hrs/day}$ to $2.0\text{ hrs/day}$):

1. **Calculate Baseline Figures:**
   $$E_{\text{baseline}} = 322.80\text{ kWh}, \quad C_{\text{baseline}} = \text{₹}2,582.40$$
2. **Calculate Proposed Figures with Modified Parameters:**
   $$\text{New Water Heater Monthly kWh} = \frac{2000 \times 1 \times 2.0}{1000} \times 30 = 120.00\text{ kWh}$$
   $$E_{\text{proposed}} = 322.80 - (180.00 - 120.00) = 262.80\text{ kWh}$$
   $$C_{\text{proposed}} = 262.80 \times \text{₹}8.00 = \text{₹}2,102.40$$
3. **Calculate Net Differences:**
   $$\Delta E_{\text{saved}} = E_{\text{baseline}} - E_{\text{proposed}} = 322.80 - 262.80 = \mathbf{60.00\text{ kWh/month}}$$
   $$\Delta C_{\text{saved}} = C_{\text{baseline}} - C_{\text{proposed}} = 2582.40 - 2102.40 = \mathbf{\text{₹}480.00\text{/month}}$$

---

## 5. Later Enhancement Calculations (Phase 6)

### 5.1 Progressive Tiered Tariff Slabs
Under progressive tariffs, each slab applies **only** to the units consumed within that slab interval. The highest slab rate is **never** applied retroactively to all units.

#### Slab Definition Structure:
| Slab Order | Range (kWh) | Applicable Rate ($r_k$) |
| :---: | :---: | :---: |
| Slab 1 | $0 - 100$ | $r_1 = \text{₹}4.50$ |
| Slab 2 | $101 - 300$ | $r_2 = \text{₹}7.00$ |
| Slab 3 | $> 300$ (Excess) | $r_3 = \text{₹}9.50$ |

#### Total Bill Formula with Fixed Charge & Tax:
1. **Base Energy Charge ($C_{\text{energy}}$):**
   $$C_{\text{energy}} = \sum_{k} (\text{Units in Slab } k \times r_k)$$
2. **Subtotal ($C_{\text{subtotal}}$):**
   $$C_{\text{subtotal}} = C_{\text{energy}} + C_{\text{fixed}}$$
   Where $C_{\text{fixed}}$ is the optional monthly fixed meter charge (e.g., ₹120.00).
3. **Electricity Duty / Tax ($T$):**
   $$T = C_{\text{subtotal}} \times \left( \frac{\text{Tax Rate } \%}{100} \right)$$
4. **Total Progressive Bill ($C_{\text{total}}$):**
   $$C_{\text{total}} = C_{\text{subtotal}} + T$$

#### Worked Example 2: Progressive Slab Computation
Using the baseline consumption from Example 1 ($E = 322.80\text{ kWh}$):
- **Slab 1 (0–100 kWh):** $100.00\text{ kWh} \times \text{₹}4.50 = \text{₹}450.00$
- **Slab 2 (101–300 kWh):** $200.00\text{ kWh} \times \text{₹}7.00 = \text{₹}1,400.00$
- **Slab 3 (>300 kWh):** $(322.80 - 300.00) = 22.80\text{ kWh} \times \text{₹}9.50 = \text{₹}216.60$
- **Base Energy Charge:** $450.00 + 1400.00 + 216.60 = \text{₹}2,066.60$
- **Fixed Meter Charge:** $+\text{₹}100.00 \rightarrow \text{Subtotal} = \text{₹}2,166.60$
- **Tax (5%):** $\text{₹}2,166.60 \times 0.05 = \text{₹}108.33$
- **Total Household Bill:** $2166.60 + 108.33 = \mathbf{\text{₹}2,274.93}$

#### Critical Rule for Scenario Savings under Progressive Tariffs:
With nonlinear tariffs, calculating scenario savings by multiplying saved kWh by an arbitrary single rate produces mathematical error. Savings **must** be calculated by recalculating the entire household bill before and after:
$$\text{Saved Money} = \text{TotalBill}(E_{\text{baseline}}) - \text{TotalBill}(E_{\text{proposed}})$$

---

### 5.2 Intermittent Cycling Appliances (Duty Cycle)
Appliances with thermostats or compressors (refrigerators, air conditioners, water coolers) do not draw rated wattage continuously.
- **Duty Cycle ($DC$):** The percentage of time the compressor/element is actively engaged ($1\% \le DC \le 100\%$).
- **Effective Daily Operating Hours ($H_{\text{eff}}$):**
  $$H_{\text{eff}} = H_{\text{window}} \times \left( \frac{DC}{100} \right)$$
- **Strict Rule:** Never multiply by duty cycle twice if the user has already entered effective hours.

---

### 5.3 Active vs. Standby Power Consumption
For electronics that consume quiescent power when plugged in but turned "off":
- **Constraint:** $H_{\text{active}} + H_{\text{standby}} \le 24.0\text{ hours/day}$
- **Combined Daily Energy:**
  $$\text{Daily kWh} = \frac{(W_{\text{active}} \times H_{\text{active}}) + (W_{\text{standby}} \times H_{\text{standby}})}{1000} \times Q$$

---

### 5.4 Appliance Replacement Payback Period
When comparing an existing appliance against a proposed energy-efficient replacement:
- **Annual Energy Saved ($\Delta E_{\text{annual}}$):**
  $$\Delta E_{\text{annual}} = (E_{\text{monthly, current}} - E_{\text{monthly, replacement}}) \times 12$$
- **Annual Cost Saved ($\Delta C_{\text{annual}}$):**
  $$\Delta C_{\text{annual}} = \Delta E_{\text{annual}} \times R$$
- **Simple Payback Period ($T_{\text{payback}}$):**
  $$T_{\text{payback}} = \frac{\text{Purchase Cost of Replacement}}{\Delta C_{\text{annual}}}$$
- **Edge Cases:**
  - If $\Delta C_{\text{annual}} \le 0$: Display **"Not Applicable"** (replacement does not reduce costs).
  - If $\text{Purchase Cost} = 0$: $T_{\text{payback}} = 0\text{ years}$ (instant payback).

---

## 6. Precision & Rounding Rules

1. **Internal Execution Precision:** All intermediate variables ($W, Q, H, D, \text{kWh}, \text{Cost}$) maintain standard IEEE-754 64-bit floating point precision in Node.js and MySQL (`DECIMAL(10, 4)`).
2. **Display & API Rounding:** All user-facing values are rounded using banker's or standard arithmetic half-up rounding strictly at presentation:
   - Energy Consumption: Formatted to **2 decimal places** (e.g., `468.75 kWh`).
   - Currency & Expenditure: Formatted to **2 decimal places** with locale currency prefix (e.g., `₹3,750.00`).
   - Tariff Rates: Preserved to **4 decimal places** in settings (e.g., `₹8.2500 / kWh`).
