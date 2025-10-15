-- Update user creation trigger to handle trial fields
-- Run this in Supabase SQL Editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function that includes trial fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the new user creation
  RAISE NOTICE 'Creating new user: % with email: %', NEW.id, NEW.email;
  
  -- Insert into public.users table with proper defaults including trial fields
  INSERT INTO public.users (
    id, 
    email, 
    subscription_status, 
    credits_remaining, 
    last_free_receipt_date, 
    created_at, 
    updated_at,
    -- Trial fields
    tier,
    trial_start,
    trial_end,
    trial_used,
    -- Usage tracking fields
    starter_receipts_used,
    daily_chats_used,
    last_chat_reset_date
  ) VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = 'piet@virtualsatchel.com' THEN 'founder'
      ELSE 'free'
    END,
    CASE 
      WHEN NEW.email = 'piet@virtualsatchel.com' THEN 999999
      ELSE 3  -- Give new users 3 credits
    END,
    CURRENT_DATE,
    NOW(),
    NOW(),
    -- Trial fields (will be updated by frontend after signup)
    'free', -- Default tier, will be updated to 'premium_trial' by frontend
    NULL,   -- trial_start
    NULL,   -- trial_end  
    false,  -- trial_used
    -- Usage tracking fields
    0,      -- starter_receipts_used
    0,      -- daily_chats_used
    CURRENT_DATE -- last_chat_reset_date
  );
  
  -- Log successful user creation
  RAISE NOTICE 'Successfully created user % with 3 credits', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth signup
    RAISE NOTICE 'Error creating user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger is created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_schema
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
