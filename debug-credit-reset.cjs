const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugCreditReset() {
  try {
    // Get your user data
    const { data, error } = await supabase
      .from('users')
      .select('id, email, credits_remaining, last_free_receipt_date, created_at, subscription_status')
      .eq('email', 'piet@pietmarie.com')
      .single();

    if (error) throw error;

    console.log('🔍 User Data from Database:');
    console.log('================================');
    console.log('Email:', data.email);
    console.log('Credits:', data.credits_remaining);
    console.log('Last Reset Date:', data.last_free_receipt_date);
    console.log('Created At:', data.created_at);
    console.log('Subscription:', data.subscription_status);
    console.log('');

    // Simulate the credit reset logic
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastResetDate = data.last_free_receipt_date;

    console.log('🔍 Date Comparison:');
    console.log('===================');
    console.log('Today (JS):', today);
    console.log('Last Reset (DB):', lastResetDate);
    console.log('Dates Match:', lastResetDate === today);
    console.log('Needs Reset:', !lastResetDate || lastResetDate !== today);
    console.log('');

    // Check user creation date
    const userCreatedDate = new Date(data.created_at);
    const daysSinceSignup = Math.floor((now - userCreatedDate) / (1000 * 60 * 60 * 24));

    console.log('🔍 User Age Calculation:');
    console.log('========================');
    console.log('User Created:', userCreatedDate.toISOString());
    console.log('Days Since Signup:', daysSinceSignup);
    console.log('Is New User (day 0):', daysSinceSignup === 0);
    console.log('Has Excess Credits:', data.credits_remaining > 1);
    console.log('');

    console.log('🔍 Reset Logic Decision:');
    console.log('========================');
    const needsReset = !lastResetDate || lastResetDate !== today;
    const isNewUserWithBonus = daysSinceSignup === 0 && data.credits_remaining > 1;

    if (needsReset) {
      if (isNewUserWithBonus) {
        console.log('❌ Would NOT reset (new user bonus protection)');
      } else {
        console.log('✅ Would RESET to 1 credit');
        console.log('   Reason: User is', daysSinceSignup, 'days old with', data.credits_remaining, 'credits');
      }
    } else {
      console.log('❌ Would NOT reset (same day)');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

debugCreditReset();