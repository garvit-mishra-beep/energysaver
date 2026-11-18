-- ==============================================================================
-- EnergySaver - Sample Seed Script
-- Standard 2-BHK Apartment Demonstration Household
-- Note: Contains example records matching docs/CALCULATIONS.md test vectors.
-- Intended for local development seeding when setting up a fresh test database.
-- ==============================================================================

-- 1. Create Sample User (Password: Password123! hashed with bcrypt)
INSERT IGNORE INTO users (id, email, password_hash, display_name)
VALUES (
    1,
    'priya@example.com',
    '$2b$10$wW1zR7E9iWv8JpX5iMkJqe7I5uO8g4n6vO5w0s8c8y0m7v4k2q2w.',
    'Priya Sharma'
);

-- 2. Create User Settings
INSERT IGNORE INTO user_settings (id, user_id, electricity_rate, monthly_budget, currency_symbol, tariff_type)
VALUES (
    1,
    1,
    8.0000,
    3500.00,
    '₹',
    'flat'
);

-- 3. Create Sample 2-BHK Appliances
INSERT IGNORE INTO appliances (id, user_id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month)
VALUES 
    (1, 1, 'Water Heater (Geyser)', 'Heating', 'Bathroom', 2000.00, 1, 3.00, 30),
    (2, 1, 'Refrigerator (Double Door)', 'Kitchen', 'Kitchen', 150.00, 1, 16.00, 30),
    (3, 1, 'Ceiling Fans', 'Cooling', 'Living Room', 75.00, 2, 10.00, 30),
    (4, 1, 'Television', 'Entertainment', 'Living Room', 100.00, 1, 5.00, 30),
    (5, 1, 'LED Lighting', 'Lighting', 'Bedroom', 10.00, 6, 6.00, 30);
