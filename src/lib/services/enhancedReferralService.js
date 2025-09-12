// Enhanced Referral Service with Real-time Updates and Credit Rewards
import { supabase } from '@/lib/database/customSupabaseClient';
import { safeProcessReferral, handleReferralError, handleReferralSuccess } from './referralErrorHandler';

// Get enhanced referral stats with milestone tracking
export const getEnhancedReferralStats = async (userId) => {
  try {
    console.log('📊 Getting enhanced referral stats for user:', userId);
    
    const { data, error } = await supabase.rpc('get_enhanced_referral_stats', {
      user_id_input: userId
    });
    
    if (error) {
      console.error('Error fetching enhanced referral stats:', error);
      return { 
        success: false, 
        error: 'Failed to fetch referral stats',
        stats: {
          totalReferrals: 0,
          totalRewards: 0,
          milestone10Reached: false,
          milestone50Reached: false,
          referralsTo10: 10,
          referralsTo50: 50
        }
      };
    }
    
    return {
      success: true,
      stats: {
        totalReferrals: data.total_referrals || 0,
        totalRewards: data.total_rewards_earned || 0,
        milestone10Reached: data.milestone_10_reached || false,
        milestone50Reached: data.milestone_50_reached || false,
        milestone10RewardClaimed: data.milestone_10_reward_claimed || false,
        milestone50RewardClaimed: data.milestone_50_reward_claimed || false,
        milestone10Coupon: data.milestone_10_coupon || null,
        milestone50Coupon: data.milestone_50_coupon || null,
        referralsTo10: data.referrals_to_10 || 10,
        referralsTo50: data.referrals_to_50 || 50
      }
    };
    
  } catch (error) {
    console.error('Enhanced referral stats error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred',
      stats: {
        totalReferrals: 0,
        totalRewards: 0,
        milestone10Reached: false,
        milestone50Reached: false,
        referralsTo10: 10,
        referralsTo50: 50
      }
    };
  }
};

// Process referral with credits and milestone rewards (with error handling)
export const processReferralWithCredits = async (referralCode, newUserId, toast) => {
  const processFn = async (code, userId) => {
    console.log('🎯 Processing referral with credits:', code, 'for user:', userId);
    
    const { data, error } = await supabase.rpc('process_referral_with_credits', {
      referral_code_input: code,
      new_user_id: userId
    });
    
    if (error) {
      console.error('Error processing referral with credits:', error);
      throw error;
    }
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return {
      success: true,
      creditsGiven: data.credits_given || 3,
      currentReferralCount: data.current_referral_count || 0,
      milestone10Reached: data.milestone_10_reached || false,
      milestone50Reached: data.milestone_50_reached || false,
      milestone10Coupon: data.milestone_10_coupon || null,
      milestone50Coupon: data.milestone_50_coupon || null,
      message: data.message || 'Referral processed successfully! You earned 3 credits.'
    };
  };
  
  return await safeProcessReferral(referralCode, newUserId, processFn, toast);
};

// Get or create referral code for user (enhanced version)
export const getUserReferralCodeEnhanced = async (userId) => {
  try {
    console.log('🔗 Getting enhanced referral code for user:', userId);
    
    // First try to get existing code with enhanced stats
    const { data: existingCode, error: fetchError } = await supabase
      .from('user_referral_codes')
      .select(`
        referral_code, 
        total_referrals, 
        total_rewards_earned,
        milestone_10_reached,
        milestone_50_reached,
        milestone_10_reward_claimed,
        milestone_50_reward_claimed
      `)
      .eq('user_id', userId)
      .single();
    
    if (existingCode && !fetchError) {
      return {
        success: true,
        referralCode: existingCode.referral_code,
        totalReferrals: existingCode.total_referrals,
        totalRewards: existingCode.total_rewards_earned,
        milestone10Reached: existingCode.milestone_10_reached,
        milestone50Reached: existingCode.milestone_50_reached,
        milestone10RewardClaimed: existingCode.milestone_10_reward_claimed,
        milestone50RewardClaimed: existingCode.milestone_50_reward_claimed
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
    
    // Fetch the newly created code with enhanced stats
    const { data: createdCode, error: fetchNewError } = await supabase
      .from('user_referral_codes')
      .select(`
        referral_code, 
        total_referrals, 
        total_rewards_earned,
        milestone_10_reached,
        milestone_50_reached,
        milestone_10_reward_claimed,
        milestone_50_reward_claimed
      `)
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
      totalRewards: createdCode.total_rewards_earned,
      milestone10Reached: createdCode.milestone_10_reached,
      milestone50Reached: createdCode.milestone_50_reached,
      milestone10RewardClaimed: createdCode.milestone_10_reward_claimed,
      milestone50RewardClaimed: createdCode.milestone_50_reward_claimed
    };
    
  } catch (error) {
    console.error('Enhanced referral service error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Get referral link for user (unchanged)
export const getReferralLink = (referralCode) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/?ref=${referralCode}`;
};

// Real-time subscription for referral updates
export const subscribeToReferralUpdates = (userId, callback) => {
  console.log('🔄 Setting up real-time referral updates for user:', userId);
  
  const subscription = supabase
    .channel('referral-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_referral_codes',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('📡 Real-time referral update received:', payload);
        callback(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'referrals',
        filter: `referrer_id=eq.${userId}`
      },
      (payload) => {
        console.log('📡 Real-time referral activity received:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return subscription;
};

// Unsubscribe from real-time updates
export const unsubscribeFromReferralUpdates = (subscription) => {
  if (subscription) {
    console.log('🔌 Unsubscribing from referral updates');
    supabase.removeChannel(subscription);
  }
};

// Get milestone progress for UI display
export const getMilestoneProgress = (totalReferrals) => {
  const milestones = [
    { target: 10, reward: 'Free Premium Month', icon: '🎁', color: 'text-yellow-400' },
    { target: 50, reward: 'OG Founders Pass', icon: '👑', color: 'text-purple-400' }
  ];
  
  return milestones.map(milestone => ({
    ...milestone,
    current: totalReferrals,
    remaining: Math.max(0, milestone.target - totalReferrals),
    completed: totalReferrals >= milestone.target,
    progress: Math.min(100, (totalReferrals / milestone.target) * 100)
  }));
};

// Format referral stats for display
export const formatReferralStats = (stats) => {
  return {
    ...stats,
    displayText: {
      referrals: `${stats.totalReferrals} friend${stats.totalReferrals !== 1 ? 's' : ''} referred`,
      credits: `${stats.totalRewards * 3} credits earned`,
      nextMilestone: stats.referralsTo10 > 0 
        ? `${stats.referralsTo10} more for free Premium month`
        : stats.referralsTo50 > 0
        ? `${stats.referralsTo50} more for OG Founders Pass`
        : 'All milestones reached! 🎉'
    }
  };
};
