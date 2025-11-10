-- FIX: BF5 Coupon Expiration Date
-- The coupon is showing as expired - this fixes the expiration date
-- Run this in Supabase SQL Editor

-- ============================================
-- Check Current BF5 Expiration
-- ============================================

SELECT 
  code,
  coupon_name,
  is_active,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN 'No expiration (never expires)'
    WHEN expires_at < NOW() THEN '❌ EXPIRED'
    WHEN expires_at > NOW() THEN '✅ Active (expires ' || expires_at || ')'
  END as expiration_status
FROM coupon_codes 
WHERE UPPER(code) = 'BF5';

-- ============================================
-- Fix BF5 Expiration Date
-- ============================================
-- Option 1: Set to expire Dec 31, 2024 (if we're still in 2024)
-- Option 2: Set to expire Dec 31, 2025 (if we're in 2025)
-- Option 3: Remove expiration (never expires)

-- Update BF5 to expire Dec 31, 2025 (adjust year as needed)
UPDATE coupon_codes 
SET 
  expires_at = '2025-12-31 23:59:59'::TIMESTAMPTZ,
  is_active = true
WHERE UPPER(code) = 'BF5';

-- OR if you want it to never expire, use:
-- UPDATE coupon_codes 
-- SET 
--   expires_at = NULL,
--   is_active = true
-- WHERE UPPER(code) = 'BF5';

-- ============================================
-- Verify Fix
-- ============================================

SELECT 
  code,
  coupon_name,
  is_active,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN '✅ Never expires'
    WHEN expires_at < NOW() THEN '❌ EXPIRED'
    WHEN expires_at > NOW() THEN '✅ Active until ' || expires_at
  END as status
FROM coupon_codes 
WHERE UPPER(code) = 'BF5';

-- ============================================
-- Also Fix PMFRIENDS50 if needed
-- ============================================

UPDATE coupon_codes 
SET 
  expires_at = '2025-12-31 23:59:59'::TIMESTAMPTZ,
  is_active = true
WHERE UPPER(code) = 'PMFRIENDS50';

-- Verify PMFRIENDS50
SELECT 
  code,
  coupon_name,
  is_active,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN '✅ Never expires'
    WHEN expires_at < NOW() THEN '❌ EXPIRED'
    WHEN expires_at > NOW() THEN '✅ Active until ' || expires_at
  END as status
FROM coupon_codes 
WHERE UPPER(code) = 'PMFRIENDS50';

