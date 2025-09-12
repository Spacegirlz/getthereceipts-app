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
    
    let creditsRemaining = data.credits_remaining || 1;
    
    // For premium users, credits are unlimited
    if (data.subscription_status === 'premium' || data.subscription_status === 'yearly' || data.subscription_status === 'founder') {
      creditsRemaining = CREDIT_AMOUNTS.PREMIUM_UNLIMITED; // -1 indicates unlimited
    }
    // For free users, check if we need to reset daily credits
    else if (data.subscription_status === 'free') {
      const today = now.toISOString().split('T')[0];
      const lastResetDate = data.last_free_receipt_date;
      
      const needsDailyReset = !lastResetDate || lastResetDate !== today;
      
      if (needsDailyReset) {
        // Check if user is still in their new user bonus period
        const userCreatedDate = new Date(data.created_at);
        const daysSinceSignup = Math.floor((now - userCreatedDate) / (1000 * 60 * 60 * 24));
        
        // If user signed up today and still has bonus credits, don't reset
        if (daysSinceSignup === 0 && creditsRemaining > 1) {
          // User is still in their first day with bonus credits, don't reset
          console.log('User still in new user bonus period, not resetting credits');
        } else {
          // Reset to 1 credit per day (standard free tier)
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
          }
        }
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
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      return { success: true }; // User already exists
    }

    // User doesn't exist, this should be handled by the user creation trigger
    // But we can update their credits if needed
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