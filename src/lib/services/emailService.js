import { Resend } from 'resend';

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'noreply@getthereceipts.com',
  fromName: process.env.RESEND_FROM_NAME || 'Get The Receipts',
  appUrl: process.env.VITE_APP_URL || 'https://www.getthereceipts.com',
  supportEmail: 'support@getthereceipts.com'
};

/**
 * Send signup confirmation email
 */
export async function sendSignupConfirmation(email, confirmationUrl, userName = '') {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: [email],
      subject: '🧾 Confirm your Get The Receipts account',
      html: getSignupConfirmationHTML(confirmationUrl, userName),
      text: getSignupConfirmationText(confirmationUrl, userName)
    });

    if (error) {
      console.error('Resend signup confirmation error:', error);
      throw error;
    }

    console.log('Signup confirmation email sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send signup confirmation:', error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email, resetUrl, userName = '') {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: [email],
      subject: '🔐 Reset your Get The Receipts password',
      html: getPasswordResetHTML(resetUrl, userName),
      text: getPasswordResetText(resetUrl, userName)
    });

    if (error) {
      console.error('Resend password reset error:', error);
      throw error;
    }

    console.log('Password reset email sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send password reset:', error);
    throw error;
  }
}

/**
 * Send welcome email after successful signup
 */
export async function sendWelcomeEmail(email, userName = '') {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: [email],
      subject: '🎉 Welcome to Get The Receipts!',
      html: getWelcomeEmailHTML(userName),
      text: getWelcomeEmailText(userName)
    });

    if (error) {
      console.error('Resend welcome email error:', error);
      throw error;
    }

    console.log('Welcome email sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

/**
 * Send receipt notification email
 */
export async function sendReceiptNotification(email, receiptData, userName = '') {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: [email],
      subject: '📄 Your truth receipt is ready!',
      html: getReceiptNotificationHTML(receiptData, userName),
      text: getReceiptNotificationText(receiptData, userName)
    });

    if (error) {
      console.error('Resend receipt notification error:', error);
      throw error;
    }

    console.log('Receipt notification email sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send receipt notification:', error);
    throw error;
  }
}

/**
 * Send referral notification email
 */
export async function sendReferralNotification(email, referrerName, userName = '') {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }
    
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: [email],
      subject: '🎁 You got a referral bonus!',
      html: getReferralNotificationHTML(referrerName, userName),
      text: getReferralNotificationText(referrerName, userName)
    });

    if (error) {
      console.error('Resend referral notification error:', error);
      throw error;
    }

    console.log('Referral notification email sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send referral notification:', error);
    throw error;
  }
}

// HTML Email Templates

function getSignupConfirmationHTML(confirmationUrl, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
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
                ${greeting} 👋<br><br>
                
                You're just one click away from decoding any text message and getting the clarity you deserve.<br><br>
                
                <span class="highlight">Click the button below to confirm your account and get your first 3 free credits!</span>
            </p>
            
            <div style="text-align: center;">
                <a href="${confirmationUrl}" class="button">Confirm My Account</a>
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmationUrl}" style="color: #00D4AA;">${confirmationUrl}</a>
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
</html>`;
}

function getPasswordResetHTML(resetUrl, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
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
                ${greeting} 👋<br><br>
                
                We received a request to reset your password for your Get The Receipts account.<br><br>
                
                <span class="highlight">Click the button below to create a new password:</span>
            </p>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is secure.
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #00D4AA;">${resetUrl}</a>
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
</html>`;
}

