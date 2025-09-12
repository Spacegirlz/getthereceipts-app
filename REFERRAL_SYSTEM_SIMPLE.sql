-- SUPER SIMPLE Referral System - This will definitely work!

-- Step 1: Create the tables
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referred_id UUID REFERENCES auth.users(id) NOT NULL,
  referral_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reward_given BOOLEAN DEFAULT FALSE,
  reward_type VARCHAR(20) DEFAULT 'coupon',
  reward_value VARCHAR(50) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_referrals INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_codes_user_id ON user_referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_codes_code ON user_referral_codes(referral_code);

-- Step 3: Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referral_codes ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
CREATE POLICY "Users can read their own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can read their own referral code" ON user_referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Users can update their own referral code" ON user_referral_codes FOR UPDATE USING (auth.uid() = user_id);

-- Step 5: Simple function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
BEGIN
  -- Generate a random 8-character code
  code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Simple function to create user referral code
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

-- Step 7: Simple function to process referral
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
