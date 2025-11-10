-- VERIFY: Check if redeem_coupon function is accessible via RPC
-- This is critical - Supabase RPC requires specific setup

-- ============================================
-- Step 1: Verify function exists and signature
-- ============================================
SELECT 
  routine_name,
  routine_type,
  data_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'redeem_coupon' 
  AND routine_schema = 'public';

-- ============================================
-- Step 2: Check function security type
-- ============================================
-- SECURITY DEFINER is required for RPC calls from frontend
SELECT 
  p.proname as function_name,
  CASE 
    WHEN p.prosecdef THEN 'SECURITY DEFINER ✅'
    ELSE 'SECURITY INVOKER ❌ (needs to be DEFINER)'
  END as security_type,
  pg_get_functiondef(p.oid) as full_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'redeem_coupon'
  AND n.nspname = 'public';

-- ============================================
-- Step 3: Verify grants/permissions
-- ============================================
-- Check if authenticated, anon, and service_role can execute
SELECT 
  'Function exists' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'redeem_coupon' AND n.nspname = 'public'
    ) THEN '✅'
    ELSE '❌'
  END as status
UNION ALL
SELECT 
  'Is SECURITY DEFINER',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'redeem_coupon' 
        AND n.nspname = 'public'
        AND p.prosecdef = true
    ) THEN '✅'
    ELSE '❌'
  END;

-- ============================================
-- Step 4: Re-grant permissions (run this if needed)
-- ============================================
-- Uncomment and run if permissions are missing:

-- GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO authenticated;
-- GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO anon;
-- GRANT EXECUTE ON FUNCTION public.redeem_coupon(VARCHAR, UUID) TO service_role;

-- ============================================
-- Step 5: Test function call (replace with real user ID)
-- ============================================
-- Get a test user:
-- SELECT id, email FROM users WHERE subscription_status = 'free' LIMIT 1;

-- Test the function:
-- SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);

