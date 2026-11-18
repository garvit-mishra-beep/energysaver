# Deployment & Operations Guide

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md) | [docs/ARCHITECTURE.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ARCHITECTURE.md)

---

## 1. System Requirements

### 1.1 Development Environment
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js Runtime:** Version 18.x LTS or 20.x LTS.
- **Package Manager:** npm (v9.x or v10.x).
- **Database Engine:** MySQL Server 8.0+ or MariaDB 10.5+.
- **IDE:** Antigravity IDE / Visual Studio Code.

### 1.2 Production Environment
- **Host Server:** Ubuntu 22.04 LTS (1 vCPU, 1 GB RAM, 20 GB SSD is sufficient).
- **Process Manager:** PM2 for continuous Node.js process supervision and auto-restart.
- **Reverse Proxy:** Nginx configured with SSL/TLS termination and Gzip compression.
- **SSL Certificate:** Let's Encrypt via Certbot.

---

## 2. Environment Variables Configuration

Create a `.env` file in the project root based on the provided `.env.example`. **Never commit `.env` into source control.**

```ini
# ==============================================================================
# EnergySaver Environment Configuration
# ==============================================================================

# Server Network Settings
PORT=3000
NODE_ENV=development

# MySQL Database Credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=energysaver_user
DB_PASSWORD=your_secure_db_password_here
DB_NAME=energysaver_db
DB_CONNECTION_LIMIT=10

# Session Cryptography & Security
SESSION_SECRET=your_random_64_character_session_key_here
COOKIE_SECURE=false

# In-Memory Rate Limiting Settings
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5
```

---

## 3. Database Initialization & Schema Setup

### 3.1 Create Database & Dedicated MySQL User
Execute in your MySQL command-line client:

```sql
-- 1. Create database with UTF-8 character encoding
CREATE DATABASE energysaver_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create isolated database runtime application user (replace with strong password)
CREATE USER 'energysaver_app'@'localhost' IDENTIFIED BY 'your_secure_db_password_here';

-- 3. Grant least-privilege DML access strictly on energysaver_db (No DROP, ALTER or DDL)
GRANT SELECT, INSERT, UPDATE, DELETE ON energysaver_db.* TO 'energysaver_app'@'localhost';
FLUSH PRIVILEGES;
```

> [!NOTE]
> If performing initial schema execution with `sql/schema.sql`, run the migration as database administrator or grant temporary DDL privileges (`CREATE, ALTER, INDEX, REFERENCES`). During runtime, the application only requires `SELECT, INSERT, UPDATE, DELETE`.

### 3.2 Execute DDL Schema Migration
From your terminal within the project root directory:

```bash
# Execute schema file using migration credentials
mysql -u root -p energysaver_db < sql/schema.sql

# (Optional) Seed with sample testing data for local development
mysql -u root -p energysaver_db < sql/seed.sql
```

---

## 4. Local Development Execution

```bash
# 1. Install Node.js dependencies
npm install

# 2. Run database migrations / verify connection
npm run db:check

# 3. Start development server with auto-reload
npm run dev

# 4. Open in browser:
# Navigate to http://localhost:3000
```

---

## 5. Production Deployment (Ubuntu + Nginx + PM2)

### 5.1 Process Management with PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start server as a supervised daemon
NODE_ENV=production pm2 start src/server.js --name "energysaver"

# Configure PM2 to start on system boot
pm2 startup systemd
pm2 save
```

### 5.2 Nginx Reverse Proxy & SSL Configuration
Create `/etc/nginx/sites-available/energysaver`:

```nginx
server {
    listen 80;
    server_name energysaver.example.com;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name energysaver.example.com;

    ssl_certificate /etc/letsencrypt/live/energysaver.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/energysaver.example.com/privkey.pem;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 6. Backup & Disaster Recovery Procedures

### 6.1 Automated Daily Database Backup
Set up a daily cron job using `mysqldump`:

```bash
# Run daily at 02:00 AM
0 2 * * * mysqldump -u energysaver_user -p'your_db_password' energysaver_db | gzip > /var/backups/energysaver_db_$(date +\%F).sql.gz
```

### 6.2 Restoration Procedure
```bash
# Gunzip and restore into database
gunzip < /var/backups/energysaver_db_2026-10-30.sql.gz | mysql -u energysaver_user -p energysaver_db
```

---

## 7. Post-Deployment Smoke Test Checklist

- [ ] HTTP requests automatically redirect to HTTPS.
- [ ] Static assets (`/css`, `/js`) load with `200 OK` and fast response times ($<50\text{ ms}$).
- [ ] User registration, session login, and logout execute without session errors.
- [ ] Adding an appliance persists to MySQL and appears in the dashboard summary.
- [ ] Budget warning alerts trigger properly when test numbers exceed budget.
- [ ] Saving an estimate snapshot preserves records in `report_snapshots`.
- [ ] Server log file contains zero unhandled Promise rejections.
