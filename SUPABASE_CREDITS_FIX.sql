-- Fix Credits System in Supabase - Reset to 1 credit per day model
-- Run this in Supabase SQL Editor to fix any inconsistencies

-- Reset all free users to 1 credit and current date
UPDATE users 
SET 
  credits_remaining = 1,
  last_free_receipt_date = CURRENT_DATE
WHERE subscription_status = 'free' OR subscription_status IS NULL;

-- Verify the update
SELECT 
  id,
  email,
  subscription_status,
  credits_remaining,
  last_free_receipt_date,
  created_at
FROM users 
WHERE subscription_status = 'free' OR subscription_status IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Check for any users with unusual credit amounts
SELECT 
  subscription_status,
  credits_remaining,
  COUNT(*) as user_count
FROM users 
GROUP BY subscription_status, credits_remaining
ORDER BY subscription_status, credits_remaining;

-- This ensures:
-- 1. All free users have exactly 1 credit
-- 2. Their last reset date is today (so they get fresh credit)
-- 3. Daily reset logic will work correctly going forward