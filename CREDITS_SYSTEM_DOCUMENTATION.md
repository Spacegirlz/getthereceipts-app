# Credits System Documentation - GetTheReceipts

## Overview
The credits system manages user subscription tiers, credit allocation, and usage tracking for GetTheReceipts app. This system has been properly implemented to work with our existing Supabase database structure.

## Database Structure

### Users Table (`users`)
The primary table for user management and credits:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR NOT NULL,
  stripe_customer_id VARCHAR UNIQUE,
  subscription_status VARCHAR DEFAULT 'free' CHECK (subscription_status IN ('free', 'emergency', 'premium', 'founder')),
  subscription_plan VARCHAR,
  stripe_subscription_id VARCHAR,
  credits_remaining INTEGER DEFAULT 1,
  total_receipts_generated INTEGER DEFAULT 0,
  last_free_receipt_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Credit Allocation by Plan

| Plan Type | Credits | Behavior |
|-----------|---------|----------|
| **Free Daily** | 1 per day | Resets daily via `last_free_receipt_date` |
| **Emergency Pack** | 5 total | One-time purchase, credits consumed |
| **Premium Monthly** | Unlimited | No credit consumption |
| **OG Founders Club** | Unlimited | No credit consumption |

## Credits System API

### Core Functions

#### `getUserCredits(userId)`
```javascript
// Returns user's current credits and subscription info
const userCredits = await getUserCredits(userId);
// Response: { data: { credits_remaining, subscription_type, last_reset }, error }
```

#### `initializeUserCredits(userId)`
```javascript
// Called when user signs up - sets initial credit state
const result = await initializeUserCredits(userId);
// Response: { success: boolean, error? }
```

#### `addCredits(userId, amount)`
```javascript
// Adds credits to user account (Emergency Pack purchases)
// Uses Supabase stored function: add_emergency_credits()
const result = await addCredits(userId, 5);
// Response: { success: boolean, error? }
```

### Referral System (Simplified)

#### `getUserReferralCode(userId)`
```javascript
// Generates referral code: "RECEIPTS" + last 6 chars of user ID
const code = await getUserReferralCode(userId);
// Response: { data: { referral_code, uses }, error }
```

#### `getReferralStats(userId)`
```javascript
// Returns referral statistics (basic implementation)
const stats = await getReferralStats(userId);
// Response: { data: { totalReferrals, bonusCreditsEarned }, error }
```

## Supabase Stored Functions

### `add_emergency_credits(user_uuid)`
Adds 5 credits to user account for Emergency Pack purchases:

```sql
-- Called when user purchases Emergency Pack
SELECT add_emergency_credits('user-uuid-here');
```

### `consume_credit(user_uuid)`
Consumes one credit and tracks usage:

```sql
-- Called when user generates a receipt
SELECT consume_credit('user-uuid-here');
```

### `update_subscription_status(user_uuid, new_status, stripe_sub_id)`
Updates user subscription from Stripe webhooks:

```sql
-- Called by Stripe webhooks
SELECT update_subscription_status('user-uuid', 'premium', 'sub_123');
```

## Integration Points

### 1. Authentication Context
**File:** `/src/contexts/SupabaseAuthContext.jsx`

```javascript
// Premium status detection
const isPremium = user?.subscription_status === 'premium' || 
                  user?.subscription_status === 'founder';
```

### 2. Subscription Service
**File:** `/src/lib/services/subscriptionService.js`

```javascript
// Credit consumption workflow
const canGenerate = SubscriptionService.canGenerateReceipt(userData);
if (canGenerate) {
  await SubscriptionService.consumeCredit(userId);
}
```

### 3. Pricing Page Integration
**File:** `/src/pages/PricingPage.jsx`

```javascript
// Plan-specific credit handling
if (planName === 'Free Daily') {
  navigate('/chat-input');  // No payment required
} else {
  // Stripe checkout for premium plans
  stripe.redirectToCheckout({ priceId });
}
```

## Error Handling

