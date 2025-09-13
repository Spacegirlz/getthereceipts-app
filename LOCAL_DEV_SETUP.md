# 🛠️ LOCAL DEVELOPMENT SETUP GUIDE
*Get The Receipts - Development Environment*

## **🚀 Quick Start**

### **Prerequisites**
- Node.js 18+ installed
- Git installed  
- Code editor (VS Code recommended)

### **1. Clone and Install**
```bash
git clone https://github.com/Spacegirlz/getthereceipts-app.git
cd getthereceipts-app-fixed
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your development keys
nano .env.local  # or your preferred editor
```

### **3. Start Development Server**
```bash
npm run dev
```

**Local URL**: http://localhost:5173

---

## **🔧 DEVELOPMENT ENVIRONMENT CONFIGURATION**

### **Environment Variables Explained**

#### **Supabase (Database & Auth)**
```bash
VITE_SUPABASE_URL=https://dpzalqyrmjuuhvcquyzc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
```
- Uses **production database** (shared with live site)
- **Development users** get separate testing environment
- **localhost detection** gives 3 credits for testing

#### **Stripe (Payments) - TEST MODE**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
- **TEST MODE ONLY** - No real charges
- Use test card: `4242 4242 4242 4242`
- Expiry: Any future date, CVC: Any 3 digits

#### **AI Providers**
```bash
VITE_OPENAI_API_KEY=sk-proj-...
VITE_GOOGLE_API_KEY=your-gemini-key...
```
- **OpenAI**: Primary AI provider
- **Google Gemini**: Backup provider
- **Development**: Shared with production (small usage)

---

## **💳 LOCALHOST PAYMENT BEHAVIOR**

### **Credit System in Development**
```javascript
// Automatic localhost detection in creditsSystem.js
const isLocalhost = window.location.hostname === 'localhost'

if (isLocalhost) {
  // Everyone gets 3 credits for testing
  return { credits: 3, subscription: 'free' }
}
```

### **Features:**
- ✅ **3 free credits** for all users on localhost
- ✅ **No credit deduction** during testing
- ✅ **Payment testing** with Stripe test mode
- ✅ **Full feature access** for development

---

## **🧪 TESTING PAYMENT FLOWS**

### **Test Payment Methods**
| Card Number | Brand | Behavior |
|-------------|--------|-----------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0000 0000 0002` | Visa | ❌ Declined |
| `4000 0000 0000 9995` | Visa | ⏳ Insufficient funds |

### **Test Scenarios**
```bash
# Test Emergency Pack ($1.99)
1. Go to pricing page
2. Click "Decode This Now"  
3. Use test card 4242...
4. Verify success page shows "5 receipts added"

# Test Premium Monthly ($6.99)
1. Click "Get Unlimited Clarity"
2. Complete test payment
3. Verify "Welcome to Premium" message

# Test webhook processing
1. Check terminal logs for webhook events
2. Verify database updates in Supabase
```

---

## **🔧 DEVELOPMENT TOOLS**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### **Debugging Tools**
```bash
# Database queries
npm run db:studio    # Open Supabase studio
npm run db:reset     # Reset local database

# Payment testing
npm run stripe:listen  # Listen to webhooks locally
npm run test:payments  # Run payment flow tests
```

### **Hot Reload Features**
- ✅ **Instant page updates** on code changes
- ✅ **Component state preservation** during edits
- ✅ **Error overlay** with helpful debugging info
- ✅ **Fast refresh** for React components

---

## **📊 DEVELOPMENT MONITORING**

### **Console Output**
```bash
# Credit system logs
🚨 LOCALHOST: Everyone gets 3 credits for testing
🚨 LOCALHOST: Skipping credit deduction for testing

# Payment processing
💳 Payment completed: test@example.com paid $1.99
✅ Successfully added 5 credits to test@example.com

# AI provider logs  
🔧 Using OpenAI provider for analysis
🔄 Fallback to Google Gemini (if needed)
```

### **Browser Developer Tools**
- **Network tab**: Monitor API calls and responses
- **Application tab**: Check localStorage and sessionStorage
- **Console tab**: View application logs and errors

---

## **🗄️ DATABASE ACCESS**

### **Supabase Development**
- **URL**: https://app.supabase.com/project/dpzalqyrmjuuhvcquyzc
- **Tables**: `users`, `receipts` (if implemented)
- **Auth**: Development users separate from production

### **Local Database Operations**
```javascript
// Check user credits in browser console
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'your-dev-email@example.com')
  .single()

console.log('User data:', data)
```

---

## **🚨 DEVELOPMENT SAFETY**

### **Localhost Protections**
- ✅ **No real payments** - Only test transactions
- ✅ **Unlimited credits** - No blocking during development  
- ✅ **Separate user base** - Won't affect production users
- ✅ **Safe API calls** - Development keys with limited access

### **Best Practices**
```bash
# Never commit real API keys
echo ".env.local" >> .gitignore

# Use test data only
CREATE_TEST_USER=true npm run dev

# Reset database before major testing
npm run db:reset && npm run dev
```

---

## **🔄 SYNCING WITH PRODUCTION**

### **Getting Latest Changes**
```bash
git pull origin main      # Get latest code
npm install              # Update dependencies  
npm run build            # Test production build locally
```

### **Testing Production Features**
```bash
# Test with production-like environment
NODE_ENV=production npm run dev

# Test production build locally
npm run build && npm run preview
```

---

## **💡 DEVELOPMENT TIPS**

### **Faster Development**
```bash
# Skip expensive operations in development
VITE_SKIP_AI_CALLS=true npm run dev

# Use mock data for faster testing
VITE_USE_MOCK_DATA=true npm run dev

# Enable detailed logging
VITE_DEBUG=true npm run dev
```

### **Common Issues & Solutions**

#### **"Stripe not loading"**
- Check `VITE_STRIPE_PUBLISHABLE_KEY` is set
- Verify test mode keys (start with `pk_test_`)

#### **"Database connection failed"**  
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is not paused

#### **"AI analysis not working"**
- Check `VITE_OPENAI_API_KEY` has credits
- Verify API key has correct permissions

---

## **📞 DEVELOPMENT SUPPORT**

### **Resources**
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Test Guide**: https://stripe.com/docs/testing
- **React DevTools**: Browser extension for debugging
- **Vite Documentation**: https://vitejs.dev/guide/

### **Getting Help**
1. Check browser console for errors
2. Review network tab for failed API calls  
3. Verify environment variables are set correctly
4. Test with minimal reproduction case

---

## **🚀 READY TO DEVELOP**

Your local development environment is now configured with:
- ✅ **Safe testing environment** with unlimited credits
- ✅ **Payment testing** with Stripe test mode  
- ✅ **Full feature access** for development
- ✅ **Hot reload** for fast iteration
- ✅ **Production-like behavior** for accurate testing

**Start developing**: `npm run dev` and visit http://localhost:5173

---

*Happy coding! The development environment is designed to be safe, fast, and feature-complete for building and testing new features.*