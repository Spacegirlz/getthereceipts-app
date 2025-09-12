// Script to delete test accounts from Supabase
// Run with: node delete-accounts.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY'; // You'll need to get this from Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const accountsToDelete = [
  'myfyiacc@gmail.com',
  'piet@virtualsatchel.com',
  'hello@virtualsatchel.com'
];

async function deleteAccounts() {
  console.log('🗑️ Deleting test accounts...');
  
  for (const email of accountsToDelete) {
    try {
      // Get user by email
      const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) {
        console.error(`❌ Error fetching users:`, fetchError);
        continue;
      }
      
      const user = users.users.find(u => u.email === email);
      
      if (user) {
        // Delete user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        
        if (deleteError) {
          console.error(`❌ Error deleting ${email}:`, deleteError);
        } else {
          console.log(`✅ Deleted account: ${email}`);
        }
      } else {
        console.log(`ℹ️ Account not found: ${email}`);
      }
    } catch (error) {
      console.error(`❌ Exception deleting ${email}:`, error);
    }
  }
  
  console.log('🎉 Account deletion complete!');
}

deleteAccounts();