function getWelcomeEmailHTML(userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Get The Receipts</title>
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
        .feature { background: #374151; padding: 20px; border-radius: 8px; margin: 15px 0; }
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
                ${greeting} 👋<br><br>
                
                Your account is now confirmed and you're ready to start getting the clarity you deserve!<br><br>
                
                <span class="highlight">You have 3 free credits to get started.</span>
            </p>
            
            <div class="feature">
                <h3 style="color: #00D4AA; margin-top: 0;">🚀 What you can do now:</h3>
                <ul style="color: #D1D5DB;">
                    <li>Paste any text message for instant analysis</li>
                    <li>Get truth receipts that reveal hidden meanings</li>
                    <li>Access deep dive insights and red flags</li>
                    <li>Build immunity to manipulation tactics</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="${EMAIL_CONFIG.appUrl}" class="button">Start Analyzing Messages</a>
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                Questions? Just reply to this email or contact us at ${EMAIL_CONFIG.supportEmail}
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Get The Receipts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

function getReceiptNotificationHTML(receiptData, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Receipt is Ready - Get The Receipts</title>
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
            <h1 class="title">Your Receipt is Ready! 📄</h1>
            
            <p class="message">
                ${greeting} 👋<br><br>
                
                Your truth receipt analysis is complete and ready to view!<br><br>
                
                <span class="highlight">Click below to see your detailed analysis:</span>
            </p>
            
            <div style="text-align: center;">
                <a href="${EMAIL_CONFIG.appUrl}/dashboard" class="button">View My Receipt</a>
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                Need help understanding your results? Reply to this email and we'll help you out!
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Get The Receipts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

function getReferralNotificationHTML(referrerName, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Referral Bonus - Get The Receipts</title>
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
            <h1 class="title">You Got a Referral Bonus! 🎁</h1>
            
            <p class="message">
                ${greeting} 👋<br><br>
                
                Great news! ${referrerName} just signed up using your referral link!<br><br>
                
                <span class="highlight">You've earned 2 bonus credits for the referral!</span>
            </p>
            
            <div style="text-align: center;">
                <a href="${EMAIL_CONFIG.appUrl}/dashboard" class="button">Check My Credits</a>
            </div>
            
            <p class="message" style="margin-top: 30px; font-size: 14px; color: #9CA3AF;">
                Keep sharing your referral link to earn more credits!
            </p>
        </div>
        
        <div class="footer">
            <p>© 2024 Get The Receipts. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

// Text Email Templates (fallbacks)

function getSignupConfirmationText(confirmationUrl, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
${greeting} 👋

Welcome to Get The Receipts!

You're just one click away from decoding any text message and getting the clarity you deserve.

Click the link below to confirm your account and get your first 3 free credits:

${confirmationUrl}

This link will expire in 24 hours for security reasons.

If you didn't create this account, you can safely ignore this email.

© 2024 Get The Receipts. All rights reserved.
`;
}

function getPasswordResetText(resetUrl, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
${greeting} 👋

Reset Your Password

We received a request to reset your password for your Get The Receipts account.

Click the link below to create a new password:

${resetUrl}

⚠️ Security Notice: If you didn't request this password reset, please ignore this email. Your account is secure.

This link will expire in 1 hour for security reasons.

© 2024 Get The Receipts. All rights reserved.
`;
}

function getWelcomeEmailText(userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
${greeting} 👋

Welcome to Get The Receipts! 🎉

Your account is now confirmed and you're ready to start getting the clarity you deserve!

You have 3 free credits to get started.

🚀 What you can do now:
- Paste any text message for instant analysis
- Get truth receipts that reveal hidden meanings
- Access deep dive insights and red flags
- Build immunity to manipulation tactics

Start analyzing messages: ${EMAIL_CONFIG.appUrl}

Questions? Just reply to this email or contact us at ${EMAIL_CONFIG.supportEmail}

© 2024 Get The Receipts. All rights reserved.
`;
}

function getReceiptNotificationText(receiptData, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
${greeting} 👋

Your Receipt is Ready! 📄

Your truth receipt analysis is complete and ready to view!

View your receipt: ${EMAIL_CONFIG.appUrl}/dashboard

Need help understanding your results? Reply to this email and we'll help you out!

© 2024 Get The Receipts. All rights reserved.
`;
}

function getReferralNotificationText(referrerName, userName) {
  const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
  
  return `
${greeting} 👋

You Got a Referral Bonus! 🎁

Great news! ${referrerName} just signed up using your referral link!

You've earned 2 bonus credits for the referral!

Check your credits: ${EMAIL_CONFIG.appUrl}/dashboard

Keep sharing your referral link to earn more credits!

© 2024 Get The Receipts. All rights reserved.
`;
}

// Utility function to test email service
export async function testEmailService() {
  try {
    console.log('Testing Resend email service...');
    
    if (!resend) {
      throw new Error('Resend API key not configured');
    }
    
    // Test with a simple email
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: ['test@example.com'],
      subject: 'Test Email from Get The Receipts',
      html: '<h1>Test Email</h1><p>This is a test email from Get The Receipts.</p>',
      text: 'Test Email\n\nThis is a test email from Get The Receipts.'
    });

    if (error) {
      console.error('Test email failed:', error);
      return { success: false, error };
    }

    console.log('Test email sent successfully:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Test email error:', error);
    return { success: false, error };
  }
}
