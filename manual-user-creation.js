import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your-service-key node manual-user-creation.js EMAIL PASSWORD');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Error: Email and password are required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your-service-key node manual-user-creation.js EMAIL PASSWORD');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createManualUser(userEmail, userPassword) {
  try {
    console.log(`🔧 Manually creating user account for: ${userEmail}`);

    // Create user with admin API (bypasses rate limits)
    const { data, error } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        created_manually: true,
        created_at: new Date().toISOString(),
      }
    });

    if (error) {
      console.error('❌ Failed to create user:', error.message);
      return;
    }

    console.log('✅ User created successfully!');
    console.log(`📧 Email: ${data.user.email}`);
    console.log(`🆔 User ID: ${data.user.id}`);
    console.log(`✅ Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}`);

    // Add to users table with default credits
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        credits_remaining: 1,
        subscription_status: 'free',
        last_free_receipt_date: new Date().toISOString().split('T')[0],
      });

    if (dbError) {
      console.log(`⚠️  Warning: Could not add to users table: ${dbError.message}`);
    } else {
      console.log('✅ Added to users table with 1 free credit');
    }

    console.log('\n🎉 Account ready! User can now sign in with:');
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🔑 Password: [the password you provided]`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createManualUser(email, password);