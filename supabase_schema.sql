-- Waitlistテーブルを作成
CREATE TABLE IF NOT EXISTS "waitlist-email" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを追加（email検索を高速化）
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON "waitlist-email"(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON "waitlist-email"(created_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE "waitlist-email" ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがINSERTできるポリシーを作成
CREATE POLICY "Allow public insert" ON "waitlist-email"
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 認証済みユーザーのみSELECTできるポリシーを作成（必要に応じて）
-- CREATE POLICY "Allow authenticated select" ON waitlist
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- Contact submissionsテーブルを作成
CREATE TABLE IF NOT EXISTS "contact-submissions" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brand_store_link TEXT,
  platform TEXT NOT NULL,
  message TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON "contact-submissions"(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_email ON "contact-submissions"(email);

-- Row Level Security (RLS) を有効化
ALTER TABLE "contact-submissions" ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがINSERTできるポリシーを作成
CREATE POLICY "Allow public insert" ON "contact-submissions"
  FOR INSERT
  TO public
  WITH CHECK (true);

