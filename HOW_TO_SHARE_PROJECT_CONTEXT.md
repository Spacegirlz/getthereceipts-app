# 📚 How to Share Get The Receipts Context with an LLM
## Structured File Grouping for Effective Context Sharing

---

## 🎯 **QUICK START: MINIMAL CONTEXT (5-10 files)**

For quick questions or specific tasks, share these essential files:

### **Core Understanding Files:**
1. `README.md` - Project overview, features, tech stack
2. `GET_THE_RECEIPTS_HANDOFF_SUMMARY.md` - Comprehensive system overview
3. `package.json` - Dependencies and project structure

### **Current State Files:**
4. `src/pages/LandingPage.jsx` - Main landing page (for UX/design work)
5. `src/App.jsx` - Routing and app structure

**Use this for**: Quick questions, specific feature work, initial understanding

---

## 📋 **BY PURPOSE: WHAT FILES TO SHARE**

### **1. UNDERSTANDING THE PRODUCT**

**Goal**: Help LLM understand what Get The Receipts is and does

**Files to Share:**
```
README.md
GET_THE_RECEIPTS_HANDOFF_SUMMARY.md (first 500 lines)
DESIGN_STRATEGY_AND_OUTLINE.md
src/pages/LandingPage.jsx (hero section)
```

**Prompt to Use:**
```
I'm sharing files about Get The Receipts. Please read these to understand:
- What the product does
- Who the target audience is
- The main value proposition
- Current design philosophy

Files: [attach files]
```

---

### **2. UX/DESIGN IMPROVEMENTS**

**Goal**: Improve landing page design and user experience

**Files to Share:**
```
DESIGN_STRATEGY_AND_OUTLINE.md
src/pages/LandingPage.jsx (full file)
src/components/SEOHead.jsx
UX_DESIGN_AND_CONVERSION_GUIDE.md (your expert role guide)
tailwind.config.js (for design system)
```

**Prompt to Use:**
```
You are an award-winning UX/UI designer. I'm sharing the current landing 
page and design strategy. Please analyze and provide improvement recommendations.

Files:
- DESIGN_STRATEGY_AND_OUTLINE.md (design philosophy)
- src/pages/LandingPage.jsx (current implementation)
- tailwind.config.js (design system)
```

---

### **3. PAYMENT/SUBSCRIPTION SYSTEM**

**Goal**: Work on payments, coupons, credits, subscriptions

**Files to Share:**
```
COMPLETE_PAYMENT_SYSTEM_SETUP.md
CREDITS_SYSTEM_DOCUMENTATION.md
api/webhook.js
src/lib/services/couponService.js
src/lib/services/subscriptionService.js
FIX_COUPON_CODES_TABLE.sql (to understand schema)
```

**Prompt to Use:**
```
You are an expert payment system developer. I'm sharing the payment system 
documentation and code. Please help with [specific task].

Files:
- COMPLETE_PAYMENT_SYSTEM_SETUP.md (system overview)
- api/webhook.js (webhook handler)
- src/lib/services/couponService.js (coupon logic)
```

---

### **4. DATABASE/SUPABASE WORK**

**Goal**: Database changes, schema updates, SQL functions

**Files to Share:**
```
supabase_setup.sql (or latest schema file)
COMPREHENSIVE_SYSTEM_REVIEW.md
[Specific SQL file related to your task]
src/lib/services/creditsSystem.js
```

**Prompt to Use:**
```
You are a Supabase/PostgreSQL expert. I need help with [specific task]. 
Here's the current database schema and related code.

Files:
- supabase_setup.sql (schema)
- [relevant service file]
```

---

### **5. AI/ANALYSIS FEATURES**

**Goal**: Work on AI analysis, prompts, receipt generation

**Files to Share:**
```
src/lib/analysis/advancedAnalysis.js
src/lib/prompts/brutalPrompt.js
src/lib/prompts/deepDivePrompt.js
src/lib/prompts/immunityPrompt.js
src/lib/chat/askSagePrompt.js
CRISIS_DETECTION_SYSTEM_DOCUMENTATION.md
```

**Prompt to Use:**
```
You are an AI prompt engineering expert. I'm sharing the analysis system 
and prompts. Please help improve [specific aspect].

Files:
- src/lib/analysis/advancedAnalysis.js (main analysis logic)
- src/lib/prompts/*.js (all prompt files)
```

---

### **6. AUTHENTICATION/USER MANAGEMENT**

**Goal**: User auth, signup, login, user flows

**Files to Share:**
```
src/contexts/SupabaseAuthContext.jsx
src/pages/DashboardPage.jsx
SUPABASE_SETUP_COMPLETE.md
SUPABASE_USER_TRIGGER.sql
```

**Prompt to Use:**
```
You are a Supabase auth expert. I need help with user authentication 
and management. Here are the relevant files.

Files:
- src/contexts/SupabaseAuthContext.jsx (auth context)
- src/pages/DashboardPage.jsx (user dashboard)
```

