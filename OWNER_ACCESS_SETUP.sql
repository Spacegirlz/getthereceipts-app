-- Owner Access Setup - Run this in Supabase SQL Editor
-- This gives piet@virtualsatchel.com full founder-level access

-- Option 1: Update existing user to founder status
UPDATE users 
SET 
  subscription_status = 'founder',
  credits_remaining = 999999,  -- Unlimited credits as backup
  last_free_receipt_date = CURRENT_DATE
WHERE email = 'piet@virtualsatchel.com';

-- Option 2: If user doesn't exist yet, create the record
INSERT INTO users (id, email, subscription_status, credits_remaining, last_free_receipt_date, created_at, updated_at)
SELECT 
  auth.users.id,
  'piet@virtualsatchel.com',
  'founder',
  999999,
  CURRENT_DATE,
  NOW(),
  NOW()
FROM auth.users
WHERE auth.users.email = 'piet@virtualsatchel.com'
  AND NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'piet@virtualsatchel.com'
  );

-- Verify the setup
SELECT 
  id,
  email,
  subscription_status,
  credits_remaining,
  created_at
FROM users 
WHERE email = 'piet@virtualsatchel.com';

-- This ensures:
-- 1. Code-level bypass for piet@virtualsatchel.com (already added)
-- 2. Database-level founder status as backup
-- 3. Unlimited credits for complete access