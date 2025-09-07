-- Add save_receipts column to users table
-- Run this in your Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS save_receipts BOOLEAN DEFAULT FALSE;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'save_receipts';

-- Optional: Update all existing users to have save_receipts = false (privacy default)
UPDATE users SET save_receipts = FALSE WHERE save_receipts IS NULL;