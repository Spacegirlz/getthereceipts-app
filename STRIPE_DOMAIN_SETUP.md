# Stripe Domain Configuration - Fix Checkout Errors

## Current Error
```
IntegrationError: The domain (https://www.getthereceipts.com/) that redirected to Checkout is not enabled in the dashboard.
```

## How to Fix

### Step 1: Go to Stripe Checkout Settings
1. Open https://dashboard.stripe.com/account/checkout/settings
2. Log into your Stripe account

### Step 2: Add Domain to Allowed Domains
1. In the "Checkout settings" section
2. Find "Domains" or "Allowed domains" 
3. Add these domains:
   - `https://www.getthereceipts.com`
   - `https://getthereceipts.com` (without www)
   - `https://getthereceipts-app-fixed-*.vercel.app` (for deployment URLs)

### Step 3: Enable Client-Only Integration (if not already done)
1. In the same settings page
2. Find "Client-only integration"
3. Toggle it **ON**
4. Save settings

### Step 4: Verify Settings
After adding the domains:
1. Save the settings
2. Test a payment button on the live site
3. Should now redirect to Stripe checkout without errors

## Alternative: Test Mode First
If you want to test payments in development:
1. Also add `http://localhost:5173` and `http://localhost:5174` 
2. Use test mode Stripe keys
3. Test with card number: `4242424242424242`

## Current Status
- ✅ Client-only integration: Enabled (you confirmed this earlier)
- ❌ Domain allowlist: Needs `https://www.getthereceipts.com` added
- ❌ Production domain: Not yet configured

Once you add the domain, Stripe checkout should work immediately!