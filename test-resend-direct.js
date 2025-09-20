#!/usr/bin/env node

/**
 * Direct Resend Test
 * Tests Resend API directly without module imports
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🧪 Direct Resend API Test for Get The Receipts\n');

async function testResendDirect() {
  // Check environment variables
  console.log('🔍 Checking environment variables...');
  
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME;
  
  if (!apiKey || apiKey.includes('your_')) {
    console.log('❌ RESEND_API_KEY not configured properly');
    console.log('Current value:', apiKey);
    return;
  }
  
  if (!fromEmail || fromEmail.includes('your_')) {
    console.log('❌ RESEND_FROM_EMAIL not configured properly');
    console.log('Current value:', fromEmail);
    return;
  }
  
  if (!fromName || fromName.includes('your_')) {
    console.log('❌ RESEND_FROM_NAME not configured properly');
    console.log('Current value:', fromName);
    return;
  }
  
  console.log('✅ All environment variables configured');
  console.log(`   - RESEND_API_KEY: ${apiKey.substring(0, 10)}...`);
  console.log(`   - RESEND_FROM_EMAIL: ${fromEmail}`);
  console.log(`   - RESEND_FROM_NAME: ${fromName}`);
  
  // Test Resend API
  console.log('\n🔍 Testing Resend API connection...');
  
  try {
    const resend = new Resend(apiKey);
    
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: ['test@example.com'],
      subject: 'Test Email from Get The Receipts',
      html: '<h1>Test Email</h1><p>This is a test email from Get The Receipts.</p>',
      text: 'Test Email\n\nThis is a test email from Get The Receipts.'
    });
    
    if (error) {
      console.log('❌ Resend API error:');
      console.log(`   ${error.message}`);
      console.log('\n🔧 Troubleshooting:');
      console.log('- Check that your Resend API key is correct');
      console.log('- Verify your domain is verified in Resend');
      console.log('- Make sure your API key has the right permissions');
      return;
    }
    
    console.log('✅ Resend API connection successful!');
    console.log(`📨 Test message ID: ${data?.id}`);
    console.log('\n🎉 Your Resend integration is working correctly!');
    console.log('\n📋 Next Steps:');
    console.log('1. Configure Supabase SMTP settings with your Resend credentials');
    console.log('2. Run the database setup script in Supabase SQL Editor');
    console.log('3. Test user signup and email confirmation');
    console.log('4. Deploy to production with environment variables');
    
  } catch (error) {
    console.log('❌ Test failed with error:');
    console.log(`   ${error.message}`);
    console.log('\n🔧 Common issues:');
    console.log('- Invalid API key format');
    console.log('- Network connectivity issues');
    console.log('- Resend service temporarily unavailable');
  }
}

testResendDirect().catch(console.error);

