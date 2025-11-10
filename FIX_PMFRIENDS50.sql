-- FIX: PMFRIENDS50 Coupon Creation
-- This script creates/verifies the PMFRIENDS50 coupon
-- Run this in Supabase SQL Editor

-- ============================================
-- Create/Verify PMFRIENDS50 Coupon
-- ============================================

-- Check if PMFRIENDS50 already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'PMFRIENDS50') THEN
    -- Insert PMFRIENDS50 coupon
    -- Adjust these values based on what PMFRIENDS50 should provide:
    INSERT INTO coupon_codes (
      code, 
      coupon_name, 
      tier, 
      receipts_count, 
      is_premium, 
      is_active, 
      max_uses,
      expires_at
    ) VALUES (
      'PMFRIENDS50',
      'PM Friends Special',
      'Premium', -- or 'Basic' depending on tier
      50, -- Assuming 50 credits based on name, adjust if different
      true, -- Assuming premium, adjust if basic
      true,
      100, -- Adjust max uses as needed
      '2024-12-31 23:59:59'::TIMESTAMPTZ -- Adjust expiration as needed
    );
    
    RAISE NOTICE 'PMFRIENDS50 coupon created successfully';
  ELSE
    RAISE NOTICE 'PMFRIENDS50 coupon already exists';
    
    -- Update existing PMFRIENDS50 to ensure it's active and has correct settings
    UPDATE coupon_codes 
    SET 
      is_active = true,
      receipts_count = 50, -- Adjust if different
      is_premium = true, -- Adjust if basic
      tier = 'Premium', -- Adjust if basic
      max_uses = 100, -- Adjust as needed
      expires_at = '2024-12-31 23:59:59'::TIMESTAMPTZ -- Adjust as needed
    WHERE UPPER(code) = 'PMFRIENDS50';
    
    RAISE NOTICE 'PMFRIENDS50 coupon updated';
  END IF;
END $$;

-- ============================================
-- Verify PMFRIENDS50 Coupon
-- ============================================

-- Check PMFRIENDS50 coupon exists and is active
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
WHERE UPPER(code) = 'PMFRIENDS50';

-- ============================================
-- Quick Status Check
-- ============================================

SELECT 
  'PMFRIENDS50 Coupon Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM coupon_codes 
      WHERE UPPER(code) = 'PMFRIENDS50' AND is_active = true
    ) THEN '✅ PMFRIENDS50 exists and is active'
    ELSE '❌ PMFRIENDS50 missing or inactive'
  END as status;

-- ============================================
-- NOTES
-- ============================================
-- Adjust the following values based on your requirements:
-- - receipts_count: Currently set to 50 (based on name)
-- - is_premium: Currently set to true (premium receipts)
-- - tier: Currently set to 'Premium'
-- - max_uses: Currently set to 100
-- - expires_at: Currently set to Dec 31, 2024
--
-- If PMFRIENDS50 should provide different credits or settings,
-- update the INSERT and UPDATE statements above accordingly.
-- ============================================

