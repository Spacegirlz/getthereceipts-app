-- FINAL SCHEMA FIXES FOR LAUNCH
-- Run this in your Supabase SQL Editor after CRITICAL_DATABASE_FIXES.sql

-- Fix user_referral_codes table schema
DO $$ 
BEGIN
  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_referral_codes' AND column_name = 'is_active') THEN
    ALTER TABLE user_referral_codes ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- Add total_referrals column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_referral_codes' AND column_name = 'total_referrals') THEN
    ALTER TABLE user_referral_codes ADD COLUMN total_referrals INTEGER DEFAULT 0;
  END IF;
  
  -- Add total_rewards column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_referral_codes' AND column_name = 'total_rewards') THEN
    ALTER TABLE user_referral_codes ADD COLUMN total_rewards INTEGER DEFAULT 0;
  END IF;
  
  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_referral_codes' AND column_name = 'created_at') THEN
    ALTER TABLE user_referral_codes ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Fix referrals table schema
DO $$ 
BEGIN
  -- Add referral_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'referrals' AND column_name = 'referral_code') THEN
    ALTER TABLE referrals ADD COLUMN referral_code VARCHAR(50);
  END IF;
  
  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'referrals' AND column_name = 'created_at') THEN
    ALTER TABLE referrals ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS user_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  total_referrals INTEGER DEFAULT 0,
  total_rewards INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id),
  referred_user_id UUID REFERENCES auth.users(id),
  referral_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can read their own referral codes" ON user_referral_codes;
CREATE POLICY "Users can read their own referral codes" ON user_referral_codes 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own referral codes" ON user_referral_codes;
CREATE POLICY "Users can insert their own referral codes" ON user_referral_codes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own referral codes" ON user_referral_codes;
CREATE POLICY "Users can update their own referral codes" ON user_referral_codes 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own referrals" ON referrals;
CREATE POLICY "Users can read their own referrals" ON referrals 
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

DROP POLICY IF EXISTS "System can insert referrals" ON referrals;
CREATE POLICY "System can insert referrals" ON referrals 
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_user_id ON user_referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referral_codes_code ON user_referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- Verify schema
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_referral_codes', 'referrals', 'coupon_codes', 'coupon_usage', 'users')
ORDER BY table_name, ordinal_position;
