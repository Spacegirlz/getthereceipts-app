#!/usr/bin/env node

/**
 * Test script for Resend email service
 * Run this to verify your Resend integration is working
 */

import { testEmailService } from './src/lib/services/emailService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🧪 Testing Resend Email Service\n');

// Check if API key is configured
if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
  console.log('❌ RESEND_API_KEY not configured');
  console.log('Please add your Resend API key to .env.local');
  console.log('Get your API key from: https://resend.com/api-keys');
  process.exit(1);
}

console.log('✅ Resend API key found');
console.log('📧 Testing email service...\n');

try {
  const result = await testEmailService();
  
  if (result.success) {
    console.log('✅ Email service test successful!');
    console.log(`📨 Message ID: ${result.messageId}`);
    console.log('\n🎉 Your Resend integration is working correctly!');
  } else {
    console.log('❌ Email service test failed:');
    console.log(result.error);
  }
} catch (error) {
  console.log('❌ Test failed with error:');
  console.log(error.message);
}

