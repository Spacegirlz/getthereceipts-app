// Credits and Referral System - TEMPORARILY DISABLED
// This file provides mock data to prevent 404 errors while we fix the database structure

export const CREDIT_AMOUNTS = {
  FREE_USER_MONTHLY_DEEP_DIVES: 3,
  REFERRAL_BONUS: 3,
  SHARE_BONUS: 1,
  PREMIUM_UNLIMITED: -1,
};

// Mock functions that return fake data instead of querying missing tables
export const getUserCredits = async (userId) => {
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
};

export const initializeUserCredits = async (userId) => {
  return { success: true };
};

export const addCredits = async (userId, amount) => {
  return { success: true };
};

export const getUserReferralCode = async (userId) => {
  return {
    data: {
      referral_code: `GETRECEIPTS${Math.random().toString(36).substring(7).toUpperCase()}`,
      uses: 0
    },
    error: null
  };
};

export const getReferralStats = async (userId) => {
  return {
    data: {
      totalReferrals: 0,
      bonusCreditsEarned: 0
    },
    error: null
  };
};

export const createReferralCode = async (userId) => {
  return {
    data: {
      referral_code: `GETRECEIPTS${Math.random().toString(36).substring(7).toUpperCase()}`,
      uses: 0
    },
    error: null
  };
};

export const processReferral = async (userId, referralCode) => {
  return { success: false, message: 'Referral system temporarily disabled' };
};

export const processShareBonus = async (userId) => {
  return { success: true };
};

export const resetDeepDives = async (userId) => {
  return { success: true };
};