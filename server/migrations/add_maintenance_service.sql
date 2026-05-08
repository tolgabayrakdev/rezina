CREATE TABLE car_maintenance_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    interval_km INT NOT NULL CHECK (interval_km > 0),
    last_done_mileage INT CHECK (last_done_mileage >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_car_maintenance_items_car_id ON car_maintenance_items(car_id);

CREATE TABLE car_service_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    mileage INT CHECK (mileage >= 0),
    service_date DATE,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_car_service_records_car_id ON car_service_records(car_id);
