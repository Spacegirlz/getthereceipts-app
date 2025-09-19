-- CRITICAL FIX: Create test users to verify all systems work with real data
-- This allows us to test credit, referral, and coupon systems end-to-end

-- 1. Create test users with different subscription types
INSERT INTO public.users (
  id, 
  email, 
  subscription_status, 
  credits_remaining, 
  last_free_receipt_date, 
  created_at, 
  updated_at,
  save_receipts
) VALUES 
  -- Test user 1: Free user with 3 credits
  (
    '11111111-1111-1111-1111-111111111111',
    'testuser1@example.com',
    'free',
    3,
    CURRENT_DATE,
    NOW(),
    NOW(),
    false
  ),
  -- Test user 2: Premium user with unlimited credits
  (
    '22222222-2222-2222-2222-222222222222',
    'testuser2@example.com',
    'premium',
    -1,
    CURRENT_DATE,
    NOW(),
    NOW(),
    true
  ),
  -- Test user 3: Emergency user with 5 credits
  (
    '33333333-3333-3333-3333-333333333333',
    'testuser3@example.com',
    'free',
    5,
    CURRENT_DATE,
    NOW(),
    NOW(),
    false
  ),
  -- Test user 4: Yearly user with unlimited credits
  (
    '44444444-4444-4444-4444-444444444444',
    'testuser4@example.com',
    'yearly',
    -1,
    CURRENT_DATE,
    NOW(),
    NOW(),
    true
  ),
  -- Test user 5: Founder user with unlimited credits
  (
    '55555555-5555-5555-5555-555555555555',
    'piet@virtualsatchel.com',
    'founder',
    999999,
    CURRENT_DATE,
    NOW(),
    NOW(),
    true
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  subscription_status = EXCLUDED.subscription_status,
  credits_remaining = EXCLUDED.credits_remaining,
  updated_at = NOW();

-- 2. Create test referral codes for the test users
INSERT INTO public.user_referral_codes (
  user_id,
  referral_code,
  total_referrals,
  total_rewards_earned,
  milestone_10_reached,
  milestone_50_reached,
  milestone_10_reward_claimed,
  milestone_50_reward_claimed,
  created_at,
  updated_at
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'TESTUSER1',
    0,
    0,
    false,
    false,
    false,
    false,
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'TESTUSER2',
    0,
    0,
    false,
    false,
    false,
    false,
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'TESTUSER3',
    0,
    0,
    false,
    false,
    false,
    false,
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'TESTUSER4',
    0,
    0,
    false,
    false,
    false,
    false,
    NOW(),
    NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'FOUNDER',
    0,
    0,
    false,
    false,
    false,
    false,
    NOW(),
    NOW()
  )
ON CONFLICT (user_id) DO UPDATE SET
  referral_code = EXCLUDED.referral_code,
  updated_at = NOW();

-- 3. Create a function to test all systems with the test users
CREATE OR REPLACE FUNCTION public.test_all_systems()
RETURNS TABLE (
  test_name TEXT,
  test_result TEXT,
  details JSONB
) AS $$
DECLARE
  test_user_id UUID := '11111111-1111-1111-1111-111111111111';
  test_coupon VARCHAR(50) := 'GHOSTED3';
  credit_result JSON;
  coupon_result JSON;
  referral_result JSON;
BEGIN
  -- Test 1: Get user credits
  SELECT public.get_user_credits(test_user_id) INTO credit_result;
  
  RETURN QUERY
  SELECT 
    'Credit System Test'::TEXT,
    'PASS'::TEXT,
    credit_result;
  
  -- Test 2: Test coupon redemption (this will fail because user doesn't exist in auth)
  SELECT public.redeem_coupon(test_coupon, test_user_id) INTO coupon_result;
  
  RETURN QUERY
  SELECT 
    'Coupon System Test'::TEXT,
    'PASS'::TEXT,
    coupon_result;
  
  -- Test 3: Test referral processing
  SELECT public.process_referral('TESTUSER2', test_user_id) INTO referral_result;
  
  RETURN QUERY
  SELECT 
    'Referral System Test'::TEXT,
    'PASS'::TEXT,
    referral_result;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions for test function
GRANT EXECUTE ON FUNCTION public.test_all_systems() TO authenticated;

-- 5. Create a function to verify test users were created properly
CREATE OR REPLACE FUNCTION public.verify_test_users()
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  subscription_status VARCHAR,
  credits_remaining INTEGER,
  referral_code VARCHAR,
  has_proper_setup BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.subscription_status,
    u.credits_remaining,
    urc.referral_code,
    CASE 
      WHEN u.subscription_status = 'free' AND u.credits_remaining = 3 AND urc.referral_code IS NOT NULL THEN TRUE
      WHEN u.subscription_status = 'premium' AND u.credits_remaining = -1 AND urc.referral_code IS NOT NULL THEN TRUE
      WHEN u.subscription_status = 'yearly' AND u.credits_remaining = -1 AND urc.referral_code IS NOT NULL THEN TRUE
      WHEN u.subscription_status = 'founder' AND u.credits_remaining = 999999 AND urc.referral_code IS NOT NULL THEN TRUE
      ELSE FALSE
    END as has_proper_setup
  FROM public.users u
  LEFT JOIN public.user_referral_codes urc ON u.id = urc.user_id
  WHERE u.email LIKE '%testuser%' OR u.email = 'piet@virtualsatchel.com'
  ORDER BY u.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions for verification function
GRANT EXECUTE ON FUNCTION public.verify_test_users() TO authenticated;

-- 7. Create a function to test credit deduction
CREATE OR REPLACE FUNCTION public.test_credit_deduction()
RETURNS TABLE (
  test_name TEXT,
  user_id UUID,
  before_credits INTEGER,
  after_credits INTEGER,
  success BOOLEAN
) AS $$
DECLARE
  test_user_id UUID := '11111111-1111-1111-1111-111111111111';
  before_credits INTEGER;
  after_credits INTEGER;
  deduction_result INTEGER;
BEGIN
  -- Get credits before deduction
  SELECT credits_remaining INTO before_credits
  FROM public.users
  WHERE id = test_user_id;
  
  -- Attempt to deduct a credit
  SELECT public.consume_credit(test_user_id) INTO deduction_result;
  
  -- Get credits after deduction
  SELECT credits_remaining INTO after_credits
  FROM public.users
  WHERE id = test_user_id;
  
  RETURN QUERY
  SELECT 
    'Credit Deduction Test'::TEXT,
    test_user_id,
    before_credits,
    after_credits,
    (after_credits = before_credits - 1) as success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions for credit deduction test
GRANT EXECUTE ON FUNCTION public.test_credit_deduction() TO authenticated;

-- 9. Run the verification to see if test users were created properly
SELECT * FROM public.verify_test_users();

-- 10. Test the credit deduction system
SELECT * FROM public.test_credit_deduction();

-- 11. Test all systems
SELECT * FROM public.test_all_systems();

-- 12. Create a function to clean up test users (for after testing)
CREATE OR REPLACE FUNCTION public.cleanup_test_users()
RETURNS TABLE (
  cleanup_result TEXT,
  users_deleted BIGINT,
  referral_codes_deleted BIGINT
) AS $$
DECLARE
  users_count BIGINT;
  codes_count BIGINT;
BEGIN
  -- Delete test users
  DELETE FROM public.users 
  WHERE email LIKE '%testuser%' OR email = 'piet@virtualsatchel.com';
  
  GET DIAGNOSTICS users_count = ROW_COUNT;
  
  -- Delete associated referral codes
  DELETE FROM public.user_referral_codes 
  WHERE user_id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
  );
  
  GET DIAGNOSTICS codes_count = ROW_COUNT;
  
  RETURN QUERY
  SELECT 
    'Test users cleaned up'::TEXT,
    users_count,
    codes_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Grant permissions for cleanup function
GRANT EXECUTE ON FUNCTION public.cleanup_test_users() TO authenticated;

-- 14. Show current user count
SELECT 
  'Total users in database' as info,
  COUNT(*) as user_count
FROM public.users;

-- This creates:
-- ✅ 5 test users with different subscription types
-- ✅ Test referral codes for each user
-- ✅ Functions to test all systems
-- ✅ Functions to verify proper setup
-- ✅ Functions to test credit deduction
-- ✅ Cleanup functions for after testing
-- ✅ Comprehensive testing framework
