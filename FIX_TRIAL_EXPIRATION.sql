-- Fix trial expiration logic in database functions
-- Run this in Supabase SQL Editor

-- 1. Update get_user_credits function to check trial status
DROP FUNCTION IF EXISTS public.get_user_credits(UUID);

CREATE OR REPLACE FUNCTION public.get_user_credits(user_uuid UUID)
RETURNS TABLE (
  credits_remaining INTEGER,
  subscription_status VARCHAR,
  can_generate_receipt BOOLEAN,
  starter_receipts_used INTEGER,
  daily_chats_used INTEGER,
  can_use_daily_chat BOOLEAN,
  is_trial_active BOOLEAN,
  trial_end TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.credits_remaining,
    u.subscription_status,
    CASE 
      -- Premium subscribers (unlimited)
      WHEN u.subscription_status IN ('premium', 'yearly', 'founder') THEN TRUE
      -- Active trial users (unlimited during trial)
      WHEN u.tier = 'premium_trial' AND u.trial_end > NOW() THEN TRUE
      -- Emergency pack users (if they have credits)
      WHEN u.subscription_status = 'emergency' AND u.credits_remaining > 0 THEN TRUE
      -- Free users (starter receipts or daily limit)
      WHEN u.subscription_status = 'free' AND (
        u.starter_receipts_used < 3 OR 
        u.last_free_receipt_date < CURRENT_DATE
      ) THEN TRUE
      ELSE FALSE
    END as can_generate_receipt,
    u.starter_receipts_used,
    CASE 
      WHEN u.last_chat_reset_date < CURRENT_DATE THEN 0
      ELSE u.daily_chats_used
    END as daily_chats_used,
    CASE 
      -- Premium subscribers (unlimited)
      WHEN u.subscription_status IN ('premium', 'yearly', 'founder') THEN TRUE
      -- Active trial users (unlimited during trial)
      WHEN u.tier = 'premium_trial' AND u.trial_end > NOW() THEN TRUE
      -- Free users (daily chat limit)
      WHEN u.subscription_status = 'free' AND (
        u.last_chat_reset_date < CURRENT_DATE OR 
        u.daily_chats_used < 5
      ) THEN TRUE
      ELSE FALSE
    END as can_use_daily_chat,
    -- Trial status
    (u.tier = 'premium_trial' AND u.trial_end > NOW()) as is_trial_active,
    u.trial_end
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update consume_credit function to handle trial users
DROP FUNCTION IF EXISTS public.consume_credit(UUID);

CREATE OR REPLACE FUNCTION public.consume_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
  can_generate BOOLEAN;
BEGIN
  -- Get user info and check if they can generate receipt
  SELECT 
    credits_remaining,
    subscription_status,
    can_generate_receipt,
    tier,
    trial_end
  FROM public.get_user_credits(user_uuid) INTO user_record;
  
  IF NOT user_record.can_generate_receipt THEN
    RETURN FALSE;
  END IF;
  
  -- Update credits based on subscription type
  IF user_record.subscription_status = 'free' THEN
    -- Check if user can use starter receipt (first 3)
    IF (SELECT starter_receipts_used FROM public.users WHERE id = user_uuid) < 3 THEN
      -- Use starter receipt
      UPDATE public.users 
      SET starter_receipts_used = starter_receipts_used + 1,
          total_receipts_generated = total_receipts_generated + 1
      WHERE id = user_uuid;
    ELSE
      -- Use daily receipt (after starter exhausted)
      UPDATE public.users 
      SET last_free_receipt_date = CURRENT_DATE,
          total_receipts_generated = total_receipts_generated + 1
      WHERE id = user_uuid;
    END IF;
  ELSIF user_record.subscription_status = 'emergency' THEN
    UPDATE public.users 
    SET credits_remaining = credits_remaining - 1,
        total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  ELSE -- premium, yearly, founder, or active trial
    UPDATE public.users 
    SET total_receipts_generated = total_receipts_generated + 1
    WHERE id = user_uuid;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update consume_daily_chat function to handle trial users
DROP FUNCTION IF EXISTS public.consume_daily_chat(UUID);

CREATE OR REPLACE FUNCTION public.consume_daily_chat(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Get user data
  SELECT 
    subscription_status,
    daily_chats_used,
    last_chat_reset_date,
    tier,
    trial_end
  INTO user_record
  FROM public.users 
  WHERE id = user_uuid;
  
  -- Check if user exists
  IF user_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Premium users and active trial users have unlimited chats
  IF user_record.subscription_status IN ('premium', 'yearly', 'founder') OR
     (user_record.tier = 'premium_trial' AND user_record.trial_end > NOW()) THEN
    RETURN TRUE;
  END IF;
  
  -- Free users: check daily chat limit
  IF user_record.subscription_status = 'free' THEN
    -- Reset daily chats if new day
    IF user_record.last_chat_reset_date < CURRENT_DATE THEN
      UPDATE public.users 
      SET daily_chats_used = 0,
          last_chat_reset_date = CURRENT_DATE
      WHERE id = user_uuid;
      user_record.daily_chats_used = 0;
    END IF;
    
    -- Check if under daily limit (5 chats)
    IF user_record.daily_chats_used < 5 THEN
      UPDATE public.users 
      SET daily_chats_used = daily_chats_used + 1
      WHERE id = user_uuid;
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to automatically expire trials (run daily via cron)
CREATE OR REPLACE FUNCTION public.expire_trials()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Update expired trials back to free tier
  UPDATE public.users 
  SET tier = 'free'
  WHERE tier = 'premium_trial' 
    AND trial_end < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log expired trials
  IF expired_count > 0 THEN
    RAISE NOTICE 'Expired % trial accounts', expired_count;
  END IF;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant permissions
GRANT EXECUTE ON FUNCTION public.expire_trials() TO authenticated;
