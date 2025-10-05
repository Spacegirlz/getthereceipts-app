// Credits System - Proper Implementation using existing database structure
import { supabase } from '@/lib/database/customSupabaseClient';

export const CREDIT_AMOUNTS = {
  FREE_USER_DAILY: 1, // 1 credit per day for free users
  NEW_USER_BONUS: 3, // 3 credits for new users on signup
  EMERGENCY_PACK: 5,
  PREMIUM_UNLIMITED: -1,
  FOUNDER_UNLIMITED: -1,
};

// Get user credits and subscription info from the users table
export const getUserCredits = async (userId) => {
  try {
    // 🚨 LOCALHOST DEVELOPMENT MODE: Return unlimited credits
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    if (isLocalhost) {
      // Check if this is the dev user
      const isDevUser = userId === '00000000-0000-0000-0000-000000000001' || 
                       (typeof window !== 'undefined' && window.location.search.includes('dev=true'));
      
      if (isDevUser) {
        console.log('🚨 LOCALHOST: Dev user detected - unlimited credits');
        return {
          credits: 999, // Unlimited credits for dev user
          subscription: 'dev', // Show as dev tier
          last_free_receipt_date: new Date().toISOString().split('T')[0],
          deepDivesRemaining: 999 // Unlimited deep dives
        };
      }
      
      // For localhost testing, check if user has a real subscription status
      // If they have a free subscription, give them unlimited credits
      const { data: localhostData, error: localhostError } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', userId)
        .single();
      
      if (!localhostError && localhostData?.subscription_status === 'free') {
        console.log('🚨 LOCALHOST: Free user detected - unlimited credits');
        return {
          credits: CREDIT_AMOUNTS.PREMIUM_UNLIMITED, // -1 indicates unlimited
          subscription: 'free',
          last_free_receipt_date: new Date().toISOString().split('T')[0],
          deepDivesRemaining: CREDIT_AMOUNTS.PREMIUM_UNLIMITED // Unlimited for free users
        };
      }
      
      // Get simulated credits from localStorage for other users (non-free)
      const simulatedCredits = parseInt(localStorage.getItem('test_credits') || '3');
      console.log('🚨 LOCALHOST: Using simulated credits for testing:', simulatedCredits);
      return {
        credits: simulatedCredits, // Use simulated credits that can be deducted
        subscription: 'free', // Show as free tier for testing
        last_free_receipt_date: new Date().toISOString().split('T')[0],
        deepDivesRemaining: simulatedCredits // Limited for testing
      };
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('credits_remaining, subscription_status, last_free_receipt_date, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user credits:', error);
      return {
        credits: CREDIT_AMOUNTS.NEW_USER_BONUS, // 3 credits for new users
        subscription: 'free',
        last_free_receipt_date: null
      };
    }

    // Check if it's a new day and reset credits for free users
    const now = new Date();
    const lastReset = data.last_free_receipt_date ? new Date(data.last_free_receipt_date) : null;
    
    let creditsRemaining = data.credits_remaining ?? 1; // Use nullish coalescing to preserve 0 values
    
    // For premium users, credits are unlimited
    if (data.subscription_status === 'premium' || data.subscription_status === 'yearly' || data.subscription_status === 'founder') {
      creditsRemaining = CREDIT_AMOUNTS.PREMIUM_UNLIMITED; // -1 indicates unlimited
    }
    // For free users, give unlimited credits (no daily reset)
    else if (data.subscription_status === 'free') {
      creditsRemaining = CREDIT_AMOUNTS.PREMIUM_UNLIMITED; // -1 indicates unlimited
    }
    // Legacy logic for other subscription types (emergency pack, etc.)
    else {
      // Keep existing credits for other subscription types
      console.log('✅ Using existing credits for subscription type:', data.subscription_status);
    }

    return {
      credits: creditsRemaining,
      subscription: data.subscription_status || 'free', // Return as 'subscription' not 'subscription_type'
      last_reset: data.last_free_receipt_date,
      deep_dives_used: 0, // Not tracking this yet
      deep_dives_reset: new Date().toISOString()
    };
  } catch (err) {
    console.error('getUserCredits error:', err);
    return {
      credits: CREDIT_AMOUNTS.NEW_USER_BONUS, // 3 credits for new users
      subscription: 'free',
      last_reset: new Date().toISOString(),
      deep_dives_used: 0,
      deep_dives_reset: new Date().toISOString()
    };
  }
};

