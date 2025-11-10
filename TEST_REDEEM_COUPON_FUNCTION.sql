-- TEST: Verify redeem_coupon function works
-- Run this in Supabase SQL Editor to test the function directly

-- ============================================
-- Step 1: Check if function exists and is callable
-- ============================================

SELECT 
  routine_name,
  routine_type,
  data_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'redeem_coupon' 
  AND routine_schema = 'public';

-- ============================================
-- Step 2: Test function with a real user
-- ============================================
-- Replace USER_ID_HERE with an actual user UUID from your database

-- First, get a test user ID:
SELECT id, email, subscription_status, credits_remaining 
FROM users 
WHERE subscription_status = 'free' 
LIMIT 1;

-- Then test the function (replace USER_ID_HERE with the UUID from above):
-- SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);
-- SELECT public.redeem_coupon('PMFRIENDS50', 'USER_ID_HERE'::UUID);

-- ============================================
-- Step 3: Check function permissions
-- ============================================

SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  r.rolname as grantee
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
LEFT JOIN pg_proc_acl pa ON p.oid = pa.prooid
LEFT JOIN pg_roles r ON pa.proacl::text LIKE '%' || r.rolname || '%'
WHERE p.proname = 'redeem_coupon'
  AND n.nspname = 'public';

-- ============================================
-- Step 4: Check if RPC is enabled for the function
-- ============================================

SELECT 
  routine_name,
  routine_type,
  security_type,
  is_deterministic
FROM information_schema.routines 
WHERE routine_name = 'redeem_coupon' 
  AND routine_schema = 'public';

-- ============================================
-- Step 5: Verify both coupons exist and are active
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
  END as expiration_status,
  CASE 
    WHEN usage_count >= max_uses THEN '❌ Usage limit reached'
    WHEN usage_count < max_uses THEN '✅ Has remaining uses'
  END as usage_status
FROM coupon_codes 
WHERE UPPER(code) IN ('BF5', 'PMFRIENDS50')
ORDER BY code;

