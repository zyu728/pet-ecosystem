-- 走失寻回系统
CREATE TABLE lost_pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_seen_lat DOUBLE PRECISION,
  last_seen_lng DOUBLE PRECISION,
  last_seen_at TIMESTAMPTZ,
  note TEXT,
  reward TEXT,
  contact TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'found')),
  found_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lost_pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lost_read_all" ON lost_pets FOR SELECT USING (true);
CREATE POLICY "lost_insert_own" ON lost_pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "lost_update_own" ON lost_pets FOR UPDATE USING (auth.uid() = owner_id);
