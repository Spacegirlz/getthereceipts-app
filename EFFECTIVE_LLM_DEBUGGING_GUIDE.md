# 🎯 Effective LLM Debugging Guide
## How to Get Deep, Systematic Problem-Solving Results

---

## 🔑 **CORE PRINCIPLES**

### 1. **First Principles Thinking**
Always ask the LLM to think from first principles, not assumptions.

**Bad**: "Fix the coupon code"
**Good**: "Take the role of a senior web app developer with a first principles thinking mindset. Investigate the root cause before proposing solutions."

### 2. **Context Setting**
Give the LLM a clear role and context.

**Template**:
```
You are an expert [ROLE] with [SPECIFIC EXPERTISE]. 
You use a first principles approach to problem-solving.
[SPECIFIC CONTEXT ABOUT THE SYSTEM]
```

**Example**:
```
You are an expert Supabase/Vite/React troubleshooter. 
You use a first principles approach. 
The app uses Supabase for database, Vite for build, React for frontend.
```

### 3. **Systematic Investigation**
Ask for investigation before fixes.

**Template**:
```
Before fixing, please:
1. Investigate the actual state (read files, check schemas)
2. Identify the root cause
3. Explain why the issue exists
4. Propose a fix with reasoning
```

---

## 📋 **IDEAL PROMPT STRUCTURE**

### **For Complex Bugs**

```
You are a [ROLE] with expertise in [TECHNOLOGIES].
You use first principles thinking and systematic investigation.

CONTEXT:
- System: [Brief description]
- Tech stack: [List technologies]
- Issue: [What's broken]

TASK:
1. INVESTIGATE: Read relevant files, check database schemas, verify configurations
2. IDENTIFY ROOT CAUSE: Explain why this is happening, not just what's wrong
3. PROPOSE FIX: Provide solution with reasoning
4. VERIFY: Create verification steps/queries

CONSTRAINTS:
- Don't assume - check actual code/schema
- Fix root causes, not symptoms
- Maintain existing patterns
- Test before moving on

Please start by investigating the actual state of the system.
```

---

## 🎯 **SPECIFIC PROMPT TEMPLATES**

### **Template 1: Database/Backend Issues**

```
You are an expert [DATABASE/API] troubleshooter with a first principles approach.

ISSUE: [Specific error or behavior]

INVESTIGATION REQUIRED:
1. Check actual database schema (don't assume column names)
2. Verify function signatures and permissions
3. Check existing code patterns for similar functionality
4. Identify what's different/broken

FIX APPROACH:
- Use existing patterns from working code
- Verify schema before writing SQL
- Test with verification queries
- Document what was fixed and why

Please investigate the actual database schema first.
```

### **Template 2: Frontend/Integration Issues**

```
You are a senior [FRAMEWORK] developer with expertise in [INTEGRATIONS].

ISSUE: [What's not working]

INVESTIGATION:
1. Read the actual component/service files
2. Check how similar features are implemented
3. Verify API contracts and data flow
4. Check for missing dependencies or config

FIX APPROACH:
- Follow existing code patterns
- Maintain consistency with codebase
- Add proper error handling
- Test integration points

Start by reading the relevant files to understand current implementation.
```

### **Template 3: Payment/Webhook Issues**

```
You are an expert payment system troubleshooter specializing in [STRIPE/PAYPAL/etc] and webhooks.

ISSUE: [Payment/webhook problem]

INVESTIGATION CHECKLIST:
1. Verify webhook endpoint configuration
2. Check event handling logic
3. Verify database schema matches code expectations
4. Check environment variables
5. Review webhook logs/errors

FIX APPROACH:
- Ensure webhook handles all required events
- Use actual Stripe subscription data (not calculated dates)
- Add proper error handling and logging
- Test with verification queries

Please investigate the webhook implementation and database schema first.
```

---

## ✅ **WHAT MADE THIS SESSION EFFECTIVE**

### **1. Role Definition**
```
"Please take the role of an expert Troubleshooter Web App Developer 
for supabase setups with Vite/React. You use a first principles approach."
```
- Clear expertise area
- Specific technology stack
- First principles mindset

### **2. Systematic Investigation**
- Asked to check actual database schema
- Read existing working code patterns
- Verified before assuming

### **3. Incremental Fixes**
- Fixed one issue at a time
- Verified each fix before moving on
- Didn't change working code unnecessarily

### **4. Verification Steps**
- Created SQL queries to verify fixes
- Asked for confirmation before proceeding
- Documented what was fixed

---

## 🚫 **COMMON MISTAKES TO AVOID**

### **1. Vague Requests**
❌ "Fix the coupons"
✅ "Investigate why coupon redemption fails. Check database schema, verify function exists, test redemption flow."

