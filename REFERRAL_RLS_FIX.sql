-- Fix RLS policies for referral system

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can read their own referral code" ON user_referral_codes;
DROP POLICY IF EXISTS "Users can insert their own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can update their own referral code" ON user_referral_codes;

-- Create new policies that work properly
CREATE POLICY "Users can read their own referrals" ON referrals 
FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can read their own referral code" ON user_referral_codes 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referrals" ON referrals 
FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their own referral code" ON user_referral_codes 
FOR UPDATE USING (auth.uid() = user_id);

-- Allow the functions to work by granting necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON user_referral_codes TO anon, authenticated;
GRANT SELECT, INSERT ON referrals TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_user_referral_code(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION process_referral(VARCHAR, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_referral_code() TO anon, authenticated;
