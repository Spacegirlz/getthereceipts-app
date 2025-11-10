-- VERIFY CHRISTMAS COUPONS STATUS
-- Run this in Supabase SQL Editor to check coupon status

-- ============================================
-- Check All Active Coupons
-- ============================================
SELECT 
  code,
  coupon_name,
  credits_to_add,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  (max_uses - usage_count) as remaining_uses,
  CASE 
    WHEN expires_at < NOW() THEN '❌ Expired'
    WHEN NOT is_active THEN '❌ Inactive'
    WHEN usage_count >= max_uses THEN '❌ Max Uses Reached'
    ELSE '✅ Active'
  END as status
FROM coupon_codes
WHERE code IN ('SAGESANTA05', 'GTRCHRISTMAS10', 'BF5', 'PMFRIENDS50')
ORDER BY code;

-- ============================================
-- Test Coupon Redemption (Replace USER_ID)
-- ============================================
-- Uncomment and replace USER_ID_HERE with actual user ID to test:
-- SELECT public.redeem_coupon(
--   'USER_ID_HERE'::UUID,
--   'SAGESANTA05'
-- ) as sage_santa_result;

-- SELECT public.redeem_coupon(
--   'USER_ID_HERE'::UUID,
--   'GTRCHRISTMAS10'
-- ) as christmas_result;

