# AI Coding Agent Operating Instructions

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Target Environment:** Antigravity IDE  
**Primary Reference:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/DEVELOPMENT_PHASES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/DEVELOPMENT_PHASES.md) | [TASKS.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/TASKS.md)

---

## 1. Core Operating Principles

As an AI coding agent pair-programming on this student capstone project, you must adhere to the following mandatory guidelines:

1. **Read Specifications First:** Before generating or modifying any code, read [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md), the relevant section of [docs/DEVELOPMENT_PHASES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/DEVELOPMENT_PHASES.md), and the active task in [TASKS.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/TASKS.md).
2. **Strict Technology Stack Adherence:**
   - **Frontend:** Semantic HTML5, Vanilla CSS3 (custom design system), Vanilla ES6 JavaScript (No React, Vue, Svelte, or Next.js).
   - **Visualizations:** Chart.js via local file or CDN.
   - **Backend:** Node.js with Express.js (serving static frontend and `/api` from the same origin).
   - **Database:** MySQL 8.0+ using `mysql2/promise` with parameterized queries.
   - **Authentication:** `express-session` with `express-mysql-session` and `bcrypt`.
   - **Constraint:** Never introduce heavy frontend build systems (Webpack, Vite, Tailwind CLI) or microservices unless explicitly requested by the user.
3. **Preserve Digital Notebook Aesthetic:** Follow the design system defined in [docs/UI_UX.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/UI_UX.md):
   - Background: Warm off-white (`#FBFBF9`).
   - Text: Charcoal (`#2D312E`).
   - Primary Accent: Muted forest green (`#2E6F40`).
   - Restrained borders and modest corner rounding ($4\text{px}-8\text{px}$).
   - No neon gradients, no translucent glass effects, and no emojis in critical interactive buttons.
4. **Implement One Coherent Phase at a Time:** Work systematically through the phases defined in `docs/DEVELOPMENT_PHASES.md`. Do not jump ahead to advanced enhancements until core foundations are tested.
5. **Preserve Existing Work & Code Comments:** Never blindly overwrite existing files or strip away existing comments and docstrings.
6. **Synchronize Code and Documentation:** If implementation details evolve, update the corresponding technical document in `docs/` and mark finished tasks in `TASKS.md`.
7. **Dual-Layer Validation:**
   - Client-side: Zero-latency validation for user feedback.
   - Server-side: Authoritative validation rejecting invalid, negative, or excessive values before database insertion.
8. **Strict Ownership Enforcement (Zero-Trust IDOR Defense):** Every database query touching user records must include `WHERE user_id = ?` matching `req.session.userId`.
9. **Authoritative Server Calculations:** All saved metrics and reports must be computed by `src/services/calculator.js`. Client-side calculators exist solely for zero-latency form previews.
10. **Zero Secrets in Code:** Never commit database credentials, API keys, or session secrets. Ensure `.env` is listed in `.gitignore` and reference `.env.example`.
11. **Truthful Progress Reporting:**
    - Never claim code runs, tests pass, or dependencies are installed without executing checks and observing real output.
    - If a feature is incomplete or mock-driven, clearly disclose its status.
12. **Ask Before Destructive Operations:** Always obtain explicit user consent before executing destructive operations (dropping database tables, purging directories, or running irreversible commands).
