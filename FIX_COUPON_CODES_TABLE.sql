-- FIX: Remove updated_at column reference from redeem_coupon function
-- The coupon_codes table doesn't have an updated_at column
-- Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Check if updated_at column exists
-- ============================================
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'coupon_codes' 
  AND table_schema = 'public'
  AND column_name = 'updated_at';

-- ============================================
-- Step 2: Fix redeem_coupon function (remove updated_at)
-- ============================================

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
  
  -- Update usage count (REMOVED updated_at - column doesn't exist)
  UPDATE coupon_codes 
  SET usage_count = usage_count + 1
  WHERE UPPER(code) = UPPER(coupon_code_input);
  
  -- Update user credits (removed updated_at - may not exist)
  UPDATE users 
  SET credits_remaining = new_credits
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
-- Step 3: Re-grant permissions
-- ============================================

GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO service_role;

-- ============================================
-- Step 4: Verify fix
-- ============================================

SELECT 
  'Function fixed' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'redeem_coupon' 
        AND n.nspname = 'public'
        AND p.prosecdef = true
    ) THEN '✅'
    ELSE '❌'
  END as status;

