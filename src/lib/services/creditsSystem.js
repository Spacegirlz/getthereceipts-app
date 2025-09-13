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
      console.log('🚨 LOCALHOST: Everyone gets 3 credits for testing');
      return {
        credits: 3, // Everyone gets 3 credits for testing
        subscription: 'free', // Show as free tier for testing
        last_free_receipt_date: new Date().toISOString().split('T')[0],
        deepDivesRemaining: 3 // Limited for testing
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
    // For free users, check if we need to reset daily credits
    else if (data.subscription_status === 'free') {
      const today = now.toISOString().split('T')[0];
      const lastResetDate = data.last_free_receipt_date;
      
      console.log('🔍 Daily reset check:', {
        today,
        lastResetDate,
        currentCredits: creditsRemaining,
        userId: userId.substring(0, 8) + '...'
      });
      
      const needsDailyReset = !lastResetDate || lastResetDate !== today;
      
      if (needsDailyReset) {
        console.log('🔄 Daily reset needed - checking bonus period...');
        
        // Check if user is still in their new user bonus period
        const userCreatedDate = new Date(data.created_at);
        const daysSinceSignup = Math.floor((now - userCreatedDate) / (1000 * 60 * 60 * 24));
        
        console.log('📅 User bonus check:', {
          userCreatedDate: userCreatedDate.toISOString(),
          daysSinceSignup,
          currentCredits: creditsRemaining,
          hasExcessCredits: creditsRemaining > 1
        });
        
        // If user signed up today and still has bonus credits, don't reset
        if (daysSinceSignup === 0 && creditsRemaining > 1) {
          // User is still in their first day with bonus credits, don't reset
          console.log('⏭️ User still in new user bonus period, not resetting credits');
        } else {
          // Reset to 1 credit per day (standard free tier)
          console.log(`🔄 Resetting credits from ${creditsRemaining} to ${CREDIT_AMOUNTS.FREE_USER_DAILY}`);
          creditsRemaining = CREDIT_AMOUNTS.FREE_USER_DAILY;
          
          // Update the database with new credits and reset date
          const { error: updateError } = await supabase
            .from('users')
            .update({
              credits_remaining: creditsRemaining,
              last_free_receipt_date: today
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating daily credit reset:', updateError);
          } else {
            console.log('✅ Daily reset complete - credits set to 1');
          }
        }
      } else {
        console.log('✅ No daily reset needed - using current credits:', creditsRemaining);
      }
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
      console.log('🚨 LOCALHOST: Skipping credit deduction for testing');
      return { success: true };
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

    // Don't deduct for unlimited users (premium/yearly/founder)
    if (userData.subscription_status === 'premium' || 
        userData.subscription_status === 'yearly' || 
        userData.subscription_status === 'founder') {
      console.log('Premium user - no credit deduction needed');
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