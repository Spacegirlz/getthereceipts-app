# Troubleshooting Guide - GetTheReceipts

## 🚨 Critical Issues & Solutions

### 1. Stripe Payments Not Working
**Error:** `IntegrationError: The Checkout client-only integration is not enabled`

**Solution:**
1. Go to https://dashboard.stripe.com/account/checkout/settings
2. Find "Client-only integration" 
3. Toggle it **ON**
4. Save settings

**Why:** Stripe requires this setting for frontend-only payment processing.

---

### 2. Database 404 Errors (FIXED)
**Error:** `Failed to load resource: the server responded with a status of 404`  
**Tables:** `user_credits`, `referral_codes`, `referrals`

**Status:** ✅ **RESOLVED** (September 2025)

**Solution Applied:**
- Rewrote credits system to use existing `users` table
- Removed references to non-existent tables
- Proper error handling with fallbacks

**File:** `/src/lib/services/creditsSystem.js`

---

### 3. Routing Issues (FIXED)
**Error:** URL changes but page doesn't navigate

**Status:** ✅ **RESOLVED**

**Solution Applied:**
- Added `vercel.json` configuration for SPA routing
- Fixed React Router integration
- All navigation now works correctly

---

### 4. Authentication Redirect Issues (FIXED)
**Error:** Google login redirects to wrong domain

**Status:** ✅ **RESOLVED**

**Solution Applied:**
- Updated Supabase Site URL to `https://www.getthereceipts.com`
- Added proper redirect URLs in Supabase dashboard
- Custom domain properly configured

---

## 🔧 Current Configuration

### Environment Variables (Production)
```bash
VITE_OPENAI_API_KEY=sk-proj-your_openai_api_key_here
VITE_AI_PROVIDER=openai
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_SUPABASE_URL=https://dpzalqyrmjuuhvcquyzc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_dxjJ8BQVkEzsyjlJmbB040V3
```

### Supabase Configuration
**Site URL:** `https://www.getthereceipts.com`

**Redirect URLs:**
- `https://www.getthereceipts.com/*`
- `https://getthereceipts.com/*` 
- `http://localhost:5173/*` (for development)

### DNS Configuration (Hostinger)
```
A Record: @ → 76.76.19.61 (or current Vercel IP)
CNAME: www → cname.vercel-dns.com
```

---

## 🧪 Testing Procedures

### 1. Test Free Daily Flow
```
1. Go to: https://www.getthereceipts.com
2. Click "Get My Free Receipt"
3. Enter test message: "Hey! Sorry I've been MIA lately..."
4. Should redirect to sign up if not logged in
5. After signup, should generate receipt
```

### 2. Test Pricing Page
```
1. Go to: https://www.getthereceipts.com/pricing
2. Verify all 4 plans show up
3. Click "Start Free Daily" → should go to /chat-input
4. Click premium plans → should open Stripe checkout
```

### 3. Test Authentication
```
1. Click "Sign In" in top nav
2. Sign up with Google/email
3. Should redirect back to app
4. User should be logged in with correct status
```

### 4. Test Receipt Generation
```
1. As logged-in user, go to /chat-input
2. Enter message and click "Generate Truth Receipt"
3. Should show AI analysis with receipt card
4. Should consume credit from user account
```

---

## 📊 Monitoring & Analytics

### Key URLs to Monitor
- **Production:** https://www.getthereceipts.com
- **Vercel Dashboard:** https://vercel.com/piet-maries-projects/getthereceipts-app-fixed
- **Supabase Dashboard:** https://supabase.com/dashboard/project/dpzalqyrmjuuhvcquyzc
- **Stripe Dashboard:** https://dashboard.stripe.com

### Health Check Queries
```sql
-- Check user registration rate
SELECT DATE(created_at), COUNT(*) as new_users
FROM auth.users 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at);

-- Check receipt generation
SELECT DATE(created_at), COUNT(*) as receipts
FROM receipts 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at);

-- Check subscription distribution
SELECT subscription_status, COUNT(*) as count
FROM users 
GROUP BY subscription_status;
```

---

## 🚀 Deployment Process

### Auto-Deployment (Current)
1. Push to `main` branch on GitHub
2. Vercel automatically builds and deploys
3. New URL generated: `https://getthereceipts-app-fixed-[hash]-piet-maries-projects.vercel.app`
4. Custom domain `www.getthereceipts.com` points to latest deployment

### Manual Deployment
```bash
# From local development
git add .
git commit -m "Your change description"
git push origin main

# Or directly with Vercel CLI
vercel --prod
```

### Build Process
1. **Build Command:** `vite build`
2. **Output Directory:** `dist`  
3. **Environment Variables:** Set in Vercel dashboard
4. **Build Time:** ~2-3 minutes

---

## 🐛 Common User Issues

### "Credits not updating"
**Diagnosis:**
```sql
SELECT id, credits_remaining, subscription_status, last_free_receipt_date 
FROM users 
WHERE email = 'user@example.com';
```

**Fix:**
```sql
-- Reset free user's daily credit
UPDATE users 
SET last_free_receipt_date = CURRENT_DATE - INTERVAL '1 day'
WHERE id = 'user-uuid';
```

### "Payment not processing"
1. Check Stripe dashboard for failed payments
2. Verify Stripe keys in Vercel environment variables
3. Ensure "Client-only integration" is enabled
4. Check browser console for Stripe errors

### "Receipt generation failing"
1. Check OpenAI API key validity and credits
2. Verify Supabase connection
3. Check browser console for JavaScript errors
4. Test with `/test-receipt-flow` page

---

## 📱 Browser Compatibility

### Supported Browsers
- ✅ **Chrome 90+** (Primary target)
- ✅ **Safari 14+** (iOS/macOS)
- ✅ **Firefox 88+**
- ✅ **Edge 90+**
- ⚠️ **IE 11** (Not supported)

### Mobile Testing
- ✅ **iOS Safari** (iPhone/iPad)
- ✅ **Chrome Mobile** (Android)
- ✅ **Samsung Internet**

### Known Issues
- Font loading warnings (cosmetic only)
- Stripe CSP warnings (safe to ignore)

---

## 🔐 Security Considerations

### API Keys
- ✅ All API keys properly configured in Vercel environment
- ✅ No secrets exposed in client-side code
- ✅ Supabase RLS (Row Level Security) enabled
- ✅ HTTPS enforced on custom domain

### Data Protection
- User data encrypted at rest (Supabase)
- API calls over HTTPS only
- User can only access their own data
- No sensitive data logged to console

---

## 📞 Support Contacts

### Technical Issues
- **Repository:** https://github.com/Spacegirlz/getthereceipts-app
- **Domain:** Hostinger account
- **Database:** Supabase (dpzalqyrmjuuhvcquyzc)
- **Payments:** Stripe dashboard
- **Hosting:** Vercel (piet-maries-projects)

### Emergency Procedures
1. **Site Down:** Check Vercel status and deployment logs
2. **Payment Issues:** Check Stripe webhook delivery  
3. **Database Issues:** Check Supabase dashboard health
4. **DNS Issues:** Check Hostinger DNS settings

---

*Last Updated: September 2025*  
*Status: Production Ready*  
*Next Review: When new features are added*