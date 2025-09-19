-- CRITICAL FIX: Implement Option A - 3 credits to both referrer and referee
-- Run this in your Supabase SQL Editor

-- 1. Update the process_referral function to give 3 credits to both parties
CREATE OR REPLACE FUNCTION process_referral(referral_code_input VARCHAR(20), new_user_id UUID)
RETURNS JSON AS $$
DECLARE
  referrer_user_id UUID;
  current_referral_count INTEGER;
  result JSON;
BEGIN
  -- Find the referrer's user_id
  SELECT user_id INTO referrer_user_id
  FROM user_referral_codes
  WHERE referral_code = referral_code_input;
  
  IF referrer_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;
  
  -- Check if user already has referrals (prevent self-referral)
  IF referrer_user_id = new_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
  END IF;
  
  -- Check if this user was already referred by someone
  IF EXISTS(SELECT 1 FROM referrals WHERE referred_id = new_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User already has a referrer');
  END IF;
  
  -- Record the referral with credit tracking
  INSERT INTO referrals (referrer_id, referred_id, referral_code, reward_type, reward_value, credits_given)
  VALUES (referrer_user_id, new_user_id, referral_code_input, 'credits', '3', 3);
  
  -- 🎯 OPTION A: Give referrer 3 credits immediately
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = referrer_user_id;
  
  -- 🎯 OPTION A: Give new user 3 bonus credits for using referral code
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = new_user_id;
  
  -- Update referrer's stats
  UPDATE user_referral_codes
  SET total_referrals = total_referrals + 1,
      total_rewards_earned = total_rewards_earned + 1
  WHERE user_id = referrer_user_id;
  
  -- Get current referral count for milestone checking
  SELECT total_referrals INTO current_referral_count
  FROM user_referral_codes
  WHERE user_id = referrer_user_id;
  
  -- Return success with credit details
  RETURN json_build_object(
    'success', true,
    'referrer_id', referrer_user_id,
    'credits_given', 3,
    'current_referral_count', current_referral_count,
    'message', 'Referral processed successfully! Both you and your friend earned 3 credits!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update the enhanced referral function as well
CREATE OR REPLACE FUNCTION process_referral_with_credits(
  referral_code_input VARCHAR(20), 
  new_user_id UUID
)
RETURNS JSON AS $$
DECLARE
  referrer_user_id UUID;
  current_referral_count INTEGER;
  milestone_10_coupon VARCHAR(50);
  milestone_50_coupon VARCHAR(50);
  result JSON;
BEGIN
  -- Find the referrer's user_id
  SELECT user_id INTO referrer_user_id
  FROM user_referral_codes
  WHERE referral_code = referral_code_input;
  
  IF referrer_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;
  
  -- Check if user already has referrals (prevent self-referral)
  IF referrer_user_id = new_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
  END IF;
  
  -- Check if this user was already referred by someone
  IF EXISTS(SELECT 1 FROM referrals WHERE referred_id = new_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User already has a referrer');
  END IF;
  
  -- Record the referral with credit tracking
  INSERT INTO referrals (referrer_id, referred_id, referral_code, reward_type, reward_value, credits_given)
  VALUES (referrer_user_id, new_user_id, referral_code_input, 'credits', '3', 3);
  
  -- 🎯 OPTION A: Give referrer 3 credits immediately
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = referrer_user_id;
  
  -- 🎯 OPTION A: Give new user 3 bonus credits for using referral code
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = new_user_id;
  
  -- Update referrer's stats
  UPDATE user_referral_codes
  SET total_referrals = total_referrals + 1,
      total_rewards_earned = total_rewards_earned + 1
  WHERE user_id = referrer_user_id;
  
  -- Get current referral count for milestone checking
  SELECT total_referrals INTO current_referral_count
  FROM user_referral_codes
  WHERE user_id = referrer_user_id;
  
  -- Check for milestone 10 (Free Premium Month)
  IF current_referral_count = 10 AND NOT (SELECT milestone_10_reached FROM user_referral_codes WHERE user_id = referrer_user_id) THEN
    -- Generate milestone 10 coupon
    milestone_10_coupon := 'MILESTONE10_' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Mark milestone as reached
    UPDATE user_referral_codes
    SET milestone_10_reached = TRUE,
        milestone_10_reward_claimed = FALSE
    WHERE user_id = referrer_user_id;
  END IF;
  
  -- Check for milestone 50 (OG Founders Pass)
  IF current_referral_count = 50 AND NOT (SELECT milestone_50_reached FROM user_referral_codes WHERE user_id = referrer_user_id) THEN
    -- Generate milestone 50 coupon
    milestone_50_coupon := 'MILESTONE50_' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Mark milestone as reached
    UPDATE user_referral_codes
    SET milestone_50_reached = TRUE,
        milestone_50_reward_claimed = FALSE
    WHERE user_id = referrer_user_id;
  END IF;
  
  -- Return success with credit details and milestone info
  RETURN json_build_object(
    'success', true,
    'referrer_id', referrer_user_id,
    'credits_given', 3,
    'current_referral_count', current_referral_count,
    'milestone_10_reached', current_referral_count >= 10,
    'milestone_50_reached', current_referral_count >= 50,
    'milestone_10_coupon', milestone_10_coupon,
    'milestone_50_coupon', milestone_50_coupon,
    'message', 'Referral processed successfully! Both you and your friend earned 3 credits!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update new user trigger to give 3 credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, credits_remaining)
  VALUES (NEW.id, NEW.email, 3); -- 🎯 Give 3 credits to new users
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_referral(VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION process_referral_with_credits(VARCHAR, UUID) TO authenticated;
