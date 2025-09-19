-- 🔧 FIX MISSING USERS
-- This script manually creates users in public.users table
-- Run this in Supabase SQL Editor

-- 1. Create myfyiacc@gmail.com in public.users
INSERT INTO public.users (id, email, subscription_status, credits_remaining, last_free_receipt_date, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'piet@virtualsatchel.com' THEN 'founder'
    ELSE 'free'
  END,
  CASE 
    WHEN au.email = 'piet@virtualsatchel.com' THEN 999999
    ELSE 3
  END,
  CURRENT_DATE,
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'myfyiacc@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu 
    WHERE pu.id = au.id
  );

-- 2. Create test1@getthereceipts.com in public.users
INSERT INTO public.users (id, email, subscription_status, credits_remaining, last_free_receipt_date, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'piet@virtualsatchel.com' THEN 'founder'
    ELSE 'free'
  END,
  CASE 
    WHEN au.email = 'piet@virtualsatchel.com' THEN 999999
    ELSE 3
  END,
  CURRENT_DATE,
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'test1@getthereceipts.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu 
    WHERE pu.id = au.id
  );

-- 3. Verify users were created
SELECT 
  'Users Created' as verification_type,
  COUNT(*) as users_found
FROM public.users
WHERE email IN ('myfyiacc@gmail.com', 'test1@getthereceipts.com');

-- 4. Show user details
SELECT 
  email,
  credits_remaining,
  subscription_status,
  created_at
FROM public.users
WHERE email IN ('myfyiacc@gmail.com', 'test1@getthereceipts.com')
ORDER BY created_at;
