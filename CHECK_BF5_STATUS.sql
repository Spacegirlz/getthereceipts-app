-- Quick check: BF5 Coupon Status
-- Run this to see if BF5 is also fixed

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

