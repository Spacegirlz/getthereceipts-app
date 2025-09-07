#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseServiceKey) {
  console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateSubscription(email, newPlan = 'premium') {
  try {
    console.log(`🔄 Updating subscription for ${email} to ${newPlan}...`)
    
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_status: newPlan })
      .eq('email', email)
      .select()
    
    if (error) {
      console.error('❌ Error updating subscription:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log(`✅ Successfully updated ${email} to ${newPlan} plan!`)
      console.log('Updated user:', data[0])
    } else {
      console.log(`❌ No user found with email: ${email}`)
    }
    
  } catch (err) {
    console.error('❌ Script error:', err)
  }
}

// Get email from command line argument
const email = process.argv[2]
const plan = process.argv[3] || 'premium'

if (!email) {
  console.log(`
Usage: node update-subscription.js <email> [plan]

Examples:
  node update-subscription.js you@example.com premium
  node update-subscription.js you@example.com yearly
  node update-subscription.js you@example.com free

Available plans: free, premium, yearly
`)
  process.exit(1)
}

updateSubscription(email, plan)