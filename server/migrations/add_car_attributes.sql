ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS fuel_type    VARCHAR(20)  CHECK (fuel_type IN ('gasoline', 'diesel', 'lpg', 'electric', 'hybrid')),
  ADD COLUMN IF NOT EXISTS transmission VARCHAR(20)  CHECK (transmission IN ('automatic', 'manual')),
  ADD COLUMN IF NOT EXISTS body_type    VARCHAR(30)  CHECK (body_type IN ('sedan', 'hatchback', 'suv', 'station_wagon', 'pickup', 'truck')),
  ADD COLUMN IF NOT EXISTS engine_power INT          CHECK (engine_power > 0),
  ADD COLUMN IF NOT EXISTS engine_volume INT         CHECK (engine_volume > 0),
  ADD COLUMN IF NOT EXISTS drive_type   VARCHAR(20)  CHECK (drive_type IN ('fwd', 'rwd', '4wd', 'awd')),
  ADD COLUMN IF NOT EXISTS color        VARCHAR(50);
