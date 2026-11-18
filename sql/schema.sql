-- ==============================================================================
-- EnergySaver - Core Database Schema (DDL)
-- Engine: MySQL 8.0+ (InnoDB)
-- Collation: utf8mb4_unicode_ci
-- Reference: docs/DATABASE.md
-- ==============================================================================

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: user_settings
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    electricity_rate DECIMAL(8, 4) NOT NULL DEFAULT 8.0000,
    monthly_budget DECIMAL(10, 2) NOT NULL DEFAULT 3500.00,
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '₹',
    tariff_type ENUM('flat', 'slab') NOT NULL DEFAULT 'flat',
    custom_rooms JSON NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_positive_rate CHECK (electricity_rate > 0),
    CONSTRAINT chk_positive_budget CHECK (monthly_budget >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: appliances
CREATE TABLE IF NOT EXISTS appliances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    room VARCHAR(50) NOT NULL,
    rated_watts DECIMAL(8, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    daily_hours DECIMAL(4, 2) NOT NULL,
    days_used_per_month INT NOT NULL DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appliances_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_appliance_watts CHECK (rated_watts > 0 AND rated_watts <= 10000),
    CONSTRAINT chk_appliance_qty CHECK (quantity >= 1 AND quantity <= 50),
    CONSTRAINT chk_appliance_hours CHECK (daily_hours >= 0.1 AND daily_hours <= 24.0),
    CONSTRAINT chk_appliance_days CHECK (days_used_per_month >= 1 AND days_used_per_month <= 31),
    INDEX idx_appliances_user (user_id),
    INDEX idx_appliances_room (user_id, room),
    INDEX idx_appliances_category (user_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: report_snapshots
CREATE TABLE IF NOT EXISTS report_snapshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    period_name VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_kwh DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    tariff_rate_used DECIMAL(8, 4) NOT NULL,
    budget_used DECIMAL(10, 2) NOT NULL,
    calculation_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_snapshots_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reports_user_period (user_id, period_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: report_snapshot_items
CREATE TABLE IF NOT EXISTS report_snapshot_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    snapshot_id INT NOT NULL,
    appliance_name VARCHAR(100) NOT NULL,
    room VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rated_watts DECIMAL(8, 2) NOT NULL,
    quantity INT NOT NULL,
    daily_hours DECIMAL(4, 2) NOT NULL,
    days_used INT NOT NULL,
    monthly_kwh DECIMAL(10, 2) NOT NULL,
    monthly_cost DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_snapshot_items_parent FOREIGN KEY (snapshot_id) REFERENCES report_snapshots(id) ON DELETE CASCADE,
    INDEX idx_snapshot_items_snapshot (snapshot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: actual_bills
CREATE TABLE IF NOT EXISTS actual_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    billing_start_date DATE NOT NULL,
    billing_end_date DATE NOT NULL,
    billed_kwh DECIMAL(10, 2) NOT NULL,
    billed_amount DECIMAL(10, 2) NOT NULL,
    provider_name VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_actual_bills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_bill_dates CHECK (billing_end_date >= billing_start_date),
    CONSTRAINT chk_positive_billed_kwh CHECK (billed_kwh >= 0),
    CONSTRAINT chk_positive_billed_amount CHECK (billed_amount >= 0),
    INDEX idx_bills_user (user_id, billing_start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: sessions (Session store managed by express-mysql-session)
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id),
    INDEX idx_sessions_expires (expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
