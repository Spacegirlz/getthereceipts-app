-- Basic Referral System Setup
-- Simple and effective referral tracking with coupon rewards

-- 1. Create referrals table to track who referred whom
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referred_id UUID REFERENCES auth.users(id) NOT NULL,
  referral_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reward_given BOOLEAN DEFAULT FALSE,
  reward_type VARCHAR(20) DEFAULT 'coupon', -- 'coupon', 'credits', 'premium'
  reward_value VARCHAR(50) DEFAULT NULL -- coupon code or credit amount
);

-- 2. Create user referral codes table
CREATE TABLE IF NOT EXISTS user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_referrals INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0
);

-- 3. Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_codes_user_id ON user_referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_codes_code ON user_referral_codes(referral_code);

-- 4. Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referral_codes ENABLE ROW LEVEL SECURITY;

-- 5. Create policies
CREATE POLICY "Users can read their own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can read their own referral code" ON user_referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Users can update their own referral code" ON user_referral_codes FOR UPDATE USING (auth.uid() = user_id);

-- 6. Function to generate unique referral code
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

-- 7. Function to create referral code for new user
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

-- 8. Function to process referral
CREATE OR REPLACE FUNCTION process_referral(referral_code_input VARCHAR(20), new_user_id UUID)
RETURNS JSON AS $$
DECLARE
  referrer_record user_referral_codes%ROWTYPE;
  reward_coupon VARCHAR(20);
  result JSON;
BEGIN
  -- Find the referrer
  SELECT * INTO referrer_record
  FROM user_referral_codes
  WHERE referral_code = referral_code_input;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;
  
  -- Check if user already has referrals (prevent self-referral)
  IF referrer_record.user_id = new_user_id THEN
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
  VALUES (referrer_record.user_id, new_user_id, referral_code_input, 'coupon', reward_coupon);
  
  -- Update referrer's stats
  UPDATE user_referral_codes
  SET total_referrals = total_referrals + 1,
      total_rewards_earned = total_rewards_earned + 1
  WHERE user_id = referrer_record.user_id;
  
  -- Return success with reward
  RETURN json_build_object(
    'success', true,
    'referrer_id', referrer_record.user_id,
    'reward_coupon', reward_coupon,
    'message', 'Referral processed successfully! You earned a reward coupon.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
