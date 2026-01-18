// Basic Referral Service
import { supabase } from '@/lib/database/customSupabaseClient';

// Get or create referral code for user
export const getUserReferralCode = async (userId) => {
  try {
    console.log('🔗 Getting referral code for user:', userId);
    
    // First try to get existing code
    const { data: existingCode, error: fetchError } = await supabase
      .from('user_referral_codes')
      .select('referral_code, total_referrals, total_rewards_earned')
      .eq('user_id', userId)
      .single();
    
    // If the table doesn't exist or permission denied, return default values
    if (fetchError && (fetchError.code === 'PGRST116' || fetchError.code === '42P01' || fetchError.status === 406)) {
      console.warn('Referral system not fully set up, returning default values');
      return {
        success: true,
        referralCode: 'TEMP' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        totalReferrals: 0,
        totalRewards: 0
      };
    }
    
    if (existingCode && !fetchError) {
      return {
        success: true,
        referralCode: existingCode.referral_code,
        totalReferrals: existingCode.total_referrals,
        totalRewards: existingCode.total_rewards_earned
      };
    }
    
    // If no existing code, create one
    const { data: newCode, error: createError } = await supabase.rpc('create_user_referral_code', {
      user_id_input: userId
    });
    
    if (createError) {
      console.error('Error creating referral code:', createError);
      return { success: false, error: 'Failed to create referral code' };
    }
    
    // Fetch the newly created code
    const { data: createdCode, error: fetchNewError } = await supabase
      .from('user_referral_codes')
      .select('referral_code, total_referrals, total_rewards_earned')
      .eq('user_id', userId)
      .single();
    
    if (fetchNewError) {
      console.error('Error fetching new referral code:', fetchNewError);
      return { success: false, error: 'Failed to fetch referral code' };
    }
    
    return {
      success: true,
      referralCode: createdCode.referral_code,
      totalReferrals: createdCode.total_referrals,
      totalRewards: createdCode.total_rewards_earned
    };
    
  } catch (error) {
    console.error('Referral service error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Process referral when someone signs up with a code
export const processReferral = async (referralCode, newUserId) => {
  try {
    console.log('🎯 Processing referral:', referralCode, 'for user:', newUserId);
    
    const { data, error } = await supabase.rpc('process_referral', {
      referral_code_input: referralCode,
      new_user_id: newUserId
    });
    
    if (error) {
      console.error('Error processing referral:', error);
      return { success: false, error: 'Failed to process referral' };
    }
    
    if (!data.success) {
      return { success: false, error: data.error };
    }
    
    // 🎯 OPTION A: Credits are now handled directly in the database function
    // No need to create coupons - both users get 3 credits automatically
    
    return {
      success: true,
      creditsGiven: data.credits_given || 3,
      message: data.message || 'Referral processed successfully! Both you and your friend earned 3 credits!'
    };
    
  } catch (error) {
    console.error('Process referral error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Get referral stats for a user
export const getReferralStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_referral_codes')
      .select('total_referrals, total_rewards_earned')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching referral stats:', error);
      return { totalReferrals: 0, totalRewards: 0 };
    }
    
    return {
      totalReferrals: data?.total_referrals || 0,
      totalRewards: data?.total_rewards_earned || 0
    };
    
  } catch (error) {
    console.error('Referral stats error:', error);
    return { totalReferrals: 0, totalRewards: 0 };
  }
};

// Get referral link for user
export const getReferralLink = (referralCode) => {
  const baseUrl = window.location.origin;
  
  // Rewardful affiliate tracking disabled - using built-in referral system
  // if (window.Rewardful && typeof window.Rewardful.refer === 'function') {
  //   // Use Rewardful to generate tracked referral link
  //   return window.Rewardful.refer({
  //     referral: referralCode
  //   });
  // }
  
  // Built-in referral system (always used now)
  return `${baseUrl}/?ref=${referralCode}`;
};
