-- FIX: Ensure redeem_coupon function is accessible via RPC
-- This fixes the most common RPC access issues
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Recreate function with SECURITY DEFINER
-- ============================================
-- This ensures the function runs with elevated privileges

CREATE OR REPLACE FUNCTION public.redeem_coupon(
  coupon_code_input VARCHAR(50), 
  user_id_input UUID
)
RETURNS JSON AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  user_usage_count INTEGER;
  user_subscription VARCHAR(20);
  current_credits INTEGER;
  new_credits INTEGER;
  new_usage_id UUID;
BEGIN
  -- Log the redemption attempt
  RAISE NOTICE 'Coupon redemption attempt: % for user %', coupon_code_input, user_id_input;
  
  -- First check if user is premium (they shouldn't use coupons)
  SELECT subscription_status INTO user_subscription
  FROM users 
  WHERE id = user_id_input;
  
  IF user_subscription IN ('premium', 'yearly', 'founder') THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Premium users already have unlimited credits! Coupons are for free users only.',
      'user_subscription', user_subscription
    );
  END IF;
  
  -- Check if coupon exists and is active (use UPPER for case-insensitive matching)
  SELECT * INTO coupon_record 
  FROM coupon_codes 
  WHERE UPPER(code) = UPPER(coupon_code_input) AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Invalid coupon code',
      'code_attempted', coupon_code_input
    );
  END IF;
  
  -- Check if user already used this coupon
  SELECT COUNT(*) INTO user_usage_count
  FROM coupon_usage 
  WHERE user_id = user_id_input AND UPPER(coupon_code) = UPPER(coupon_code_input);
  
  IF user_usage_count > 0 THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'You have already used this coupon',
      'coupon_code', coupon_code_input
    );
  END IF;
  
  -- Check if coupon has remaining uses
  IF coupon_record.usage_count >= coupon_record.max_uses THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'This coupon has reached its usage limit',
      'max_uses', coupon_record.max_uses,
      'current_uses', coupon_record.usage_count
    );
  END IF;
  
  -- Check if coupon is expired
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'This coupon has expired',
      'expires_at', coupon_record.expires_at
    );
  END IF;
  
  -- Get current user credits
  SELECT COALESCE(credits_remaining, 0) INTO current_credits
  FROM users 
  WHERE id = user_id_input;
  
  -- Calculate new credits
  new_credits := current_credits + coupon_record.receipts_count;
  
  -- Record the usage with proper timestamps
  INSERT INTO coupon_usage (user_id, coupon_code, created_at, used_at) 
  VALUES (user_id_input, UPPER(coupon_code_input), NOW(), NOW())
  RETURNING id INTO new_usage_id;
  
  -- Update usage count
  UPDATE coupon_codes 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE UPPER(code) = UPPER(coupon_code_input);
  
  -- Update user credits
  UPDATE users 
  SET credits_remaining = new_credits,
      updated_at = NOW()
  WHERE id = user_id_input;
  
  -- Log successful redemption
  RAISE NOTICE 'Coupon redeemed successfully: % for user %, credits: % -> %', 
    coupon_code_input, user_id_input, current_credits, new_credits;
  
  -- Return success with complete coupon details
  RETURN json_build_object(
    'success', true,
    'coupon_name', coupon_record.coupon_name,
    'coupon_code', coupon_record.code,
    'receipts_count', coupon_record.receipts_count,
    'is_premium', coupon_record.is_premium,
    'remaining_uses', coupon_record.max_uses - coupon_record.usage_count - 1,
    'usage_id', new_usage_id,
    'previous_credits', current_credits,
    'new_credits', new_credits,
    'credits_added', coupon_record.receipts_count,
    'message', 'Coupon redeemed successfully! You received ' || coupon_record.receipts_count || ' credits!'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    RAISE NOTICE 'Error redeeming coupon % for user %: %', coupon_code_input, user_id_input, SQLERRM;
    
    -- Return error response
    RETURN json_build_object(
      'success', false,
      'error', 'An unexpected error occurred while redeeming the coupon. Please try again.',
      'error_code', SQLSTATE,
      'error_message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 2: Grant permissions (CRITICAL for RPC)
-- ============================================

-- Revoke any existing permissions first
REVOKE ALL ON FUNCTION public.redeem_coupon(VARCHAR, UUID) FROM PUBLIC;

-- Grant to authenticated users (logged in users)
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;

-- Grant to anon users (for testing, but they'll need to be authenticated anyway)
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO anon;

-- Grant to service_role (for backend/admin use)
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO service_role;

-- ============================================
-- Step 3: Verify the setup
-- ============================================

SELECT 
  'Function exists' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'redeem_coupon' AND n.nspname = 'public'
    ) THEN '✅'
    ELSE '❌'
  END as status
UNION ALL
SELECT 
  'Is SECURITY DEFINER',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'redeem_coupon' 
        AND n.nspname = 'public'
        AND p.prosecdef = true
    ) THEN '✅'
    ELSE '❌'
  END;

-- ============================================
-- Step 4: Test the function (optional)
-- ============================================
-- Get a test user first:
-- SELECT id, email FROM users WHERE subscription_status = 'free' LIMIT 1;

-- Then test (replace USER_ID_HERE):
-- SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);

