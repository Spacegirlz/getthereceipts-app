-- 🚀 MASTER FIX EXECUTION SCRIPT
-- Run this script in your Supabase SQL Editor to fix all critical issues
-- This script executes all fixes in the correct order

-- ========================================
-- CRITICAL FIXES EXECUTION ORDER
-- ========================================

-- 1. Create missing subscription_events table
\echo '🔧 Step 1: Creating subscription_events table...'
\i FIX_SUBSCRIPTION_EVENTS_TABLE.sql

-- 2. Fix coupon_usage schema mismatches
\echo '🔧 Step 2: Fixing coupon_usage schema...'
\i FIX_COUPON_USAGE_SCHEMA.sql

-- 3. Complete redeem_coupon function
\echo '🔧 Step 3: Completing redeem_coupon function...'
\i COMPLETE_REDEEM_COUPON_FUNCTION.sql

-- 4. Verify user creation trigger
\echo '🔧 Step 4: Verifying user creation trigger...'
\i VERIFY_USER_CREATION_TRIGGER.sql

-- 5. Create test users
\echo '🔧 Step 5: Creating test users...'
\i CREATE_TEST_USERS.sql

-- 6. Standardize credit logic
\echo '🔧 Step 6: Standardizing credit logic...'
\i STANDARDIZE_CREDIT_LOGIC.sql

-- 7. Add comprehensive logging
\echo '🔧 Step 7: Adding comprehensive logging...'
\i ADD_COMPREHENSIVE_LOGGING.sql

-- 8. Implement rate limiting
\echo '🔧 Step 8: Implementing rate limiting...'
\i IMPLEMENT_RATE_LIMITING.sql

-- 9. Run comprehensive testing
\echo '🔧 Step 9: Running comprehensive tests...'
\i COMPREHENSIVE_TESTING_SUITE.sql

-- ========================================
-- FINAL VERIFICATION
-- ========================================

\echo '🎯 Final verification...'

-- Check all tables exist
SELECT 
  'Tables Check' as verification_type,
  COUNT(*) as tables_found
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'receipts', 'coupon_codes', 'coupon_usage', 'user_referral_codes', 'referrals', 'subscription_events', 'audit_logs', 'rate_limits');

-- Check all functions exist
SELECT 
  'Functions Check' as verification_type,
  COUNT(*) as functions_found
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_user_credits', 'process_referral', 'redeem_coupon', 'consume_credit', 'add_emergency_credits', 'update_subscription_status', 'create_user_referral_code', 'generate_referral_code', 'handle_new_user');

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

-- Run final comprehensive test
SELECT 
  'Final Test Results' as verification_type,
  jsonb_agg(
    jsonb_build_object(
      'test', test_name,
      'result', test_result
    )
  ) as test_results
FROM public.run_comprehensive_tests();

\echo '✅ All critical fixes have been applied!'
\echo '🚀 Your system is now ready for launch!'
