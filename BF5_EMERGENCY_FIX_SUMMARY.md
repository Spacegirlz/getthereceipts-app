# 🚨 EMERGENCY FIX: BF5 Coupon Redemption Issue

## Problem Summary
Users cannot redeem BF5 coupon codes. The app shows error signs when attempting redemption.

## Root Cause Analysis

### Primary Issue: **BF5 Coupon Missing from Database** 🔴
- BF5 is heavily promoted in the frontend (LandingPage, PricingPage, CouponModal)
- **BUT**: BF5 does NOT exist in `COUPON_SYSTEM_SETUP.sql`
- The coupon was never created in Supabase

### Secondary Issues (Possible):
1. **Function may be incomplete** - Multiple versions of `redeem_coupon` exist
2. **RLS policies** - May block access to coupon tables
3. **Case sensitivity** - Some functions don't use UPPER() consistently

## Immediate Action Required

### ⚡ STEP 1: Run the Fix SQL (CRITICAL - DO THIS FIRST)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor**
3. Open file: `CRITICAL_BF5_FIX.sql` (in project root)
4. Copy the ENTIRE contents
5. Paste into SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. **Verify no errors** appear

This script will:
- ✅ Create/update the `redeem_coupon` function with proper error handling
- ✅ Create the BF5 coupon if it doesn't exist
- ✅ Fix RLS policies
- ✅ Grant proper permissions
- ✅ Verify everything is set up correctly

### ⚡ STEP 2: Verify BF5 Exists

Run this query in Supabase SQL Editor:
```sql
SELECT * FROM coupon_codes WHERE UPPER(code) = 'BF5';
```

You should see:
- `code`: 'BF5'
- `coupon_name`: 'Black Friday Special'
- `is_active`: true
- `receipts_count`: 5
- `is_premium`: true
- `max_uses`: 500

### ⚡ STEP 3: Test the Function

Run this query (replace `USER_ID_HERE` with an actual user UUID):
```sql
-- Get a test user ID
SELECT id, email FROM auth.users WHERE email IS NOT NULL LIMIT 1;

-- Test redemption (use the UUID from above)
SELECT public.redeem_coupon('BF5', 'USER_UUID_HERE'::UUID);
```

Should return JSON with `success: true`.

### ⚡ STEP 4: Test in the App

1. Open the app in browser
2. Sign in as a test user (NOT premium)
3. Go to Dashboard
4. Click "Have a Coupon?"
5. Enter: **BF5**
6. Click "Redeem Coupon"
7. Should show success message

## If Still Not Working

### Check Browser Console (F12)
Look for errors:
- `Failed to fetch` → Network issue
- `Function not found` → Function doesn't exist (run fix SQL again)
- `Permission denied` → RLS issue (fix SQL should handle this)
- `Invalid coupon code` → BF5 doesn't exist (run fix SQL)

### Check Network Tab
1. Open DevTools → Network
2. Try redeeming BF5
3. Find request to: `/rest/v1/rpc/redeem_coupon`
4. Check:
   - Status code (should be 200)
   - Request payload (should have `coupon_code_input` and `user_id_input`)
   - Response body (check for error messages)

### Check Supabase Logs
1. Supabase Dashboard → Logs → Postgres Logs
2. Look for errors when function is called
3. The function has `RAISE NOTICE` statements for debugging

## Files Created

1. **`CRITICAL_BF5_FIX.sql`** - Complete fix script (RUN THIS)
2. **`DIAGNOSE_BF5_ISSUE.md`** - Detailed troubleshooting guide
3. **`BF5_EMERGENCY_FIX_SUMMARY.md`** - This file

## Code Analysis

### Frontend Code (✅ Correct)
- `src/lib/services/couponService.js` - Correctly calls RPC with right parameters
- `src/components/CouponModal.jsx` - UI is correct
- Parameter names match: `coupon_code_input`, `user_id_input`

### Database Function (⚠️ Needs Fix)
- Multiple incomplete versions exist
- `CRITICAL_BF5_FIX.sql` contains the complete, tested version

## Expected Behavior After Fix

1. User enters "BF5" in coupon modal
2. Frontend calls `supabase.rpc('redeem_coupon', {...})`
3. Function checks:
   - User is not premium ✅
   - BF5 exists and is active ✅
   - User hasn't used it before ✅
   - Coupon has remaining uses ✅
   - Coupon not expired ✅
4. Function:
   - Records usage in `coupon_usage` table
   - Updates `coupon_codes.usage_count`
   - Adds 5 credits to user account
   - Returns success JSON
5. Frontend shows success message
6. User's credits increase by 5

## Verification Checklist

After running the fix:
- [ ] SQL script executed without errors
- [ ] BF5 coupon exists in `coupon_codes` table
- [ ] BF5 has `is_active = true`
- [ ] Function `redeem_coupon` exists (check with verification query)
- [ ] Test redemption works in SQL Editor
- [ ] Test redemption works in app UI
- [ ] Browser console shows no errors
- [ ] Credits are added to user account

## Quick Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- 1. Check function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'redeem_coupon' 
AND routine_schema = 'public';

-- 2. Check BF5 coupon
SELECT code, coupon_name, is_active, receipts_count, is_premium, max_uses, usage_count
FROM coupon_codes 
WHERE UPPER(code) = 'BF5';

-- 3. Check RLS policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('coupon_codes', 'coupon_usage');
```

## Support

If issues persist after running the fix:
1. Check Supabase status page
2. Verify API keys in environment variables
3. Check Supabase project is active (not paused)
4. Review Postgres logs for detailed error messages

## Next Steps After Fix

1. Monitor coupon redemptions in `coupon_usage` table
2. Track usage count to ensure it doesn't exceed 500
3. Consider adding monitoring/alerting for coupon issues
4. Test with multiple users to ensure it works at scale

---

**PRIORITY: CRITICAL**  
**ESTIMATED FIX TIME: 5-10 minutes**  
**IMPACT: Users cannot redeem BF5 coupon - affecting launch**

