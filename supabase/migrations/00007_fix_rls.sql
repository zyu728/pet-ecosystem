-- Fix missing RLS policies found during code review
-- alerts: add INSERT and UPDATE policies
CREATE POLICY "alerts_insert" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update" ON alerts FOR UPDATE USING (auth.uid() = user_id);

-- post_likes: enable RLS and add policies
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_read_all" ON post_likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- posts: add missing UPDATE policy
CREATE POLICY "posts_update_own" ON posts FOR UPDATE USING (auth.uid() = author_id);
