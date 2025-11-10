-- VERIFY: Emergency Pack Webhook Setup
-- Check if all required columns exist and webhook will work

-- ============================================
-- Step 1: Check users table columns
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
-- Step 2: Add missing columns if needed
-- ============================================

-- Add subscription_expires_at if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- Add updated_at if it doesn't exist (though webhook doesn't use it)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- Step 3: Verify Emergency Pack price IDs
-- ============================================
-- These should match what's in Stripe:
-- Emergency Pack x5: price_1SRl6hG71EqeOEZebPJkKJB6 ($0.99 → 5 credits)
-- Emergency Pack x10: price_1S0Po4G71EqeOEZeSqdB1Qfa ($1.99 → 10 credits)

-- ============================================
-- Step 4: Test query (simulate webhook update)
-- ============================================
-- This simulates what the webhook does for Emergency Pack x5 ($0.99)
-- Replace USER_EMAIL_HERE with a test email:

-- SELECT 
--   id,
--   email,
--   credits_remaining as current_credits,
--   subscription_status
-- FROM users 
-- WHERE email = 'USER_EMAIL_HERE';

-- Simulated update (don't run this, just for reference):
-- UPDATE users 
-- SET 
--   credits_remaining = credits_remaining + 5,
--   subscription_status = COALESCE(subscription_status, 'free'),
--   last_free_receipt_date = CURRENT_DATE
-- WHERE email = 'USER_EMAIL_HERE'
-- RETURNING id, email, credits_remaining, subscription_status;

-- ============================================
-- Step 5: Check webhook endpoint
-- ============================================
-- Verify the webhook endpoint exists:
-- - Should be at: /api/webhook
-- - Should handle: checkout.session.completed
-- - Should process: $0.99 (5 credits) and $1.99 (10 credits)

