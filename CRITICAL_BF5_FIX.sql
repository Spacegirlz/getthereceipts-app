-- CRITICAL FIX: BF5 Coupon Redemption Issue
-- This script fixes the BF5 coupon redemption problem
-- Run this in Supabase SQL Editor immediately

-- ============================================
-- STEP 1: Verify and Fix redeem_coupon Function
-- ============================================

-- Drop existing function if it has wrong signature
DROP FUNCTION IF EXISTS public.redeem_coupon(VARCHAR, UUID);
DROP FUNCTION IF EXISTS public.redeem_coupon(VARCHAR(50), UUID);

-- Create complete redeem_coupon function with proper error handling
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO anon;

-- ============================================
-- STEP 2: Create BF5 Coupon (Black Friday Special)
-- ============================================

-- Check if BF5 already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupon_codes WHERE UPPER(code) = 'BF5') THEN
    -- Insert BF5 coupon: 5 premium receipts + unlimited chat
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
      'BF5',
      'Black Friday Special',
      'Premium',
      5,
      true,
      true,
      500, -- First 500 users
      '2024-12-31 23:59:59'::TIMESTAMPTZ -- Expires Dec 31, 2024
    );
    
    RAISE NOTICE 'BF5 coupon created successfully';
  ELSE
    RAISE NOTICE 'BF5 coupon already exists';
    
    -- Update existing BF5 to ensure it's active and has correct settings
    UPDATE coupon_codes 
    SET 
      is_active = true,
      receipts_count = 5,
      is_premium = true,
      tier = 'Premium',
      max_uses = 500,
      expires_at = '2024-12-31 23:59:59'::TIMESTAMPTZ
    WHERE UPPER(code) = 'BF5';
    
    RAISE NOTICE 'BF5 coupon updated';
  END IF;
END $$;

-- ============================================
-- STEP 3: Verify RLS Policies
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active coupons" ON coupon_codes;
DROP POLICY IF EXISTS "Users can read their own usage" ON coupon_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON coupon_usage;

-- Create/Recreate policies
CREATE POLICY "Anyone can read active coupons" 
  ON coupon_codes 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can read their own usage" 
  ON coupon_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
  ON coupon_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 4: Verify Function and Coupon
-- ============================================

-- Verify function exists
SELECT 
  routine_name,
  routine_type,
  data_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'redeem_coupon' 
  AND routine_schema = 'public';

-- Verify BF5 coupon exists and is active
SELECT 
  code,
  coupon_name,
  tier,
  receipts_count,
  is_premium,
  is_active,
  max_uses,
  usage_count,
  expires_at
FROM coupon_codes 
WHERE UPPER(code) = 'BF5';

-- ============================================
-- STEP 5: Test Query (for debugging)
-- ============================================

-- This query helps verify the setup
SELECT 
  'Function Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_name = 'redeem_coupon' 
      AND routine_schema = 'public'
    ) THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as status
UNION ALL
SELECT 
  'BF5 Coupon Status',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM coupon_codes 
      WHERE UPPER(code) = 'BF5' AND is_active = true
    ) THEN '✅ BF5 exists and is active'
    ELSE '❌ BF5 missing or inactive'
  END;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
-- ✅ Function created/updated with proper error handling
-- ✅ BF5 coupon created/verified
-- ✅ RLS policies verified
-- ✅ Permissions granted
-- 
-- Next steps:
-- 1. Test redemption in the app
-- 2. Check browser console for any errors
-- 3. Verify Supabase logs for function calls
-- ============================================

