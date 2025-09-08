import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your-service-key node check-users.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsers() {
  try {
    console.log('🔍 Checking Supabase for authorized email addresses...\n');

    // Query auth.users table for user statistics
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    const totalUsers = users.users.length;
    const confirmedUsers = users.users.filter(user => user.email_confirmed_at !== null);
    const unconfirmedUsers = users.users.filter(user => user.email_confirmed_at === null);
    
    console.log('📊 User Statistics:');
    console.log('==================');
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Confirmed Email Addresses: ${confirmedUsers.length}`);
    console.log(`Unconfirmed Email Addresses: ${unconfirmedUsers.length}`);
    console.log(`Confirmation Rate: ${totalUsers > 0 ? Math.round((confirmedUsers.length / totalUsers) * 100) : 0}%\n`);

    // Show recent registrations
    const recentUsers = users.users
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    console.log('🕐 Recent Users (last 10):');
    console.log('===========================');
    recentUsers.forEach((user, index) => {
      const createdAt = new Date(user.created_at).toLocaleDateString();
      const confirmed = user.email_confirmed_at ? '✅' : '❌';
      console.log(`${index + 1}. ${user.email} - ${createdAt} ${confirmed}`);
    });

    // Check for users with subscriptions and their credits
    const { data: userCredits, error: creditsError } = await supabase
      .from('users')
      .select('id, email, credits_remaining, subscription_status, last_free_receipt_date');

    if (!creditsError && userCredits) {
      console.log(`\n💳 User Credits Details:`);
      console.log('========================');
      userCredits.forEach(user => {
        const email = users.users.find(u => u.id === user.id)?.email || 'No email';
        console.log(`${email}: ${user.credits_remaining || 0} credits (${user.subscription_status || 'free'}) - Last reset: ${user.last_free_receipt_date || 'Never'}`);
      });
      
      const premiumUsers = userCredits.filter(u => u.subscription_status && u.subscription_status !== 'free');
      console.log(`\n💎 Premium Subscribers: ${premiumUsers.length}`);
    }

  } catch (error) {
    console.error('❌ Error querying Supabase:', error.message);
  }
}

checkUsers();