-- ================================================================
-- Durva Woodcraft — Settings table migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ================================================================

-- Step 1: Add new credential + social columns to existing settings table
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS whatsapp_number  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS msme_number      TEXT DEFAULT 'MH-01-0084519',
  ADD COLUMN IF NOT EXISTS gst_number       TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS gem_seller_id    TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS instagram_url    TEXT DEFAULT 'https://instagram.com/durvawoodcraft',
  ADD COLUMN IF NOT EXISTS facebook_url     TEXT DEFAULT 'https://facebook.com/durvawoodcraft',
  ADD COLUMN IF NOT EXISTS youtube_url      TEXT DEFAULT 'https://youtube.com/@durvawoodcraft';

-- Step 2: Seed the MSME number you confirmed (MH-01-0084519)
UPDATE settings
SET
  msme_number     = 'MH-01-0084519',
  instagram_url   = 'https://instagram.com/durvawoodcraft',
  facebook_url    = 'https://facebook.com/durvawoodcraft',
  youtube_url     = 'https://youtube.com/@durvawoodcraft'
WHERE id = (SELECT id FROM settings LIMIT 1);

-- Step 3: Create inquiries table (for contact form + custom order submissions)
CREATE TABLE IF NOT EXISTS inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  message     TEXT NOT NULL,
  source      TEXT NOT NULL DEFAULT 'contact_form',  -- contact_form | custom_order | product_page
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Step 4: RLS on inquiries — only authenticated users (admin) can read
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can insert inquiries"
  ON inquiries FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can read inquiries"
  ON inquiries FOR SELECT TO authenticated
  USING (true);

-- Step 5: RLS on settings — public read, authenticated write
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read settings"
  ON settings FOR SELECT TO anon
  USING (true);

CREATE POLICY IF NOT EXISTS "Admin can update settings"
  ON settings FOR UPDATE TO authenticated
  USING (true);

-- Done. Go to Admin Panel > Settings to fill in remaining values.
-- Fields to fill after running this:
--   whatsapp_number  → your WhatsApp number (with country code, no +, e.g. 919XXXXXXXXX)
--   gst_number       → your GSTIN (e.g. 27XXXXXXXXXXXXX)
--   gem_seller_id    → your GeM Seller ID (once registered)
