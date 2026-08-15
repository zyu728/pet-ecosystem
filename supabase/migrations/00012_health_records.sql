-- 宠物健康档案
CREATE TABLE health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT CHECK (record_type IN ('vaccine','visit','weight','medication','surgery','other')) NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_date DATE,
  weight_kg DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_pet_date ON health_records (pet_id, record_date DESC);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "health_read_all" ON health_records FOR SELECT USING (true);
CREATE POLICY "health_insert_owner" ON health_records FOR INSERT WITH CHECK (
  pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
);
CREATE POLICY "health_update_owner" ON health_records FOR UPDATE USING (
  pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
);
CREATE POLICY "health_delete_owner" ON health_records FOR DELETE USING (
  pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
);
