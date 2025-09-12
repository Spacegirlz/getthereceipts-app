# Refined Email Templates - Get The Receipts

## 1. 🔐 Sign Up Verification Email

**Subject:** Confirm your Get The Receipts account

**Plaintext Body (Supabase-compatible):**
```
Hey there,

You're just one step away from decoding the tea.

To finish setting up your Get The Receipts account, click the button below:

[ Confirm My Email ]  
{{ .ConfirmationURL }}

If you didn't request this, no worries — just ignore it. No receipts will be pulled.

Need help? Email us at support@getthereceipts.com

– The Get The Receipts Team  
www.getthereceipts.com
```

**HTML Version:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Account - Get The Receipts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .message { color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
        .highlight { color: #8B5CF6; font-weight: 600; }
        .link { color: #8B5CF6; text-decoration: none; }
        .link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Get The Receipts</div>
            <div class="tagline">Stop second-guessing their texts</div>
        </div>
        
        <div class="content">
            <h1 class="title">Hey there 👋</h1>
            
            <p class="message">
                You're just one step away from <span class="highlight">decoding the tea</span>.
            </p>
            
            <p class="message">
                To finish setting up your Get The Receipts account, click the button below:
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm My Email</a>
            </div>
            
            <p class="message" style="font-size: 14px; color: #6B7280;">
                If you didn't request this, no worries — just ignore it. No receipts will be pulled.
            </p>
            
            <p class="message" style="font-size: 14px; color: #6B7280;">
                Need help? Email us at <a href="mailto:support@getthereceipts.com" class="link">support@getthereceipts.com</a>
            </p>
        </div>
        
        <div class="footer">
            <p>– The Get The Receipts Team</p>
            <p><a href="https://www.getthereceipts.com" class="link">www.getthereceipts.com</a></p>
        </div>
    </div>
</body>
</html>
```

---

## 2. 🧠 Reset Password Email

**Subject:** Reset your password — we've got you

**Plaintext Body:**
```
Hey,

Forgot your password? It happens.

Click below to reset it and get back to decoding:

[ Reset My Password ]  
{{ .ConfirmationURL }}

This link will expire in 24 hours. If you didn't request this, no action needed.

– The Get The Receipts Team  
support@getthereceipts.com | www.getthereceipts.com
```

**HTML Version:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Get The Receipts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .message { color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
        .highlight { color: #EF4444; font-weight: 600; }
        .link { color: #8B5CF6; text-decoration: none; }
        .link:hover { text-decoration: underline; }
        .warning { background: #FEF3C7; color: #92400E; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Get The Receipts</div>
            <div class="tagline">Stop second-guessing their texts</div>
        </div>
        
        <div class="content">
            <h1 class="title">Hey 👋</h1>
            
            <p class="message">
                Forgot your password? <span class="highlight">It happens.</span>
            </p>
            
            <p class="message">
                Click below to reset it and get back to decoding:
            </p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⏰ This link will expire in 24 hours.</strong> If you didn't request this, no action needed.
            </div>
        </div>
        
        <div class="footer">
            <p>– The Get The Receipts Team</p>
            <p><a href="mailto:support@getthereceipts.com" class="link">support@getthereceipts.com</a> | <a href="https://www.getthereceipts.com" class="link">www.getthereceipts.com</a></p>
        </div>
    </div>
</body>
</html>
```

---

## 3. 🎉 Welcome Email

**Subject:** Welcome to Get The Receipts – let's decode that text

**Plaintext Body:**
```
Welcome aboard 👋

You're officially in. Get The Receipts is your new AI-powered sidekick for decoding texts that feel… confusing.

Whether it's a ghost emoji, a breadcrumb, or a message that just feels off — we'll help you read between the lines.

Start here:  
https://www.getthereceipts.com

3 things you can try right now:
• Paste a real convo and get your Receipt
• Use your free credits to go deeper
• Share your link to earn more (and unlock extra features)

Thanks for joining us. Let's make the hidden obvious.

– The Get The Receipts Team  
support@getthereceipts.com
```

**HTML Version:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Get The Receipts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .message { color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
        .highlight { color: #8B5CF6; font-weight: 600; }
        .link { color: #8B5CF6; text-decoration: none; }
        .link:hover { text-decoration: underline; }
        .features { background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { margin: 10px 0; color: #4B5563; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Get The Receipts</div>
            <div class="tagline">Stop second-guessing their texts</div>
        </div>
        
        <div class="content">
            <h1 class="title">Welcome aboard 👋</h1>
            
            <p class="message">
                You're officially in. Get The Receipts is your new <span class="highlight">AI-powered sidekick</span> for decoding texts that feel… confusing.
            </p>
            
            <p class="message">
                Whether it's a ghost emoji, a breadcrumb, or a message that just feels off — we'll help you read between the lines.
            </p>
            
            <div style="text-align: center;">
                <a href="https://www.getthereceipts.com" class="button">Start Decoding</a>
            </div>
            
            <div class="features">
                <h3 style="color: #1F2937; margin-bottom: 15px;">3 things you can try right now:</h3>
                <div class="feature-item">• Paste a real convo and get your Receipt</div>
                <div class="feature-item">• Use your free credits to go deeper</div>
                <div class="feature-item">• Share your link to earn more (and unlock extra features)</div>
            </div>
            
            <p class="message">
                Thanks for joining us. Let's make the hidden obvious.
            </p>
        </div>
        
        <div class="footer">
            <p>– The Get The Receipts Team</p>
            <p><a href="mailto:support@getthereceipts.com" class="link">support@getthereceipts.com</a></p>
        </div>
    </div>
</body>
</html>
```

---

## 4. 💌 Referral Reward Email

**Subject:** You just unlocked a reward 🎁

**Plaintext Body:**
```
Nice work — you've hit a referral milestone.

Your reward:
🏆 1 Free Premium Month  
(Automatically applied to your account)

Keep going and you'll unlock even more. Here's your referral link:
https://www.getthereceipts.com?ref={{ .user_referral_code }}

– The Get The Receipts Team  
support@getthereceipts.com
```

---

## Implementation Steps

### For Supabase (Plaintext):
1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Select the template (e.g., "Confirm signup")
3. Replace the default content with the plaintext version above
4. Save changes

### For HTML Versions (Optional):
1. Use the HTML versions for better branding
2. Can be hosted on your SMTP provider
3. Better deliverability and visual appeal
4. Can be integrated with Mailchimp for email journeys

### Email Configuration:
- **From:** support@getthereceipts.com
- **Reply-To:** support@getthereceipts.com
- **Domain:** getthereceipts.com
