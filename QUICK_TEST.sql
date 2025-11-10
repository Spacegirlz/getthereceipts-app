-- QUICK TEST: Test redeem_coupon and see exact response
-- Run this with a real user ID

-- Step 1: Get a test user
SELECT id, email, subscription_status, credits_remaining
FROM users 
WHERE subscription_status = 'free' 
LIMIT 1;

-- Step 2: Test BF5 (replace USER_ID_HERE with ID from Step 1)
-- SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);

-- Step 3: Check the response format
-- The response should be JSON with these fields:
-- {
--   "success": true/false,
--   "coupon_name": "...",
--   "receipts_count": 5,
--   "is_premium": true,
--   "new_credits": ...,
--   ...
-- }

-- If you get an error, check:
-- 1. Is the user premium? (premium users can't use coupons)
-- 2. Has the user already used this coupon?
-- 3. Is the coupon expired or at usage limit?

