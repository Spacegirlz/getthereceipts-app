#!/usr/bin/env node

/**
 * Test Password Recovery Email
 * Verify that password recovery emails work with correct domain
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔐 Testing Password Recovery Email\n');

async function testPasswordRecovery() {
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
    
    console.log('\n📧 Testing password recovery email...');
    
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: ['test@example.com'],
      subject: '🔐 Reset your Get The Receipts password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00D4AA;">Get The Receipts</h1>
          <h2>Reset Your Password 🔐</h2>
          <p>Hey there! 👋</p>
          <p>We received a request to reset your password for your Get The Receipts account.</p>
          <p><strong>Click the button below to create a new password:</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.getthereceipts.com/reset-password?token=test123" 
               style="background: linear-gradient(135deg, #EF4444 0%, #F97316 100%); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      font-size: 16px;">
              Reset My Password
            </a>
          </div>
          <div style="background: #FEF3C7; color: #92400E; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is secure.
          </div>
          <p style="font-size: 14px; color: #9CA3AF;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="https://www.getthereceipts.com/reset-password?token=test123" style="color: #00D4AA;">
              https://www.getthereceipts.com/reset-password?token=test123
            </a>
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #6B7280;">
            This link will expire in 1 hour for security reasons.<br>
            If you didn't request this reset, you can safely ignore this email.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="text-align: center; color: #6B7280; font-size: 14px;">
            © 2024 Get The Receipts. All rights reserved.
          </p>
        </div>
      `,
      text: `
Get The Receipts - Reset Your Password 🔐

Hey there! 👋

We received a request to reset your password for your Get The Receipts account.

Click the link below to create a new password:

https://www.getthereceipts.com/reset-password?token=test123

⚠️ Security Notice: If you didn't request this password reset, please ignore this email. Your account is secure.

This link will expire in 1 hour for security reasons.
If you didn't request this reset, you can safely ignore this email.

© 2024 Get The Receipts. All rights reserved.
      `
    });
    
    if (error) {
      console.log('❌ Password recovery email failed:');
      console.log(`   ${error.message}`);
      
      if (error.message.includes('not verified')) {
        console.log('\n🔧 Domain Issue:');
        console.log('Your Supabase Sender Email domain doesn\'t match your verified Resend domain');
        console.log('Fix: Change Supabase Sender Email to support@wwww.getthereceipts.com (4 w\'s)');
      }
    } else {
      console.log('✅ Password recovery email sent successfully!');
      console.log(`📨 Message ID: ${data?.id}`);
      console.log('\n🎉 Your password recovery emails are working!');
      console.log('\n📋 Next Steps:');
      console.log('1. Update Supabase Sender Email to support@wwww.getthereceipts.com');
      console.log('2. Test password recovery in Supabase dashboard');
      console.log('3. Verify emails arrive in your inbox');
    }
    
  } catch (error) {
    console.log('❌ Test failed:');
    console.log(`   ${error.message}`);
  }
}

testPasswordRecovery().catch(console.error);

