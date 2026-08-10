-- 电子围栏
CREATE TABLE geofences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 500,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 告警记录
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE geofences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "geofences_owner" ON geofences FOR ALL
  USING (pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid()));
CREATE POLICY "geofences_insert" ON geofences FOR INSERT
  WITH CHECK (pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid()));

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_owner" ON alerts FOR SELECT USING (auth.uid() = user_id);
