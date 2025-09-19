-- 🔍 VERIFICATION CHECK - Run this to see all results
-- This will show you the status of all database components

-- Check all tables exist
SELECT 
  'Tables Check' as verification_type,
  COUNT(*) as tables_found
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'receipts', 'coupon_codes', 'coupon_usage', 'user_referral_codes', 'referrals', 'subscription_events', 'credit_history');

-- Check all functions exist
SELECT 
  'Functions Check' as verification_type,
  COUNT(*) as functions_found
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_user_credits', 'process_referral', 'redeem_coupon', 'consume_credit', 'add_user_credits', 'handle_new_user');

-- Check test users exist
SELECT 
  'Test Users Check' as verification_type,
  COUNT(*) as test_users_found
FROM public.users
WHERE email LIKE '%testuser%' OR email = 'piet@virtualsatchel.com';

-- Check active coupons
SELECT 
  'Active Coupons Check' as verification_type,
  COUNT(*) as active_coupons
FROM public.coupon_codes
WHERE is_active = TRUE;

-- Check if subscription_events table exists
SELECT 
  'Subscription Events Table' as verification_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_events' AND table_schema = 'public') 
    THEN 'EXISTS' 
    ELSE 'MISSING' 
  END as status;

-- Check if credit_history table exists
SELECT 
  'Credit History Table' as verification_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_history' AND table_schema = 'public') 
    THEN 'EXISTS' 
    ELSE 'MISSING' 
  END as status;

-- Check if handle_new_user function exists
SELECT 
  'Handle New User Function' as verification_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') 
    THEN 'EXISTS' 
    ELSE 'MISSING' 
  END as status;
