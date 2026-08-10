-- 关注系统
CREATE TABLE follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_read_all" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- 已读回执
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- Storage bucket 创建（需在 Supabase 控制台手动操作）
-- 1. Storage → New Bucket → 名称: uploads → 勾选 Public
-- 2. 在 uploads bucket → Policies → 添加:
--    - SELECT: 所有人 (true)
--    - INSERT: 登录用户 (auth.uid() IS NOT NULL)
