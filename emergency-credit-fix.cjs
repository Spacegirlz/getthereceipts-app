const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function emergencyAddCredits() {
  try {
    console.log('🚨 EMERGENCY: Adding 5 credits for $1.99 purchase...');
    
    const { error } = await supabase
      .from('users')
      .update({ 
        credits_remaining: 5, // Emergency pack purchased
        last_free_receipt_date: new Date().toISOString().split('T')[0]
      })
      .eq('email', 'piet@pietmarie.com');
      
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Emergency credit fix applied - 5 credits added');
    }
    
    // Verify the update
    const { data, error: checkError } = await supabase
      .from('users')
      .select('email, credits_remaining')
      .eq('email', 'piet@pietmarie.com')
      .single();
      
    if (checkError) {
      console.error('❌ Verification error:', checkError);
    } else {
      console.log('✅ Verified:', data);
    }
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
  }
}

emergencyAddCredits();