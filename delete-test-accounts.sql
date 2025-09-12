-- Delete test accounts from Supabase Auth
-- Run this in your Supabase SQL Editor
-- IMPORTANT: Delete in correct order to avoid foreign key constraint errors

-- Step 1: Delete referral records first (they reference users)
DELETE FROM public.user_referral_codes 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'myfyiacc@gmail.com',
    'piet@virtualsatchel.com',
    'hello@virtualsatchel.com'
  )
);

-- Step 2: Delete from your users table if it exists
DELETE FROM public.users 
WHERE email IN (
  'myfyiacc@gmail.com',
  'piet@virtualsatchel.com',
  'hello@virtualsatchel.com'
);

-- Step 3: Finally delete from auth.users table
DELETE FROM auth.users 
WHERE email IN (
  'myfyiacc@gmail.com',
  'piet@virtualsatchel.com', 
  'hello@virtualsatchel.com'
);
