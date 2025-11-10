# 🔴 CRITICAL: BF5 Coupon Redemption Troubleshooting Guide

## Problem
Users cannot redeem BF5 coupon codes. Getting error signs.

## Root Causes Identified

### 1. **BF5 Coupon Missing from Database** ⚠️ CRITICAL
- BF5 is referenced throughout the frontend but **NOT in COUPON_SYSTEM_SETUP.sql**
- The coupon needs to be created in Supabase

### 2. **Function Signature Mismatch** ⚠️ POSSIBLE
- Multiple versions of `redeem_coupon` function exist
- Function might not exist or have wrong parameters
- RPC call might be failing silently

### 3. **RLS (Row Level Security) Issues** ⚠️ POSSIBLE
- Policies might block coupon reads/writes
- Function might not have proper permissions

### 4. **Case Sensitivity** ⚠️ POSSIBLE
- Code uses `UPPER()` but some functions don't
- Frontend sends uppercase but database might expect exact case

## Immediate Fix Steps

### Step 1: Run the Fix SQL Script
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste contents of `CRITICAL_BF5_FIX.sql`
3. Execute the script
4. Check for any errors

### Step 2: Verify in Supabase Dashboard
1. Go to Table Editor → `coupon_codes`
2. Search for code = "BF5"
3. Verify:
   - ✅ `is_active` = true
   - ✅ `receipts_count` = 5
   - ✅ `is_premium` = true
   - ✅ `max_uses` = 500 (or desired limit)
   - ✅ `expires_at` is in the future

### Step 3: Test Function Exists
Run in Supabase SQL Editor:
```sql
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'redeem_coupon' 
  AND routine_schema = 'public';
```

Should return 1 row with the function definition.

### Step 4: Test Function Manually
Run in Supabase SQL Editor (replace with a real user ID):
```sql
-- Get a test user ID first
SELECT id, email FROM auth.users LIMIT 1;

-- Then test (replace USER_ID_HERE with actual UUID)
SELECT public.redeem_coupon('BF5', 'USER_ID_HERE'::UUID);
```

### Step 5: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try redeeming BF5
4. Look for errors:
   - `Failed to fetch` → Network/connection issue
   - `Function not found` → Function doesn't exist
   - `Permission denied` → RLS/policy issue
   - `Invalid coupon code` → BF5 doesn't exist or is inactive

### Step 6: Check Network Tab
1. Open DevTools → Network tab
2. Try redeeming BF5
3. Look for request to Supabase:
   - URL should contain: `/rest/v1/rpc/redeem_coupon`
   - Check request payload
   - Check response status (should be 200)
   - Check response body for error details

## Common Error Messages & Fixes

### "Invalid coupon code"
- **Cause**: BF5 doesn't exist or `is_active = false`
- **Fix**: Run `CRITICAL_BF5_FIX.sql` to create/activate BF5

### "Function not found" or RPC error
- **Cause**: Function doesn't exist or wrong schema
- **Fix**: Run Step 1 of `CRITICAL_BF5_FIX.sql`

### "Permission denied" or 403 error
- **Cause**: RLS policies blocking access
- **Fix**: Run Step 3 of `CRITICAL_BF5_FIX.sql` to fix policies

### "Premium users already have unlimited credits"
- **Cause**: User has premium subscription
- **Fix**: This is expected behavior - premium users can't use coupons

### "You have already used this coupon"
- **Cause**: User already redeemed BF5
- **Fix**: Check `coupon_usage` table to verify

### Network timeout or connection error
- **Cause**: Supabase connection issue
- **Fix**: Check Supabase status, verify API keys in `.env`

## Verification Checklist

After running the fix:
- [ ] Function `redeem_coupon` exists in Supabase
- [ ] BF5 coupon exists in `coupon_codes` table
- [ ] BF5 has `is_active = true`
- [ ] RLS policies allow reading coupons
- [ ] Function has `SECURITY DEFINER` and proper grants
- [ ] Test redemption works in Supabase SQL Editor
- [ ] Test redemption works in the app UI
- [ ] Browser console shows no errors
- [ ] Network tab shows successful RPC call

## Quick Test Query

Run this to verify everything is set up:
```sql
-- Check function
SELECT EXISTS (
  SELECT 1 FROM information_schema.routines 
  WHERE routine_name = 'redeem_coupon' 
  AND routine_schema = 'public'
) as function_exists;

-- Check BF5 coupon
SELECT 
  code,
  coupon_name,
  is_active,
  receipts_count,
  is_premium,
  max_uses,
  usage_count,
  expires_at
FROM coupon_codes 
WHERE UPPER(code) = 'BF5';

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('coupon_codes', 'coupon_usage');
```

## If Still Not Working

1. **Check Supabase Logs**:
   - Dashboard → Logs → Postgres Logs
   - Look for errors when function is called

2. **Check Function Logs**:
   - The function has `RAISE NOTICE` statements
   - Check Postgres logs for these messages

3. **Verify API Keys**:
   - Check `.env` or environment variables
   - Verify Supabase URL and anon key are correct

4. **Test with Different User**:
   - Create a test account
   - Try redeeming BF5
   - This isolates user-specific issues

5. **Check Frontend Code**:
   - Verify `couponService.js` is calling RPC correctly
   - Check parameter names match function signature
   - Verify error handling is working

## Emergency Rollback

If the fix causes issues, you can:
1. Disable BF5 temporarily:
```sql
UPDATE coupon_codes 
SET is_active = false 
WHERE UPPER(code) = 'BF5';
```

2. Revert function to previous version (if you have backup)

## Contact Points

- Supabase Dashboard: https://supabase.com/dashboard
- Function should be in: `public.redeem_coupon`
- Table: `public.coupon_codes`
- Usage tracking: `public.coupon_usage`

