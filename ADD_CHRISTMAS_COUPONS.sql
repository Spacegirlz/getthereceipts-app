-- ADD CHRISTMAS COUPONS: SageSanta05 and GTRChristmas10
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Add SageSanta05 (5 credits)
-- ============================================
INSERT INTO coupon_codes (
  code,
  coupon_name,
  credits_to_add,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  created_at
) VALUES (
  'SAGESANTA05',                    -- Uppercase code
  'Sage Santa 05',                  -- Display name
  5,                                -- 5 credits
  true,                             -- Active
  '2025-12-31 23:59:59+00',        -- Expires end of 2025
  1000,                             -- Max 1000 uses
  0,                                -- Starting usage count
  NOW()                             -- Created now
)
ON CONFLICT (code) 
DO UPDATE SET
  coupon_name = EXCLUDED.coupon_name,
  credits_to_add = EXCLUDED.credits_to_add,
  is_active = EXCLUDED.is_active,
  expires_at = EXCLUDED.expires_at,
  max_uses = EXCLUDED.max_uses;

-- ============================================
-- Step 2: Add GTRChristmas10 (10 credits)
-- ============================================
INSERT INTO coupon_codes (
  code,
  coupon_name,
  credits_to_add,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  created_at
) VALUES (
  'GTRCHRISTMAS10',                 -- Uppercase code
  'GTR Christmas 10',               -- Display name
  10,                               -- 10 credits
  true,                             -- Active
  '2025-12-31 23:59:59+00',        -- Expires end of 2025
  1000,                             -- Max 1000 uses
  0,                                -- Starting usage count
  NOW()                             -- Created now
)
ON CONFLICT (code) 
DO UPDATE SET
  coupon_name = EXCLUDED.coupon_name,
  credits_to_add = EXCLUDED.credits_to_add,
  is_active = EXCLUDED.is_active,
  expires_at = EXCLUDED.expires_at,
  max_uses = EXCLUDED.max_uses;

-- ============================================
-- Step 3: Verify Coupons Were Created
-- ============================================
SELECT 
  code,
  coupon_name,
  credits_to_add,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  CASE 
    WHEN expires_at < NOW() THEN '❌ Expired'
    WHEN NOT is_active THEN '❌ Inactive'
    WHEN usage_count >= max_uses THEN '❌ Max Uses Reached'
    ELSE '✅ Active'
  END as status
FROM coupon_codes
WHERE code IN ('SAGESANTA05', 'GTRCHRISTMAS10')
ORDER BY code;

-- ============================================
-- Expected Result:
-- ============================================
-- code            | coupon_name      | credits_to_add | is_active | expires_at              | max_uses | usage_count | status
-- SAGESANTA05     | Sage Santa 05    | 5              | true      | 2025-12-31 23:59:59+00 | 1000     | 0           | ✅ Active
-- GTRCHRISTMAS10  | GTR Christmas 10  | 10             | true      | 2025-12-31 23:59:59+00 | 1000     | 0           | ✅ Active

