# GetTheReceipts Production Deployment Checklist

## 🚀 PHASE 1: STRIPE INTEGRATION (CRITICAL)

### ✅ Stripe Price IDs Confirmed
**From CSV: `/Users/pietmarie/Downloads/Get The Receipts Stripe. Pricing .csv`**

1. **Emergency Pack**: `price_1S0Po4G71EqeOEZeSqdB1Qfa` ($1.99 one-time)
2. **Premium Monthly**: `price_1RzgEZG71EqeOEZejcCAFxQs` ($6.99/month) 
3. **OG Founders Club**: `price_1RzgBYG71EqeOEZer7ojcw0R` ($29.99/year)

### 📝 Required Updates:

#### Update PricingPage.jsx Price IDs:
```javascript
// CURRENT (placeholder):
priceId: 'price_emergency_pack',         // Emergency Pack
priceId: 'price_1RzgEZG71EqeOEZejcCAFxQs', // Premium Monthly ✅ CORRECT
priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R', // OG Founders Club ✅ CORRECT

// NEEDS UPDATE:
priceId: 'price_1S0Po4G71EqeOEZeSqdB1Qfa', // Emergency Pack ← UPDATE THIS
```

#### Verify Stripe Product Names Match UI:
- ✅ **Emergency Pack**: "Get The Receipts 🎉 Emergency Pack x 5 Truth Receipts"
- ✅ **Premium Monthly**: "Get The Receipts 💎 Premium Royalty Monthly"  
- ✅ **OG Founders Club**: "Get The Receipts 👑 The Founder's Yearly Pass"

### 🔧 Stripe Configuration Tasks:
- [ ] Update Emergency Pack price ID in `/src/pages/PricingPage.jsx`
- [ ] Test all payment flows in Stripe test mode
- [ ] Configure Stripe webhooks for subscription management
- [ ] Set up Stripe Customer Portal for subscription management
- [ ] Verify success/cancel URLs redirect properly

---

## 🔐 PHASE 2: SUPABASE SETUP & AUTHENTICATION

### Database Tables Required:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  stripe_customer_id VARCHAR,
  subscription_status VARCHAR DEFAULT 'free',
  subscription_plan VARCHAR,
  credits_remaining INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Truth Receipts storage (optional)
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  message TEXT,
  analysis_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 🔧 Supabase Configuration Tasks:
- [ ] Create production Supabase project
- [ ] Set up authentication policies
- [ ] Configure Row Level Security (RLS)
- [ ] Add email templates for auth flows
- [ ] Test user registration/login flows
- [ ] Set up subscription status tracking

### Environment Variables:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🔗 PHASE 3: LINK OPTIMIZATION & TARGETING

### Current Link Analysis & Updates Needed:

#### Landing Page → Pricing Links:
- [ ] **General "Pricing" buttons**: Should go to `/pricing` (top of page)
- [ ] **"Go Premium" CTAs**: Should go to `/pricing#premium-monthly`
- [ ] **"Founder's Deal" CTAs**: Should go directly to Stripe checkout

#### Pricing Page → Stripe Integration:
- [ ] **Free Daily**: Goes to `/chat-input` (no Stripe)
- [ ] **Emergency Pack**: Direct Stripe checkout with `price_1S0Po4G71EqeOEZeSqdB1Qfa`
- [ ] **Premium Monthly**: Direct Stripe checkout with `price_1RzgEZG71EqeOEZejcCAFxQs`
- [ ] **OG Founders Club**: Direct Stripe checkout with `price_1RzgBYG71EqeOEZer7ojcw0R`

#### Deep Link Strategy:
```javascript
// Add anchor linking for targeted pricing
const handleGoPremium = () => {
  navigate('/pricing#premium-monthly');
};

const handleFoundersClick = async () => {
  // Direct Stripe checkout for highest conversion
  await stripe.redirectToCheckout({
    lineItems: [{ price: 'price_1RzgBYG71EqeOEZer7ojcw0R', quantity: 1 }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/chat-input?welcome=founder`,
    cancelUrl: `${window.location.origin}/pricing`,
  });
};
```

### 🔧 Link Optimization Tasks:
- [ ] Add anchor links to pricing sections
- [ ] Update all CTA buttons with specific targeting
- [ ] Implement direct Stripe checkout for Founder's Deal
- [ ] Add welcome flows for different subscription types
- [ ] Test all navigation paths

---

## 🇪🇺 PHASE 4: EU GDPR COMPLIANCE

### Required GDPR Elements:

#### Cookie Consent:
```javascript
// Add to App.jsx or create CookieConsent component
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(!localStorage.getItem('cookie-consent'));
  
  return showBanner && (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use cookies to enhance your experience. By continuing, you agree to our 
          <a href="/privacy" className="text-blue-400 hover:underline ml-1">Privacy Policy</a>.
        </p>
        <Button onClick={() => {
          localStorage.setItem('cookie-consent', 'true');
          setShowBanner(false);
        }}>
          Accept
        </Button>
      </div>
    </div>
  );
};
```

#### Privacy Policy Page:
```javascript
// Create /src/pages/PrivacyPolicy.jsx
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
          <p>We collect minimal data necessary for service functionality...</p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Rights (GDPR)</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Right to access your data</li>
            <li>Right to rectification</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p>For privacy concerns: privacy@getthereceipts.com</p>
        </section>
      </div>
    </div>
  );
};
```

### 🔧 GDPR Compliance Tasks:
- [ ] Create cookie consent banner component
- [ ] Write comprehensive Privacy Policy page
- [ ] Add Terms of Service page
- [ ] Implement data deletion requests
- [ ] Add privacy controls to user dashboard
- [ ] Set up GDPR contact email
- [ ] Add age verification (13+ requirement)

---

## 🧪 PHASE 5: TESTING & VALIDATION

### End-to-End Testing Checklist:
- [ ] **Free Daily Flow**: Register → Get free receipt → Works correctly
- [ ] **Emergency Pack**: Purchase → 5 credits added → Usage tracking
- [ ] **Premium Monthly**: Subscribe → Unlimited access → Recurring billing
- [ ] **OG Founders**: Subscribe → Unlimited access → Annual billing
- [ ] **Payment Failures**: Handle declined cards gracefully
- [ ] **Subscription Management**: Cancel/upgrade flows work
- [ ] **Mobile Experience**: All flows work on mobile devices
- [ ] **EU Users**: GDPR compliance elements display correctly

### Technical Testing:
- [ ] All Stripe webhooks configured and tested
- [ ] Supabase authentication flows tested
- [ ] Environment variables configured in production
- [ ] Error handling tested for edge cases
- [ ] Performance testing completed
- [ ] SEO meta tags verified

---

## 🚀 PHASE 6: DEPLOYMENT

### Pre-Deployment Cleanup:
```bash
# Remove development files
rm /Users/pietmarie/getthereceipts-app-fixed/clean_immunity.jsx
rm /Users/pietmarie/getthereceipts-app-fixed/src/components/DeepDive_backup.jsx
rm /Users/pietmarie/getthereceipts-app-fixed/src/components/ImmunityTraining_broken.jsx
rm /Users/pietmarie/getthereceipts-app-fixed/src/components/ImmunityTraining_template.jsx

