-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. REGIONS / COUNTRIES TABLE
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL, -- e.g. 'IN', 'BR', 'ZA', 'RU', 'CN'
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'authority', 'admin')),
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POLLUTION REPORTS TABLE
CREATE TABLE IF NOT EXISTS pollution_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- nullable for anonymous reports
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    photo_url TEXT,
    description TEXT,
    reported_pm25 NUMERIC(6, 2),
    ai_score INT CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_category VARCHAR(50) CHECK (ai_category IN ('smoke', 'haze', 'burning', 'normal')),
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'severe')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POLLUTION HOTSPOTS TABLE
CREATE TABLE IF NOT EXISTS pollution_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_m INT DEFAULT 500,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'moderate', 'high', 'severe')),
    report_count INT DEFAULT 1,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SENSOR READINGS TABLE
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES pollution_reports(id) ON DELETE SET NULL,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    pm25 NUMERIC(6, 2),
    pm10 NUMERIC(6, 2),
    co2 NUMERIC(6, 2),
    source VARCHAR(50) DEFAULT 'citizen_device' CHECK (source IN ('citizen_device', 'mock', 'station')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WEATHER DATA CACHE TABLE
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    temperature NUMERIC(5, 2),
    humidity NUMERIC(5, 2),
    wind_speed NUMERIC(5, 2),
    wind_direction INT, -- in degrees (0-360)
    fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PREDICTIONS (AQI Forecast) TABLE
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    forecast_horizon_hours INT NOT NULL,
    predicted_aqi NUMERIC(6, 2) NOT NULL,
    confidence NUMERIC(3, 2), -- 0.00 to 1.00
    model_version VARCHAR(50) DEFAULT 'v1.0-statistical',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotspot_id UUID REFERENCES pollution_hotspots(id) ON DELETE SET NULL,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'severe')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'escalated', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FEDERATED PREDICTIONS ("Shared Packet" exchange) TABLE
CREATE TABLE IF NOT EXISTS federated_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    target_region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    risk_summary_json JSONB NOT NULL,
    shared_at TIMESTAMPTZ DEFAULT NOW()
);

-- OPTIONAL: Seed base BRICS demo regions
INSERT INTO regions (name, country_code, center_lat, center_lng)
VALUES 
    ('New Delhi', 'IN', 28.6139, 77.2090),
    ('São Paulo', 'BR', -23.5505, -46.6333)
ON CONFLICT DO NOTHING;