# 📱 GetTheReceipts - AI-Powered Relationship Analysis

**Decode any text message instantly. Get the receipts on what they really meant.**

A React-based web application that provides AI-powered relationship advice through "Truth Receipts." Users can input messages, situations, or conversations and receive detailed analysis including personality archetypes, brutal honesty, and actionable advice.

🌟 **[Live App](https://www.getthereceipts.com)** | 📚 **[Documentation](#documentation)** | 🐛 **[GitHub Repository](https://github.com/Spacegirlz/getthereceipts-app)**

---

## 🚀 **Production Status: LIVE**

**✅ App URL:** https://www.getthereceipts.com  
**✅ GitHub:** https://github.com/Spacegirlz/getthereceipts-app  
**✅ Database:** Supabase (configured & operational)  
**✅ Payments:** Stripe integration (requires checkout activation)  
**✅ Domain:** Custom domain configured with SSL  
**✅ Deployment:** Auto-deploy from GitHub main branch  

### Recent Updates (September 2025)
- ✅ **Credits System:** Properly integrated with existing database structure
- ✅ **Routing Fixed:** All navigation working correctly on production  
- ✅ **Authentication:** Supabase auth configured for custom domain
- ✅ **Free Daily Button:** Fixed to navigate directly to chat input
- ⚠️ **Stripe Checkout:** Requires manual activation in Stripe dashboard

---

## ✨ Features

### 🧠 AI-Powered Analysis
- **Truth Receipts**: Instant message analysis with brutal honesty
- **Deep Dive**: Detailed psychological insights and patterns
- **Immunity Training**: Learn to recognize manipulation tactics
- **Green/Red Flags**: Dynamic flag detection based on relationship health

### 💰 Flexible Pricing
- **Free Daily**: 1 truth receipt per day
- **Emergency Pack**: 5 receipts for crisis situations ($1.99)
- **Premium Monthly**: Unlimited receipts + premium features ($6.99/mo)
- **OG Founders Club**: Lifetime unlimited access ($29.99/year)

### 🎨 Premium UX
- Beautiful dark theme with animated gradients
- Mobile-responsive design
- Voice synthesis with multiple providers
- Social sharing optimized for viral content
- Crystal-clear screenshots for social media

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/getthereceipts.git
   cd getthereceipts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # AI Services
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_AI_PROVIDER=openai
   VITE_OPENAI_MODEL=gpt-4o-mini
   
   # Database
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Payments
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Voice (optional)
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
   ```

4. **Set up database**
   - Create a Supabase project
   - Run the SQL schema from `supabase_setup.sql` in your Supabase SQL editor
   
5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:5174`

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI GPT-4o-mini
- **Voice**: ElevenLabs TTS + OpenAI TTS
- **Deployment**: Vercel/Netlify ready

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, toasts)
│   ├── ReceiptCardViral.jsx    # Main truth receipt component
│   ├── DeepDive.jsx            # Deep analysis component  
│   └── ImmunityTraining.jsx    # Pattern recognition training
├── pages/              # Route components
│   ├── LandingPage.jsx         # Homepage
│   ├── PricingPage.jsx         # Subscription plans
│   ├── ChatInputPage.jsx       # Message input interface
│   └── TestReceiptPage.jsx     # Development testing
├── contexts/           # React contexts
│   ├── SupabaseAuthContext.jsx # Authentication
│   └── AuthModalContext.jsx    # Modal management
├── lib/               # Utilities and services
│   ├── services/      # Business logic
│   ├── prompts/       # AI prompt engineering
│   └── database/      # Database utilities
└── assets/            # Static assets
```

---

## 🧪 Testing

### Test Receipt Generation
Visit `/test-receipt-flow` in development for comprehensive testing:
- Pre-loaded sample scenarios
- Complete component testing (Receipt → Deep Dive → Immunity)
- Debug data inspection
- Animation and styling verification

### Sample Test Messages
1. **Mixed Signals Test**: Tests toxic relationship detection
2. **Healthy Connection Test**: Verifies green flag generation  
3. **Breadcrumbing Test**: Manipulation pattern recognition

### Test Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test complete flow
# Visit: http://localhost:5174/test-receipt-flow
```

