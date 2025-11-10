-- TEST: Test redeem_coupon function directly
-- This will help identify if the issue is with the function or RPC access

-- ============================================
-- Step 1: Get a test user (free user, not premium)
-- ============================================
SELECT 
  id, 
  email, 
  subscription_status, 
  credits_remaining
FROM users 
WHERE subscription_status = 'free' 
ORDER BY created_at DESC
LIMIT 3;

-- ============================================
-- Step 2: Test BF5 redemption directly
-- ============================================
-- Copy a user ID from Step 1 and replace USER_ID_HERE below:

-- Example (uncomment and replace USER_ID_HERE):
-- SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);

-- ============================================
-- Step 3: Check what the function returns
-- ============================================
-- The function should return JSON like:
-- {
--   "success": true,
--   "coupon_name": "Black Friday Freebie",
--   "receipts_count": 5,
--   "is_premium": true,
--   "new_credits": 8,
--   ...
-- }

-- ============================================
-- Step 4: Check if user already used the coupon
-- ============================================
-- If the function says "already used", check here:
-- SELECT * FROM coupon_usage 
-- WHERE user_id = 'USER_ID_HERE'::UUID 
-- AND coupon_code = 'BF5';

-- ============================================
-- Step 5: Verify grants are applied
-- ============================================
-- Check if authenticated role can see the function
SELECT 
  has_function_privilege('authenticated', 'public.redeem_coupon(VARCHAR, UUID)', 'EXECUTE') as authenticated_can_execute,
  has_function_privilege('anon', 'public.redeem_coupon(VARCHAR, UUID)', 'EXECUTE') as anon_can_execute,
  has_function_privilege('service_role', 'public.redeem_coupon(VARCHAR, UUID)', 'EXECUTE') as service_role_can_execute;

