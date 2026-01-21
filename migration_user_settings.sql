-- Migration script to update user-settings table structure
-- Run this script in your Supabase SQL editor to update the existing table

-- Step 1: Add new columns (if they don't exist)
DO $$ 
BEGIN
  -- Add first_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'first_name') THEN
    ALTER TABLE "user-settings" ADD COLUMN first_name TEXT;
  END IF;

  -- Add last_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'last_name') THEN
    ALTER TABLE "user-settings" ADD COLUMN last_name TEXT;
  END IF;

  -- Add country column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'country') THEN
    ALTER TABLE "user-settings" ADD COLUMN country TEXT DEFAULT 'US';
  END IF;

  -- Add state_region column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'state_region') THEN
    ALTER TABLE "user-settings" ADD COLUMN state_region TEXT;
  END IF;

  -- Add zip_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'zip_code') THEN
    ALTER TABLE "user-settings" ADD COLUMN zip_code TEXT;
  END IF;

  -- Add city column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'city') THEN
    ALTER TABLE "user-settings" ADD COLUMN city TEXT;
  END IF;

  -- Add address_line1 column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'address_line1') THEN
    ALTER TABLE "user-settings" ADD COLUMN address_line1 TEXT;
  END IF;

  -- Add address_line2 column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'address_line2') THEN
    ALTER TABLE "user-settings" ADD COLUMN address_line2 TEXT;
  END IF;

  -- Add card_number column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'card_number') THEN
    ALTER TABLE "user-settings" ADD COLUMN card_number TEXT;
  END IF;

  -- Add card_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'card_name') THEN
    ALTER TABLE "user-settings" ADD COLUMN card_name TEXT;
  END IF;

  -- Add card_exp_month column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'card_exp_month') THEN
    ALTER TABLE "user-settings" ADD COLUMN card_exp_month TEXT;
  END IF;

  -- Add card_exp_year column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'card_exp_year') THEN
    ALTER TABLE "user-settings" ADD COLUMN card_exp_year TEXT;
  END IF;

  -- Add card_security_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user-settings' AND column_name = 'card_security_code') THEN
    ALTER TABLE "user-settings" ADD COLUMN card_security_code TEXT;
  END IF;
END $$;

-- Step 2: Migrate existing data (if any)
-- Split name into first_name and last_name if name exists
UPDATE "user-settings"
SET 
  first_name = CASE 
    WHEN name IS NOT NULL AND name != '' THEN 
      CASE 
        WHEN position(' ' in name) > 0 THEN substring(name from 1 for position(' ' in name) - 1)
        ELSE name
      END
    ELSE NULL
  END,
  last_name = CASE 
    WHEN name IS NOT NULL AND name != '' THEN 
      CASE 
        WHEN position(' ' in name) > 0 THEN substring(name from position(' ' in name) + 1)
        ELSE NULL
      END
    ELSE NULL
  END
WHERE name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL);

-- Migrate address to address_line1 if address exists
UPDATE "user-settings"
SET address_line1 = address
WHERE address IS NOT NULL AND address != '' AND address_line1 IS NULL;

-- Step 3: (Optional) Drop old columns after migration
-- Uncomment these lines if you want to remove the old columns after verifying the migration
-- ALTER TABLE "user-settings" DROP COLUMN IF EXISTS name;
-- ALTER TABLE "user-settings" DROP COLUMN IF EXISTS address;
-- ALTER TABLE "user-settings" DROP COLUMN IF EXISTS payment_info;

-- Note: Keep the old columns (name, address, payment_info) for now if you have existing data
-- You can drop them later after verifying everything works correctly
