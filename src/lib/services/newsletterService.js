/**
 * Newsletter Service for Get The Receipts
 * Handles marketing emails, newsletters, and user engagement campaigns
 */

import { Resend } from 'resend';

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'support@wwww.getthereceipts.com',
  fromName: process.env.RESEND_FROM_NAME || 'Get The Receipts',
  appUrl: process.env.VITE_APP_URL || 'https://www.getthereceipts.com',
  supportEmail: 'support@wwww.getthereceipts.com'
};

/**
 * Send weekly newsletter
 */
export async function sendWeeklyNewsletter(recipients, newsletterData) {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: recipients,
      subject: `📧 ${newsletterData.title} - Get The Receipts Weekly`,
      html: getNewsletterHTML(newsletterData),
      text: getNewsletterText(newsletterData)
    });

    if (error) {
      console.error('Newsletter send error:', error);
      throw error;
    }

    console.log('Newsletter sent successfully:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    throw error;
  }
}

/**
 * Send feature announcement
 */
export async function sendFeatureAnnouncement(recipients, featureData) {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: recipients,
      subject: `🚀 New Feature: ${featureData.title}`,
      html: getFeatureAnnouncementHTML(featureData),
      text: getFeatureAnnouncementText(featureData)
    });

    if (error) {
      console.error('Feature announcement error:', error);
      throw error;
    }

    console.log('Feature announcement sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send feature announcement:', error);
    throw error;
  }
}

/**
 * Send user engagement campaign
 */
export async function sendEngagementCampaign(recipients, campaignData) {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: recipients,
      subject: `💡 ${campaignData.title}`,
      html: getEngagementCampaignHTML(campaignData),
      text: getEngagementCampaignText(campaignData)
    });

    if (error) {
      console.error('Engagement campaign error:', error);
      throw error;
    }

    console.log('Engagement campaign sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send engagement campaign:', error);
    throw error;
  }
}

/**
 * Send promotional email
 */
export async function sendPromotionalEmail(recipients, promoData) {
  try {
    if (!resend) {
      throw new Error('Resend API key not configured');
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: recipients,
      subject: `🎁 ${promoData.title}`,
      html: getPromotionalEmailHTML(promoData),
      text: getPromotionalEmailText(promoData)
    });

    if (error) {
      console.error('Promotional email error:', error);
      throw error;
    }

    console.log('Promotional email sent:', data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send promotional email:', error);
    throw error;
  }
}

// HTML Templates

