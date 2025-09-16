import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your-service-key node check-auth-status.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAuthStatus() {
  try {
    console.log('🔍 Checking Supabase Auth Status...\n');

    // Check recent user registrations to see if there's unusual activity
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return;
    }

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const recentSignups24h = users.users.filter(user => 
      new Date(user.created_at) > last24Hours
    );

    const recentSignups1h = users.users.filter(user => 
      new Date(user.created_at) > lastHour
    );

    console.log('📊 Recent Signup Activity:');
    console.log('==========================');
    console.log(`Total users: ${users.users.length}`);
    console.log(`Signups in last 24h: ${recentSignups24h.length}`);
    console.log(`Signups in last hour: ${recentSignups1h.length}`);

    if (recentSignups24h.length > 0) {
      console.log('\n🕐 Recent signups (last 24h):');
      recentSignups24h.forEach(user => {
        const timeAgo = Math.round((now - new Date(user.created_at)) / (1000 * 60));
        console.log(`   ${user.email} - ${timeAgo} minutes ago`);
      });
    }

    // Check for failed confirmation attempts
    const unconfirmedUsers = users.users.filter(user => !user.email_confirmed_at);
    console.log(`\n❌ Unconfirmed users: ${unconfirmedUsers.length}`);
    
    if (unconfirmedUsers.length > 0) {
      console.log('   These users may be causing email rate limits:');
      unconfirmedUsers.forEach(user => {
        const timeAgo = Math.round((now - new Date(user.created_at)) / (1000 * 60 * 60));
        console.log(`   ${user.email} - ${timeAgo} hours ago (unconfirmed)`);
      });
    }

    // Check if there are any specific error patterns
    console.log('\n🚨 Potential Issues:');
    console.log('====================');
    
    if (recentSignups1h.length > 10) {
      console.log('⚠️  HIGH signup rate in last hour - this could trigger rate limits');
    }
    
    if (unconfirmedUsers.length > 5) {
      console.log('⚠️  Many unconfirmed users - email delivery may be failing');
    }
    
    if (recentSignups24h.length === 0) {
      console.log('✅ Normal signup activity levels');
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    console.log('===================');
    console.log('1. Supabase free tier has email rate limits (usually ~100/hour)');
    console.log('2. Rate limits reset automatically after time passes');
    console.log('3. Consider upgrading to paid plan for higher limits');
    console.log('4. Implement signup throttling on frontend if needed');
    
    if (unconfirmedUsers.length > 0) {
      console.log('5. Check if confirmation emails are being sent properly');
      console.log('6. Consider resending confirmations for legitimate users');
    }

  } catch (error) {
    console.error('❌ Error checking auth status:', error.message);
  }
}

checkAuthStatus();