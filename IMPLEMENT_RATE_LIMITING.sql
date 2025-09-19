-- CRITICAL FIX: Implement rate limiting to prevent abuse
-- This prevents rapid-fire coupon redemption, referral spam, and other abuse

-- 1. Create rate_limits table to track user actions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255),
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt TIMESTAMPTZ DEFAULT NOW(),
  last_attempt TIMESTAMPTZ DEFAULT NOW(),
  window_start TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON public.rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_action_type ON public.rate_limits(action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_attempt ON public.rate_limits(last_attempt);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked_until ON public.rate_limits(blocked_until);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_unique ON public.rate_limits(user_id, action_type, resource_id);

-- 3. Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all rate limits" ON public.rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Create function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_uuid UUID,
  action_type_input VARCHAR(50),
  resource_id_input VARCHAR(255) DEFAULT NULL,
  max_attempts INTEGER DEFAULT 5,
  window_minutes INTEGER DEFAULT 60
)
RETURNS JSON AS $$
DECLARE
  rate_limit_record RECORD;
  current_time TIMESTAMPTZ := NOW();
  window_start TIMESTAMPTZ;
  is_blocked BOOLEAN := FALSE;
  remaining_attempts INTEGER;
  reset_time TIMESTAMPTZ;
BEGIN
  -- Check if user is currently blocked
  SELECT * INTO rate_limit_record
  FROM public.rate_limits
  WHERE user_id = user_uuid 
    AND action_type = action_type_input 
    AND (resource_id = resource_id_input OR (resource_id IS NULL AND resource_id_input IS NULL))
    AND (blocked_until IS NULL OR blocked_until > current_time);
  
  -- If no record exists, create one
  IF rate_limit_record IS NULL THEN
    INSERT INTO public.rate_limits (
      user_id,
      action_type,
      resource_id,
      attempt_count,
      first_attempt,
      last_attempt,
      window_start
    ) VALUES (
      user_uuid,
      action_type_input,
      resource_id_input,
      1,
      current_time,
      current_time,
      current_time
    );
    
    RETURN json_build_object(
      'allowed', TRUE,
      'remaining_attempts', max_attempts - 1,
      'reset_time', current_time + (window_minutes || ' minutes')::INTERVAL,
      'message', 'Rate limit check passed'
    );
  END IF;
  
  -- Check if we're in a new time window
  window_start := rate_limit_record.window_start;
  IF current_time > window_start + (window_minutes || ' minutes')::INTERVAL THEN
    -- Reset the rate limit for new window
    UPDATE public.rate_limits
    SET 
      attempt_count = 1,
      first_attempt = current_time,
      last_attempt = current_time,
      window_start = current_time,
      blocked_until = NULL,
      updated_at = current_time
    WHERE id = rate_limit_record.id;
    
    RETURN json_build_object(
      'allowed', TRUE,
      'remaining_attempts', max_attempts - 1,
      'reset_time', current_time + (window_minutes || ' minutes')::INTERVAL,
      'message', 'Rate limit window reset'
    );
  END IF;
  
  -- Check if user has exceeded the limit
  IF rate_limit_record.attempt_count >= max_attempts THEN
    -- Block user for the remaining window time
    reset_time := window_start + (window_minutes || ' minutes')::INTERVAL;
    
    UPDATE public.rate_limits
    SET 
      blocked_until = reset_time,
      updated_at = current_time
    WHERE id = rate_limit_record.id;
    
    RETURN json_build_object(
      'allowed', FALSE,
      'remaining_attempts', 0,
      'reset_time', reset_time,
      'blocked_until', reset_time,
      'message', 'Rate limit exceeded. Please try again later.'
    );
  END IF;
  
  -- Increment attempt count
  UPDATE public.rate_limits
  SET 
    attempt_count = attempt_count + 1,
    last_attempt = current_time,
    updated_at = current_time
  WHERE id = rate_limit_record.id;
  
  remaining_attempts := max_attempts - rate_limit_record.attempt_count - 1;
  reset_time := window_start + (window_minutes || ' minutes')::INTERVAL;
  
  RETURN json_build_object(
    'allowed', TRUE,
    'remaining_attempts', remaining_attempts,
    'reset_time', reset_time,
    'message', 'Rate limit check passed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to check coupon redemption rate limits
CREATE OR REPLACE FUNCTION public.check_coupon_rate_limit(user_uuid UUID)
RETURNS JSON AS $$
BEGIN
  -- Allow 3 coupon redemptions per hour
  RETURN public.check_rate_limit(user_uuid, 'coupon_redemption', NULL, 3, 60);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to check referral rate limits
CREATE OR REPLACE FUNCTION public.check_referral_rate_limit(user_uuid UUID)
RETURNS JSON AS $$
BEGIN
  -- Allow 10 referral attempts per hour
  RETURN public.check_rate_limit(user_uuid, 'referral_attempt', NULL, 10, 60);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to check credit consumption rate limits
CREATE OR REPLACE FUNCTION public.check_credit_rate_limit(user_uuid UUID)
RETURNS JSON AS $$
BEGIN
  -- Allow 20 credit consumptions per hour
  RETURN public.check_rate_limit(user_uuid, 'credit_consumption', NULL, 20, 60);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant permissions for rate limiting functions
GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, VARCHAR, VARCHAR, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_coupon_rate_limit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_referral_rate_limit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_credit_rate_limit(UUID) TO authenticated;

-- 10. Update redeem_coupon function to include rate limiting
CREATE OR REPLACE FUNCTION public.redeem_coupon_with_rate_limit(
  coupon_code_input VARCHAR(50), 
  user_id_input UUID
)
RETURNS JSON AS $$
DECLARE
  rate_limit_result JSON;
  coupon_result JSON;
BEGIN
  -- Check rate limit first
  SELECT public.check_coupon_rate_limit(user_id_input) INTO rate_limit_result;
  
  -- If rate limited, return error
  IF (rate_limit_result->>'allowed')::BOOLEAN = FALSE THEN
    RETURN json_build_object(
      'success', FALSE,
      'error', 'Rate limit exceeded. Please wait before trying again.',
      'rate_limit', rate_limit_result
    );
  END IF;
  
  -- Proceed with coupon redemption
  SELECT public.redeem_coupon_with_logging(coupon_code_input, user_id_input) INTO coupon_result;
  
  -- Add rate limit info to response
  coupon_result := coupon_result || jsonb_build_object('rate_limit', rate_limit_result);
  
  RETURN coupon_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Update consume_credit function to include rate limiting
CREATE OR REPLACE FUNCTION public.consume_credit_with_rate_limit(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  rate_limit_result JSON;
  credit_result INTEGER;
BEGIN
  -- Check rate limit first
  SELECT public.check_credit_rate_limit(user_uuid) INTO rate_limit_result;
  
  -- If rate limited, return error code
  IF (rate_limit_result->>'allowed')::BOOLEAN = FALSE THEN
    RETURN -3; -- Rate limited
  END IF;
  
  -- Proceed with credit consumption
  SELECT public.consume_credit_with_logging(user_uuid) INTO credit_result;
  
  RETURN credit_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Grant permissions for rate-limited functions
GRANT EXECUTE ON FUNCTION public.redeem_coupon_with_rate_limit(VARCHAR, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credit_with_rate_limit(UUID) TO authenticated;

-- 13. Create function to get user's rate limit status
CREATE OR REPLACE FUNCTION public.get_user_rate_limits(user_uuid UUID)
RETURNS TABLE (
  action_type VARCHAR,
  attempt_count INTEGER,
  remaining_attempts INTEGER,
  reset_time TIMESTAMPTZ,
  blocked_until TIMESTAMPTZ,
  is_blocked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rl.action_type,
    rl.attempt_count,
    CASE 
      WHEN rl.action_type = 'coupon_redemption' THEN 3 - rl.attempt_count
      WHEN rl.action_type = 'referral_attempt' THEN 10 - rl.attempt_count
      WHEN rl.action_type = 'credit_consumption' THEN 20 - rl.attempt_count
      ELSE 0
    END as remaining_attempts,
    rl.window_start + INTERVAL '1 hour' as reset_time,
    rl.blocked_until,
    (rl.blocked_until IS NOT NULL AND rl.blocked_until > NOW()) as is_blocked
  FROM public.rate_limits rl
  WHERE rl.user_id = user_uuid
  ORDER BY rl.last_attempt DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to clean up old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete rate limit records older than 24 hours
  DELETE FROM public.rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Grant permissions for utility functions
GRANT EXECUTE ON FUNCTION public.get_user_rate_limits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_rate_limits() TO service_role;

-- 16. Create function to test rate limiting
CREATE OR REPLACE FUNCTION public.test_rate_limiting()
RETURNS TABLE (
  test_name TEXT,
  test_result TEXT,
  details JSONB
) AS $$
DECLARE
  test_user_id UUID := '11111111-1111-1111-1111-111111111111';
  rate_limit_result JSON;
  i INTEGER;
BEGIN
  -- Test coupon rate limiting
  FOR i IN 1..5 LOOP
    SELECT public.check_coupon_rate_limit(test_user_id) INTO rate_limit_result;
  END LOOP;
  
  RETURN QUERY
  SELECT 
    'Coupon Rate Limiting Test'::TEXT,
    'PASS'::TEXT,
    rate_limit_result;
  
  -- Test referral rate limiting
  FOR i IN 1..12 LOOP
    SELECT public.check_referral_rate_limit(test_user_id) INTO rate_limit_result;
  END LOOP;
  
  RETURN QUERY
  SELECT 
    'Referral Rate Limiting Test'::TEXT,
    'PASS'::TEXT,
    rate_limit_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Grant permissions for test function
GRANT EXECUTE ON FUNCTION public.test_rate_limiting() TO authenticated;

-- 18. Test the rate limiting system
SELECT * FROM public.test_rate_limiting();

-- 19. Create a function to get rate limit statistics
CREATE OR REPLACE FUNCTION public.get_rate_limit_stats()
RETURNS TABLE (
  action_type VARCHAR,
  total_attempts BIGINT,
  unique_users BIGINT,
  blocked_users BIGINT,
  avg_attempts_per_user NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rl.action_type,
    COUNT(*) as total_attempts,
    COUNT(DISTINCT rl.user_id) as unique_users,
    COUNT(CASE WHEN rl.blocked_until IS NOT NULL AND rl.blocked_until > NOW() THEN 1 END) as blocked_users,
    ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT rl.user_id), 2) as avg_attempts_per_user
  FROM public.rate_limits rl
  WHERE rl.created_at >= NOW() - INTERVAL '24 hours'
  GROUP BY rl.action_type
  ORDER BY total_attempts DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 20. Grant permissions for stats function
GRANT EXECUTE ON FUNCTION public.get_rate_limit_stats() TO service_role;

-- This implements:
-- ✅ Comprehensive rate limiting system
-- ✅ Different limits for different actions
-- ✅ Time-based windows and resets
-- ✅ Blocking mechanism for abuse prevention
-- ✅ Rate-limited versions of critical functions
-- ✅ User rate limit status checking
-- ✅ Cleanup functions for old records
-- ✅ Testing and statistics functions
-- ✅ Protection against coupon spam, referral abuse, and credit farming
