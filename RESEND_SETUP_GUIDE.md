# Resend Email Setup Guide - Get The Receipts

## 🚀 Complete Resend Integration with Supabase

This guide will help you set up Resend for better email deliverability and control over your authentication emails.

---

## 📋 Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Domain Verification**: Verify your domain `getthereceipts.com` in Resend
3. **API Key**: Generate a Resend API key from your dashboard

---

## 🔧 Step 1: Environment Variables

Add these variables to your `.env.local` file and Vercel environment:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@getthereceipts.com
RESEND_FROM_NAME=Get The Receipts
```

**Important**: 
- Replace `re_your_resend_api_key_here` with your actual Resend API key
- The `RESEND_FROM_EMAIL` must be from your verified domain
- Add these to Vercel Dashboard > Settings > Environment Variables

---

## 📧 Step 2: Resend Email Service

The email service has been created at `/src/lib/services/emailService.js` with the following features:

### Features:
- ✅ **Authentication Emails**: Signup confirmation, password reset
- ✅ **Transactional Emails**: Receipt notifications, subscription updates
- ✅ **Marketing Emails**: Welcome series, referral notifications
- ✅ **Error Handling**: Retry logic and fallback to Supabase
- ✅ **Template System**: HTML and text versions
- ✅ **Rate Limiting**: Built-in protection against spam

### Email Types Supported:
1. **Signup Confirmation** - Welcome email with confirmation link
2. **Password Reset** - Secure password reset with expiration
3. **Welcome Series** - Onboarding emails for new users
4. **Receipt Notifications** - When analysis is complete
5. **Subscription Updates** - Payment confirmations, plan changes
6. **Referral Notifications** - When someone uses your referral code

---

## 🔗 Step 3: Supabase SMTP Configuration

### Option A: Custom SMTP (Recommended)
1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **SMTP Settings**
3. Configure with Resend SMTP:

```bash
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Pass: [Your Resend API Key]
SMTP Admin Email: support@getthereceipts.com
SMTP Sender Name: Get The Receipts
```

### Option B: Webhook Integration (Advanced)
Use the webhook system to send emails via Resend API instead of SMTP.

---

## 📝 Step 4: Email Templates

### Template Structure:
- **HTML Version**: Beautiful, branded emails with your styling
- **Text Version**: Fallback for email clients that don't support HTML
- **Variables**: Dynamic content like user names, confirmation links
- **Responsive**: Mobile-friendly design

### Template Variables Available:
- `{{userName}}` - User's display name
- `{{userEmail}}` - User's email address
- `{{confirmationUrl}}` - Email confirmation link
- `{{resetUrl}}` - Password reset link
- `{{appName}}` - "Get The Receipts"
- `{{appUrl}}` - https://www.getthereceipts.com
- `{{supportEmail}}` - support@getthereceipts.com

---

## 🧪 Step 5: Testing

### Test Email Functionality:
1. **Signup Flow**: Create a test account and verify confirmation email
2. **Password Reset**: Test password reset functionality
3. **Welcome Series**: Verify onboarding emails are sent
4. **Receipt Notifications**: Generate a receipt and check email

### Test Commands:
```bash
# Test email service directly
node test-email-service.js

# Test Supabase integration
node test-supabase-emails.js
```

---

## 📊 Step 6: Monitoring & Analytics

### Resend Dashboard:
- **Delivery Rates**: Monitor email deliverability
- **Open Rates**: Track email engagement
- **Bounce Rates**: Identify delivery issues
- **Spam Reports**: Monitor reputation

### Key Metrics to Track:
- Email delivery success rate (target: >95%)
- Confirmation email open rate (target: >30%)
- Password reset completion rate (target: >80%)
- Welcome series engagement (target: >25%)

---

## 🚨 Troubleshooting

### Common Issues:

#### 1. Emails Not Sending
**Check:**
- Resend API key is correct
- Domain is verified in Resend
- SMTP settings in Supabase are correct
- Environment variables are set

#### 2. Emails Going to Spam
**Solutions:**
- Set up SPF, DKIM, and DMARC records
- Use a dedicated IP (Resend Pro plan)
- Monitor sender reputation
- Avoid spam trigger words

#### 3. SMTP Connection Issues
**Check:**
- Port 587 is not blocked
- Firewall settings
- Resend API key permissions
- Supabase SMTP configuration

---

## 🔒 Security Best Practices

### API Key Security:
- Never commit API keys to git
- Use environment variables only
- Rotate keys regularly
- Monitor API usage

### Email Security:
- Use HTTPS for all email links
- Implement rate limiting
- Validate email addresses
- Use secure confirmation tokens

---

## 📈 Performance Optimization

### Email Queuing:
- Process emails in background
- Implement retry logic
- Batch similar emails
- Monitor queue performance

### Template Optimization:
- Minimize HTML size
- Optimize images
- Use web fonts efficiently
- Test across email clients

---

## 🎯 Next Steps

1. **Set up Resend account** and verify domain
2. **Add environment variables** to your project
3. **Configure Supabase SMTP** with Resend settings
4. **Test email functionality** with test accounts
5. **Monitor delivery rates** and optimize as needed

---

## 📞 Support

If you encounter issues:
1. Check Resend dashboard for delivery status
2. Review Supabase authentication logs
3. Test with the provided test scripts
4. Contact Resend support for deliverability issues

---

**Ready to get started?** Follow the steps above to integrate Resend with your Supabase authentication system!

