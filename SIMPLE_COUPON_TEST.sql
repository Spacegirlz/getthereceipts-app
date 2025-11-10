-- SIMPLE TEST: Test redeem_coupon function
-- Run this step by step in Supabase SQL Editor

-- ============================================
-- Step 1: Get a test user (free user, not premium)
-- ============================================
SELECT 
  id, 
  email, 
  subscription_status, 
  credits_remaining,
  created_at
FROM users 
WHERE subscription_status = 'free' 
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- Step 2: Test BF5 redemption
-- ============================================
-- Copy a user ID from Step 1 and replace USER_ID_HERE below:

-- SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);

-- ============================================
-- Step 3: Test PMFRIENDS50 redemption  
-- ============================================
-- SELECT public.redeem_coupon('PMFRIENDS50', 'USER_ID_HERE'::UUID);

-- ============================================
-- Step 4: Check if user already used the coupon
-- ============================================
-- Replace USER_ID_HERE with the same user ID:

-- SELECT * FROM coupon_usage 
-- WHERE user_id = 'USER_ID_HERE'::UUID 
-- AND coupon_code IN ('BF5', 'PMFRIENDS50');

-- ============================================
-- Step 5: Verify coupons are active
-- ============================================
SELECT 
  code,
  coupon_name,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  CASE 
    WHEN expires_at IS NULL THEN 'Never expires'
    WHEN expires_at < NOW() THEN '❌ EXPIRED'
    WHEN expires_at > NOW() THEN '✅ Active'
  END as status
FROM coupon_codes 
WHERE UPPER(code) IN ('BF5', 'PMFRIENDS50');

