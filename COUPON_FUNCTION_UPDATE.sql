-- Updated redeem_coupon function with better error messages
CREATE OR REPLACE FUNCTION redeem_coupon(coupon_code_input VARCHAR(50), user_id_input UUID)
RETURNS JSON AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  user_usage_count INTEGER;
  user_subscription VARCHAR(20);
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
  
  -- Check if user already used this coupon (fixed ambiguous reference)
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
  
  -- Record the usage
  INSERT INTO coupon_usage (user_id, coupon_code) VALUES (user_id_input, coupon_code_input);
  
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
    'remaining_uses', coupon_record.max_uses - (coupon_record.usage_count + 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
