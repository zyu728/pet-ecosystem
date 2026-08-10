-- 宠物社区动态
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_read_all" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_delete_own" ON posts FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_read_all" ON post_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
