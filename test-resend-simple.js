#!/usr/bin/env node

/**
 * Simple Resend Test
 * Tests just the Resend email service without Supabase dependencies
 */

import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env.local' });

// Import after environment variables are loaded
import { testEmailService } from './src/lib/services/emailService.js';

console.log('🧪 Simple Resend Test for Get The Receipts\n');

async function runTest() {
  // Check environment variables
  console.log('🔍 Checking environment variables...');
  
  const required = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'RESEND_FROM_NAME'];
  const missing = required.filter(key => !process.env[key] || process.env[key].includes('your_'));
  
  if (missing.length > 0) {
    console.log('❌ Missing or not configured environment variables:');
    missing.forEach(key => console.log(`   - ${key}`));
    console.log('\n📋 To fix this:');
    console.log('1. Open .env.local in your editor');
    console.log('2. Replace the placeholder values with your actual Resend API key');
    console.log('3. Get your API key from: https://resend.com/api-keys');
    return;
  }
  
  console.log('✅ All environment variables configured');
  console.log(`   - RESEND_API_KEY: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
  console.log(`   - RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL}`);
  console.log(`   - RESEND_FROM_NAME: ${process.env.RESEND_FROM_NAME}`);
  
  // Test Resend connection
  console.log('\n🔍 Testing Resend API connection...');
  
  try {
    const result = await testEmailService();
    
    if (result.success) {
      console.log('✅ Resend API connection successful!');
      console.log(`📨 Test message ID: ${result.messageId}`);
      console.log('\n🎉 Your Resend integration is working correctly!');
      console.log('\n📋 Next Steps:');
      console.log('1. Configure Supabase SMTP settings with your Resend credentials');
      console.log('2. Run the database setup script in Supabase SQL Editor');
      console.log('3. Test user signup and email confirmation');
      console.log('4. Deploy to production with environment variables');
    } else {
      console.log('❌ Resend API connection failed:');
      console.log(`   Error: ${result.error}`);
      console.log('\n🔧 Troubleshooting:');
      console.log('- Check that your Resend API key is correct');
      console.log('- Verify your domain is verified in Resend');
      console.log('- Make sure your API key has the right permissions');
    }
  } catch (error) {
    console.log('❌ Test failed with error:');
    console.log(`   ${error.message}`);
    console.log('\n🔧 Common issues:');
    console.log('- Invalid API key format');
    console.log('- Network connectivity issues');
    console.log('- Resend service temporarily unavailable');
  }
}

runTest().catch(console.error);
