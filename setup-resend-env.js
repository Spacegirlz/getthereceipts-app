#!/usr/bin/env node

/**
 * Setup script for Resend environment variables
 * Run this script to help configure your Resend integration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Resend Setup Helper for Get The Receipts\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.local.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Get The Receipts - Local Environment Variables
# Add your actual values below

# Supabase Configuration
VITE_SUPABASE_URL=https://dpzalqyrmjuuhvcquyzc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# AI Services
VITE_OPENAI_API_KEY=sk-proj-your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_AI_PROVIDER=openai
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@getthereceipts.com
RESEND_FROM_NAME=Get The Receipts

# Application Configuration
VITE_APP_URL=https://www.getthereceipts.com
VITE_APP_NAME=Get The Receipts
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Open .env.local in your editor');
console.log('2. Replace "re_your_resend_api_key_here" with your actual Resend API key');
console.log('3. Update other environment variables as needed');
console.log('4. Run: npm run dev');

console.log('\n🔑 To get your Resend API key:');
console.log('1. Go to https://resend.com/api-keys');
console.log('2. Click "Create API Key"');
console.log('3. Name it "Get The Receipts Production"');
console.log('4. Copy the key (starts with "re_")');
console.log('5. Paste it in your .env.local file');

console.log('\n🌐 For Production (Vercel):');
console.log('1. Go to Vercel Dashboard > Settings > Environment Variables');
console.log('2. Add these variables:');
console.log('   - RESEND_API_KEY: your_resend_api_key');
console.log('   - RESEND_FROM_EMAIL: noreply@getthereceipts.com');
console.log('   - RESEND_FROM_NAME: Get The Receipts');

console.log('\n✨ Setup complete! Your Resend integration is ready to configure.');
