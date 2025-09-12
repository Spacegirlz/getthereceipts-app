-- STEP 2: Create functions after tables exist
-- Referral System Functions

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM user_referral_codes WHERE referral_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create referral code for new user
CREATE OR REPLACE FUNCTION create_user_referral_code(user_id_input UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
  new_code VARCHAR(20);
BEGIN
  -- Generate unique code
  new_code := generate_referral_code();
  
  -- Insert into user_referral_codes table
  INSERT INTO user_referral_codes (user_id, referral_code)
  VALUES (user_id_input, new_code)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Return the code
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process referral
CREATE OR REPLACE FUNCTION process_referral(referral_code_input VARCHAR(20), new_user_id UUID)
RETURNS JSON AS $$
DECLARE
  referrer_user_id UUID;
  reward_coupon VARCHAR(20);
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
  
  -- Generate reward coupon code
  reward_coupon := 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  
  -- Record the referral
  INSERT INTO referrals (referrer_id, referred_id, referral_code, reward_type, reward_value)
  VALUES (referrer_user_id, new_user_id, referral_code_input, 'coupon', reward_coupon);
  
  -- Update referrer's stats
  UPDATE user_referral_codes
  SET total_referrals = total_referrals + 1,
      total_rewards_earned = total_rewards_earned + 1
  WHERE user_id = referrer_user_id;
  
  -- Return success with reward
  RETURN json_build_object(
    'success', true,
    'referrer_id', referrer_user_id,
    'reward_coupon', reward_coupon,
    'message', 'Referral processed successfully! You earned a reward coupon.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
