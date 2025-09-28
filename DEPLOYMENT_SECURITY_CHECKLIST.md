# 🚀 Deployment Security Checklist

## Pre-Deployment Security Verification

### 🔒 Anonymous User System
- [ ] **Credit Limit Enforcement**: Anonymous users limited to 1 free analysis
- [ ] **Race Condition Protection**: Atomic operations prevent multiple submissions
- [ ] **localStorage Reliability**: Fallback system works in iOS private browsing
- [ ] **Sign-up Prompts**: Users prompted to sign up after limit reached

### 🔑 API Key Configuration
- [ ] **Primary Key**: `VITE_OPENAI_API_KEY` set and working
- [ ] **Backup Key 1**: `VITE_OPENAI_API_KEY_BACKUP1` set and working
- [ ] **Backup Key 2**: `VITE_GOOGLE_API_KEY_BACKUP2` set and working
- [ ] **Key Names Match**: Code expects exact variable names from Vercel

### 🛡️ Route Security
- [ ] **Production Routes**: All analysis routes have credit checking
- [ ] **Test Routes**: Restricted to DEV-only access
- [ ] **No Bypasses**: No routes allow unlimited free access

### 🔧 API Backup System
- [ ] **Backup Chain**: OpenAI → OpenAI → Gemini → Fallback
- [ ] **All Functions**: Main Analysis, Deep Dive, Immunity Training use backup
- [ ] **Provider Detection**: Automatic detection based on key prefix
- [ ] **Error Handling**: Graceful fallback when all keys fail

## Post-Deployment Testing

### Anonymous User Testing
1. **First Analysis**: Should work without login
2. **Second Analysis**: Should be blocked with sign-up prompt
3. **Rapid Clicking**: Should not allow multiple analyses
4. **Private Browsing**: Should work with fallback storage

### Logged-in User Testing
1. **Free Users**: Should respect credit limits
2. **Premium Users**: Should have unlimited access
3. **Credit Deduction**: Should deduct credits after analysis
4. **Daily Reset**: Should reset credits at midnight

### API Backup Testing
1. **Primary Key**: Test with main OpenAI key
2. **Backup Keys**: Test with backup OpenAI key
3. **Gemini Backup**: Test with Google API key
4. **All Fail**: Test fallback when all keys fail

## Environment Variables Required

### Vercel Environment Variables
```bash
# OpenAI API Keys
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_API_KEY_BACKUP1=sk-...

# Google API Key (Gemini)
VITE_GOOGLE_API_KEY_BACKUP2=AIza...

# Optional Model Configuration
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_GOOGLE_GEMINI_MODEL=gemini-2.5-lite
```

### Supabase Configuration
- [ ] Database connection working
- [ ] User authentication working
- [ ] Credit system database functions working
- [ ] RLS policies properly configured

## Monitoring & Alerts

### Key Metrics to Monitor
- [ ] **API Key Usage**: Monitor usage across all keys
- [ ] **Credit Deductions**: Track credit consumption
- [ ] **Anonymous Users**: Monitor anonymous analysis count
- [ ] **Error Rates**: Track API failures and fallbacks

### Alert Thresholds
- [ ] **API Key Exhaustion**: Alert when keys near limit
- [ ] **High Error Rates**: Alert on API failure spikes
- [ ] **Unusual Usage**: Alert on suspicious patterns
- [ ] **Credit System Issues**: Alert on credit deduction failures

## Rollback Plan

### If Security Issues Found
1. **Immediate**: Disable anonymous access
2. **Short-term**: Require login for all analysis
3. **Long-term**: Fix issues and re-enable features

### If API Issues Found
1. **Immediate**: Switch to backup keys
2. **Short-term**: Implement rate limiting
3. **Long-term**: Add more backup providers

## Documentation Updates

### After Deployment
- [ ] Update security documentation
- [ ] Document any new vulnerabilities found
- [ ] Update monitoring procedures
- [ ] Review and update this checklist

## Contact Information

### Security Issues
- **Critical**: Contact immediately
- **High**: Contact within 24 hours
- **Medium**: Contact within 1 week

### Technical Issues
- **API Problems**: Check Vercel logs and Supabase
- **Credit System**: Check database functions
- **User Issues**: Check authentication flow

---
*Last Updated: December 2024*
*Next Review: Quarterly*
