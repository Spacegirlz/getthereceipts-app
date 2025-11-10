# 🎯 Complete Payment System Setup Guide
## Organizing Coupons, Credits, and Subscriptions

---

## 📋 **STEP 1: DATABASE VERIFICATION**

### 1.1 Verify Users Table Columns
Run this in Supabase SQL Editor:

```sql
-- Check all required columns exist
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name IN (
    'credits_remaining',
    'subscription_status',
    'last_free_receipt_date',
    'subscription_expires_at',
    'stripe_subscription_id',
    'updated_at'
  )
ORDER BY column_name;
```

**Expected Result**: All 6 columns should exist

**If Missing**: Run `FIX_EMERGENCY_PACK_WEBHOOK.sql` to add missing columns

---

### 1.2 Verify Coupon Codes Table
Run this in Supabase SQL Editor:

```sql
-- Check coupon_codes table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'coupon_codes' 
  AND table_schema = 'public'
ORDER BY column_name;
```

**Required Columns**:
- `id` (UUID)
- `code` (VARCHAR) - unique
- `coupon_name` (VARCHAR)
- `credits_to_add` (INTEGER)
- `is_active` (BOOLEAN)
- `expires_at` (TIMESTAMPTZ)
- `max_uses` (INTEGER)
- `usage_count` (INTEGER)
- `created_at` (TIMESTAMPTZ)

---

### 1.3 Verify redeem_coupon Function
Run this in Supabase SQL Editor:

```sql
-- Check if function exists and has correct permissions
SELECT 
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  CASE 
    WHEN p.prosecdef THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'redeem_coupon';
```

**Expected Result**: Function exists with `SECURITY DEFINER`

**If Missing**: Run `FIX_COUPON_CODES_TABLE.sql` to create/update function

---

## 📋 **STEP 2: COUPON SETUP**

### 2.1 Verify Existing Coupons
Run this in Supabase SQL Editor:

```sql
-- Check all active coupons
SELECT 
  code,
  coupon_name,
  credits_to_add,
  is_active,
  expires_at,
  max_uses,
  usage_count,
  CASE 
    WHEN expires_at < NOW() THEN '❌ Expired'
    WHEN NOT is_active THEN '❌ Inactive'
    WHEN usage_count >= max_uses THEN '❌ Max Uses Reached'
    ELSE '✅ Active'
  END as status
FROM coupon_codes
ORDER BY code;
```

**Expected Coupons**:
- `BF5` - Black Friday Freebie (5 credits, expires 2025-12-31)
- `PMFRIENDS50` - PM Friends Mega Drop (50 credits, expires 2025-12-31)
- `SAGESANTA05` - Sage Santa 05 (5 credits, expires 2025-12-31)
- `GTRCHRISTMAS10` - GTR Christmas 10 (10 credits, expires 2025-12-31)

---

### 2.2 Add New Coupons (If Needed)
Run this in Supabase SQL Editor (replace values):

```sql
-- Template for adding new coupon
INSERT INTO coupon_codes (
  code,
  coupon_name,
  credits_to_add,
  is_active,
  expires_at,
  max_uses,
  usage_count
) VALUES (
  'COUPON_CODE',           -- Uppercase code
  'Coupon Display Name',   -- Human-readable name
  10,                       -- Credits to add
  true,                     -- Active status
  '2025-12-31 23:59:59+00', -- Expiration date
  100,                      -- Max uses
  0                         -- Current usage count
)
ON CONFLICT (code) 
DO UPDATE SET
  coupon_name = EXCLUDED.coupon_name,
  credits_to_add = EXCLUDED.credits_to_add,
  is_active = EXCLUDED.is_active,
  expires_at = EXCLUDED.expires_at,
  max_uses = EXCLUDED.max_uses;
```

---

### 2.3 Test Coupon Redemption
Run this in Supabase SQL Editor (replace with your user ID):

```sql
-- Test coupon redemption (replace USER_ID and COUPON_CODE)
SELECT public.redeem_coupon(
  'USER_ID_HERE'::UUID,
  'BF5'
) as result;
```

**Expected Result**: `{"success": true, "credits_added": 5}`

---

## 📋 **STEP 3: STRIPE PRODUCT CONFIGURATION**

### 3.1 Verify Stripe Products
Go to: **Stripe Dashboard → Products**

**Required Products**:

| Product Name | Price ID | Amount | Type | Credits |
|-------------|----------|--------|------|---------|
| Emergency Pack x5 | `price_1SRl6hG71EqeOEZebPJkKJB6` | $0.99 | One-time | +5 |
| Emergency Pack x10 | `price_1S0Po4G71EqeOEZeSqdB1Qfa` | $1.99 | One-time | +10 |
| Premium Monthly | `price_1RzgEZG71EqeOEZejcCAFxQs` | $4.99 | Recurring | Unlimited |
| OG Founders Club | `price_1RzgBYG71EqeOEZer7ojcw0R` | $29.99 | Recurring | Unlimited |

**Action**: Verify each product exists and price IDs match

---

