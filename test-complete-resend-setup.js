#!/usr/bin/env node

/**
 * Complete Resend Setup Test
 * This script tests all aspects of your Resend integration
 */

import { testEmailService } from './src/lib/services/emailService.js';
import { testEmailIntegration } from './src/lib/services/supabaseEmailIntegration.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🧪 Complete Resend Setup Test for Get The Receipts\n');

// Test configuration
const tests = [
  {
    name: 'Environment Variables',
    test: () => {
      const required = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'RESEND_FROM_NAME'];
      const missing = required.filter(key => !process.env[key] || process.env[key].includes('your_'));
      
      if (missing.length > 0) {
        return { success: false, error: `Missing or not configured: ${missing.join(', ')}` };
      }
      
      return { success: true, message: 'All environment variables configured' };
    }
  },
  {
    name: 'Resend API Connection',
    test: async () => {
      try {
        const result = await testEmailService();
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },
  {
    name: 'Supabase Integration',
    test: async () => {
      try {
        const result = await testEmailIntegration();
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }
];

// Run all tests
async function runTests() {
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`🔍 Testing: ${test.name}`);
    
    try {
      const result = await test.test();
      
      if (result.success) {
        console.log(`✅ ${test.name}: PASSED`);
        if (result.message) console.log(`   ${result.message}`);
        if (result.messageId) console.log(`   Message ID: ${result.messageId}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Error: ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   ${error.message}`);
      failed++;
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your Resend integration is ready to go!');
    console.log('\n📋 Next Steps:');
    console.log('1. Configure Supabase SMTP settings with your Resend credentials');
    console.log('2. Run the database setup script in Supabase SQL Editor');
    console.log('3. Test user signup and email confirmation');
    console.log('4. Deploy to production with environment variables');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above and fix them.');
    console.log('\n🔧 Common Issues:');
    console.log('- Make sure your Resend API key is correct');
    console.log('- Verify your domain is verified in Resend');
    console.log('- Check that all environment variables are set');
    console.log('- Ensure your .env.local file exists and is properly formatted');
  }
}

// Run the tests
runTests().catch(console.error);

