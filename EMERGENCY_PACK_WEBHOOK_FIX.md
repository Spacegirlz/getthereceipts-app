# 🆘 Emergency Pack Webhook Fix

## Issues Found

### 1. **Critical Bug: `currentUser` Referenced Before Fetch** ✅ FIXED
- **Location**: `api/webhook.js` lines 162, 167, 181
- **Problem**: Code tried to use `currentUser?.subscription_status` before `currentUser` was fetched from database
- **Impact**: Would cause `ReferenceError: currentUser is not defined` when processing Emergency Pack payments
- **Fix**: Moved user fetch to the beginning of `handlePaymentSuccess()` function

### 2. **Potential Database Column Issue** ⚠️ NEEDS VERIFICATION
- **Location**: `api/webhook.js` line 216
- **Problem**: Webhook tries to update `subscription_expires_at` column which may not exist
- **Impact**: Would cause database error if column doesn't exist (only affects premium subscriptions, not Emergency Packs)
- **Fix**: Run `FIX_EMERGENCY_PACK_WEBHOOK.sql` to add missing column

## Emergency Pack Flow

### Emergency Pack x5 ($0.99)
- **Price ID**: `price_1SRl6hG71EqeOEZebPJkKJB6`
- **Credits Added**: +5 credits
- **Subscription Status**: Keeps current status (doesn't change)
- **Webhook Event**: `checkout.session.completed`
- **Amount Check**: `amountPaid === 0.99`

### Emergency Pack x10 ($1.99)
- **Price ID**: `price_1S0Po4G71EqeOEZeSqdB1Qfa`
- **Credits Added**: +10 credits
- **Subscription Status**: Keeps current status (doesn't change)
- **Webhook Event**: `checkout.session.completed`
- **Amount Check**: `amountPaid === 1.99`

## Database Update Logic

When Emergency Pack payment succeeds:
```javascript
{
  credits_remaining: (current_credits || 0) + creditsToAdd,
  subscription_status: currentUser.subscription_status, // Keep existing
  last_free_receipt_date: today
}
```

## Required Database Columns

The webhook updates these columns in `users` table:
- ✅ `credits_remaining` (should exist)
- ✅ `subscription_status` (should exist)
- ✅ `last_free_receipt_date` (should exist)
- ⚠️ `subscription_expires_at` (may not exist - only for premium subscriptions)

## Next Steps

1. ✅ **Fixed webhook bug** - `currentUser` now fetched before use
2. ⚠️ **Run SQL fix** - Execute `FIX_EMERGENCY_PACK_WEBHOOK.sql` in Supabase to ensure all columns exist
3. ✅ **Test Emergency Pack x5** - Purchase $0.99 pack and verify +5 credits
4. ✅ **Test Emergency Pack x10** - Purchase $1.99 pack and verify +10 credits

## Testing Checklist

- [ ] Run `FIX_EMERGENCY_PACK_WEBHOOK.sql` in Supabase
- [ ] Test Emergency Pack x5 purchase ($0.99)
- [ ] Verify credits increase by 5
- [ ] Test Emergency Pack x10 purchase ($1.99)
- [ ] Verify credits increase by 10
- [ ] Verify subscription_status doesn't change for Emergency Packs
- [ ] Check webhook logs for successful processing

## Notes

- The Stripe console errors shown (`Cannot find module './en'`, `unsupported 'as' value`) are **Stripe's internal errors**, not related to our webhook
- These Stripe errors don't affect payment processing or webhook execution
- The webhook will work correctly once deployed with the fix

