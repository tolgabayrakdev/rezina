ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS vehicle_type    VARCHAR(20) CHECK (vehicle_type IN ('passenger', 'commercial')),
  ADD COLUMN IF NOT EXISTS insurance_date  DATE,
  ADD COLUMN IF NOT EXISTS inspection_date DATE;
