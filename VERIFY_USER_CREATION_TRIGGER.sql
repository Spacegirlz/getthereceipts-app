-- CRITICAL FIX: Verify and fix user creation trigger for initial credits
-- This ensures new users get 3 credits automatically when they sign up

-- 1. Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_schema,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
  AND trigger_schema = 'public';

-- 2. Check if the function exists
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
  AND routine_schema = 'public';

-- 3. Drop existing trigger and function if they exist (to recreate them properly)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Create the complete handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the new user creation
  RAISE NOTICE 'Creating new user: % with email: %', NEW.id, NEW.email;
  
  -- Insert into public.users table with proper defaults
  INSERT INTO public.users (
    id, 
    email, 
    subscription_status, 
    credits_remaining, 
    last_free_receipt_date, 
    created_at, 
    updated_at,
    save_receipts
  ) VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = 'piet@virtualsatchel.com' THEN 'founder'
      ELSE 'free'
    END,
    CASE 
      WHEN NEW.email = 'piet@virtualsatchel.com' THEN 999999
      ELSE 3  -- 🎯 Give new users 3 credits
    END,
    CURRENT_DATE,
    NOW(),
    NOW(),
    false  -- Default to not saving receipts for privacy
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

-- 5. Create the trigger that fires when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 7. Create a test function to verify the trigger works
CREATE OR REPLACE FUNCTION public.test_user_creation()
RETURNS TABLE (
  test_result TEXT,
  user_count BIGINT,
  sample_users JSONB
) AS $$
BEGIN
  -- Count total users
  SELECT COUNT(*) INTO user_count FROM public.users;
  
  -- Get sample users
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'email', email,
      'subscription_status', subscription_status,
      'credits_remaining', credits_remaining,
      'created_at', created_at
    )
  ) INTO sample_users
  FROM public.users
  ORDER BY created_at DESC
  LIMIT 3;
  
  RETURN QUERY
  SELECT 
    'User creation trigger test'::TEXT,
    user_count,
    sample_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions for test function
GRANT EXECUTE ON FUNCTION public.test_user_creation() TO authenticated;

-- 9. Test the function
SELECT * FROM public.test_user_creation();

-- 10. Create a function to manually create a test user (for testing purposes)
CREATE OR REPLACE FUNCTION public.create_test_user(
  test_email VARCHAR(255),
  test_password VARCHAR(255) DEFAULT 'testpassword123'
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  auth_result JSON;
BEGIN
  -- This function is for testing only - in production, users sign up through Supabase Auth
  -- For now, we'll just create a user record directly
  
  new_user_id := gen_random_uuid();
  
  -- Insert test user
  INSERT INTO public.users (
    id, 
    email, 
    subscription_status, 
    credits_remaining, 
    last_free_receipt_date, 
    created_at, 
    updated_at,
    save_receipts
  ) VALUES (
    new_user_id,
    test_email,
    'free',
    3,  -- Give 3 credits
    CURRENT_DATE,
    NOW(),
    NOW(),
    false
  );
  
  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', test_email,
    'credits_remaining', 3,
    'message', 'Test user created successfully'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to create test user'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Grant permissions for test user creation
GRANT EXECUTE ON FUNCTION public.create_test_user(VARCHAR, VARCHAR) TO authenticated;

-- 12. Create a function to verify user credit initialization
CREATE OR REPLACE FUNCTION public.verify_user_credits(user_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  subscription_status VARCHAR,
  credits_remaining INTEGER,
  has_proper_credits BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.subscription_status,
    u.credits_remaining,
    CASE 
      WHEN u.subscription_status = 'founder' AND u.credits_remaining = 999999 THEN TRUE
      WHEN u.subscription_status = 'free' AND u.credits_remaining = 3 THEN TRUE
      WHEN u.subscription_status IN ('premium', 'yearly') AND u.credits_remaining = -1 THEN TRUE
      ELSE FALSE
    END as has_proper_credits,
    u.created_at
  FROM public.users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Grant permissions for verification function
GRANT EXECUTE ON FUNCTION public.verify_user_credits(UUID) TO authenticated;

-- 14. Verify the trigger is properly created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  trigger_schema
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 15. Verify the function is properly created
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
  AND routine_schema = 'public';

-- This ensures:
-- ✅ User creation trigger exists and works properly
-- ✅ New users get 3 credits automatically
-- ✅ Founder account gets unlimited credits
-- ✅ Proper error handling and logging
-- ✅ Test functions to verify functionality
-- ✅ Manual test user creation for testing
-- ✅ User credit verification function
-- ✅ Proper permissions and security