### 3.2 Create Missing Products (If Needed)
1. Go to **Stripe Dashboard → Products → Add Product**
2. Fill in:
   - **Name**: "Emergency Pack x5"
   - **Price**: $0.99
   - **Billing**: One time
   - **Currency**: USD
3. Copy the **Price ID** (starts with `price_`)
4. Update code with new Price ID

---

## 📋 **STEP 4: WEBHOOK CONFIGURATION**

### 4.1 Verify Webhook Endpoint
Go to: **Stripe Dashboard → Developers → Webhooks**

**Required Endpoint**: `https://your-domain.vercel.app/api/webhook`

**Required Events**:
- ✅ `checkout.session.completed` - One-time payments & subscription setup
- ✅ `invoice.payment_succeeded` - Subscription renewals
- ✅ `invoice.payment_failed` - Failed payments
- ✅ `customer.subscription.deleted` - Cancellations
- ✅ `customer.subscription.updated` - Subscription changes

**Action**: Verify endpoint URL and events are configured

---

### 4.2 Test Webhook Locally (Optional)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5173/api/webhook
```

---

### 4.3 Verify Webhook Secret
Go to: **Stripe Dashboard → Developers → Webhooks → Your Endpoint → Signing Secret**

**Action**: Copy signing secret and verify it's set in Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

---

## 📋 **STEP 5: VERCEL ENVIRONMENT VARIABLES**

### 5.1 Verify Required Variables
Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Required Variables**:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGci...` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGci...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |

**Action**: Verify all variables are set for Production environment

---

## 📋 **STEP 6: TESTING PROCEDURE**

### 6.1 Test Emergency Pack x5 ($0.99)
1. **Purchase**: Go to pricing page → Click "Emergency Pack x5"
2. **Complete Payment**: Complete Stripe checkout
3. **Verify Credits**: Check dashboard - should show +5 credits
4. **Check Database**:
   ```sql
   SELECT credits_remaining, subscription_status 
   FROM users 
   WHERE email = 'your-email@example.com';
   ```
5. **Check Webhook Logs**: Vercel → Functions → webhook → Logs
   - Look for: `🆘 Processing Emergency Pack x 5 ($0.99)`
   - Look for: `✅ Successfully updated`

---

### 6.2 Test Emergency Pack x10 ($1.99)
1. **Purchase**: Go to pricing page → Click "Emergency Pack x10"
2. **Complete Payment**: Complete Stripe checkout
3. **Verify Credits**: Check dashboard - should show +10 credits
4. **Check Database**: Same as above
5. **Check Webhook Logs**: Same as above

---

### 6.3 Test Coupon Redemption
1. **Redeem Coupon**: Go to dashboard → Enter coupon code (e.g., `BF5`)
2. **Verify Credits**: Check dashboard - should show credits added
3. **Check Database**:
   ```sql
   SELECT 
     code,
     usage_count,
     max_uses
   FROM coupon_codes
   WHERE code = 'BF5';
   ```
4. **Test Duplicate**: Try redeeming same coupon again - should fail

---

### 6.4 Test Monthly Subscription ($4.99)
1. **Subscribe**: Go to pricing page → Click "Premium Monthly"
2. **Complete Payment**: Complete Stripe checkout
3. **Verify Status**: Check dashboard - should show "Premium" with unlimited credits
4. **Check Database**:
   ```sql
   SELECT 
     subscription_status,
     credits_remaining,
     subscription_expires_at
   FROM users 
   WHERE email = 'your-email@example.com';
   ```
   - `subscription_status` should be `'premium'`
   - `credits_remaining` should be `-1` (unlimited)
   - `subscription_expires_at` should be ~30 days from now
5. **Check Webhook Logs**: Look for subscription period end date

---

### 6.5 Test Yearly Subscription ($29.99)
1. **Subscribe**: Go to pricing page → Click "OG Founders Club"
2. **Complete Payment**: Complete Stripe checkout
3. **Verify Status**: Check dashboard - should show "Founder" with unlimited credits
4. **Check Database**: Same as monthly, but `subscription_expires_at` should be ~365 days from now
5. **Check Webhook Logs**: Same as monthly

---

## 📋 **STEP 7: MONITORING SETUP**

### 7.1 Set Up Webhook Monitoring
1. **Vercel Logs**: 
   - Go to Vercel Dashboard → Your Project → Functions → webhook
   - Monitor for errors or successful processing

2. **Stripe Dashboard**:
   - Go to Stripe Dashboard → Developers → Webhooks → Your Endpoint
   - Monitor for failed deliveries

3. **Supabase Logs**:
   - Go to Supabase Dashboard → Logs → Postgres Logs
   - Monitor for database errors

---

### 7.2 Create Monitoring Queries
Run these daily in Supabase SQL Editor:

