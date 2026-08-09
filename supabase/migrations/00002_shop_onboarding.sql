-- ==========================================
-- 商丘宠物生态平台 — 店铺入驻功能
-- 在 Supabase SQL Editor 中执行
-- ==========================================

-- 1. 给 profiles 添加角色字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'shop_owner'));

-- 2. 给 shops 添加 owner_id
ALTER TABLE shops ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id);
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON shops(owner_id);

-- 3. shops RLS：店主可编辑自己店铺
DROP POLICY IF EXISTS "shops_update_own" ON shops;
CREATE POLICY "shops_update_own" ON shops FOR UPDATE
  USING (auth.uid() = owner_id);

-- 4. shops RLS：登录用户可创建店铺(owner_id=自己)
DROP POLICY IF EXISTS "shops_insert_auth" ON shops;
CREATE POLICY "shops_insert_auth" ON shops FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

-- 5. shop_products RLS：店主可管理自己店铺的商品
DROP POLICY IF EXISTS "products_insert_own_shop" ON shop_products;
CREATE POLICY "products_insert_own_shop" ON shop_products FOR INSERT
  WITH CHECK (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

DROP POLICY IF EXISTS "products_update_own_shop" ON shop_products;
CREATE POLICY "products_update_own_shop" ON shop_products FOR UPDATE
  USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

DROP POLICY IF EXISTS "products_delete_own_shop" ON shop_products;
CREATE POLICY "products_delete_own_shop" ON shop_products FOR DELETE
  USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

-- 6. orders RLS：店主可查看自己店铺的订单
DROP POLICY IF EXISTS "orders_shop_owner" ON orders;
CREATE POLICY "orders_shop_owner" ON orders FOR SELECT
  USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

-- 7. orders RLS：店主可更新自己店铺订单状态
DROP POLICY IF EXISTS "orders_update_shop_owner" ON orders;
CREATE POLICY "orders_update_shop_owner" ON orders FOR UPDATE
  USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));
