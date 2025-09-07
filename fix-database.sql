-- Fix Database Schema for Get The Receipts
-- Run this in Supabase SQL Editor

-- 1. Add the save_receipts column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS save_receipts BOOLEAN DEFAULT FALSE;

-- 2. Set default value for existing users (privacy first)
UPDATE users 
SET save_receipts = FALSE 
WHERE save_receipts IS NULL;

-- 3. Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'save_receipts';

-- 4. Optional: Enable saving for your account (replace with your email)
-- UPDATE users 
-- SET save_receipts = TRUE 
-- WHERE email = 'your-email@example.com';

-- Expected output: Should show the save_receipts column with type 'boolean'