```sql
-- Check failed coupon redemptions (last 24 hours)
SELECT 
  code,
  usage_count,
  max_uses,
  CASE 
    WHEN usage_count >= max_uses THEN 'Max uses reached'
    WHEN expires_at < NOW() THEN 'Expired'
    WHEN NOT is_active THEN 'Inactive'
    ELSE 'OK'
  END as status
FROM coupon_codes
WHERE is_active = true;

-- Check subscription status
SELECT 
  email,
  subscription_status,
  credits_remaining,
  subscription_expires_at,
  CASE 
    WHEN subscription_expires_at < NOW() THEN 'Expired'
    WHEN subscription_expires_at < NOW() + INTERVAL '7 days' THEN 'Expiring Soon'
    ELSE 'Active'
  END as status
FROM users
WHERE subscription_status IN ('premium', 'yearly')
ORDER BY subscription_expires_at;
```

---

## 📋 **STEP 8: DOCUMENTATION**

### 8.1 Update Price IDs in Code
Verify these files have correct Price IDs:

- `src/pages/LandingPage.jsx`
- `src/pages/PricingPage.jsx`
- `src/pages/DashboardPage.jsx`
- `src/components/AskSageSimple.jsx`
- `src/pages/LuxeChatInputPage.jsx`

**Search for**: `price_1SRl6hG71EqeOEZebPJkKJB6` (Emergency Pack x5)
**Search for**: `price_1S0Po4G71EqeOEZeSqdB1Qfa` (Emergency Pack x10)

---

### 8.2 Create Coupon Documentation
Document all active coupons:

| Code | Name | Credits | Expires | Max Uses | Current Uses |
|------|------|---------|---------|-----------|--------------|
| BF5 | Black Friday Freebie | 5 | 2025-12-31 | 500 | 0 |
| PMFRIENDS50 | PM Friends Mega Drop | 50 | 2025-12-31 | 100 | 0 |
| SAGESANTA05 | Sage Santa 05 | 5 | 2025-12-31 | 1000 | 0 |
| GTRCHRISTMAS10 | GTR Christmas 10 | 10 | 2025-12-31 | 1000 | 0 |

---

## 📋 **STEP 9: TROUBLESHOOTING**

### 9.1 Emergency Pack Not Adding Credits
**Check**:
1. Webhook logs in Vercel
2. Database `credits_remaining` column
3. Stripe webhook endpoint URL
4. `STRIPE_WEBHOOK_SECRET` environment variable

**Fix**: Verify webhook is receiving events and processing correctly

---

### 9.2 Coupon Not Working
**Check**:
1. Coupon exists in database: `SELECT * FROM coupon_codes WHERE code = 'COUPON_CODE';`
2. Coupon is active: `is_active = true`
3. Coupon not expired: `expires_at > NOW()`
4. Coupon not maxed: `usage_count < max_uses`
5. Function exists: `SELECT * FROM pg_proc WHERE proname = 'redeem_coupon';`

**Fix**: Run `FIX_COUPON_CODES_TABLE.sql` if function is missing

---

### 9.3 Subscription Not Renewing
**Check**:
1. Stripe subscription status
2. Webhook receiving `invoice.payment_succeeded` events
3. Database `subscription_expires_at` is updating
4. Webhook logs for errors

**Fix**: Verify webhook is processing renewal events correctly

---

## 📋 **STEP 10: FINAL VERIFICATION CHECKLIST**

- [ ] All database columns exist
- [ ] All coupons exist and are active
- [ ] `redeem_coupon` function exists and works
- [ ] All Stripe products exist with correct Price IDs
- [ ] Webhook endpoint configured in Stripe
- [ ] All environment variables set in Vercel
- [ ] Emergency Pack x5 tested and working
- [ ] Emergency Pack x10 tested and working
- [ ] Coupon redemption tested and working
- [ ] Monthly subscription tested and working
- [ ] Yearly subscription tested and working
- [ ] Webhook logs monitored and clean
- [ ] Documentation updated

---

## 🎯 **QUICK REFERENCE**

### Database Tables
- `users` - User credits and subscription status
- `coupon_codes` - Available coupons

### Key Functions
- `redeem_coupon(user_id, coupon_code)` - Redeem coupon and add credits

### Webhook Events
- `checkout.session.completed` - One-time payments
- `invoice.payment_succeeded` - Subscription renewals
- `invoice.payment_failed` - Failed payments
- `customer.subscription.deleted` - Cancellations

### Price IDs
- Emergency Pack x5: `price_1SRl6hG71EqeOEZebPJkKJB6`
- Emergency Pack x10: `price_1S0Po4G71EqeOEZeSqdB1Qfa`
- Premium Monthly: `price_1RzgEZG71EqeOEZejcCAFxQs`
- OG Founders: `price_1RzgBYG71EqeOEZer7ojcw0R`

---

## ✅ **SUCCESS CRITERIA**

All systems are working correctly when:
1. ✅ Emergency Packs add credits immediately after payment
2. ✅ Coupons redeem successfully and add credits
3. ✅ Subscriptions set unlimited credits and expiration dates
4. ✅ Subscription renewals update expiration dates automatically
5. ✅ Failed payments downgrade users after 3 attempts
6. ✅ Cancellations immediately downgrade users
7. ✅ All webhook events process without errors

---

**Last Updated**: January 2025
**Status**: Ready for Production

