-- STEP 1: Create tables first
-- Basic Referral System Setup - Step by Step

-- 1. Create referrals table to track who referred whom
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

-- 2. Create user referral codes table
CREATE TABLE IF NOT EXISTS user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_referrals INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0
);

-- 3. Create indexes
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
