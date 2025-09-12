# Supabase Email Templates - Get The Receipts

## Custom Email Templates

### 1. Email Confirmation Template

**Subject:** 🧾 Confirm your Get The Receipts account

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Account - Get The Receipts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; }
        .logo { font-size: 32px; font-weight: bold; color: #00D4AA; margin-bottom: 10px; }
        .tagline { color: #9CA3AF; font-size: 16px; }
        .content { background: #1F2937; border-radius: 12px; padding: 40px; margin: 20px 0; }
        .title { color: #F9FAFB; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .message { color: #D1D5DB; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; }
        .highlight { color: #00D4AA; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Get The Receipts</div>
            <div class="tagline">Stop second-guessing their texts</div>
        </div>
        
        <div class="content">
            <h1 class="title">Welcome to Get The Receipts! 🎉</h1>
            
            <p class="message">
                Hey there! 👋<br><br>
                
                You're just one click away from decoding any text message and getting the clarity you deserve.<br><br>
                
                <span class="highlight">Click the button below to confirm your account and get your first 3 free credits!</span>
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm My Account</a>
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #00D4AA;">{{ .ConfirmationURL }}</a>
            </p>
        </div>
        
        <div class="footer">
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
            <br>
            <p>© 2024 Get The Receipts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 2. Password Reset Template

**Subject:** 🔐 Reset your Get The Receipts password

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Get The Receipts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; }
        .logo { font-size: 32px; font-weight: bold; color: #00D4AA; margin-bottom: 10px; }
        .tagline { color: #9CA3AF; font-size: 16px; }
        .content { background: #1F2937; border-radius: 12px; padding: 40px; margin: 20px 0; }
        .title { color: #F9FAFB; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .message { color: #D1D5DB; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; }
        .highlight { color: #00D4AA; font-weight: bold; }
        .warning { background: #FEF3C7; color: #92400E; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Get The Receipts</div>
            <div class="tagline">Stop second-guessing their texts</div>
        </div>
        
        <div class="content">
            <h1 class="title">Reset Your Password 🔐</h1>
            
            <p class="message">
                Hey there! 👋<br><br>
                
                We received a request to reset your password for your Get The Receipts account.<br><br>
                
                <span class="highlight">Click the button below to create a new password:</span>
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is secure.
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #00D4AA;">{{ .ConfirmationURL }}</a>
            </p>
        </div>
        
        <div class="footer">
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this reset, you can safely ignore this email.</p>
            <br>
            <p>© 2024 Get The Receipts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## How to Apply These Templates

### Step 1: Go to Supabase Dashboard
1. Navigate to **Authentication → Email Templates**
2. Select **"Confirm signup"** template
3. Replace the default template with the custom HTML above

### Step 2: Configure Template Variables
Make sure these variables are available:
- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL

### Step 3: Test the Templates
1. Try signing up with a test email
2. Check the email formatting
3. Test the confirmation link

## Additional Improvements

### 1. Custom SMTP (Optional)
For better deliverability, consider using a custom SMTP provider:
- **SendGrid**
- **Mailgun** 
- **Amazon SES**

### 2. Email Verification Flow
- Add a "Resend confirmation" option
- Show better error messages
- Add a confirmation success page

### 3. Development vs Production
- Use different templates for dev/prod
- Add environment-specific branding
- Include debug information in dev emails