### **2. Assuming Schema**
❌ "Add a column called credits_to_add"
✅ "Check the actual coupon_codes table schema first, then use the correct column names."

### **3. Fixing Without Understanding**
❌ "Change this code"
✅ "Read the existing code to understand the pattern, identify why it's broken, then fix following the same pattern."

### **4. No Verification**
❌ "I fixed it"
✅ "I fixed it. Here's a verification query to confirm it works."

---

## 📝 **EFFECTIVE PROMPT EXAMPLES FROM THIS SESSION**

### **Example 1: Emergency Pack Investigation**
```
"Please take the role of an expert Troubleshooter Web App Developer 
for supabase setups with Vite/React. 

I am concerned about Emergency Pack 5 and 10 - will these work?

Please investigate:
1. How Emergency Pack purchases are handled
2. Check webhook implementation
3. Verify database columns exist
4. Identify any potential issues

Use first principles thinking."
```

**Why it worked**:
- Clear role and expertise
- Specific concern
- Investigation checklist
- First principles approach

### **Example 2: Coupon Creation**
```
"Based on this. Can we create another 2 packs.

SageSanta05 - 5 credits
GTRChristmas10 - 10 credits"
```

**Why it worked**:
- Clear request
- Specific values
- Following existing pattern
- I checked existing coupon structure first

---

## 🎯 **QUICK REFERENCE: DEBUGGING PROMPT**

Copy this template for complex issues:

```
You are an expert [SPECIFIC ROLE] with expertise in [TECHNOLOGIES].
You use first principles thinking and systematic investigation.

ISSUE: [Clear description of what's broken]

INVESTIGATION REQUIRED:
1. Read actual code/files (don't assume)
2. Check database schemas/tables
3. Verify configurations
4. Check existing patterns for similar features
5. Identify root cause (not just symptoms)

FIX APPROACH:
- Follow existing code patterns
- Fix root causes, not symptoms
- Verify with test queries/scripts
- Document what was fixed

Please start by investigating the actual state of the system.
```

---

## 💡 **KEY INSIGHTS**

### **What Made This Session Successful:**

1. **Role Clarity**: "Expert troubleshooter" set the right mindset
2. **First Principles**: Asked to investigate, not assume
3. **Systematic**: Check schema → Read code → Identify issue → Fix → Verify
4. **Pattern Matching**: Used existing working code as reference
5. **Verification**: Created test queries to confirm fixes
6. **Incremental**: Fixed one thing at a time, verified, then moved on

### **Critical Success Factors:**

✅ **Investigation before action**
✅ **Verification after fixes**
✅ **Following existing patterns**
✅ **Clear communication of findings**
✅ **Documentation of changes**

---

## 🔄 **ITERATIVE DEBUGGING APPROACH**

When an issue persists:

```
The fix didn't work. Error: [NEW ERROR]

Please:
1. Re-read the relevant files (they may have changed)
2. Check if the error reveals new information
3. Verify the fix was applied correctly
4. Investigate if there's a deeper issue

Use first principles - what does the error actually tell us?
```

---

## 📚 **ADVANCED: MULTI-STEP DEBUGGING**

For complex systems:

```
You are a senior [ROLE] with expertise in [TECHNOLOGIES].

SYSTEM: [Brief description]
ISSUE: [What's broken]

INVESTIGATION PLAN:
1. Map the data flow (user action → frontend → API → database)
2. Check each layer for issues
3. Verify configurations
4. Test each component independently

FIX STRATEGY:
- Fix issues in order (upstream first)
- Verify each fix before moving on
- Document all changes
- Create verification steps

Please start by mapping the complete data flow.
```

---

## 🎓 **LEARNING FROM THIS SESSION**

### **What Worked Well:**

1. **Schema Verification**: Always checked actual database schema
2. **Code Reading**: Read existing working code before writing new code
3. **Pattern Matching**: Used BF5/PMFRIENDS50 as templates
4. **Error Analysis**: Used error messages to identify missing columns
5. **Systematic Fixes**: Fixed webhook bug, then verified, then moved to next issue

### **Key Patterns:**

- **Investigate → Identify → Fix → Verify**
- **Read before writing**
- **Check actual state, don't assume**
- **Follow existing patterns**
- **Document changes**

---

## 🚀 **QUICK START: COPY-PASTE PROMPT**

For your next debugging session:

```
You are an expert [ROLE] with expertise in [TECHNOLOGIES].
You use first principles thinking and systematic investigation.

ISSUE: [Describe the problem]

Before proposing fixes:
1. Investigate the actual state (read files, check schemas)
2. Identify the root cause
3. Explain why the issue exists
4. Propose a fix following existing patterns
5. Create verification steps

Please start by investigating the actual state of the system.
```

---

**Last Updated**: January 2025
**Based on**: Successful debugging session for payment system issues

