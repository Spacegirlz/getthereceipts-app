-- CRITICAL FIX: Add comprehensive error logging for all transactions
-- This creates audit trails and helps with debugging and monitoring

-- 1. Create audit_logs table for comprehensive logging
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON public.audit_logs(success);

-- 3. Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all audit logs" ON public.audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  user_uuid UUID,
  action_type_input VARCHAR(50),
  resource_type_input VARCHAR(50),
  resource_id_input VARCHAR(255) DEFAULT NULL,
  old_values_input JSONB DEFAULT NULL,
  new_values_input JSONB DEFAULT NULL,
  metadata_input JSONB DEFAULT NULL,
  success_input BOOLEAN DEFAULT TRUE,
  error_message_input TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    metadata,
    success,
    error_message
  ) VALUES (
    user_uuid,
    action_type_input,
    resource_type_input,
    resource_id_input,
    old_values_input,
    new_values_input,
    metadata_input,
    success_input,
    error_message_input
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant permissions for audit logging
GRANT EXECUTE ON FUNCTION public.log_audit_event(UUID, VARCHAR, VARCHAR, VARCHAR, JSONB, JSONB, JSONB, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_audit_event(UUID, VARCHAR, VARCHAR, VARCHAR, JSONB, JSONB, JSONB, BOOLEAN, TEXT) TO service_role;

-- 7. Update consume_credit function with comprehensive logging
CREATE OR REPLACE FUNCTION public.consume_credit_with_logging(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_credits INTEGER;
  user_subscription VARCHAR(20);
  new_credits INTEGER;
  log_id UUID;
BEGIN
  -- Get current user data
  SELECT credits_remaining, subscription_status 
  INTO current_credits, user_subscription
  FROM public.users 
  WHERE id = user_uuid;
  
  -- Check if user exists
  IF current_credits IS NULL THEN
    -- Log failed attempt
    SELECT public.log_audit_event(
      user_uuid,
      'credit_consumption',
      'user',
      user_uuid::TEXT,
      NULL,
      NULL,
      jsonb_build_object('error', 'User not found'),
      FALSE,
      'User not found'
    ) INTO log_id;
    RETURN -1;
  END IF;
  
  -- Premium users have unlimited credits
  IF user_subscription IN ('premium', 'yearly', 'founder') THEN
    -- Log unlimited credit usage
    SELECT public.log_audit_event(
      user_uuid,
      'credit_consumption',
      'user',
      user_uuid::TEXT,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('subscription_status', user_subscription, 'unlimited', TRUE),
      TRUE,
      NULL
    ) INTO log_id;
    RETURN -1;
  END IF;
  
  -- Check if user has credits
  IF current_credits <= 0 THEN
    -- Log failed attempt
    SELECT public.log_audit_event(
      user_uuid,
      'credit_consumption',
      'user',
      user_uuid::TEXT,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('subscription_status', user_subscription, 'reason', 'No credits remaining'),
      FALSE,
      'No credits remaining'
    ) INTO log_id;
    RETURN 0;
  END IF;
  
  -- Calculate new credits
  new_credits := current_credits - 1;
  
  -- Update user credits
  UPDATE public.users 
  SET 
    credits_remaining = new_credits,
    last_free_receipt_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Log successful deduction
  SELECT public.log_audit_event(
    user_uuid,
    'credit_consumption',
    'user',
    user_uuid::TEXT,
    jsonb_build_object('credits_remaining', current_credits),
    jsonb_build_object('credits_remaining', new_credits),
    jsonb_build_object('subscription_status', user_subscription, 'credits_deducted', 1),
    TRUE,
    NULL
  ) INTO log_id;
  
  RETURN new_credits;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    SELECT public.log_audit_event(
      user_uuid,
      'credit_consumption',
      'user',
      user_uuid::TEXT,
      jsonb_build_object('credits_remaining', current_credits),
      NULL,
      jsonb_build_object('error_code', SQLSTATE),
      FALSE,
      SQLERRM
    ) INTO log_id;
    RETURN -2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Update redeem_coupon function with comprehensive logging
CREATE OR REPLACE FUNCTION public.redeem_coupon_with_logging(
  coupon_code_input VARCHAR(50), 
  user_id_input UUID
)
RETURNS JSON AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  user_usage_count INTEGER;
  user_subscription VARCHAR(20);
  new_usage_id UUID;
  current_credits INTEGER;
  new_credits INTEGER;
  log_id UUID;
BEGIN
  -- Get current user data
  SELECT subscription_status, credits_remaining
  INTO user_subscription, current_credits
  FROM users 
  WHERE id = user_id_input;
  
  -- Check if user is premium
  IF user_subscription IN ('premium', 'yearly', 'founder') THEN
    -- Log premium user attempt
    SELECT public.log_audit_event(
      user_id_input,
      'coupon_redemption',
      'coupon',
      coupon_code_input,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('subscription_status', user_subscription, 'reason', 'Premium user'),
      FALSE,
      'Premium users already have unlimited credits'
    ) INTO log_id;
    
    RETURN json_build_object(
      'success', false, 
      'error', 'Premium users already have unlimited credits! Coupons are for free users only.',
      'log_id', log_id
    );
  END IF;
  
  -- Check if coupon exists
  SELECT * INTO coupon_record 
  FROM coupon_codes 
  WHERE code = UPPER(coupon_code_input) AND is_active = true;
  
  IF NOT FOUND THEN
    -- Log invalid coupon attempt
    SELECT public.log_audit_event(
      user_id_input,
      'coupon_redemption',
      'coupon',
      coupon_code_input,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('reason', 'Invalid coupon code'),
      FALSE,
      'Invalid coupon code'
    ) INTO log_id;
    
    RETURN json_build_object(
      'success', false, 
      'error', 'Invalid coupon code',
      'log_id', log_id
    );
  END IF;
  
  -- Check if user already used this coupon
  SELECT COUNT(*) INTO user_usage_count
  FROM coupon_usage 
  WHERE user_id = user_id_input AND coupon_code = UPPER(coupon_code_input);
  
  IF user_usage_count > 0 THEN
    -- Log duplicate usage attempt
    SELECT public.log_audit_event(
      user_id_input,
      'coupon_redemption',
      'coupon',
      coupon_code_input,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('reason', 'Already used'),
      FALSE,
      'You have already used this coupon'
    ) INTO log_id;
    
    RETURN json_build_object(
      'success', false, 
      'error', 'You have already used this coupon',
      'log_id', log_id
    );
  END IF;
  
  -- Check if coupon has remaining uses
  IF coupon_record.usage_count >= coupon_record.max_uses THEN
    -- Log maxed out coupon attempt
    SELECT public.log_audit_event(
      user_id_input,
      'coupon_redemption',
      'coupon',
      coupon_code_input,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('max_uses', coupon_record.max_uses, 'current_uses', coupon_record.usage_count),
      FALSE,
      'This coupon has reached its usage limit'
    ) INTO log_id;
    
    RETURN json_build_object(
      'success', false, 
      'error', 'This coupon has reached its usage limit',
      'log_id', log_id
    );
  END IF;
  
  -- Check if coupon is expired
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    -- Log expired coupon attempt
    SELECT public.log_audit_event(
      user_id_input,
      'coupon_redemption',
      'coupon',
      coupon_code_input,
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('credits_remaining', current_credits),
      jsonb_build_object('expires_at', coupon_record.expires_at),
      FALSE,
      'This coupon has expired'
    ) INTO log_id;
    
    RETURN json_build_object(
      'success', false, 
      'error', 'This coupon has expired',
      'log_id', log_id
    );
  END IF;
  
  -- Calculate new credits
  new_credits := COALESCE(current_credits, 0) + coupon_record.receipts_count;
  
  -- Record the usage
  INSERT INTO coupon_usage (user_id, coupon_code, created_at, used_at) 
  VALUES (user_id_input, UPPER(coupon_code_input), NOW(), NOW())
  RETURNING id INTO new_usage_id;
  
  -- Update usage count
  UPDATE coupon_codes 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE code = UPPER(coupon_code_input);
  
  -- Update user credits
  UPDATE users 
  SET credits_remaining = new_credits,
      updated_at = NOW()
  WHERE id = user_id_input;
  
  -- Log successful redemption
  SELECT public.log_audit_event(
    user_id_input,
    'coupon_redemption',
    'coupon',
    coupon_code_input,
    jsonb_build_object('credits_remaining', current_credits),
    jsonb_build_object('credits_remaining', new_credits),
    jsonb_build_object(
      'coupon_name', coupon_record.coupon_name,
      'credits_added', coupon_record.receipts_count,
      'usage_id', new_usage_id
    ),
    TRUE,
    NULL
  ) INTO log_id;
  
  RETURN json_build_object(
    'success', true,
    'coupon_name', coupon_record.coupon_name,
    'receipts_count', coupon_record.receipts_count,
    'new_credits', new_credits,
    'log_id', log_id,
    'message', 'Coupon redeemed successfully!'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    SELECT public.log_audit_event(
      user_id_input,
      'coupon_redemption',
      'coupon',
      coupon_code_input,
      jsonb_build_object('credits_remaining', current_credits),
      NULL,
      jsonb_build_object('error_code', SQLSTATE),
      FALSE,
      SQLERRM
    ) INTO log_id;
    
    RETURN json_build_object(
      'success', false,
      'error', 'An unexpected error occurred while redeeming the coupon',
      'log_id', log_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant permissions for logged functions
GRANT EXECUTE ON FUNCTION public.consume_credit_with_logging(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_coupon_with_logging(VARCHAR, UUID) TO authenticated;

-- 10. Create function to get audit logs for a user
CREATE OR REPLACE FUNCTION public.get_user_audit_logs(
  user_uuid UUID,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  log_id UUID,
  action_type VARCHAR,
  resource_type VARCHAR,
  resource_id VARCHAR,
  old_values JSONB,
  new_values JSONB,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.action_type,
    al.resource_type,
    al.resource_id,
    al.old_values,
    al.new_values,
    al.success,
    al.error_message,
    al.created_at
  FROM public.audit_logs al
  WHERE al.user_id = user_uuid
  ORDER BY al.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to get system audit logs (admin only)
CREATE OR REPLACE FUNCTION public.get_system_audit_logs(
  limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
  log_id UUID,
  user_id UUID,
  action_type VARCHAR,
  resource_type VARCHAR,
  resource_id VARCHAR,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    al.user_id,
    al.action_type,
    al.resource_type,
    al.resource_id,
    al.success,
    al.error_message,
    al.created_at
  FROM public.audit_logs al
  ORDER BY al.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Grant permissions for audit log functions
GRANT EXECUTE ON FUNCTION public.get_user_audit_logs(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_audit_logs(INTEGER) TO service_role;

-- 13. Create function to test logging system
CREATE OR REPLACE FUNCTION public.test_logging_system()
RETURNS TABLE (
  test_name TEXT,
  log_id UUID,
  success BOOLEAN
) AS $$
DECLARE
  test_user_id UUID := '11111111-1111-1111-1111-111111111111';
  test_log_id UUID;
BEGIN
  -- Test audit logging
  SELECT public.log_audit_event(
    test_user_id,
    'test_action',
    'test_resource',
    'test_id',
    jsonb_build_object('test', 'old_value'),
    jsonb_build_object('test', 'new_value'),
    jsonb_build_object('test_metadata', 'test_value'),
    TRUE,
    NULL
  ) INTO test_log_id;
  
  RETURN QUERY
  SELECT 
    'Audit Logging Test'::TEXT,
    test_log_id,
    (test_log_id IS NOT NULL) as success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Grant permissions for test function
GRANT EXECUTE ON FUNCTION public.test_logging_system() TO authenticated;

-- 15. Test the logging system
SELECT * FROM public.test_logging_system();

-- This adds:
-- ✅ Comprehensive audit_logs table
-- ✅ Performance indexes for fast queries
-- ✅ RLS policies for security
-- ✅ Functions for logging all transactions
-- ✅ Updated credit and coupon functions with logging
-- ✅ Functions to retrieve audit logs
-- ✅ Test functions to verify logging works
-- ✅ Complete audit trail for debugging and monitoring
