#!/usr/bin/env node

/**
 * Check Available Domains
 * See what domains are actually available in your Resend account
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🔍 Checking Available Domains\n');

async function checkDomains() {
  const apiKey = process.env.RESEND_API_KEY;
  
  console.log(`🔑 Using API key: ${apiKey?.substring(0, 10)}...`);
  
  try {
    const resend = new Resend(apiKey);
    
    console.log('📋 Fetching domain list...');
    const domains = await resend.domains.list();
    
    console.log('📊 Domain Information:');
    console.log(JSON.stringify(domains, null, 2));
    
    if (domains.data && domains.data.data && domains.data.data.length > 0) {
      console.log('\n📋 Available Domains:');
      domains.data.data.forEach((domain, index) => {
        console.log(`\n${index + 1}. Domain: ${domain.name}`);
        console.log(`   Status: ${domain.status}`);
        console.log(`   Region: ${domain.region}`);
        console.log(`   Created: ${domain.created_at}`);
        console.log(`   ID: ${domain.id}`);
        
        if (domain.status === 'verified') {
          console.log('   ✅ This domain is verified and ready to use!');
        } else {
          console.log('   ⚠️  This domain is not verified');
        }
      });
      
      // Find verified domains
      const verifiedDomains = domains.data.data.filter(d => d.status === 'verified');
      
      if (verifiedDomains.length > 0) {
        console.log('\n🎉 Verified domains found:');
        verifiedDomains.forEach(domain => {
          console.log(`   ✅ ${domain.name} (${domain.region})`);
        });
        
        // Test with the first verified domain
        const testDomain = verifiedDomains[0];
        console.log(`\n📧 Testing email with verified domain: ${testDomain.name}`);
        
        const testEmail = `test@${testDomain.name}`;
        
        try {
          const { data, error } = await resend.emails.send({
            from: `Get The Receipts <${testEmail}>`,
            to: ['test@example.com'],
            subject: 'Domain Test',
            html: '<p>Testing with verified domain</p>',
            text: 'Testing with verified domain'
          });
          
          if (error) {
            console.log(`   ❌ Error: ${error.message}`);
          } else {
            console.log(`   ✅ SUCCESS! Message ID: ${data?.id}`);
            console.log(`   🎉 Working domain: ${testDomain.name}`);
            console.log(`   📧 Use this email format: test@${testDomain.name}`);
          }
        } catch (err) {
          console.log(`   ❌ Exception: ${err.message}`);
        }
      } else {
        console.log('\n❌ No verified domains found');
        console.log('🔧 You need to verify a domain before sending emails');
      }
    } else {
      console.log('\n❌ No domains found in your account');
      console.log('🔧 You need to add and verify a domain first');
    }
    
  } catch (error) {
    console.log('❌ Failed to check domains:', error.message);
  }
}

checkDomains().catch(console.error);

