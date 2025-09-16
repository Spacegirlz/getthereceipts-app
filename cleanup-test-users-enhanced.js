import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your-service-key node cleanup-test-users-enhanced.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define test account patterns to delete
const TEST_PATTERNS = [
  '+old_20250916',
  '+test',
  '+dev',
];

// SAFE LIST - Never delete these accounts
const PROTECTED_ACCOUNTS = [
  'piet@virtualsatchel.com',
  'piet@pietmarie.com', 
  'support@getthereceipts.com',
  'hello@virtualsatchel.com',
  // Add other accounts that should never be deleted
];

// Tables that might have foreign key references to users (in dependency order)
const DEPENDENT_TABLES = [
  'user_referral_codes',
  'coupon_usage', 
  'stripe_customers',
  'user_sessions',
  'user_analysis_history',
  // Add other tables that reference users.id
];

async function cleanupTestUsers() {
  try {
    console.log('🔍 Finding test accounts to cleanup...\n');

    // Get all users
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    // Find test accounts based on email patterns (but exclude protected accounts)
    const testAccounts = users.users.filter(user => {
      if (!user.email) return false;
      
      // Never delete protected accounts
      if (PROTECTED_ACCOUNTS.includes(user.email)) {
        console.log(`🛡️  Protecting account: ${user.email}`);
        return false;
      }
      
      return TEST_PATTERNS.some(pattern => user.email.includes(pattern));
    });

    if (testAccounts.length === 0) {
      console.log('✅ No test accounts found to cleanup.');
      return;
    }

    console.log(`Found ${testAccounts.length} test accounts:`);
    console.log('==========================================');
    testAccounts.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
      console.log(`   Last sign in: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}`);
    });

    console.log('\n🗑️  Proceeding with enhanced cleanup (handling foreign keys)...\n');
    
    // Delete each test account with proper dependency handling
    for (const user of testAccounts) {
      try {
        console.log(`🧹 Cleaning up ${user.email}...`);
        
        // First, delete from dependent tables in order
        for (const table of DEPENDENT_TABLES) {
          try {
            const { error: depError } = await supabase
              .from(table)
              .delete()
              .eq('user_id', user.id);
            
            if (depError && !depError.message.includes('relation') && !depError.message.includes('does not exist')) {
              console.log(`   ⚠️  Warning deleting from ${table}: ${depError.message}`);
            } else {
              console.log(`   ✅ Cleaned ${table}`);
            }
          } catch (tableError) {
            console.log(`   ⚠️  Table ${table} might not exist or have user_id column: ${tableError.message}`);
          }
        }
        
        // Delete from our main users table
        const { error: dbError } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
        
        if (dbError && !dbError.message.includes('No rows found')) {
          console.log(`   ⚠️  Warning deleting from users table: ${dbError.message}`);
        } else {
          console.log(`   ✅ Cleaned users table`);
        }
        
        // Finally, delete from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
        
        if (authError) {
          console.log(`   ❌ Failed to delete from auth: ${authError.message}`);
        } else {
          console.log(`   ✅ Successfully deleted ${user.email} from auth`);
        }
        
        console.log(`   🎉 Complete cleanup for ${user.email}\n`);
        
        // Small delay between deletions
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (deleteError) {
        console.log(`   ❌ Error deleting ${user.email}: ${deleteError.message}\n`);
      }
    }
    
    console.log('✅ Enhanced cleanup completed!');
    
    // Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    const { data: remainingUsers, error: verifyError } = await supabase.auth.admin.listUsers();
    if (!verifyError) {
      const stillExists = remainingUsers.users.filter(user => 
        user.email && TEST_PATTERNS.some(pattern => user.email.includes(pattern))
      );
      
      if (stillExists.length === 0) {
        console.log('✅ All test accounts successfully removed!');
      } else {
        console.log(`❌ ${stillExists.length} test accounts still exist:`);
        stillExists.forEach(user => console.log(`   - ${user.email}`));
      }
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanupTestUsers();