# Security Architecture & Threat Mitigation

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/ARCHITECTURE.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ARCHITECTURE.md)

---

## 1. Security Philosophy

Because EnergySaver handles private residential electricity habits, financial budgets, and user credentials, the application is engineered with defense-in-depth principles. The security architecture addresses the OWASP Top 10 web vulnerabilities using robust, framework-free patterns that a student can clearly articulate during an academic viva.

---

## 2. Threat Model & Mitigation Matrix

| Vulnerability / Threat | OWASP Category | Potential Impact | EnergySaver Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **SQL Injection (SQLi)** | A03:2021 - Injection | Unauthorized database access, record alteration, data theft | 100% parameterized SQL prepared statements via `mysql2/promise`. Zero query string concatenation. |
| **Cross-Site Scripting (XSS)** | A03:2021 - Injection | Session hijacking, malicious script execution in victim browser | HTML escaping on frontend output; strict `textContent` DOM assignments; `helmet` Content Security Policy headers. |
| **Insecure Direct Object Reference (IDOR)** | A01:2021 - Broken Access Control | Attacker modifies another user's appliances or reports by altering ID | Every database query enforces `WHERE user_id = ?` matching `req.session.userId`. Zero reliance on client-sent user IDs. |
| **Brute Force Authentication** | A07:2021 - Auth Failures | Credential cracking via automated dictionary attacks | Rate limiting on `/api/auth/login` (max 5 failed attempts per IP per 15-minute window). |
| **Weak Password Storage** | A02:2021 - Cryptographic Failures | Credential exposure if database is breached | Passwords hashed using `bcrypt` with minimum 10 salt rounds. Plaintext passwords never logged or persisted. |
| **Cross-Site Request Forgery (CSRF)** | A01:2021 - Broken Access Control | Unauthorized state mutation via third-party malicious sites | Anti-CSRF token verification (`X-CSRF-Token` header) and `SameSite=Lax` cookie configuration. |
| **Formula Injection (CSV Injection)** | A03:2021 - Injection | Arbitrary command execution in spreadsheet software upon CSV export | Sanitizing exported appliance fields by prepending an apostrophe `'` to values starting with `=`, `+`, `-`, or `@`. |
| **Session Hijacking** | A07:2021 - Auth Failures | Stolen cookie gives full account access | `HttpOnly` and `SameSite=Lax` cookie flags prevent client-side JS access; `Secure` flag enabled in production HTTPS. |

---

## 3. Cryptographic & Authentication Controls

### 3.1 Password Hashing Policy (`bcrypt`)
- Passwords must be at least 8 characters in length.
- Before database insertion or verification, passwords are processed via `bcrypt.hash(password, 10)`:
  - 10 rounds of salt generation provides an optimal balance between server CPU load and resistance against offline GPU cracking.
  - The resulting 60-character bcrypt string (`$2b$10$...`) is stored in the `password_hash` column of `users`.
  - Passwords exceeding 72 bytes are safely handled to respect bcrypt's internal limit.

### 3.2 Session Storage & Cookie Security
Sessions are managed via `express-session` with the `express-mysql-session` persistent store:

```javascript
// Express Session Configuration
const sessionConfig = {
  name: 'energysaver_sid',
  secret: process.env.SESSION_SECRET || 'dev_secret_fallback_key',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore({}, pool),
  cookie: {
    httpOnly: true,                                    // Blocks document.cookie access in JS (Anti-XSS)
    sameSite: 'lax',                                   // Defends against cross-site request forgery
    secure: process.env.NODE_ENV === 'production',     // Transmitted strictly over HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000                    // 7-day session lifetime
  }
};
```

---

## 4. Authorization & Cross-User Data Isolation (IDOR Defense)

In EnergySaver, no client-supplied ID parameter is ever trusted to confer access to another record. 

### Secure Implementation Pattern:
```javascript
// Example: Safe Appliance Update Controller
async function updateAppliance(req, res) {
  const userId = req.session.userId; // Authenticated session ID
  const applianceId = req.params.id; // Target resource ID
  const { name, rated_watts, quantity, daily_hours, days_used_per_month } = req.body;

  // Strict check ensures record belongs to THIS user
  const [result] = await db.execute(
    `UPDATE appliances 
     SET name = ?, rated_watts = ?, quantity = ?, daily_hours = ?, days_used_per_month = ?
     WHERE id = ? AND user_id = ?`,
    [name, rated_watts, quantity, daily_hours, days_used_per_month, applianceId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Appliance not found or unauthorized' }
    });
  }

  return res.json({ success: true, message: 'Appliance updated successfully' });
}
```

---

## 5. SQL Injection Prevention Standards

1. **Zero String Concatenation:** Query strings must never concatenate raw user inputs.
   - ❌ **Forbidden:** `db.query("SELECT * FROM appliances WHERE name = '" + req.query.name + "'")`
   - ✅ **Mandatory:** `db.execute("SELECT * FROM appliances WHERE user_id = ? AND name = ?", [userId, req.query.name])`
2. **Prepared Statements:** The application uses `mysql2/promise` with parameter arrays for all queries, forcing the database engine to parse SQL logic separately from data parameters.

---

## 6. Cross-Site Scripting (XSS) Prevention

1. **Frontend DOM Manipulation:** 
   - Never inject untrusted user data via `element.innerHTML = ...`.
   - Always use `element.textContent = ...` or create elements via `document.createElement()`.
2. **HTTP Security Headers (`helmet`):**
   - Configures `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.

---

## 7. CSV Export Sanitization (Formula Injection Defense)

When exporting appliance lists to CSV (`/api/reports/export-csv`), cell values can be parsed as executable commands in Microsoft Excel or Google Sheets if they begin with arithmetic operators:

```javascript
// CSV Cell Sanitization Function
function sanitizeCsvCell(value) {
  if (typeof value !== 'string') return value;
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.includes(value.charAt(0))) {
    // Prepend a single apostrophe to force Excel to treat the cell as raw string
    return `'${value}`;
  }
  return value;
}
```

---

## 8. Environment Variable & Secret Management

1. **Never Commit Secrets:** The `.env` file containing database passwords and session secret keys is strictly ignored in `.gitignore`.
2. **Reference Template (`.env.example`):** A template file provides clear keys with safe placeholder values for developers.
3. **Graceful Startup Validation:** If required environment variables (`DB_PASSWORD`, `SESSION_SECRET`) are missing in production mode, the server halts immediately with an explicit error.
