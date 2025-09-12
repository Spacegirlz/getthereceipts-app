-- ENHANCED REFERRAL SYSTEM - CREDIT-BASED WITH MILESTONES
-- This replaces the coupon-only system with direct credits + milestone rewards

-- 1. Add new columns to user_referral_codes for milestone tracking
ALTER TABLE user_referral_codes 
ADD COLUMN IF NOT EXISTS milestone_10_reached BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS milestone_50_reached BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS milestone_10_reward_claimed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS milestone_50_reward_claimed BOOLEAN DEFAULT FALSE;

-- 2. Add new columns to referrals table for credit tracking
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS credits_given INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS milestone_reward_given BOOLEAN DEFAULT FALSE;

-- 3. Create enhanced referral processing function with credits
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
  
  -- Give referrer 3 credits immediately
  UPDATE users 
  SET credits_remaining = credits_remaining + 3
  WHERE id = referrer_user_id;
  
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
    milestone_10_coupon := 'FREE1M' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Create the coupon
    INSERT INTO coupon_codes (code, coupon_name, tier, receipts_count, is_premium, max_uses, usage_count)
    VALUES (milestone_10_coupon, 'Free Premium Month', 'Premium', 999, true, 1, 0);
    
    -- Mark milestone as reached
    UPDATE user_referral_codes
    SET milestone_10_reached = TRUE
    WHERE user_id = referrer_user_id;
    
    -- Update referral record
    UPDATE referrals
    SET milestone_reward_given = TRUE, reward_value = milestone_10_coupon
    WHERE referrer_id = referrer_user_id AND referred_id = new_user_id;
  END IF;
  
  -- Check for milestone 50 (OG Founders Pass)
  IF current_referral_count = 50 AND NOT (SELECT milestone_50_reached FROM user_referral_codes WHERE user_id = referrer_user_id) THEN
    -- Generate milestone 50 coupon
    milestone_50_coupon := 'OGFOUNDER' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Create the coupon
    INSERT INTO coupon_codes (code, coupon_name, tier, receipts_count, is_premium, max_uses, usage_count)
    VALUES (milestone_50_coupon, 'OG Founders Pass', 'Premium', 999999, true, 1, 0);
    
    -- Mark milestone as reached
    UPDATE user_referral_codes
    SET milestone_50_reached = TRUE
    WHERE user_id = referrer_user_id;
    
    -- Update referral record
    UPDATE referrals
    SET milestone_reward_given = TRUE, reward_value = milestone_50_coupon
    WHERE referrer_id = referrer_user_id AND referred_id = new_user_id;
  END IF;
  
  -- Build success response
  result := json_build_object(
    'success', true,
    'referrer_id', referrer_user_id,
    'credits_given', 3,
    'current_referral_count', current_referral_count,
    'milestone_10_reached', current_referral_count >= 10,
    'milestone_50_reached', current_referral_count >= 50,
    'milestone_10_coupon', milestone_10_coupon,
    'milestone_50_coupon', milestone_50_coupon,
    'message', 'Referral processed successfully! You earned 3 credits.'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to get enhanced referral stats
CREATE OR REPLACE FUNCTION get_enhanced_referral_stats(user_id_input UUID)
RETURNS JSON AS $$
DECLARE
  user_stats RECORD;
  milestone_10_coupon VARCHAR(50);
  milestone_50_coupon VARCHAR(50);
  result JSON;
BEGIN
  -- Get user's referral stats
  SELECT 
    total_referrals,
    total_rewards_earned,
    milestone_10_reached,
    milestone_50_reached,
    milestone_10_reward_claimed,
    milestone_50_reward_claimed
  INTO user_stats
  FROM user_referral_codes
  WHERE user_id = user_id_input;
  
  -- Get milestone coupons if they exist
  SELECT code INTO milestone_10_coupon
  FROM coupon_codes
  WHERE coupon_name = 'Free Premium Month' 
    AND code LIKE 'FREE1M%'
    AND usage_count = 0
  LIMIT 1;
  
  SELECT code INTO milestone_50_coupon
  FROM coupon_codes
  WHERE coupon_name = 'OG Founders Pass' 
    AND code LIKE 'OGFOUNDER%'
    AND usage_count = 0
  LIMIT 1;
  
  -- Build response
  result := json_build_object(
    'total_referrals', COALESCE(user_stats.total_referrals, 0),
    'total_rewards_earned', COALESCE(user_stats.total_rewards_earned, 0),
    'milestone_10_reached', COALESCE(user_stats.milestone_10_reached, false),
    'milestone_50_reached', COALESCE(user_stats.milestone_50_reached, false),
    'milestone_10_reward_claimed', COALESCE(user_stats.milestone_10_reward_claimed, false),
    'milestone_50_reward_claimed', COALESCE(user_stats.milestone_50_reward_claimed, false),
    'milestone_10_coupon', milestone_10_coupon,
    'milestone_50_coupon', milestone_50_coupon,
    'referrals_to_10', GREATEST(0, 10 - COALESCE(user_stats.total_referrals, 0)),
    'referrals_to_50', GREATEST(0, 50 - COALESCE(user_stats.total_referrals, 0))
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant permissions
GRANT EXECUTE ON FUNCTION process_referral_with_credits(VARCHAR(20), UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_enhanced_referral_stats(UUID) TO authenticated;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_milestones ON user_referral_codes(milestone_10_reached, milestone_50_reached);
CREATE INDEX IF NOT EXISTS idx_referrals_credits ON referrals(credits_given, milestone_reward_given);

-- 7. Update RLS policies for new columns
DROP POLICY IF EXISTS "Users can read their own referral code" ON user_referral_codes;
CREATE POLICY "Users can read their own referral code" ON user_referral_codes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own referral code" ON user_referral_codes;
CREATE POLICY "Users can update their own referral code" ON user_referral_codes FOR UPDATE USING (auth.uid() = user_id);
