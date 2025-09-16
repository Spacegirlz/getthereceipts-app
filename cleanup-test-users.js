import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Usage: SUPABASE_SERVICE_KEY=your-service-key node cleanup-test-users.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define test account patterns to delete
const TEST_PATTERNS = [
  '+old_20250916',
  '+test',
  '+dev',
  // Add more patterns as needed
];

async function cleanupTestUsers() {
  try {
    console.log('🔍 Finding test accounts to cleanup...\n');

    // Get all users
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    // Find test accounts based on email patterns
    const testAccounts = users.users.filter(user => {
      if (!user.email) return false;
      
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

    console.log('\n🗑️  Proceeding with cleanup...\n');
    
    // Delete each test account
    for (const user of testAccounts) {
      try {
        console.log(`Deleting ${user.email}...`);
        
        // First, delete from our users table if exists
        const { error: dbError } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
        
        if (dbError && !dbError.message.includes('No rows found')) {
          console.log(`   ⚠️  Warning deleting from users table: ${dbError.message}`);
        }
        
        // Then delete from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
        
        if (authError) {
          console.log(`   ❌ Failed to delete ${user.email}: ${authError.message}`);
        } else {
          console.log(`   ✅ Successfully deleted ${user.email}`);
        }
        
        // Small delay between deletions
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (deleteError) {
        console.log(`   ❌ Error deleting ${user.email}: ${deleteError.message}`);
      }
    }
    
    console.log('\n✅ Cleanup completed!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanupTestUsers();