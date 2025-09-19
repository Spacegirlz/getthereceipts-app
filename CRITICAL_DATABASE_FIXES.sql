-- CRITICAL DATABASE FIXES FOR LAUNCH
-- Run this in your Supabase SQL Editor

-- 1. Add missing get_user_credits function
CREATE OR REPLACE FUNCTION public.get_user_credits(user_uuid UUID)
RETURNS TABLE (
  credits_remaining INTEGER,
  subscription_status VARCHAR,
  can_generate_receipt BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.credits_remaining,
    u.subscription_status,
    CASE 
      WHEN u.subscription_status IN ('premium', 'founder', 'yearly') THEN TRUE
      WHEN u.subscription_status = 'emergency' AND u.credits_remaining > 0 THEN TRUE
      WHEN u.subscription_status = 'free' AND u.last_free_receipt_date < CURRENT_DATE THEN TRUE
      ELSE FALSE
    END as can_generate_receipt
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_user_credits(UUID) TO authenticated;

-- 2. Add missing process_referral function (Option A: 3 credits to both)
CREATE OR REPLACE FUNCTION public.process_referral(
  referral_code_input VARCHAR(50),
  new_user_id UUID
)
RETURNS JSON AS $$
DECLARE
  referrer_record RECORD;
  referral_exists BOOLEAN;
  result JSON;
BEGIN
  -- Check if referral code exists and is active
  SELECT * INTO referrer_record
  FROM user_referral_codes
  WHERE referral_code = referral_code_input AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;
  
  -- Check if user is trying to refer themselves
  IF referrer_record.user_id = new_user_id THEN
    RETURN json_build_object('success', false, 'error', 'You cannot refer yourself');
  END IF;
  
  -- Check if this referral already exists
  SELECT EXISTS(
    SELECT 1 FROM referrals 
    WHERE referrer_id = referrer_record.user_id AND referred_user_id = new_user_id
  ) INTO referral_exists;
  
  IF referral_exists THEN
    RETURN json_build_object('success', false, 'error', 'Referral already processed');
  END IF;
  
  -- Record the referral
  INSERT INTO referrals (referrer_id, referred_user_id, referral_code)
  VALUES (referrer_record.user_id, new_user_id, referral_code_input);
  
  -- 🎯 OPTION A: Give 3 credits to BOTH referrer and referee
  -- Give credits to referrer
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = referrer_record.user_id;
  
  -- Give credits to new user
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = new_user_id;
  
  -- Update referral stats
  UPDATE user_referral_codes
  SET total_referrals = total_referrals + 1,
      total_rewards = total_rewards + 3
  WHERE user_id = referrer_record.user_id;
  
  RETURN json_build_object(
    'success', true,
    'credits_given', 3,
    'message', 'Referral processed successfully! Both you and your friend earned 3 credits!'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'Failed to process referral');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.process_referral(VARCHAR, UUID) TO authenticated;

-- 3. Add missing redeem_coupon function
CREATE OR REPLACE FUNCTION public.redeem_coupon(
  coupon_code_input VARCHAR(50), 
  user_id_input UUID
)
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;

-- 4. Add missing consume_credit function
CREATE OR REPLACE FUNCTION public.consume_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
  can_generate BOOLEAN;
BEGIN
  -- Get user info and check if they can generate receipt
  SELECT * FROM public.get_user_credits(user_uuid) INTO user_record;
  
  IF NOT user_record.can_generate_receipt THEN
    RETURN FALSE;
  END IF;
  
  -- Update credits based on subscription type
  IF user_record.subscription_status = 'free' THEN
    UPDATE public.users 
    SET last_free_receipt_date = CURRENT_DATE,
        total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  ELSIF user_record.subscription_status = 'emergency' THEN
    UPDATE public.users 
    SET credits_remaining = credits_remaining - 1,
        total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  ELSE -- premium or founder
    UPDATE public.users 
    SET total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.consume_credit(UUID) TO authenticated;

-- 5. Add missing add_emergency_credits function
CREATE OR REPLACE FUNCTION public.add_emergency_credits(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET credits_remaining = 5,
      subscription_status = 'emergency'
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.add_emergency_credits(UUID) TO authenticated;

-- 6. Add missing update_subscription_status function
CREATE OR REPLACE FUNCTION public.update_subscription_status(
  user_uuid UUID,
  new_status VARCHAR(20)
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET subscription_status = new_status
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_subscription_status(UUID, VARCHAR) TO authenticated;

-- 7. Fix schema issues - Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add created_at to coupon_usage if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'coupon_usage' AND column_name = 'created_at') THEN
    ALTER TABLE coupon_usage ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  
  -- Add referred_user_id to referrals if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'referrals' AND column_name = 'referred_user_id') THEN
    ALTER TABLE referrals ADD COLUMN referred_user_id UUID REFERENCES auth.users(id);
  END IF;
  
  -- Add subscription_events table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                 WHERE table_name = 'subscription_events') THEN
    CREATE TABLE subscription_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      event_type VARCHAR(50) NOT NULL,
      event_data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can read their own events" ON subscription_events 
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 8. Create missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_credits_remaining ON users(credits_remaining);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_created_at ON coupon_usage(created_at);

-- 9. Verify all functions exist
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'get_user_credits',
    'process_referral', 
    'redeem_coupon',
    'consume_credit',
    'add_emergency_credits',
    'update_subscription_status'
  )
ORDER BY routine_name;
