-- Migration script to remove old columns from user-settings table
-- Run this script in your Supabase SQL editor to remove the old columns

-- Step 1: Remove payment_info column (if it exists)
ALTER TABLE "user-settings" DROP COLUMN IF EXISTS payment_info;

-- Step 2: Remove address column (if it exists)
ALTER TABLE "user-settings" DROP COLUMN IF EXISTS address;

-- Step 3: Remove name column (if it exists) - replaced by first_name and last_name
ALTER TABLE "user-settings" DROP COLUMN IF EXISTS name;

-- Note: These columns will be permanently deleted.
-- Make sure you have migrated all data to the new columns before running this script.
-- If you need to keep the old data, run the migration_user_settings.sql first to copy data to new columns.