// Initialize user credits (called when user signs up)
export const initializeUserCredits = async (userId) => {
  try {
    // Check if user already exists - don't use .single() as it throws errors
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .limit(1);

    // If user exists or there's an error checking, don't initialize
    if (existingUser && existingUser.length > 0) {
      console.log('✅ User already exists, skipping credit initialization');
      return { success: true }; // User already exists
    }

    if (checkError) {
      console.error('Error checking user existence:', checkError);
      // Don't initialize if we can't verify - this prevents accidental resets
      return { success: false, error: checkError };
    }

    // Only create/update if user truly doesn't exist
    console.log('🆕 New user detected, initializing with bonus credits');
    const { error } = await supabase
      .from('users')
      .update({
        credits_remaining: CREDIT_AMOUNTS.NEW_USER_BONUS, // 3 credits for new users
        last_free_receipt_date: new Date().toISOString().split('T')[0]
      })
      .eq('id', userId);

    if (error) {
      console.error('Error initializing user credits:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('initializeUserCredits error:', error);
    return { success: false, error };
  }
};

// Add credits to user account (for emergency packs)
export const addCredits = async (userId, amount) => {
  try {
    const { error } = await supabase.rpc('add_emergency_credits', {
      user_uuid: userId
    });

    if (error) {
      console.error('Error adding credits:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('addCredits error:', error);
    return { success: false, error };
  }
};

// Referral system - simplified for now
export const getUserReferralCode = async (userId) => {
  // Generate a simple referral code based on user ID
  const referralCode = `RECEIPTS${userId.slice(-6).toUpperCase()}`;
  
  return {
    data: {
      referral_code: referralCode,
      uses: 0 // We're not tracking this in current database
    },
    error: null
  };
};

export const getReferralStats = async (userId) => {
  // Return basic stats - we can implement proper tracking later
  return {
    data: {
      totalReferrals: 0,
      bonusCreditsEarned: 0
    },
    error: null
  };
};

export const createReferralCode = async (userId) => {
  return getUserReferralCode(userId);
};

export const processReferral = async (userId, referralCode) => {
  // Simplified - just return success for now
  return { success: true, message: 'Referral processed' };
};

export const processShareBonus = async (userId) => {
  // Could add logic to give bonus credits for sharing
  return { success: true };
};

export const resetDeepDives = async (userId) => {
  // Reset logic if needed
  return { success: true };
};

// Deduct credits from user account
export const deductCredits = async (userId, amount = 1) => {
  try {
    // 🚨 LOCALHOST DEVELOPMENT MODE: Skip deduction
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    if (isLocalhost) {
      // Check if this is the dev user
      const isDevUser = userId === '00000000-0000-0000-0000-000000000001' || 
                       (typeof window !== 'undefined' && window.location.search.includes('dev=true'));
      
      if (isDevUser) {
        console.log('🚨 LOCALHOST: Dev user - no credit deduction');
        return { success: true, newCredits: 999 }; // Keep unlimited credits
      }
      
      // Check if user has a real free subscription
      const { data: localhostData, error: localhostError } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', userId)
        .single();
      
      if (!localhostError && localhostData?.subscription_status === 'free') {
        console.log('🚨 LOCALHOST: Free user - no credit deduction needed');
        return { success: true, newCredits: CREDIT_AMOUNTS.PREMIUM_UNLIMITED };
      }
      
      console.log('🚨 LOCALHOST: Simulating credit deduction for testing');
      // Simulate credit deduction by updating localStorage for testing
      const currentCredits = parseInt(localStorage.getItem('test_credits') || '3');
      const newCredits = Math.max(0, currentCredits - amount);
      localStorage.setItem('test_credits', newCredits.toString());
      console.log(`🚨 LOCALHOST: Simulated deduction. Credits: ${currentCredits} → ${newCredits}`);
      return { success: true, newCredits };
    }

    // Get current user data
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('credits_remaining, subscription_status, email')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user data for deduction:', fetchError);
      return { success: false, error: fetchError };
    }

    // Don't deduct for unlimited users (premium/yearly/founder/free)
    if (userData.subscription_status === 'premium' || 
        userData.subscription_status === 'yearly' || 
        userData.subscription_status === 'founder' ||
        userData.subscription_status === 'free') {
      console.log('Unlimited user - no credit deduction needed');
      return { success: true };
    }

    // Deduct credits for free users
    const newCredits = Math.max(0, (userData.credits_remaining || 0) - amount);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        credits_remaining: newCredits,
        last_free_receipt_date: new Date().toISOString().split('T')[0]
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error deducting credits:', updateError);
      return { success: false, error: updateError };
    }

    console.log(`✅ Deducted ${amount} credit(s) from user ${userData.email}. Remaining: ${newCredits}`);
    return { success: true, newCredits };
  } catch (error) {
    console.error('deductCredits error:', error);
    return { success: false, error };
  }
};

// Reset credits for localhost testing
export const resetTestCredits = () => {
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    localStorage.setItem('test_credits', '3');
    console.log('🚨 LOCALHOST: Reset test credits to 3');
    return true;
  }
  return false;
};