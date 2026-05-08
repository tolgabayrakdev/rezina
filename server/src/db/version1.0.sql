CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- AUTH
-- =========================

CREATE TABLE roles (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email                VARCHAR(255) UNIQUE NOT NULL,
    password             VARCHAR(255) NOT NULL,
    role_id              UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active            BOOLEAN DEFAULT FALSE,
    is_verified          BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE verification_codes (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code       VARCHAR(6) NOT NULL,
    is_used    BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at    TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email               ON users(email);
CREATE INDEX idx_users_role_id             ON users(role_id);
CREATE INDEX idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token      ON refresh_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token   ON password_reset_tokens(token);

INSERT INTO roles (name) VALUES ('user');
INSERT INTO roles (name) VALUES ('admin');


-- =========================
-- UPDATED_AT TRIGGER
-- =========================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =========================
-- ARAÇLAR
-- =========================

CREATE TABLE cars (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    brand           VARCHAR(100),
    model           VARCHAR(100),
    year            INT CHECK (year > 1900 AND year <= 2100),
    mileage         INT CHECK (mileage >= 0),
    price           NUMERIC(12,2) CHECK (price >= 0),
    status          VARCHAR(20) DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'reserved', 'sold')),
    description     TEXT,
    expertise       JSONB DEFAULT NULL,
    fuel_type       VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'lpg', 'electric', 'hybrid')),
    transmission    VARCHAR(20) CHECK (transmission IN ('automatic', 'manual')),
    body_type       VARCHAR(30) CHECK (body_type IN ('sedan', 'hatchback', 'suv', 'station_wagon', 'pickup', 'truck')),
    engine_power    INT CHECK (engine_power > 0),
    engine_volume   INT CHECK (engine_volume > 0),
    drive_type      VARCHAR(20) CHECK (drive_type IN ('fwd', 'rwd', '4wd', 'awd')),
    color           VARCHAR(50),
    vehicle_type    VARCHAR(20) CHECK (vehicle_type IN ('passenger', 'commercial')),
    insurance_date  DATE,
    inspection_date DATE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cars_user_id ON cars(user_id);
CREATE INDEX idx_cars_status  ON cars(status);

CREATE TRIGGER trg_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ARAÇ FOTOĞRAFLARI
CREATE TABLE car_images (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id     UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    is_cover   BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_car_images_car_id ON car_images(car_id);

CREATE UNIQUE INDEX idx_car_images_one_cover
  ON car_images(car_id)
  WHERE is_cover = TRUE;


-- ARAÇ İLAN LİNKLERİ
CREATE TABLE car_links (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id     UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    platform   VARCHAR(100) NOT NULL,
    url        TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_car_links_car_id ON car_links(car_id);


-- ARAÇ BAKIM KALEMLERİ
CREATE TABLE car_maintenance_items (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id            UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    name              VARCHAR(255) NOT NULL,
    interval_km       INT NOT NULL CHECK (interval_km > 0),
    last_done_mileage INT CHECK (last_done_mileage >= 0),
    notes             TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_car_maintenance_items_car_id ON car_maintenance_items(car_id);


-- ARAÇ SERVİS KAYITLARI
CREATE TABLE car_service_records (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id       UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    mileage      INT CHECK (mileage >= 0),
    service_date DATE,
    title        VARCHAR(255) NOT NULL,
    notes        TEXT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_car_service_records_car_id ON car_service_records(car_id);


-- =========================
-- MÜŞTERİLER
-- =========================

CREATE TABLE customers (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       VARCHAR(150),
    phone      VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id ON customers(user_id);


-- ARAÇ - MÜŞTERİ İLGİSİ
CREATE TABLE car_interests (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id      UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status      VARCHAR(20) DEFAULT 'interested' CHECK (status IN ('interested', 'test_drive', 'negotiating', 'lost', 'sold')),
    note        TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(car_id, customer_id)
);

CREATE INDEX idx_car_interests_car_id      ON car_interests(car_id);
CREATE INDEX idx_car_interests_customer_id ON car_interests(customer_id);

CREATE TRIGGER trg_car_interests_updated_at
  BEFORE UPDATE ON car_interests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
