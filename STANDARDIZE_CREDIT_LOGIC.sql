-- CRITICAL FIX: Standardize credit deduction logic across environments
-- Remove localhost bypass and ensure consistent behavior

-- 1. Update the consume_credit function to be environment-agnostic
CREATE OR REPLACE FUNCTION public.consume_credit(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_credits INTEGER;
  user_subscription VARCHAR(20);
  new_credits INTEGER;
BEGIN
  -- Log the credit consumption attempt
  RAISE NOTICE 'Credit consumption attempt for user: %', user_uuid;
  
  -- Get current user data
  SELECT credits_remaining, subscription_status 
  INTO current_credits, user_subscription
  FROM public.users 
  WHERE id = user_uuid;
  
  -- Check if user exists
  IF current_credits IS NULL THEN
    RAISE NOTICE 'User % not found', user_uuid;
    RETURN -1; -- User not found
  END IF;
  
  -- Premium users have unlimited credits - no deduction needed
  IF user_subscription IN ('premium', 'yearly', 'founder') THEN
    RAISE NOTICE 'Premium user % - no credit deduction needed', user_uuid;
    RETURN -1; -- Unlimited credits
  END IF;
  
  -- Check if user has credits
  IF current_credits <= 0 THEN
    RAISE NOTICE 'User % has no credits remaining', user_uuid;
    RETURN 0; -- No credits remaining
  END IF;
  
  -- Calculate new credits
  new_credits := current_credits - 1;
  
  -- Update user credits
  UPDATE public.users 
  SET 
    credits_remaining = new_credits,
    last_free_receipt_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Log successful deduction
  RAISE NOTICE 'Successfully deducted credit for user %. Credits: % -> %', 
    user_uuid, current_credits, new_credits;
  
  RETURN new_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    RAISE NOTICE 'Error consuming credit for user %: %', user_uuid, SQLERRM;
    RETURN -2; -- Error occurred
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update the deductCredits function in the frontend service
-- This will be handled in the JavaScript file, but let's create a database function that's consistent

-- 3. Create a function to check if user can generate a receipt
CREATE OR REPLACE FUNCTION public.can_generate_receipt(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get user data
  SELECT 
    credits_remaining,
    subscription_status,
    last_free_receipt_date
  INTO user_record
  FROM public.users 
  WHERE id = user_uuid;
  
  -- Check if user exists
  IF user_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Premium users can always generate receipts
  IF user_record.subscription_status IN ('premium', 'yearly', 'founder') THEN
    RETURN TRUE;
  END IF;
  
  -- Free users can generate if they have credits and haven't used today's free receipt
  IF user_record.subscription_status = 'free' THEN
    -- Check if they have credits and haven't used today's free receipt
    IF user_record.credits_remaining > 0 AND 
       (user_record.last_free_receipt_date IS NULL OR 
        user_record.last_free_receipt_date < CURRENT_DATE) THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  -- Emergency users can generate if they have credits
  IF user_record.subscription_status = 'emergency' AND user_record.credits_remaining > 0 THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a function to get user credit status with environment-agnostic logic
CREATE OR REPLACE FUNCTION public.get_user_credit_status(user_uuid UUID)
RETURNS TABLE (
  credits_remaining INTEGER,
  subscription_status VARCHAR,
  can_generate_receipt BOOLEAN,
  daily_reset_available BOOLEAN,
  unlimited_credits BOOLEAN
) AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get user data
  SELECT 
    credits_remaining,
    subscription_status,
    last_free_receipt_date
  INTO user_record
  FROM public.users 
  WHERE id = user_record;
  
  -- Check if user exists
  IF user_record IS NULL THEN
    RETURN QUERY SELECT 0, 'unknown'::VARCHAR, FALSE, FALSE, FALSE;
    RETURN;
  END IF;
  
  -- Determine if user has unlimited credits
  IF user_record.subscription_status IN ('premium', 'yearly', 'founder') THEN
    RETURN QUERY SELECT 
      -1, -- Unlimited
      user_record.subscription_status,
      TRUE, -- Can always generate
      FALSE, -- No daily reset needed
      TRUE; -- Unlimited credits
  END IF;
  
  -- Determine if daily reset is available
  IF user_record.subscription_status = 'free' AND 
     (user_record.last_free_receipt_date IS NULL OR 
      user_record.last_free_receipt_date < CURRENT_DATE) THEN
    RETURN QUERY SELECT 
      user_record.credits_remaining,
      user_record.subscription_status,
      (user_record.credits_remaining > 0), -- Can generate if has credits
      TRUE, -- Daily reset available
      FALSE; -- Not unlimited
  END IF;
  
  -- Default case
  RETURN QUERY SELECT 
    user_record.credits_remaining,
    user_record.subscription_status,
    (user_record.credits_remaining > 0), -- Can generate if has credits
    FALSE, -- No daily reset
    FALSE; -- Not unlimited
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a function to reset daily credits for free users
CREATE OR REPLACE FUNCTION public.reset_daily_credits(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get user data
  SELECT 
    subscription_status,
    last_free_receipt_date
  INTO user_record
  FROM public.users 
  WHERE id = user_uuid;
  
  -- Check if user exists
  IF user_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Only reset for free users who haven't used today's credit
  IF user_record.subscription_status = 'free' AND 
     (user_record.last_free_receipt_date IS NULL OR 
      user_record.last_free_receipt_date < CURRENT_DATE) THEN
    
    -- Reset to 1 credit and update last_free_receipt_date
    UPDATE public.users 
    SET 
      credits_remaining = 1,
      last_free_receipt_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE id = user_uuid;
    
    RAISE NOTICE 'Reset daily credits for user %', user_uuid;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions for all functions
GRANT EXECUTE ON FUNCTION public.consume_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_generate_receipt(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_credit_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_daily_credits(UUID) TO authenticated;

-- 7. Create a test function to verify credit logic works consistently
CREATE OR REPLACE FUNCTION public.test_credit_logic_consistency()
RETURNS TABLE (
  test_name TEXT,
  user_id UUID,
  subscription_status VARCHAR,
  credits_before INTEGER,
  credits_after INTEGER,
  can_generate_before BOOLEAN,
  can_generate_after BOOLEAN,
  test_passed BOOLEAN
) AS $$
DECLARE
  test_user_id UUID := '11111111-1111-1111-1111-111111111111';
  credits_before INTEGER;
  credits_after INTEGER;
  can_generate_before BOOLEAN;
  can_generate_after BOOLEAN;
  user_subscription VARCHAR;
BEGIN
  -- Get initial state
  SELECT credits_remaining, subscription_status 
  INTO credits_before, user_subscription
  FROM public.users 
  WHERE id = test_user_id;
  
  SELECT can_generate_receipt INTO can_generate_before
  FROM public.can_generate_receipt(test_user_id);
  
  -- Test credit consumption
  SELECT public.consume_credit(test_user_id) INTO credits_after;
  
  -- Get final state
  SELECT can_generate_receipt INTO can_generate_after
  FROM public.can_generate_receipt(test_user_id);
  
  RETURN QUERY
  SELECT 
    'Credit Logic Consistency Test'::TEXT,
    test_user_id,
    user_subscription,
    credits_before,
    credits_after,
    can_generate_before,
    can_generate_after,
    (credits_after = credits_before - 1 AND can_generate_after = (credits_after > 0)) as test_passed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions for test function
GRANT EXECUTE ON FUNCTION public.test_credit_logic_consistency() TO authenticated;

-- 9. Test the credit logic consistency
SELECT * FROM public.test_credit_logic_consistency();

-- 10. Create a function to audit credit consistency across all users
CREATE OR REPLACE FUNCTION public.audit_credit_consistency()
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  subscription_status VARCHAR,
  credits_remaining INTEGER,
  last_free_receipt_date DATE,
  consistency_issues TEXT[]
) AS $$
DECLARE
  issues TEXT[];
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.subscription_status,
    u.credits_remaining,
    u.last_free_receipt_date,
    ARRAY(
      SELECT issue FROM (
        SELECT 'Premium user with limited credits' as issue
        WHERE u.subscription_status IN ('premium', 'yearly', 'founder') AND u.credits_remaining != -1 AND u.credits_remaining != 999999
        UNION ALL
        SELECT 'Free user with unlimited credits' as issue
        WHERE u.subscription_status = 'free' AND u.credits_remaining = -1
        UNION ALL
        SELECT 'Free user with too many credits' as issue
        WHERE u.subscription_status = 'free' AND u.credits_remaining > 3
        UNION ALL
        SELECT 'Negative credits' as issue
        WHERE u.credits_remaining < 0 AND u.subscription_status NOT IN ('premium', 'yearly', 'founder')
      ) issues
      WHERE issue IS NOT NULL
    ) as consistency_issues
  FROM public.users u
  ORDER BY u.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Grant permissions for audit function
GRANT EXECUTE ON FUNCTION public.audit_credit_consistency() TO authenticated;

-- 12. Run the credit consistency audit
SELECT * FROM public.audit_credit_consistency();

-- This standardizes:
-- ✅ Credit deduction logic across all environments
-- ✅ Removes localhost bypass for consistent behavior
-- ✅ Proper error handling and logging
-- ✅ Functions to check receipt generation eligibility
-- ✅ Daily credit reset logic for free users
-- ✅ Comprehensive testing and auditing functions
-- ✅ Consistent behavior between development and production