# Verify build works
npm run build
npm run preview
```

### Vercel Deployment:
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Environment Variables**: Add all `VITE_` prefixed variables
3. **Domain Configuration**: Set up custom domain
4. **Build Settings**: Verify build command and output directory
5. **Deploy**: Run first deployment
6. **SSL Certificate**: Ensure HTTPS is configured

### Environment Variables for Production:
```bash
# AI & Services
VITE_OPENAI_API_KEY=sk-proj-your_openai_api_key_here
VITE_AI_PROVIDER=openai
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Database
VITE_SUPABASE_URL=https://dpzalqyrmjuuhvcquyzc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwemFscXlybWp1dWh2Y3F1eXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDgwMjMsImV4cCI6MjA3MTUyNDAyM30.hUwv38jR4O0cC7hEDFQP0zu94zeVyVukc0-eY4fsbX0

# Payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_dxjJ8BQVkEzsyjlJmbB040V3
```

---

## 📊 PHASE 7: POST-LAUNCH MONITORING

### Analytics & Tracking:
- [ ] Set up Google Analytics 4
- [ ] Configure conversion tracking for subscriptions
- [ ] Monitor Stripe dashboard for payment issues
- [ ] Track user registration and retention rates
- [ ] Monitor AI API usage and costs

### Business Metrics:
- [ ] Daily/Weekly Active Users
- [ ] Free → Paid conversion rates
- [ ] Subscription retention rates
- [ ] Average revenue per user (ARPU)
- [ ] Customer support ticket volume

### Technical Monitoring:
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Monitor API response times
- [ ] Track build/deployment success rates
- [ ] Monitor Core Web Vitals scores

---

## 🎯 CRITICAL SUCCESS FACTORS

### Must-Have Before Launch:
1. **Stripe Integration Working**: All payment flows tested and functional
2. **Authentication System**: Users can register, login, and manage accounts
3. **GDPR Compliance**: EU users have proper privacy controls
4. **Mobile Experience**: App works flawlessly on mobile devices
5. **Error Handling**: Graceful failures for all edge cases

### Nice-to-Have Post-Launch:
1. Advanced analytics dashboard
2. Customer support chat integration
3. Referral program implementation
4. A/B testing framework
5. Advanced user segmentation

---

## 📋 FINAL PRE-LAUNCH CHECKLIST

- [ ] **Code Review**: All critical paths reviewed and tested
- [ ] **Security Audit**: No API keys exposed, secure authentication
- [ ] **Performance**: Page load times under 3 seconds
- [ ] **SEO**: Meta tags, sitemap, robots.txt configured
- [ ] **Legal**: Privacy Policy, Terms of Service, GDPR compliance
- [ ] **Monitoring**: Error tracking and analytics configured
- [ ] **Backup Plan**: Database backups and rollback strategy
- [ ] **Customer Support**: Support email and help documentation ready

---

## 🚨 IMMEDIATE ACTION ITEMS

### Priority 1 (THIS WEEK):
1. Update Emergency Pack price ID: `price_1S0Po4G71EqeOEZeSqdB1Qfa`
2. Test all Stripe payment flows
3. Configure Supabase production database
4. Create Privacy Policy and Terms of Service pages
5. Implement GDPR cookie consent

### Priority 2 (NEXT WEEK):
1. Set up production deployment pipeline
2. Configure domain and SSL certificates  
3. Implement comprehensive error monitoring
4. Create customer support documentation
5. Launch beta testing with limited users

### Priority 3 (FOLLOWING WEEK):
1. Full production launch
2. Marketing campaign activation
3. Customer feedback collection
4. Performance optimization
5. Scale monitoring and support systems

---

**Estimated Timeline**: 2-3 weeks for full production launch with all compliance and optimization features.

**Risk Factors**: GDPR compliance, Stripe webhook configuration, mobile performance optimization.

**Success Metrics**: >90% payment success rate, <3s page load times, full GDPR compliance, mobile-responsive experience across all devices.

**Last Updated**: September 2025