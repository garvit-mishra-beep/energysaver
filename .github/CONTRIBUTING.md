# Contributing to EnergySaver

Thank you for your interest in contributing to **EnergySaver — Electricity Usage Analyzer**.

This project was built as an academic web technology capstone project adhering to strict architectural and technology constraints.

---

## Architectural Principles

Before submitting a pull request, ensure your proposed changes follow the project's core principles:

1. **Technology Stack Adherence:**
   - **Frontend:** Semantic HTML5, Vanilla CSS3 (custom design system), Vanilla ES6 JavaScript (No React, Vue, Vite, or Tailwind CLI).
   - **Backend:** Node.js with Express.js as a single-origin monolith.
   - **Database:** MySQL 8.0+ using `mysql2/promise` with 100% parameterized SQL queries.
   - **Visualizations:** Chart.js via local offline vendor bundle (`public/js/vendor/chart.umd.min.js`).

2. **Zero Silent Commits:**
   - Sliders and interactive controls provide zero-latency client calculation feedback without triggering unprompted database mutations.
   - All database updates must be initiated via explicit user confirmation.

3. **Zero-Trust IDOR Protection:**
   - Every database query accessing user records must explicitly enforce `WHERE user_id = req.session.userId`.

4. **Dual Storage Modes:**
   - Maintain strict separation between guest demo mode (`localStorage`) and authenticated database mode (`MySQL`).

---

## Development Workflow

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Copy environment configuration and configure local MySQL:
   ```bash
   cp .env.example .env
   ```
4. Verify database connectivity and initialize schema:
   ```bash
   npm run db:check
   npm run db:init
   ```
5. Ensure all regression tests pass before opening a pull request:
   ```bash
   npm test
   npm run test:e2e
   ```

---

## Commit Guidelines

Follow conventional commit conventions:
- `feat:` for new capabilities within release scope.
- `fix:` for bug fixes.
- `docs:` for documentation updates.
- `test:` for adding or improving test suites.
- `chore:` for maintenance or configuration updates.