### Database Connection Issues
```javascript
// Graceful fallback for database errors
export const getUserCredits = async (userId) => {
  try {
    const { data, error } = await supabase.from('users')...;
    if (error) {
      // Return safe defaults
      return {
        data: { credits_remaining: 1, subscription_type: 'free' },
        error: error
      };
    }
  } catch (err) {
    console.error('Credits system error:', err);
    // Always return valid structure
  }
};
```

### User Experience
- **No credits remaining:** Show upgrade modal
- **Database errors:** Allow free usage with warnings
- **Network issues:** Graceful degradation to local state

## Migration History

### Issue Resolution (September 2025)
**Problem:** App was querying non-existent tables (`user_credits`, `referral_codes`, `referrals`)
**Solution:** Rewrote credits system to use existing `users` table structure

**Before:**
```javascript
// ❌ Queried missing tables
.from('user_credits').select(...)
.from('referral_codes').select(...)
```

**After:**
```javascript
// ✅ Uses existing users table
.from('users').select('credits_remaining, subscription_status, ...')
```

## Testing

### Local Development
```bash
# Test receipt generation with different user types
# 1. Free user (1 credit per day)
# 2. Emergency pack user (5 credits total)
# 3. Premium user (unlimited)

# Test URL: http://localhost:5174/test-receipt-flow
```

### Production Testing
```bash
# Live app testing
# URL: https://www.getthereceipts.com/chat-input

# Test scenarios:
# 1. New user signup → gets 1 free credit
# 2. Emergency pack purchase → gets 5 credits
# 3. Premium subscription → unlimited usage
```

## Configuration

### Environment Variables
```bash
# Required for credits system
VITE_SUPABASE_URL=https://dpzalqyrmjuuhvcquyzc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

### Stripe Configuration
1. **Enable Checkout:** https://dashboard.stripe.com/account/checkout/settings
2. **Enable "Client-only integration"**
3. **Configure webhooks** for subscription updates

## Monitoring

### Key Metrics to Track
- Daily active users vs credits consumed
- Conversion rate: Free → Emergency Pack
- Conversion rate: Emergency Pack → Premium
- Subscription churn rate
- Average credits per user per month

### Database Queries for Analytics
```sql
-- Daily credit consumption
SELECT DATE(created_at), COUNT(*) as receipts_generated
FROM receipts 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at);

-- Subscription distribution
SELECT subscription_status, COUNT(*) as users
FROM users 
GROUP BY subscription_status;

-- Revenue potential (emergency pack purchases)
SELECT COUNT(*) as emergency_purchases
FROM users 
WHERE subscription_status = 'emergency' 
AND updated_at >= CURRENT_DATE - INTERVAL '30 days';
```

## Future Enhancements

### Planned Features
1. **Advanced Referral System:** Track referral success and bonus distribution
2. **Usage Analytics:** Per-user receipt generation patterns
3. **Credit Gifting:** Allow premium users to gift credits
4. **Bulk Credit Packages:** Different emergency pack sizes
5. **Corporate Plans:** Team subscriptions with shared credit pools

### Technical Debt
1. **Referral Tracking:** Implement proper referral tables and tracking
2. **Credit History:** Track all credit transactions
3. **Usage Patterns:** Store user behavior analytics
4. **A/B Testing:** Credit allocation optimization

## Support & Troubleshooting

### Common Issues

**Credits not updating:**
```javascript
// Check user record in database
SELECT credits_remaining, subscription_status FROM users WHERE id = 'user-uuid';

// Manually reset credits if needed
UPDATE users SET credits_remaining = 1 WHERE id = 'user-uuid';
```

**Subscription status out of sync:**
```javascript
// Check Stripe webhook delivery
// Manually trigger subscription update
SELECT update_subscription_status('user-uuid', 'premium', 'sub_123');
```

### Contact Information
- **Developer:** Claude Code Integration
- **Database:** Supabase Project (dpzalqyrmjuuhvcquyzc)
- **Payments:** Stripe Dashboard
- **Repository:** https://github.com/Spacegirlz/getthereceipts-app

---

*Last Updated: September 2025*
*Status: Production Ready*