---

### **7. DEPLOYMENT/PRODUCTION**

**Goal**: Deployment, environment setup, production issues

**Files to Share:**
```
PRODUCTION_DEPLOYMENT_CHECKLIST.md
DEPLOYMENT_AND_MONITORING_PLAN.md
vercel.json
package.json
README.md (deployment section)
```

**Prompt to Use:**
```
You are a DevOps/deployment expert. I need help with [deployment task]. 
Here's the deployment configuration and checklist.

Files:
- PRODUCTION_DEPLOYMENT_CHECKLIST.md
- vercel.json
```

---

## 🗂️ **FILE GROUPING STRATEGY**

### **Strategy 1: Progressive Context Loading**

**Step 1: Overview (3-5 files)**
```
README.md
GET_THE_RECEIPTS_HANDOFF_SUMMARY.md (summary section)
package.json
```

**Step 2: Specific Domain (5-10 files)**
```
[Domain-specific files based on task]
```

**Step 3: Implementation Details (as needed)**
```
[Specific component/service files]
```

---

### **Strategy 2: Domain-Based Grouping**

**Group A: Product Understanding**
- `README.md`
- `GET_THE_RECEIPTS_HANDOFF_SUMMARY.md`
- `DESIGN_STRATEGY_AND_OUTLINE.md`

**Group B: Frontend/UI**
- `src/pages/LandingPage.jsx`
- `src/App.jsx`
- `src/components/*.jsx`
- `tailwind.config.js`

**Group C: Backend/API**
- `api/webhook.js`
- `api/create-checkout-session.js`
- `src/lib/services/*.js`

**Group D: Database**
- `supabase_setup.sql`
- `[relevant SQL files]`
- `src/lib/services/creditsSystem.js`

**Group E: Documentation**
- `COMPLETE_PAYMENT_SYSTEM_SETUP.md`
- `CREDITS_SYSTEM_DOCUMENTATION.md`
- `[domain-specific docs]`

---

## 📝 **EFFECTIVE PROMPT TEMPLATES**

### **Template 1: First-Time Introduction**

```
I'm working on Get The Receipts, an AI-powered relationship analysis web app.

CONTEXT FILES (read these first):
- README.md - Project overview
- GET_THE_RECEIPTS_HANDOFF_SUMMARY.md - System overview

TASK FILES (for this specific task):
- [list relevant files]

TASK: [What you need help with]

Please read the context files first to understand the product, then help 
with the specific task using the task files.
```

---

### **Template 2: Domain-Specific Work**

```
You are an expert [DOMAIN]. I'm working on [SPECIFIC FEATURE] in Get The 
Receipts.

PRODUCT CONTEXT:
- README.md (quick overview)

DOMAIN CONTEXT:
- [Domain-specific documentation file]

CURRENT IMPLEMENTATION:
- [Relevant code files]

TASK: [Specific task]

Please analyze the current implementation and provide recommendations.
```

---

### **Template 3: Bug Fixing/Debugging**

```
You are an expert [TECHNOLOGY] troubleshooter. There's an issue with 
[FEATURE] in Get The Receipts.

PROBLEM: [Describe the issue]

RELEVANT FILES:
- [Files related to the issue]
- [Error logs if available]
- [Related documentation]

Please investigate and provide a fix.
```

---

## 🎯 **SPECIFIC SCENARIOS**

### **Scenario 1: Landing Page Redesign**

**Files:**
```
1. DESIGN_STRATEGY_AND_OUTLINE.md
2. src/pages/LandingPage.jsx
3. tailwind.config.js
4. UX_DESIGN_AND_CONVERSION_GUIDE.md
```

**Prompt:**
```
You are an award-winning UX/UI designer. I'm sharing the current landing 
page design and strategy. Please analyze and provide improvement recommendations.

Files:
1. DESIGN_STRATEGY_AND_OUTLINE.md - Design philosophy and strategy
2. src/pages/LandingPage.jsx - Current implementation
3. tailwind.config.js - Design system
4. UX_DESIGN_AND_CONVERSION_GUIDE.md - Expert role guide

Goal: Improve from C- to award-winning quality, reduce density, improve conversion.
```

---

### **Scenario 2: Payment System Work**

**Files:**
```
1. COMPLETE_PAYMENT_SYSTEM_SETUP.md
2. api/webhook.js
3. src/lib/services/couponService.js
4. FIX_COUPON_CODES_TABLE.sql
```

**Prompt:**
```
You are an expert payment system developer. I need help with [specific task] 
in the payment system.

Files:
1. COMPLETE_PAYMENT_SYSTEM_SETUP.md - Complete system documentation
2. api/webhook.js - Stripe webhook handler
3. src/lib/services/couponService.js - Coupon redemption logic
4. FIX_COUPON_CODES_TABLE.sql - Database schema reference

Task: [Specific task]
```

