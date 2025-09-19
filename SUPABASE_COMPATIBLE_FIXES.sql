-- 🚀 SUPABASE COMPATIBLE FIXES SCRIPT
-- Run this script in your Supabase SQL Editor to fix all critical issues
-- This script executes all fixes in the correct order

-- ========================================
-- CRITICAL FIXES EXECUTION ORDER
-- ========================================

-- 1. Create missing subscription_events table
CREATE TABLE IF NOT EXISTS public.subscription_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON public.subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_stripe_subscription_id ON public.subscription_events(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_event_type ON public.subscription_events(event_type);

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription events" ON public.subscription_events
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert subscription events" ON public.subscription_events
FOR INSERT WITH CHECK (true);

-- 2. Fix coupon_usage schema mismatches
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupon_usage' AND column_name = 'created_at') THEN
        ALTER TABLE public.coupon_usage ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupon_usage' AND column_name = 'used_at') THEN
        ALTER TABLE public.coupon_usage ADD COLUMN used_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END
$$;

UPDATE public.coupon_usage SET created_at = NOW() WHERE created_at IS NULL;
UPDATE public.coupon_usage SET used_at = NOW() WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_coupon_usage_created_at ON public.coupon_usage(created_at);

-- 3. Complete redeem_coupon function
CREATE OR REPLACE FUNCTION public.redeem_coupon(
  coupon_code_input VARCHAR(50), 
  user_id_input UUID
)
RETURNS JSON AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  user_usage_count INTEGER;
  user_subscription VARCHAR(20);
  credits_to_add INTEGER;
  is_premium_coupon BOOLEAN;
  coupon_name_output VARCHAR(255);
  remaining_uses_output INTEGER;
BEGIN
  -- First check if user is premium (they shouldn't use coupons)
  SELECT subscription_status INTO user_subscription
  FROM users 
  WHERE id = user_id_input;
  
  IF user_subscription IN ('premium', 'yearly', 'founder') THEN
    RETURN json_build_object('success', false, 'error', 'Premium users already have unlimited credits! Coupons are for free users only.');
  END IF;
  
  -- Check if coupon exists and is active
  SELECT * INTO coupon_record 
  FROM coupon_codes 
  WHERE code = UPPER(coupon_code_input) AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid coupon code');
  END IF;
  
  -- Check if user already used this coupon
  SELECT COUNT(*) INTO user_usage_count
  FROM coupon_usage 
  WHERE user_id = user_id_input AND coupon_code = UPPER(coupon_code_input);
  
  IF user_usage_count > 0 THEN
    RETURN json_build_object('success', false, 'error', 'You have already used this coupon');
  END IF;
  
  -- Check if coupon has remaining uses
  IF coupon_record.usage_count >= coupon_record.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has reached its usage limit');
  END IF;
  
  -- Check if coupon is expired
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    RETURN json_build_object('success', false, 'error', 'This coupon has expired');
  END IF;
  
  -- Record the usage
  INSERT INTO coupon_usage (user_id, coupon_code, used_at) VALUES (user_id_input, UPPER(coupon_code_input), NOW());
  
  -- Update usage count
  UPDATE coupon_codes 
  SET usage_count = usage_count + 1 
  WHERE code = UPPER(coupon_code_input);
  
  -- Determine credits to add and if it's a premium coupon
  credits_to_add := coupon_record.credits_awarded;
  is_premium_coupon := coupon_record.grants_premium_access;
  coupon_name_output := coupon_record.name;
  remaining_uses_output := coupon_record.max_uses - (coupon_record.usage_count + 1);
  
  -- Add credits to user account
  UPDATE public.users
  SET credits_remaining = credits_remaining + credits_to_add
  WHERE id = user_id_input;
  
  -- If coupon grants premium access, update subscription status
  IF is_premium_coupon THEN
    UPDATE public.users
    SET subscription_status = 'premium',
        subscription_expires_at = NOW() + INTERVAL '1 month'
    WHERE id = user_id_input;
  END IF;
  
  -- Return success with coupon details
  RETURN json_build_object(
    'success', true,
    'coupon_name', coupon_name_output,
    'receipts_count', credits_to_add,
    'is_premium', is_premium_coupon,
    'remaining_uses', remaining_uses_output,
    'message', 'Coupon redeemed successfully!'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;

-- 4. Verify user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_status, credits_remaining, last_free_receipt_date, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN NEW.email = 'piet@virtualsatchel.com' THEN 'founder'
      ELSE 'free'
    END,
    CASE
      WHEN NEW.email = 'piet@virtualsatchel.com' THEN 999999
      ELSE 3  -- Ensure new users get 3 credits
    END,
    CURRENT_DATE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    subscription_status = EXCLUDED.subscription_status,
    credits_remaining = EXCLUDED.credits_remaining,
    last_free_receipt_date = EXCLUDED.last_free_receipt_date,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT ALL ON public.users TO supabase_auth_admin;

-- Update existing users who might have 0 or 1 credit to 3 credits
UPDATE public.users
SET credits_remaining = 3
WHERE subscription_status = 'free'
  AND credits_remaining < 3
  AND id != (SELECT id FROM public.users WHERE email = 'piet@virtualsatchel.com' LIMIT 1);

-- 5. Create test users (only if they don't exist to avoid foreign key issues)
-- Note: Test users will only be created if corresponding auth.users entries exist
-- For full testing, create users through the signup flow instead

-- Clean up any existing test users first
DELETE FROM public.users WHERE email LIKE 'testuser%';

-- Only create test users if we can find existing auth.users entries
-- This prevents foreign key constraint violations
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Try to find existing test users in auth.users, if any exist
    -- If not, we'll skip creating test users to avoid foreign key issues
    
    -- Check if piet@virtualsatchel.com exists and ensure it has proper credits
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'piet@virtualsatchel.com' LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Ensure piet@virtualsatchel.com has proper founder status
        INSERT INTO public.users (id, email, subscription_status, credits_remaining, last_free_receipt_date, created_at, updated_at)
        VALUES (test_user_id, 'piet@virtualsatchel.com', 'founder', 999999, CURRENT_DATE, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            subscription_status = 'founder',
            credits_remaining = 999999,
            updated_at = NOW();
        
        RAISE NOTICE 'Updated piet@virtualsatchel.com with founder status';
    END IF;
    
    RAISE NOTICE 'Test users creation skipped to avoid foreign key constraints. Create users through signup flow for testing.';
END
$$;

-- 6. Standardize credit logic
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_credit_consumption_at') THEN
        ALTER TABLE public.users ADD COLUMN last_credit_consumption_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.consume_credit(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    current_credits INTEGER;
    user_sub_status VARCHAR(20);
    can_deduct BOOLEAN := FALSE;
    new_credits INTEGER;
    last_receipt_date DATE;
    last_consumption_time TIMESTAMPTZ;
    rate_limit_seconds INTEGER := 5;
BEGIN
    SELECT credits_remaining, subscription_status, last_free_receipt_date, last_credit_consumption_at
    INTO current_credits, user_sub_status, last_receipt_date, last_consumption_time
    FROM public.users
    WHERE id = user_uuid;

    IF NOT FOUND THEN
        RETURN json_build_object('success', FALSE, 'error', 'User not found.');
    END IF;

    IF user_sub_status IN ('premium', 'founder', 'yearly') THEN
        RETURN json_build_object('success', TRUE, 'message', 'Premium user, no credit deduction needed.');
    END IF;

    IF last_consumption_time IS NOT NULL AND (NOW() - last_consumption_time) < INTERVAL '1 second' * rate_limit_seconds THEN
        RETURN json_build_object('success', FALSE, 'error', 'Rate limit exceeded. Please wait a moment before generating another receipt.');
    END IF;

    IF user_sub_status = 'emergency' AND current_credits > 0 THEN
        can_deduct := TRUE;
    END IF;

    IF user_sub_status = 'free' THEN
        IF current_credits > 0 THEN
            can_deduct := TRUE;
        ELSIF last_receipt_date < CURRENT_DATE THEN
            UPDATE public.users
            SET credits_remaining = 1, last_free_receipt_date = CURRENT_DATE
            WHERE id = user_uuid;
            current_credits := 1;
            can_deduct := TRUE;
        END IF;
    END IF;

    IF can_deduct THEN
        IF current_credits <= 0 THEN
            RETURN json_build_object('success', FALSE, 'error', 'No credits remaining for deduction.');
        END IF;

        new_credits := current_credits - 1;

        UPDATE public.users
        SET credits_remaining = new_credits,
            last_credit_consumption_at = NOW()
        WHERE id = user_uuid;

        RETURN json_build_object('success', TRUE, 'new_credits', new_credits, 'message', 'Credit consumed successfully.');
    ELSE
        RETURN json_build_object('success', FALSE, 'error', 'Cannot consume credit. User has no credits or is not eligible for free daily credit.');
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.consume_credit(UUID) TO authenticated;

-- 7. Add comprehensive logging
CREATE TABLE IF NOT EXISTS public.credit_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    credit_change INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON public.credit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_reason ON public.credit_history(reason);

ALTER TABLE public.credit_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credit history" ON public.credit_history
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert credit history" ON public.credit_history
FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.add_user_credits(user_uuid UUID, amount INTEGER, reason_text VARCHAR(255))
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.users
    SET credits_remaining = credits_remaining + amount
    WHERE id = user_uuid;

    IF FOUND THEN
        INSERT INTO public.credit_history (user_id, credit_change, reason)
        VALUES (user_uuid, amount, reason_text);
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.add_user_credits(UUID, INTEGER, VARCHAR) TO authenticated;

-- 8. Ensure all critical functions exist
CREATE OR REPLACE FUNCTION public.get_user_credits(user_uuid UUID)
RETURNS TABLE (credits_remaining INTEGER, subscription_status VARCHAR, can_generate_receipt BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.credits_remaining,
    u.subscription_status,
    CASE 
      WHEN u.subscription_status IN ('premium', 'founder', 'yearly') THEN TRUE
      WHEN u.subscription_status = 'emergency' AND u.credits_remaining > 0 THEN TRUE
      WHEN u.subscription_status = 'free' AND u.last_free_receipt_date < CURRENT_DATE THEN TRUE
      ELSE FALSE
    END as can_generate_receipt
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_credits(UUID) TO authenticated;

-- 9. Process referral function (Option A: 3 credits to both)
CREATE OR REPLACE FUNCTION public.process_referral(referral_code_input VARCHAR(20), new_user_id UUID)
RETURNS JSON AS $$
DECLARE
  referrer_user_id UUID;
  current_referral_count INTEGER;
BEGIN
  -- Check if referral code exists
  SELECT user_id INTO referrer_user_id
  FROM public.user_referral_codes
  WHERE referral_code = referral_code_input;

  IF referrer_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;

  -- Check if user is trying to refer themselves
  IF referrer_user_id = new_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
  END IF;

  -- Check if user already has a referrer
  IF EXISTS(SELECT 1 FROM public.referrals WHERE referred_id = new_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User already has a referrer');
  END IF;

  -- Record the referral
  INSERT INTO public.referrals (referrer_id, referred_id, referral_code, reward_type, reward_value, credits_given)
  VALUES (referrer_user_id, new_user_id, referral_code_input, 'credits', '3', 3);

  -- Give 3 credits to referrer
  UPDATE public.users
  SET credits_remaining = credits_remaining + 3
  WHERE id = referrer_user_id;

  -- Give 3 credits to new user
  UPDATE public.users
  SET credits_remaining = credits_remaining + 3
  WHERE id = new_user_id;

  -- Update referrer stats
  UPDATE public.user_referral_codes
  SET total_referrals = total_referrals + 1,
      total_rewards_earned = total_rewards_earned + 1
  WHERE user_id = referrer_user_id;

  -- Get current referral count for milestone check
  SELECT total_referrals INTO current_referral_count
  FROM public.user_referral_codes
  WHERE user_id = referrer_user_id;

  -- Check for milestone rewards (10 referrals = free premium month)
  IF current_referral_count >= 10 THEN
    UPDATE public.users
    SET subscription_status = 'premium',
        subscription_expires_at = NOW() + INTERVAL '1 month'
    WHERE id = referrer_user_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Referral processed successfully! Both you and your friend earned 3 credits!',
    'referrer_credits_added', 3,
    'referee_credits_added', 3,
    'total_referrals', current_referral_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.process_referral(VARCHAR, UUID) TO authenticated;

-- ========================================
-- FINAL VERIFICATION
-- ========================================

-- Check all tables exist
SELECT 
  'Tables Check' as verification_type,
  COUNT(*) as tables_found
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'receipts', 'coupon_codes', 'coupon_usage', 'user_referral_codes', 'referrals', 'subscription_events', 'credit_history');

-- Check all functions exist
SELECT 
  'Functions Check' as verification_type,
  COUNT(*) as functions_found
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_user_credits', 'process_referral', 'redeem_coupon', 'consume_credit', 'add_user_credits', 'handle_new_user');

-- Check test users exist
SELECT 
  'Test Users Check' as verification_type,
  COUNT(*) as test_users_found
FROM public.users
WHERE email LIKE '%testuser%' OR email = 'piet@virtualsatchel.com';

-- Check active coupons
SELECT 
  'Active Coupons Check' as verification_type,
  COUNT(*) as active_coupons
FROM public.coupon_codes
WHERE is_active = TRUE;
