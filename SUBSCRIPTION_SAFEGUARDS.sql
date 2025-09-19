-- SUBSCRIPTION SAFEGUARDS FOR PREMIUM MONTHLY
-- Run this in your Supabase SQL Editor

-- 1. Add subscription expiration tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;

-- 2. Create subscription monitoring function
CREATE OR REPLACE FUNCTION public.check_subscription_status(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  current_time TIMESTAMPTZ := NOW();
  result JSON;
BEGIN
  -- Get user subscription data
  SELECT * INTO user_record
  FROM users
  WHERE id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Check if subscription has expired
  IF user_record.subscription_status IN ('premium', 'yearly') AND 
     user_record.subscription_expires_at IS NOT NULL AND
     user_record.subscription_expires_at < current_time THEN
    
    -- Downgrade expired subscription
    UPDATE users
    SET subscription_status = 'free',
        credits_remaining = 1,
        last_free_receipt_date = current_time::date
    WHERE id = user_uuid;
    
    RETURN json_build_object(
      'success', true,
      'expired', true,
      'message', 'Subscription expired and downgraded to free'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'expired', false,
    'status', user_record.subscription_status,
    'expires_at', user_record.subscription_expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to update subscription expiration
CREATE OR REPLACE FUNCTION public.update_subscription_expiration(
  user_uuid UUID,
  expires_at TIMESTAMPTZ,
  stripe_sub_id VARCHAR DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET subscription_expires_at = expires_at,
      stripe_subscription_id = COALESCE(stripe_sub_id, stripe_subscription_id),
      last_payment_date = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to add grace period
CREATE OR REPLACE FUNCTION public.add_grace_period(user_uuid UUID, days INTEGER DEFAULT 3)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET subscription_expires_at = subscription_expires_at + INTERVAL '1 day' * days
  WHERE id = user_uuid AND subscription_status IN ('premium', 'yearly');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create subscription audit function
CREATE OR REPLACE FUNCTION public.audit_subscriptions()
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  subscription_status VARCHAR,
  expires_at TIMESTAMPTZ,
  days_until_expiry INTEGER,
  needs_attention BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.subscription_status,
    u.subscription_expires_at,
    CASE 
      WHEN u.subscription_expires_at IS NULL THEN NULL
      ELSE EXTRACT(DAY FROM (u.subscription_expires_at - NOW()))::INTEGER
    END as days_until_expiry,
    CASE
      WHEN u.subscription_status IN ('premium', 'yearly') AND 
           u.subscription_expires_at IS NOT NULL AND
           u.subscription_expires_at < NOW() THEN TRUE
      WHEN u.subscription_status IN ('premium', 'yearly') AND 
           u.subscription_expires_at IS NOT NULL AND
           u.subscription_expires_at < NOW() + INTERVAL '3 days' THEN TRUE
      ELSE FALSE
    END as needs_attention
  FROM users u
  WHERE u.subscription_status IN ('premium', 'yearly')
  ORDER BY u.subscription_expires_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_expires_at ON users(subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_last_payment_date ON users(last_payment_date);

-- 7. Grant permissions
GRANT EXECUTE ON FUNCTION public.check_subscription_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_subscription_expiration(UUID, TIMESTAMPTZ, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_grace_period(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_subscriptions() TO authenticated;

-- 8. Create subscription_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can read their own events" ON subscription_events 
  FOR SELECT USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at ON subscription_events(created_at);
