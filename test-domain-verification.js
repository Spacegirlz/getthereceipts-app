#!/usr/bin/env node

/**
 * Test Domain Verification
 * Check what's happening with domain verification
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 Testing Domain Verification\n');

async function testDomainVerification() {
  const apiKey = process.env.RESEND_API_KEY;
  
  console.log(`🔑 Using API key: ${apiKey?.substring(0, 10)}...`);
  
  try {
    const resend = new Resend(apiKey);
    
    // Try to get domain information
    console.log('🔍 Attempting to retrieve domain information...');
    
    try {
      // This might not work in all API versions, but let's try
      const domains = await resend.domains.list();
      console.log('📋 Available domains:', domains);
    } catch (error) {
      console.log('ℹ️  Domain list not available via API:', error.message);
    }
    
    // Test different email formats
    const testFormats = [
      'support@www.getthereceipts.com',
      'noreply@www.getthereceipts.com',
      'hello@www.getthereceipts.com',
      'test@www.getthereceipts.com'
    ];
    
    console.log('\n📧 Testing different email formats...');
    
    for (const email of testFormats) {
      console.log(`\n🔍 Testing: ${email}`);
      
      try {
        const { data, error } = await resend.emails.send({
          from: `Get The Receipts <${email}>`,
          to: ['test@example.com'],
          subject: 'Domain Test',
          html: '<p>Testing domain verification</p>',
          text: 'Testing domain verification'
        });
        
        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
          
          // Check for specific error types
          if (error.message.includes('not verified')) {
            console.log(`   🔍 Domain verification issue detected`);
          } else if (error.message.includes('rate limit')) {
            console.log(`   ⏱️  Rate limit hit, waiting...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } else {
          console.log(`   ✅ SUCCESS! Message ID: ${data?.id}`);
          console.log(`   🎉 Working email format: ${email}`);
          return email;
        }
      } catch (err) {
        console.log(`   ❌ Exception: ${err.message}`);
      }
    }
    
    console.log('\n❌ No working email format found');
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check Resend dashboard for domain status');
    console.log('2. Verify DNS records are properly set');
    console.log('3. Wait for DNS propagation (up to 24 hours)');
    console.log('4. Contact Resend support if issue persists');
    console.log('5. Try creating a new domain verification');
    
  } catch (error) {
    console.log('❌ Failed to initialize Resend:', error.message);
  }
}

testDomainVerification().catch(console.error);