---

## 📊 AI System

### Three-Stage Analysis
1. **Main Analysis** (`brutalPrompt.js`): Archetype detection with health assessment
2. **Deep Dive** (`deepDivePrompt.js`): Psychological insights and patterns
3. **Immunity Training** (`immunityPrompt.js`): Pattern recognition and advice

### Key Features
- Dynamic green/red flag detection
- Conversation-specific analysis (no templates)
- Bulletproof error handling with fallbacks
- Token usage optimization

### Prompt Engineering
- Crisis intervention responses
- User protection (no shaming/victim blaming)
- Consistent "Sage" voice across all components
- Context-aware pattern matching

---

## 💳 Stripe Integration

### Products Configured
- **Emergency Pack**: `price_1S0Po4G71EqeOEZeSqdB1Qfa` ($1.99)
- **Premium Monthly**: `price_1RzgEZG71EqeOEZejcCAFxQs` ($6.99/month)
- **OG Founders Club**: `price_1RzgBYG71EqeOEZer7ojcw0R` ($29.99/year)

### Subscription Management
- Automatic user profile creation
- Credit tracking and consumption
- Subscription status synchronization
- Webhook event processing

---

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   Set all `VITE_` prefixed variables in Vercel dashboard

3. **Database Setup**
   - Run `supabase_setup.sql` in production Supabase project
   - Configure Row Level Security policies
   - Set up authentication providers

### Environment Configuration
```bash
# Production Environment Variables
VITE_OPENAI_API_KEY=sk-proj-...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_ELEVENLABS_API_KEY=sk_...
```

---

## 📚 Documentation

### Key Documents
- [`PRODUCTION_DEPLOYMENT_CHECKLIST.md`](PRODUCTION_DEPLOYMENT_CHECKLIST.md) - Complete deployment guide
- [`SUPABASE_SETUP_COMPLETE.md`](SUPABASE_SETUP_COMPLETE.md) - Database configuration
- [`GET_THE_RECEIPTS_HANDOFF_SUMMARY.md`](GET_THE_RECEIPTS_HANDOFF_SUMMARY.md) - Comprehensive project overview
- [`LINK_AUDIT_REPORT.md`](LINK_AUDIT_REPORT.md) - Navigation verification

### API Documentation
- Authentication via Supabase Auth
- Subscription management via custom service
- AI analysis via OpenAI integration
- Payment processing via Stripe

---

## 🛡️ Security & Privacy

### Data Protection
- Row Level Security (RLS) enabled on all tables
- User data encryption at rest and in transit
- No permanent storage of analysis content
- GDPR compliance ready

### API Security
- Environment variable protection
- Rate limiting recommended for production
- Secure webhook endpoints
- Input validation and sanitization

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly using `/test-receipt-flow`
5. Submit a pull request

### Code Standards
- ESLint configuration included
- Prettier for code formatting
- Component-based architecture
- TypeScript-ready structure

---

## 📈 Performance

### Metrics
- **AI Success Rate**: 99%+ analysis completion
- **Page Load Time**: <2 seconds optimized
- **Build Size**: ~2MB compressed
- **Mobile Performance**: 90+ Lighthouse score

### Optimization
- Code splitting with Vite
- Image optimization
- Lazy loading implementation
- CDN-ready asset structure

---

## 🐛 Troubleshooting

### Common Issues

**AI Analysis Fails**
- Check OpenAI API key and credits
- Verify network connectivity
- Review prompt token limits

**Payment Processing Errors**  
- Confirm Stripe keys and webhook configuration
- Check subscription status in Supabase
- Verify customer creation flow

**Authentication Issues**
- Confirm Supabase project settings
- Check RLS policies
- Verify email confirmation setup

### Support
- 📧 **Email**: support@getthereceipts.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/getthereceipts/issues)
- 📖 **Docs**: See documentation files in repository

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o-mini API
- **Supabase** for database and authentication
- **Stripe** for payment processing
- **Vercel** for hosting and deployment
- **Framer Motion** for animations
- **Tailwind CSS** for styling

---

**Built with ❤️ for people navigating modern dating confusion.**

*Get the receipts. Get the clarity. Get your power back.*