function getNewsletterHTML(newsletterData) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsletterData.title} - Get The Receipts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .section { margin: 30px 0; }
        .section-title { color: #8B5CF6; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .section-content { color: #4B5563; font-size: 16px; line-height: 1.6; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
        .highlight { color: #8B5CF6; font-weight: 600; }
        .link { color: #8B5CF6; text-decoration: none; }
        .link:hover { text-decoration: underline; }
        .unsubscribe { font-size: 12px; color: #9CA3AF; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Get The Receipts</div>
            <div class="tagline">Stop second-guessing their texts</div>
        </div>
        
        <div class="content">
            <h1 class="title">${newsletterData.title}</h1>
            
            <div class="section">
                <div class="section-title">📊 This Week's Insights</div>
                <div class="section-content">${newsletterData.insights}</div>
            </div>
            
            <div class="section">
                <div class="section-title">🚨 Red Flags to Watch For</div>
                <div class="section-content">${newsletterData.redFlags}</div>
            </div>
            
            <div class="section">
                <div class="section-title">💡 Pro Tips</div>
                <div class="section-content">${newsletterData.proTips}</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${EMAIL_CONFIG.appUrl}" class="button">Analyze Your Messages</a>
            </div>
            
            <div class="section">
                <div class="section-title">📈 User Success Story</div>
                <div class="section-content">${newsletterData.successStory}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Thanks for being part of the Get The Receipts community!</p>
            <p><a href="${EMAIL_CONFIG.appUrl}" class="link">www.getthereceipts.com</a></p>
            <div class="unsubscribe">
                <a href="${EMAIL_CONFIG.appUrl}/unsubscribe" class="link">Unsubscribe</a> | 
                <a href="${EMAIL_CONFIG.appUrl}/preferences" class="link">Email Preferences</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function getFeatureAnnouncementHTML(featureData) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Feature: ${featureData.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .feature-box { background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5CF6; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
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
            <h1 class="title">🚀 New Feature: ${featureData.title}</h1>
            
            <div class="feature-box">
                <h3 style="color: #8B5CF6; margin-top: 0;">What's New:</h3>
                <p style="color: #4B5563; margin-bottom: 0;">${featureData.description}</p>
            </div>
            
            <div style="color: #4B5563; font-size: 16px; line-height: 1.6;">
                ${featureData.details}
            </div>
            
            <div style="text-align: center;">
                <a href="${featureData.ctaUrl || EMAIL_CONFIG.appUrl}" class="button">Try It Now</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Thanks for using Get The Receipts!</p>
            <p><a href="${EMAIL_CONFIG.appUrl}" class="link">www.getthereceipts.com</a></p>
        </div>
    </div>
</body>
</html>`;
}

function getEngagementCampaignHTML(campaignData) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${campaignData.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
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
            <h1 class="title">${campaignData.title}</h1>
            
            <div style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                ${campaignData.message}
            </div>
            
            <div style="text-align: center;">
                <a href="${campaignData.ctaUrl || EMAIL_CONFIG.appUrl}" class="button">${campaignData.ctaText || 'Get Started'}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Thanks for being part of our community!</p>
            <p><a href="${EMAIL_CONFIG.appUrl}" class="link">www.getthereceipts.com</a></p>
        </div>
    </div>
</body>
</html>`;
}

function getPromotionalEmailHTML(promoData) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${promoData.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #1a1a3e 0%, #14142e 100%); border-radius: 12px 12px 0 0; }
        .logo { font-size: 28px; font-weight: bold; color: #00D4AA; margin-bottom: 8px; }
        .tagline { color: #9CA3AF; font-size: 14px; }
        .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .title { color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .promo-box { background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #F59E0B; }
        .promo-code { font-size: 24px; font-weight: bold; color: #92400E; margin: 10px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; margin: 20px 0; }
        .button:hover { opacity: 0.9; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
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
            <h1 class="title">${promoData.title}</h1>
            
            <div style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                ${promoData.message}
            </div>
            
            <div class="promo-box">
                <h3 style="color: #92400E; margin-top: 0;">Special Offer</h3>
                <div class="promo-code">${promoData.promoCode}</div>
                <p style="color: #92400E; margin-bottom: 0;">${promoData.offer}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${promoData.ctaUrl || EMAIL_CONFIG.appUrl}" class="button">Claim Your Offer</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Limited time offer - don't miss out!</p>
            <p><a href="${EMAIL_CONFIG.appUrl}" class="link">www.getthereceipts.com</a></p>
        </div>
    </div>
</body>
</html>`;
}

// Text fallbacks
function getNewsletterText(newsletterData) {
  return `
${newsletterData.title} - Get The Receipts Weekly

📊 This Week's Insights
${newsletterData.insights}

🚨 Red Flags to Watch For
${newsletterData.redFlags}

💡 Pro Tips
${newsletterData.proTips}

📈 User Success Story
${newsletterData.successStory}

Analyze Your Messages: ${EMAIL_CONFIG.appUrl}

Thanks for being part of the Get The Receipts community!

Unsubscribe: ${EMAIL_CONFIG.appUrl}/unsubscribe
Email Preferences: ${EMAIL_CONFIG.appUrl}/preferences
`;
}

function getFeatureAnnouncementText(featureData) {
  return `
New Feature: ${featureData.title}

What's New:
${featureData.description}

${featureData.details}

Try It Now: ${featureData.ctaUrl || EMAIL_CONFIG.appUrl}

Thanks for using Get The Receipts!
`;
}

function getEngagementCampaignText(campaignData) {
  return `
${campaignData.title}

${campaignData.message}

${campaignData.ctaText || 'Get Started'}: ${campaignData.ctaUrl || EMAIL_CONFIG.appUrl}

Thanks for being part of our community!
`;
}

function getPromotionalEmailText(promoData) {
  return `
${promoData.title}

${promoData.message}

Special Offer: ${promoData.promoCode}
${promoData.offer}

Claim Your Offer: ${promoData.ctaUrl || EMAIL_CONFIG.appUrl}

Limited time offer - don't miss out!
`;
}
