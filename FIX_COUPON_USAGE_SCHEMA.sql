-- CRITICAL FIX: Fix coupon_usage table schema mismatches
-- The frontend expects 'created_at' column but table has 'used_at'

-- 1. Check current schema of coupon_usage table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'coupon_usage' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Add missing columns to coupon_usage table
ALTER TABLE public.coupon_usage 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.coupon_usage 
ADD COLUMN IF NOT EXISTS used_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Update existing records to have proper timestamps
UPDATE public.coupon_usage 
SET created_at = COALESCE(used_at, NOW())
WHERE created_at IS NULL;

UPDATE public.coupon_usage 
SET used_at = COALESCE(created_at, NOW())
WHERE used_at IS NULL;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupon_usage_created_at ON public.coupon_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_used_at ON public.coupon_usage(used_at);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON public.coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_code ON public.coupon_usage(coupon_code);

-- 5. Create function to get coupon usage statistics
CREATE OR REPLACE FUNCTION public.get_coupon_usage_stats(coupon_code_input VARCHAR(50))
RETURNS TABLE (
  total_uses INTEGER,
  recent_uses INTEGER,
  last_used TIMESTAMPTZ,
  unique_users INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_uses,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::INTEGER as recent_uses,
    MAX(created_at) as last_used,
    COUNT(DISTINCT user_id)::INTEGER as unique_users
  FROM public.coupon_usage
  WHERE coupon_code = coupon_code_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to get user's coupon usage history
CREATE OR REPLACE FUNCTION public.get_user_coupon_history(user_uuid UUID)
RETURNS TABLE (
  coupon_code VARCHAR,
  used_at TIMESTAMPTZ,
  coupon_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cu.coupon_code,
    cu.created_at as used_at,
    cc.coupon_name
  FROM public.coupon_usage cu
  JOIN public.coupon_codes cc ON cu.coupon_code = cc.code
  WHERE cu.user_id = user_uuid
  ORDER BY cu.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_coupon_usage_stats(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_coupon_history(UUID) TO authenticated;

-- 8. Update the redeem_coupon function to use proper column names
CREATE OR REPLACE FUNCTION public.redeem_coupon(
  coupon_code_input VARCHAR(50), 
  user_id_input UUID
)
RETURNS JSON AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  user_usage_count INTEGER;
  user_subscription VARCHAR(20);
  new_usage_id UUID;
BEGIN
  -- First check if user is premium (they shouldn't use coupons)
  SELECT subscription_status INTO user_subscription
  FROM users 
  WHERE id = user_id_input;
  
  IF user_subscription IN ('premium', 'yearly', 'founder') THEN
    RETURN json_build_object('success', false, 'error', 'Premium users already have unlimited credits! Coupons are for free users only.');
  END IF;
  
  -- Check if coupon exists and is active
  SELECT * INTO coupon_record 
  FROM coupon_codes 
  WHERE code = coupon_code_input AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid coupon code');
  END IF;
  
  -- Check if user already used this coupon
  SELECT COUNT(*) INTO user_usage_count
  FROM coupon_usage 
  WHERE user_id = user_id_input AND coupon_code = coupon_code_input;
  
  IF user_usage_count > 0 THEN
    RETURN json_build_object('success', false, 'error', 'You have already used this coupon');
  END IF;
  
  -- Check if coupon has remaining uses
  IF coupon_record.usage_count >= coupon_record.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has reached its usage limit');
  END IF;
  
  -- Check if coupon is expired
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has expired');
  END IF;
  
  -- Record the usage with proper timestamps
  INSERT INTO coupon_usage (user_id, coupon_code, created_at, used_at) 
  VALUES (user_id_input, coupon_code_input, NOW(), NOW())
  RETURNING id INTO new_usage_id;
  
  -- Update usage count
  UPDATE coupon_codes 
  SET usage_count = usage_count + 1 
  WHERE code = coupon_code_input;
  
  -- Return success with coupon details
  RETURN json_build_object(
    'success', true,
    'coupon_name', coupon_record.coupon_name,
    'receipts_count', coupon_record.receipts_count,
    'is_premium', coupon_record.is_premium,
    'remaining_uses', coupon_record.max_uses - coupon_record.usage_count - 1,
    'usage_id', new_usage_id,
    'message', 'Coupon redeemed successfully!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant permissions for updated function
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;

-- 10. Verify the schema is now correct
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'coupon_usage' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- This fixes:
-- ✅ Adds missing 'created_at' column
-- ✅ Ensures 'used_at' column exists
-- ✅ Updates existing records with proper timestamps
-- ✅ Creates performance indexes
-- ✅ Adds utility functions for coupon statistics
-- ✅ Updates redeem_coupon function with proper column names
-- ✅ Grants proper permissions
