-- ADD CHRISTMAS COUPONS: SageSanta05 and GTRChristmas10
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Add SageSanta05 (5 credits)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'SAGESANTA05') THEN
    INSERT INTO coupon_codes (
      code,
      coupon_name,
      tier,
      receipts_count,
      is_premium,
      is_active,
      expires_at,
      max_uses,
      usage_count
    ) VALUES (
      'SAGESANTA05',                    -- Uppercase code
      'Sage Santa 05',                 -- Display name
      'Premium',                        -- Tier
      5,                                -- 5 credits (receipts_count)
      true,                             -- Premium credits
      true,                             -- Active
      '2025-12-31 23:59:59+00'::TIMESTAMPTZ,  -- Expires end of 2025
      1000,                             -- Max 1000 uses
      0                                 -- Starting usage count
    );
    RAISE NOTICE 'SAGESANTA05 coupon created successfully';
  ELSE
    UPDATE coupon_codes 
    SET 
      coupon_name = 'Sage Santa 05',
      receipts_count = 5,
      is_premium = true,
      tier = 'Premium',
      is_active = true,
      expires_at = '2025-12-31 23:59:59+00'::TIMESTAMPTZ,
      max_uses = 1000
    WHERE UPPER(code) = 'SAGESANTA05';
    RAISE NOTICE 'SAGESANTA05 coupon updated';
  END IF;
END $$;

-- ============================================
-- Step 2: Add GTRChristmas10 (10 credits)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'GTRCHRISTMAS10') THEN
    INSERT INTO coupon_codes (
      code,
      coupon_name,
      tier,
      receipts_count,
      is_premium,
      is_active,
      expires_at,
      max_uses,
      usage_count
    ) VALUES (
      'GTRCHRISTMAS10',                 -- Uppercase code
      'GTR Christmas 10',               -- Display name
      'Premium',                        -- Tier
      10,                               -- 10 credits (receipts_count)
      true,                             -- Premium credits
      true,                             -- Active
      '2025-12-31 23:59:59+00'::TIMESTAMPTZ,  -- Expires end of 2025
      1000,                             -- Max 1000 uses
      0                                 -- Starting usage count
    );
    RAISE NOTICE 'GTRCHRISTMAS10 coupon created successfully';
  ELSE
    UPDATE coupon_codes 
    SET 
      coupon_name = 'GTR Christmas 10',
      receipts_count = 10,
      is_premium = true,
      tier = 'Premium',
      is_active = true,
      expires_at = '2025-12-31 23:59:59+00'::TIMESTAMPTZ,
      max_uses = 1000
    WHERE UPPER(code) = 'GTRCHRISTMAS10';
    RAISE NOTICE 'GTRCHRISTMAS10 coupon updated';
  END IF;
END $$;

-- ============================================
-- Step 3: Verify Coupons Were Created
-- ============================================
SELECT 
  code,
  coupon_name,
  tier,
  receipts_count,
  is_premium,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  CASE 
    WHEN is_active = true AND (expires_at IS NULL OR expires_at > NOW()) AND usage_count < max_uses 
    THEN '✅ Active and ready'
    WHEN expires_at < NOW() THEN '❌ Expired'
    WHEN NOT is_active THEN '❌ Inactive'
    WHEN usage_count >= max_uses THEN '❌ Max Uses Reached'
    ELSE '❌ Inactive or expired'
  END as status
FROM coupon_codes
WHERE UPPER(code) IN ('SAGESANTA05', 'GTRCHRISTMAS10')
ORDER BY code;

-- ============================================
-- Expected Result:
-- ============================================
-- code            | coupon_name      | tier    | receipts_count | is_premium | is_active | expires_at              | max_uses | usage_count | status
-- SAGESANTA05     | Sage Santa 05    | Premium | 5              | true       | true      | 2025-12-31 23:59:59+00 | 1000     | 0           | ✅ Active and ready
-- GTRCHRISTMAS10  | GTR Christmas 10 | Premium | 10             | true       | true      | 2025-12-31 23:59:59+00 | 1000     | 0           | ✅ Active and ready

