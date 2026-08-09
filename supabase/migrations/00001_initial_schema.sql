-- ==========================================
-- 商丘宠物生态平台 — 初始数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件
-- ==========================================

-- 1. 用户扩展资料表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_subscribed BOOLEAN DEFAULT FALSE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, phone) VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. 宠物档案表
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT CHECK (species IN ('dog', 'cat', 'other')) DEFAULT 'dog',
  breed TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  weight DOUBLE PRECISION,
  avatar_url TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  vaccine_records JSONB DEFAULT '[]'::jsonb,
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 店铺/医院表
CREATE TABLE IF NOT EXISTS shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('pet_shop', 'pet_hospital', 'grooming')) NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone TEXT,
  business_hours TEXT,
  rating DOUBLE PRECISION DEFAULT 0,
  cover_image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 商品/服务表
CREATE TABLE IF NOT EXISTS shop_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('food', 'supplies', 'medicine', 'service')) NOT NULL,
  price DOUBLE PRECISION NOT NULL DEFAULT 0,
  image TEXT,
  delivery_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 追踪项圈表
CREATE TABLE IF NOT EXISTS tracking_collars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  device_serial TEXT UNIQUE NOT NULL,
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  last_ping_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GPS轨迹记录表
CREATE TABLE IF NOT EXISTS tracking_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collar_id UUID REFERENCES tracking_collars(id) ON DELETE CASCADE NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_records_collar_time ON tracking_records (collar_id, recorded_at DESC);

-- 7. 会话表
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- 8. 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_time ON messages (conversation_id, created_at);

-- 9. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'delivering', 'done')) DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RLS (Row Level Security) 策略
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_collars ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- profiles: 可读所有，只能改自己
DROP POLICY IF EXISTS "profiles_read_all" ON profiles;
CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- pets: 主人读写
DROP POLICY IF EXISTS "pets_read_all" ON pets;
CREATE POLICY "pets_read_all" ON pets FOR SELECT USING (true);
DROP POLICY IF EXISTS "pets_insert_own" ON pets;
CREATE POLICY "pets_insert_own" ON pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "pets_update_own" ON pets;
CREATE POLICY "pets_update_own" ON pets FOR UPDATE USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "pets_delete_own" ON pets;
CREATE POLICY "pets_delete_own" ON pets FOR DELETE USING (auth.uid() = owner_id);

-- shops: 所有人可读
DROP POLICY IF EXISTS "shops_read_all" ON shops;
CREATE POLICY "shops_read_all" ON shops FOR SELECT USING (true);
DROP POLICY IF EXISTS "shop_products_read_all" ON shop_products;
CREATE POLICY "shop_products_read_all" ON shop_products FOR SELECT USING (true);

-- tracking
DROP POLICY IF EXISTS "collars_own" ON tracking_collars;
CREATE POLICY "collars_own" ON tracking_collars FOR ALL USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "records_own" ON tracking_records;
CREATE POLICY "records_own" ON tracking_records FOR SELECT USING (
  collar_id IN (SELECT id FROM tracking_collars WHERE owner_id = auth.uid())
);
DROP POLICY IF EXISTS "records_insert_own" ON tracking_records;
CREATE POLICY "records_insert_own" ON tracking_records FOR INSERT WITH CHECK (
  collar_id IN (SELECT id FROM tracking_collars WHERE owner_id = auth.uid())
);

-- conversations / messages
DROP POLICY IF EXISTS "conversations_participant" ON conversations;
CREATE POLICY "conversations_participant" ON conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
DROP POLICY IF EXISTS "conversations_insert" ON conversations;
CREATE POLICY "conversations_insert" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);
DROP POLICY IF EXISTS "messages_participant" ON messages;
CREATE POLICY "messages_participant" ON messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM conversations WHERE auth.uid() = participant_1 OR auth.uid() = participant_2)
);
DROP POLICY IF EXISTS "messages_insert_own" ON messages;
CREATE POLICY "messages_insert_own" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- orders
DROP POLICY IF EXISTS "orders_buyer" ON orders;
CREATE POLICY "orders_buyer" ON orders FOR SELECT USING (auth.uid() = buyer_id);
DROP POLICY IF EXISTS "orders_insert" ON orders;
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- ==========================================
-- Realtime 订阅
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
