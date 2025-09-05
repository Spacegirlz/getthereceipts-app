-- Get The Receipts - Credits and Referral System Database Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. User Credits Table
CREATE TABLE user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    credits_remaining INTEGER DEFAULT 0 NOT NULL, -- Changed to 0 for new model
    subscription_type VARCHAR(20) DEFAULT 'free' NOT NULL CHECK (subscription_type IN ('free', 'premium', 'yearly')),
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_earned INTEGER DEFAULT 0 NOT NULL,
    referrals_made INTEGER DEFAULT 0 NOT NULL,
    deep_dives_used INTEGER DEFAULT 0 NOT NULL, -- NEW: Track deep dives used
    deep_dives_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- NEW: Track when deep dives reset
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Referral Codes Table
CREATE TABLE referral_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    referral_code VARCHAR(12) UNIQUE NOT NULL,
    uses INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Referrals Table
CREATE TABLE referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referred_user_id) -- Each user can only be referred once
);

-- 4. Share Bonuses Table (for daily share credits)
CREATE TABLE share_bonuses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    credits_awarded INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Credit History Table (optional - for tracking all credit movements)
CREATE TABLE credit_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    credit_change INTEGER NOT NULL, -- positive for earned, negative for spent
    reason VARCHAR(50) NOT NULL, -- 'referral_bonus', 'share_bonus', 'analysis_spent', 'monthly_reset', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_history ENABLE ROW LEVEL SECURITY;

-- User Credits Policies
CREATE POLICY "Users can view their own credits" ON user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own credits" ON user_credits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own credits" ON user_credits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referral Codes Policies
CREATE POLICY "Users can view their own referral codes" ON referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own referral codes" ON referral_codes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own referral codes" ON referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals Policies
CREATE POLICY "Users can view referrals they made" ON referrals FOR SELECT USING (auth.uid() = referrer_user_id);
CREATE POLICY "Users can view referrals where they were referred" ON referrals FOR SELECT USING (auth.uid() = referred_user_id);
CREATE POLICY "Anyone can insert referrals" ON referrals FOR INSERT WITH CHECK (true);

-- Share Bonuses Policies
CREATE POLICY "Users can view their own share bonuses" ON share_bonuses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own share bonuses" ON share_bonuses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit History Policies
CREATE POLICY "Users can view their own credit history" ON credit_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert credit history" ON credit_history FOR INSERT WITH CHECK (true);

-- Database Functions

-- 1. Function to deduct a credit
CREATE OR REPLACE FUNCTION deduct_user_credit(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    current_credits INTEGER;
    user_subscription VARCHAR(20);
BEGIN
    -- Get current credits and subscription
    SELECT credits_remaining, subscription_type INTO current_credits, user_subscription
    FROM user_credits 
    WHERE user_id = user_id_param;
    
    -- Premium users have unlimited credits
    IF user_subscription IN ('premium', 'yearly') THEN
        RETURN -1; -- Indicate unlimited
    END IF;
    
    -- Check if user has credits
    IF current_credits <= 0 THEN
        RETURN 0; -- No credits remaining
    END IF;
    
    -- Deduct credit
    UPDATE user_credits 
    SET credits_remaining = credits_remaining - 1,
        updated_at = NOW()
    WHERE user_id = user_id_param;
    
    -- Log the transaction
    INSERT INTO credit_history (user_id, credit_change, reason)
    VALUES (user_id_param, -1, 'analysis_spent');
    
    RETURN current_credits - 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to add credits
CREATE OR REPLACE FUNCTION add_user_credits(user_id_param UUID, credit_amount INTEGER, reason_param VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    -- Add credits
    UPDATE user_credits 
    SET credits_remaining = credits_remaining + credit_amount,
        total_earned = total_earned + credit_amount,
        updated_at = NOW()
    WHERE user_id = user_id_param;
    
    -- Log the transaction
    INSERT INTO credit_history (user_id, credit_change, reason)
    VALUES (user_id_param, credit_amount, reason_param);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Function to reset monthly credits (can be called by cron)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS INTEGER AS $$
DECLARE
    affected_users INTEGER;
BEGIN
    UPDATE user_credits 
    SET credits_remaining = 0, -- No more basic credits needed
        deep_dives_used = 0, -- Reset deep dives
        deep_dives_reset = NOW(), -- Update deep dive reset time
        last_reset = NOW(),
        updated_at = NOW()
    WHERE subscription_type = 'free' 
    AND (last_reset < (NOW() - INTERVAL '1 month') OR deep_dives_reset < (NOW() - INTERVAL '1 month'));
    
    GET DIAGNOSTICS affected_users = ROW_COUNT;
    
    -- Log monthly resets
    INSERT INTO credit_history (user_id, credit_change, reason)
    SELECT user_id, 3, 'monthly_deep_dive_reset' -- 3 free deep dives
    FROM user_credits 
    WHERE subscription_type = 'free' 
    AND (last_reset >= (NOW() - INTERVAL '1 minute') OR deep_dives_reset >= (NOW() - INTERVAL '1 minute')); -- Just reset users
    
    RETURN affected_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for better performance
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX idx_share_bonuses_user_date ON share_bonuses(user_id, created_at);
CREATE INDEX idx_credit_history_user_id ON credit_history(user_id);

-- Updated timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_codes_updated_at BEFORE UPDATE ON referral_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();