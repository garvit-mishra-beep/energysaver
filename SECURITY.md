# Security Policy

## Supported Releases

EnergySaver is an academic capstone software engineering project. Only the latest release on the primary branch is actively maintained.

| Release | Supported |
|:---|:---:|
| 1.0.x (Current Academic Release) | :white_check_mark: |
| < 1.0.0 | :x: |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability in EnergySaver, please report it responsibly:

1. **Do not create public GitHub issues** for security vulnerabilities.
2. Email the maintainer directly with a detailed description of the vulnerability, steps to reproduce, and impact.
3. Include proof-of-concept payloads or HTTP request/response traces where appropriate.
4. The maintainer will acknowledge receipt within 48 hours and work towards a prompt resolution.

---

## Security Practices Implemented

- **Password Hashing:** Passwords are never stored in plaintext; salted `bcrypt` with a work factor $\ge 10$ is used.
- **Session Security:** Persistent MySQL session storage with `HttpOnly` and `SameSite=Lax` cookies.
- **CSRF Defense:** State-mutating requests require an `X-CSRF-Token` header validated per session.
- **IDOR Prevention:** All database operations enforce user ownership checks (`WHERE user_id = ?`).
- **SQL Injection Defense:** 100% parameterized queries via prepared statements.
- **Rate Limiting:** Authentication endpoints are rate-limited to mitigate brute-force attacks.
- **Formula Injection Defense:** CSV export escapes formula characters (`=`, `+`, `-`, `@`).
