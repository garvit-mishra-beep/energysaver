# EnergySaver — GitHub Publication Checklist
**Document:** `docs/GITHUB_PUBLICATION_CHECKLIST.md`  
**Target Project:** EnergySaver — Electricity Usage Analyzer  
**Auditor Roles:** Senior Git Repository Maintainer, Release Engineer, Security Auditor  
**Date:** November 18, 2026  

---

## Pre-Publication Verification Gate

Before creating a remote repository on GitHub and pushing code, complete this verified checklist:

### 1. Repository Cleanliness & Structure
- [x] **No Nested Git Repositories:** Confirmed single `.git` directory at project root (`Ai-project`).
- [x] **Zero Stray Artifacts:** Temporary files, debug logs, crash dumps, and OS files (`.DS_Store`, `Thumbs.db`) are excluded.
- [x] **Professional `.gitignore`:** Strict patterns covering `node_modules/`, `.env*`, `logs/`, `coverage/`, `scratch/`, and database dumps.
- [x] **Line Ending Normalization (`.gitattributes`):** Configured text auto-detection and LF line endings (`*.js`, `*.json`, `*.html`, `*.css`, `*.md`, `*.sql`), while preserving binary assets (`*.png`, `*.woff`).
- [x] **Node Version Pinning:** Documented engine compatibility (`>=18.0.0`) in `package.json` and added `.nvmrc` (`20`).

### 2. Application Security & Secret Hygiene
- [x] **No Cleartext Credentials in Active Source:** Zero database passwords, session secrets, or API keys in application source code.
- [x] **Template Configuration Sanitization:** `.env.example` verified with harmless dummy placeholders (`your_secure_db_password_here`).
- [x] **Untracked Local Environment:** `.env` confirmed untracked and excluded by `.gitignore`.
- [x] **Current Working Tree Sanitization:** All historical audit reports in `audit/` sanitized from raw quoted passwords to `<redacted_historical_db_password>`.
- [!] **Historical Git Commit `5883da4`:** Baseline commit contains references in historical audit documents. Before pushing to a public GitHub repository, either:
  1. Rotate your local MySQL developer password (recommended best practice); or
  2. Perform an authorized history rewrite using `git-filter-repo` to redact the commit history.

### 3. Documentation & GitHub Presentation
- [x] **Professional `README.md`:** Contains all 16 required sections: Title, Overview, Key Features, Tech Stack, Screenshots, Architecture, Directory Layout, Installation, Environment Variables, Calculations, Security, Automated Testing, Known Limitations, Future Roadmap, and License.
- [x] **Screenshots:** Relative repository paths pointing to sanitized visual audit captures (`audit/screenshots/`).
- [x] **Contribution Guidelines (`CONTRIBUTING.md`):** Outlines technology constraints, zero-silent-commit principles, and PR workflows.
- [x] **Security Policy (`SECURITY.md`):** Responsible disclosure process and implemented defense overview.
- [x] **Specification Parity:** `docs/API_SPEC.md`, `docs/DATABASE.md`, `docs/ARCHITECTURE.md`, and `docs/CALCULATIONS.md` reflect verified Phase 1–5, 7 implementation.

### 4. Cross-Platform Reproducibility
- [x] **Clean Dependency Installation:** Verified `npm ci --dry-run` and lockfile consistency.
- [x] **Path Handling:** Refactored dynamic path resolution (`path.join`) and cross-platform Chrome binary lookups in browser test suites.
- [x] **Idempotent Database Provisioning:** Repeatable database check (`npm run db:check`) and schema initialization (`npm run db:init`).
- [x] **Test Suite Health:** All 371 automated assertions pass with 0 failures (`npm test` and `npm run test:e2e`).

---

## Step-by-Step Remote Publishing Instructions

When ready to publish to GitHub:

```bash
# 1. Create a new empty repository on GitHub (e.g. energysaver-app) via the GitHub UI.
# Do NOT initialize it with README, .gitignore, or license (already present locally).

# 2. Add the remote origin:
git remote add origin https://github.com/<your_username>/energysaver.git

# 3. Rename default branch to main if desired:
git branch -M main

# 4. Push local commits to remote:
git push -u origin main
```
