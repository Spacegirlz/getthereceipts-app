-- New User Bonus System Update
-- This script updates the database to give new users 3 credits instead of 1

-- 1. Update the user creation trigger to give 3 credits to new users
CREATE OR REPLACE FUNCTION handle_new_user()
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
      ELSE 3  -- NEW: Give new users 3 credits instead of 1
    END,
    CURRENT_DATE,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update existing free users who have 1 credit to give them the new user bonus
-- (This is a one-time update for existing users)
UPDATE users 
SET credits_remaining = 3
WHERE subscription_status = 'free' 
  AND credits_remaining = 1 
  AND email != 'piet@virtualsatchel.com';

-- 3. Verify the trigger is working
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_schema
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Check how many users were updated
SELECT 
  subscription_status,
  credits_remaining,
  COUNT(*) as user_count
FROM users 
GROUP BY subscription_status, credits_remaining
ORDER BY subscription_status, credits_remaining;

-- This ensures:
-- 1. All NEW signups get 3 credits automatically
-- 2. Existing free users with 1 credit get upgraded to 3 credits
-- 3. Founder account remains unlimited
-- 4. After using 3 credits, users rollover to 1 credit per day (handled by frontend logic)
