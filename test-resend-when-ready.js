#!/usr/bin/env node

/**
 * Test Resend When Domain is Ready
 * This will work once your domain is properly verified
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🧪 Resend Test - Ready When Domain is Verified\n');

async function testWhenReady() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME;
  
  console.log('🔍 Current Configuration:');
  console.log(`   - API Key: ${apiKey?.substring(0, 10)}...`);
  console.log(`   - From Email: ${fromEmail}`);
  console.log(`   - From Name: ${fromName}`);
  
  if (!apiKey || !fromEmail || !fromName) {
    console.log('❌ Configuration incomplete');
    return;
  }
  
  try {
    const resend = new Resend(apiKey);
    
    console.log('\n📧 Testing email send...');
    
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: ['test@example.com'],
      subject: '🎉 Get The Receipts - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00D4AA;">Get The Receipts</h1>
          <p>This is a test email to verify your Resend integration is working!</p>
          <p>If you're seeing this, your domain is properly verified and emails are working.</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Email Features:</h3>
            <ul>
              <li>✅ Beautiful HTML templates</li>
              <li>✅ Mobile responsive design</li>
              <li>✅ Professional branding</li>
              <li>✅ Reliable delivery</li>
            </ul>
          </div>
          <p>Ready to start sending real emails to your users!</p>
        </div>
      `,
      text: `
Get The Receipts - Test Email

This is a test email to verify your Resend integration is working!

If you're seeing this, your domain is properly verified and emails are working.

Email Features:
- Beautiful HTML templates
- Mobile responsive design  
- Professional branding
- Reliable delivery

Ready to start sending real emails to your users!
      `
    });
    
    if (error) {
      console.log('❌ Email failed:');
      console.log(`   ${error.message}`);
      
      if (error.message.includes('not verified')) {
        console.log('\n🔧 Domain Verification Issue:');
        console.log('1. Go to https://resend.com/domains');
        console.log('2. Check if your domain is fully verified');
        console.log('3. Look for any pending DNS records');
        console.log('4. Wait up to 24 hours for propagation');
        console.log('5. Contact Resend support if issues persist');
      }
    } else {
      console.log('✅ Email sent successfully!');
      console.log(`📨 Message ID: ${data?.id}`);
      console.log('\n🎉 Your Resend integration is working perfectly!');
      console.log('\n📋 Next Steps:');
      console.log('1. Configure Supabase SMTP settings');
      console.log('2. Set up database logging');
      console.log('3. Test user signup emails');
      console.log('4. Deploy to production');
    }
    
  } catch (error) {
    console.log('❌ Test failed:');
    console.log(`   ${error.message}`);
  }
}

testWhenReady().catch(console.error);

