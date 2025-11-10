-- FIX: BF5 and PMFRIENDS50 Coupons
-- This script creates/verifies both coupons
-- Run this in Supabase SQL Editor

-- ============================================
-- Create/Verify BF5 Coupon (Black Friday Special)
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'BF5') THEN
    INSERT INTO coupon_codes (
      code, coupon_name, tier, receipts_count, is_premium, is_active, max_uses, expires_at
    ) VALUES (
      'BF5', 'Black Friday Special', 'Premium', 5, true, true, 500, '2024-12-31 23:59:59'::TIMESTAMPTZ
    );
    RAISE NOTICE 'BF5 coupon created successfully';
  ELSE
    UPDATE coupon_codes 
    SET is_active = true, receipts_count = 5, is_premium = true, tier = 'Premium',
        max_uses = 500, expires_at = '2024-12-31 23:59:59'::TIMESTAMPTZ
    WHERE UPPER(code) = 'BF5';
    RAISE NOTICE 'BF5 coupon updated';
  END IF;
END $$;

-- ============================================
-- Create/Verify PMFRIENDS50 Coupon
-- ============================================
-- NOTE: Adjust values below based on actual requirements
-- Current assumptions: 50 premium credits, 100 max uses

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'PMFRIENDS50') THEN
    INSERT INTO coupon_codes (
      code, coupon_name, tier, receipts_count, is_premium, is_active, max_uses, expires_at
    ) VALUES (
      'PMFRIENDS50', 
      'PM Friends Special', 
      'Premium',  -- Change to 'Basic' if needed
      50,          -- Number of credits - adjust if different
      true,        -- true for premium, false for basic
      true, 
      100,         -- Max uses - adjust as needed
      '2024-12-31 23:59:59'::TIMESTAMPTZ  -- Expiration - adjust as needed
    );
    RAISE NOTICE 'PMFRIENDS50 coupon created successfully';
  ELSE
    UPDATE coupon_codes 
    SET 
      is_active = true,
      receipts_count = 50,      -- Adjust if different
      is_premium = true,        -- Adjust if basic
      tier = 'Premium',         -- Adjust if basic
      max_uses = 100,           -- Adjust as needed
      expires_at = '2024-12-31 23:59:59'::TIMESTAMPTZ  -- Adjust as needed
    WHERE UPPER(code) = 'PMFRIENDS50';
    RAISE NOTICE 'PMFRIENDS50 coupon updated';
  END IF;
END $$;

-- ============================================
-- Verify Both Coupons
-- ============================================

SELECT 
  code,
  coupon_name,
  tier,
  receipts_count,
  is_premium,
  is_active,
  max_uses,
  usage_count,
  expires_at,
  CASE 
    WHEN is_active = true AND (expires_at IS NULL OR expires_at > NOW()) AND usage_count < max_uses 
    THEN '✅ Active and ready'
    ELSE '❌ Inactive or expired'
  END as status
FROM coupon_codes 
WHERE UPPER(code) IN ('BF5', 'PMFRIENDS50')
ORDER BY code;

-- ============================================
-- Quick Status Check
-- ============================================

SELECT 
  'BF5 Coupon Status' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'BF5' AND is_active = true)
    THEN '✅ BF5 exists and is active'
    ELSE '❌ BF5 missing or inactive'
  END as status
UNION ALL
SELECT 
  'PMFRIENDS50 Coupon Status',
  CASE 
    WHEN EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'PMFRIENDS50' AND is_active = true)
    THEN '✅ PMFRIENDS50 exists and is active'
    ELSE '❌ PMFRIENDS50 missing or inactive'
  END;

