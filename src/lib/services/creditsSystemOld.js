// Credits and Referral System - Get The Receipts
import { supabase } from '@/lib/database/customSupabaseClient';

// Credit amounts - NEW FREEMIUM MODEL
export const CREDIT_AMOUNTS = {
  FREE_USER_MONTHLY_DEEP_DIVES: 3, // 3 premium deep dives per month
  REFERRAL_BONUS: 3,
  SHARE_BONUS: 1,
  PREMIUM_UNLIMITED: -1, // Unlimited
};

// User credit operations
export const getUserCredits = async (userId) => {
  try {
    // TEMPORARY: Return mock data instead of querying missing table
    return {
      data: {
        credits_remaining: 1,
        last_reset: new Date().toISOString(),
        subscription_type: 'free',
        deep_dives_used: 0,
        deep_dives_reset: new Date().toISOString()
      },
      error: null
    };
    
    // OLD CODE (commented out):
    // const { data, error } = await supabase
    //   .from('user_credits')
    //   .select('credits_remaining, last_reset, subscription_type, deep_dives_used, deep_dives_reset')
    //   .eq('user_id', userId)
    //   .single();
    
    if (error) {
      console.error('Error fetching user credits:', error);
      return { credits: 0, subscription: 'free', deepDivesRemaining: 3 };
    }
    
    // Check if deep dives need to reset (monthly)
    const now = new Date();
    const lastReset = data?.deep_dives_reset ? new Date(data.deep_dives_reset) : null;
    const needsReset = !lastReset || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
    
    let deepDivesRemaining = data?.deep_dives_used ? (CREDIT_AMOUNTS.FREE_USER_MONTHLY_DEEP_DIVES - data.deep_dives_used) : CREDIT_AMOUNTS.FREE_USER_MONTHLY_DEEP_DIVES;
    
    if (needsReset && data?.subscription_type === 'free') {
      deepDivesRemaining = CREDIT_AMOUNTS.FREE_USER_MONTHLY_DEEP_DIVES;
    }
    
    return {
      credits: data?.credits_remaining || 0,
      lastReset: data?.last_reset,
      subscription: data?.subscription_type || 'free',
      deepDivesRemaining: data?.subscription_type === 'premium' ? -1 : deepDivesRemaining, // -1 for unlimited
      deepDivesUsed: data?.deep_dives_used || 0
    };
  } catch (error) {
    console.error('Error in getUserCredits:', error);
    return { credits: 0, subscription: 'free', deepDivesRemaining: 3 };
  }
};

export const initializeUserCredits = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        credits_remaining: 0, // No more basic credits needed
        last_reset: new Date().toISOString(),
        subscription_type: 'free',
        total_earned: 0,
        referrals_made: 0,
        deep_dives_used: 0,
        deep_dives_reset: new Date().toISOString()
      }, { 
        onConflict: 'user_id' 
      });
    
    if (error) {
      console.error('Error initializing user credits:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in initializeUserCredits:', error);
    return false;
  }
};

export const deductCredit = async (userId) => {
  try {
    const { data, error } = await supabase.rpc('deduct_user_credit', {
      user_id_param: userId
    });
    
    if (error) {
      console.error('Error deducting credit:', error);
      return { success: false, remainingCredits: 0 };
    }
    
    return { success: true, remainingCredits: data };
  } catch (error) {
    console.error('Error in deductCredit:', error);
    return { success: false, remainingCredits: 0 };
  }
};

export const addCredits = async (userId, amount, reason = 'bonus') => {
  try {
    const { data, error } = await supabase.rpc('add_user_credits', {
      user_id_param: userId,
      credit_amount: amount,
      reason_param: reason
    });
    
    if (error) {
      console.error('Error adding credits:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addCredits:', error);
    return false;
  }
};

// Referral system
export const generateReferralCode = (userId) => {
  // Generate a unique 8-character referral code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GTR${result}`;
};

export const createReferralCode = async (userId) => {
  try {
    const referralCode = generateReferralCode(userId);
    
    const { data, error } = await supabase
      .from('referral_codes')
      .upsert({
        user_id: userId,
        referral_code: referralCode,
        created_at: new Date().toISOString(),
        uses: 0
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Error creating referral code:', error);
      return null;
    }
    
    return referralCode;
  } catch (error) {
    console.error('Error in createReferralCode:', error);
    return null;
  }
};

export const processReferral = async (referrerCode, newUserId) => {
  try {
    // Find the referrer
    const { data: referrerData, error: referrerError } = await supabase
      .from('referral_codes')
      .select('user_id, uses')
      .eq('referral_code', referrerCode)
      .single();
    
    if (referrerError || !referrerData) {
      console.error('Invalid referral code:', referrerError);
      return false;
    }
    
    const referrerId = referrerData.user_id;
    
    // Check if this user was already referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_user_id', newUserId)
      .single();
    
    if (existingReferral) {
      console.log('User already has a referral record');
      return false;
    }
    
    // Create referral record
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_user_id: referrerId,
        referred_user_id: newUserId,
        created_at: new Date().toISOString(),
        status: 'completed'
      });
    
    if (referralError) {
      console.error('Error creating referral record:', referralError);
      return false;
    }
    
    // Update referral code uses
    await supabase
      .from('referral_codes')
      .update({ uses: referrerData.uses + 1 })
      .eq('referral_code', referrerCode);
    
    // Give bonus credits to referrer
    await addCredits(referrerId, CREDIT_AMOUNTS.REFERRAL_BONUS, 'referral_bonus');
    
    // Give bonus credits to new user
    await addCredits(newUserId, CREDIT_AMOUNTS.REFERRAL_BONUS, 'signup_bonus');
    
    return true;
  } catch (error) {
    console.error('Error in processReferral:', error);
    return false;
  }
};

