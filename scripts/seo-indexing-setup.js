#!/usr/bin/env node

/**
 * SEO Indexing Setup Script
 * Run this to get indexing URLs and verification steps
 */

console.log('🚀 GET THE RECEIPTS - SEO INDEXING SETUP\n');

const urls = [
  'https://www.getthereceipts.com',
  'https://www.getthereceipts.com/pricing', 
  'https://www.getthereceipts.com/about',
  'https://www.getthereceipts.com/chat-input'
];

console.log('📋 STEP 1: Google Search Console Setup');
console.log('1. Go to: https://search.google.com/search-console');
console.log('2. Add property: https://www.getthereceipts.com');
console.log('3. Use HTML tag verification method');
console.log('4. Add verification code to index.html');
console.log('5. Submit sitemap: /sitemap.xml\n');

console.log('📋 STEP 2: Manual URL Indexing Requests');
console.log('After Search Console verification, request indexing for:');
urls.forEach((url, i) => {
  console.log(`${i + 1}. ${url}`);
});

console.log('\n📋 STEP 3: Alternative Indexing Methods');
console.log('1. Submit to: https://www.google.com/webmasters/tools/submit-url');
console.log('2. Share on social media with links');
console.log('3. Get backlinks from indexed sites');
console.log('4. Create Google Business Profile (if applicable)');

console.log('\n📋 STEP 4: Verify Indexing');
console.log('Use these search queries to check indexing:');
console.log('- site:getthereceipts.com');
console.log('- "Get The Receipts" site:getthereceipts.com');
console.log('- inurl:getthereceipts.com');

console.log('\n✅ Run this script anytime for indexing checklist');