---

### **Scenario 3: New Feature Development**

**Files:**
```
1. README.md
2. GET_THE_RECEIPTS_HANDOFF_SUMMARY.md (relevant sections)
3. src/App.jsx
4. [Similar feature files as reference]
```

**Prompt:**
```
I'm adding a new feature to Get The Receipts. Please help implement it.

CONTEXT:
- README.md - Product overview
- GET_THE_RECEIPTS_HANDOFF_SUMMARY.md - System architecture

REFERENCE:
- [Similar feature files] - Use as pattern reference

NEW FEATURE: [Describe feature]

Please implement following existing patterns and code style.
```

---

## 📊 **FILE PRIORITY GUIDE**

### **High Priority (Always Share)**
1. `README.md` - Essential overview
2. Task-specific main file (e.g., `LandingPage.jsx` for design work)

### **Medium Priority (Share for Context)**
1. `GET_THE_RECEIPTS_HANDOFF_SUMMARY.md` - Comprehensive overview
2. Domain-specific documentation
3. Related service/component files

### **Low Priority (Share Only if Relevant)**
1. Test files
2. Deprecated files
3. SQL migration files (unless working on DB)

---

## 💡 **BEST PRACTICES**

### **1. Start Small, Add as Needed**
- Begin with 3-5 essential files
- Add more if LLM needs additional context
- Don't overwhelm with too many files at once

### **2. Provide Clear File Purpose**
```
Files:
1. README.md - Product overview
2. LandingPage.jsx - Current landing page (needs improvement)
3. DESIGN_STRATEGY.md - Design philosophy
```

### **3. Use Documentation Files**
- Share `.md` documentation files first
- They provide structured context
- Code files for implementation details

### **4. Group Related Files**
```
PAYMENT SYSTEM FILES:
- COMPLETE_PAYMENT_SYSTEM_SETUP.md
- api/webhook.js
- src/lib/services/couponService.js
```

### **5. Reference, Don't Always Share**
- For large files, share specific sections
- Use line numbers: "See lines 50-100 in LandingPage.jsx"
- Share summaries for very large files

---

## 🚀 **QUICK REFERENCE: FILE GROUPS BY TASK**

| Task | Essential Files | Additional Context |
|------|----------------|-------------------|
| **Landing Page Design** | `LandingPage.jsx`, `DESIGN_STRATEGY.md` | `tailwind.config.js`, `UX_DESIGN_GUIDE.md` |
| **Payment System** | `COMPLETE_PAYMENT_SETUP.md`, `api/webhook.js` | `couponService.js`, `FIX_COUPON_CODES_TABLE.sql` |
| **Database Work** | `supabase_setup.sql`, relevant SQL files | `CREDITS_SYSTEM_DOC.md`, service files |
| **AI Features** | `advancedAnalysis.js`, prompt files | `CRISIS_DETECTION.md` |
| **Auth/Users** | `SupabaseAuthContext.jsx`, `DashboardPage.jsx` | `SUPABASE_SETUP.md` |
| **New Feature** | `README.md`, `App.jsx`, similar feature files | `HANDOFF_SUMMARY.md` |

---

## 📋 **EXAMPLE: COMPLETE CONTEXT SHARING**

### **For Landing Page Redesign:**

```
You are an award-winning UX/UI designer AND Gen Z marketing strategist.

PRODUCT CONTEXT:
I'm sharing Get The Receipts - an AI-powered relationship analysis app 
that decodes text messages. Target audience: Gen Z.

FILES FOR CONTEXT:
1. README.md - Product overview and features
2. DESIGN_STRATEGY_AND_OUTLINE.md - Current design philosophy
3. src/pages/LandingPage.jsx - Current landing page implementation
4. tailwind.config.js - Design system configuration
5. UX_DESIGN_AND_CONVERSION_GUIDE.md - Expert role guide

CURRENT STATE:
- Landing page grade: C-
- Issues: Too dense, too heavy, weak UX/Design
- Not converting well
- Target: Gen Z audience

TASK:
Please analyze the landing page and provide specific recommendations 
to elevate it to award-winning quality while improving conversion for Gen Z.

Please read the context files first, then provide comprehensive analysis 
and actionable recommendations.
```

---

## 🎯 **TIPS FOR EFFECTIVE CONTEXT SHARING**

1. **Always start with README.md** - Gives product overview
2. **Share documentation before code** - Provides structured context
3. **Group files by purpose** - Makes it easier for LLM to understand
4. **Explain file purpose** - Help LLM prioritize what to read
5. **Start minimal, add as needed** - Don't overwhelm initially
6. **Use expert role prompts** - From UX_DESIGN_AND_CONVERSION_GUIDE.md
7. **Reference specific sections** - For very large files

---

**Last Updated**: January 2025
**Purpose**: Guide for effectively sharing Get The Receipts context with LLMs

