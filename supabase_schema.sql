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
  ships_black_tees_ny TEXT,
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

-- User settingsテーブルを作成
CREATE TABLE IF NOT EXISTS "user-settings" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  name TEXT,
  address TEXT,
  email TEXT,
  phone_number TEXT,
  payment_info TEXT,
  brand_name TEXT,
  brand_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_user_settings_clerk_id ON "user-settings"(clerk_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_email ON "user-settings"(email);

-- Row Level Security (RLS) を有効化
ALTER TABLE "user-settings" ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーが自分のデータをINSERTできるポリシー
CREATE POLICY "Allow authenticated insert" ON "user-settings"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 認証済みユーザーが自分のデータをSELECTできるポリシー
CREATE POLICY "Allow authenticated select" ON "user-settings"
  FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザーが自分のデータをUPDATEできるポリシー
CREATE POLICY "Allow authenticated update" ON "user-settings"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

