#!/usr/bin/env node

/**
 * Debug Resend Domains
 * Check what domains are available and verified
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 Debugging Resend Domains\n');

async function debugDomains() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found');
    return;
  }
  
  console.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
  
  try {
    const resend = new Resend(apiKey);
    
    // Try to get domains (this might not be available in all API versions)
    console.log('🔍 Attempting to check domains...');
    
    // Test with different email formats
    const testEmails = [
      'noreply@getthereceipts.com',
      'noreply@www.getthereceipts.com',
      'noreply@getthereceipts.com',
      'test@getthereceipts.com',
      'test@www.getthereceipts.com'
    ];
    
    for (const email of testEmails) {
      console.log(`\n📧 Testing with: ${email}`);
      
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
        } else {
          console.log(`   ✅ Success! Message ID: ${data?.id}`);
          console.log(`   🎉 Working domain found: ${email}`);
          break;
        }
      } catch (err) {
        console.log(`   ❌ Exception: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Failed to initialize Resend:', error.message);
  }
}

debugDomains().catch(console.error);

