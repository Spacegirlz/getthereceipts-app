-- FIX: Ensure Emergency Pack webhook will work
-- Add missing columns that webhook tries to update
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Add missing columns to users table
-- ============================================

-- Add subscription_expires_at if it doesn't exist (for premium subscriptions)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- Add updated_at if it doesn't exist (though webhook doesn't use it, but good to have)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- Step 2: Verify all required columns exist
-- ============================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name IN (
    'credits_remaining',
    'subscription_status',
    'last_free_receipt_date',
    'subscription_expires_at',
    'updated_at'
  )
ORDER BY column_name;

-- ============================================
-- Step 3: Test Emergency Pack update (simulation)
-- ============================================
-- This shows what the webhook will do:
-- For $0.99 Emergency Pack x5:
--   - credits_remaining = credits_remaining + 5
--   - subscription_status = 'free' (or keep current)
--   - last_free_receipt_date = today
--
-- For $1.99 Emergency Pack x10:
--   - credits_remaining = credits_remaining + 10
--   - subscription_status = 'free' (or keep current)
--   - last_free_receipt_date = today

-- ============================================
-- Verification Query
-- ============================================
SELECT 
  'All required columns exist' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND table_schema = 'public'
        AND column_name = 'credits_remaining'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND table_schema = 'public'
        AND column_name = 'subscription_status'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'users' 
        AND table_schema = 'public'
        AND column_name = 'last_free_receipt_date'
    ) THEN '✅'
    ELSE '❌'
  END as status;

