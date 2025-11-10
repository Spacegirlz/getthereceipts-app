-- Add Subscription Expiration Tracking
-- This migration adds expiration tracking for subscriptions

-- 1. Add subscription_expires_at column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- 2. Create index for efficient expiration queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_expires_at 
ON public.users(subscription_expires_at) 
WHERE subscription_expires_at IS NOT NULL;

-- 3. Create function to check and downgrade expired subscriptions
-- This should be run daily via Supabase Cron or pg_cron
CREATE OR REPLACE FUNCTION public.check_and_downgrade_expired_subscriptions()
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  old_status VARCHAR,
  new_status VARCHAR,
  downgraded_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  UPDATE public.users
  SET 
    subscription_status = 'free',
    credits_remaining = 1,
    subscription_expires_at = NULL,
    updated_at = NOW()
  WHERE 
    subscription_expires_at IS NOT NULL
    AND subscription_expires_at < NOW()
    AND subscription_status IN ('premium', 'yearly', 'founder')
  RETURNING 
    id,
    email,
    subscription_status AS old_status,
    'free' AS new_status,
    NOW() AS downgraded_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_and_downgrade_expired_subscriptions() TO authenticated;

-- 5. Optional: Set up pg_cron job (if pg_cron extension is enabled)
-- Uncomment and adjust schedule as needed
-- SELECT cron.schedule(
--   'downgrade-expired-subscriptions',
--   '0 0 * * *', -- Run daily at midnight UTC
--   $$SELECT public.check_and_downgrade_expired_subscriptions()$$
-- );

-- Note: For Supabase, use the Cron Jobs feature in the dashboard instead:
-- 1. Go to Database > Cron Jobs
-- 2. Create new cron job
-- 3. Schedule: 0 0 * * * (daily at midnight UTC)
-- 4. SQL: SELECT public.check_and_downgrade_expired_subscriptions();

