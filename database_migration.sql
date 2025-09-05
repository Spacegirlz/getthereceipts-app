-- Migration Script: Add Deep Dive Tracking to Existing Database
-- Run this in your Supabase SQL Editor to update existing user_credits table

-- Add new columns for deep dive tracking
ALTER TABLE user_credits 
ADD COLUMN IF NOT EXISTS deep_dives_used INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS deep_dives_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing users to have 0 credits (new model)
UPDATE user_credits 
SET credits_remaining = 0 
WHERE subscription_type = 'free' AND credits_remaining > 0;

-- Update the reset function to handle deep dives
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

-- Verify the migration
SELECT 
    'Migration completed successfully' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN deep_dives_used IS NOT NULL THEN 1 END) as users_with_deep_dive_tracking
FROM user_credits;
