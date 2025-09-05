-- User Auto-Creation Trigger - Run this in Supabase SQL Editor
-- This creates user records automatically when someone signs up

-- Function to create user profile automatically
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
      ELSE 1
    END,
    CURRENT_DATE,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Verify the trigger is created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_schema
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Test: Check if piet@virtualsatchel.com already exists and update if needed
UPDATE users 
SET 
  subscription_status = 'founder',
  credits_remaining = 999999
WHERE email = 'piet@virtualsatchel.com';

-- This ensures:
-- 1. All new signups automatically get a user record
-- 2. Owner email gets founder status automatically
-- 3. No more 404 errors when querying users table
-- 4. Proper RLS policies for security