export const getUserReferralCode = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('referral_codes')
      .select('referral_code, uses')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No referral code exists, create one
      const newCode = await createReferralCode(userId);
      return { referralCode: newCode, uses: 0 };
    }
    
    if (error) {
      console.error('Error fetching referral code:', error);
      return null;
    }
    
    return {
      referralCode: data.referral_code,
      uses: data.uses
    };
  } catch (error) {
    console.error('Error in getUserReferralCode:', error);
    return null;
  }
};

export const getReferralStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', userId);
    
    if (error) {
      console.error('Error fetching referral stats:', error);
      return { totalReferrals: 0, bonusCreditsEarned: 0 };
    }
    
    return {
      totalReferrals: data.length,
      bonusCreditsEarned: data.length * CREDIT_AMOUNTS.REFERRAL_BONUS
    };
  } catch (error) {
    console.error('Error in getReferralStats:', error);
    return { totalReferrals: 0, bonusCreditsEarned: 0 };
  }
};

// Share bonus system
export const processShareBonus = async (userId) => {
  try {
    // Check if user has already earned share bonus today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingBonus } = await supabase
      .from('share_bonuses')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)
      .single();
    
    if (existingBonus) {
      return { success: false, reason: 'already_earned_today' };
    }
    
    // Record the share bonus
    await supabase
      .from('share_bonuses')
      .insert({
        user_id: userId,
        created_at: new Date().toISOString(),
        credits_awarded: CREDIT_AMOUNTS.SHARE_BONUS
      });
    
    // Add the bonus credits
    const success = await addCredits(userId, CREDIT_AMOUNTS.SHARE_BONUS, 'share_bonus');
    
    return { success, creditsAwarded: CREDIT_AMOUNTS.SHARE_BONUS };
  } catch (error) {
    console.error('Error in processShareBonus:', error);
    return { success: false, reason: 'error' };
  }
};

// NEW: Check if user can access deep dive
export const canUserAccessDeepDive = async (userId) => {
  try {
    const userCredits = await getUserCredits(userId);
    
    // Premium users have unlimited access
    if (userCredits.subscription === 'premium') {
      return { canAccess: true, remainingDeepDives: -1, subscription: 'premium' };
    }
    
    // Free users get 3 deep dives per month
    return { 
      canAccess: userCredits.deepDivesRemaining > 0, 
      remainingDeepDives: userCredits.deepDivesRemaining,
      subscription: 'free'
    };
  } catch (error) {
    console.error('Error checking deep dive access:', error);
    return { canAccess: false, remainingDeepDives: 0, subscription: 'free' };
  }
};

// NEW: Use a deep dive
export const useDeepDive = async (userId) => {
  try {
    const userCredits = await getUserCredits(userId);
    
    // Premium users have unlimited access
    if (userCredits.subscription === 'premium') {
      return { success: true, remainingDeepDives: -1 };
    }
    
    // Check if free user has deep dives remaining
    if (userCredits.deepDivesRemaining <= 0) {
      return { success: false, remainingDeepDives: 0, message: 'No deep dives remaining this month' };
    }
    
    // Update deep dives used
    const { error } = await supabase
      .from('user_credits')
      .update({ 
        deep_dives_used: (userCredits.deepDivesUsed || 0) + 1,
        deep_dives_reset: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error using deep dive:', error);
      return { success: false, remainingDeepDives: userCredits.deepDivesRemaining };
    }
    
    return { 
      success: true, 
      remainingDeepDives: userCredits.deepDivesRemaining - 1 
    };
  } catch (error) {
    console.error('Error in useDeepDive:', error);
    return { success: false, remainingDeepDives: 0 };
  }
};