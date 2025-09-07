import { supabase } from '@/lib/database/customSupabaseClient';

/**
 * Save a receipt to the database if user has save_receipts enabled
 * @param {string} userId - The user's ID
 * @param {string} message - The original message
 * @param {Object} analysisResult - The analysis result (brutal, deepdive, immunity)
 * @param {string} receiptType - Type of receipt ('truth' or 'emergency')
 * @param {number} tokensUsed - Number of tokens used for analysis
 * @returns {Promise<Object>} - Success/error response
 */
export const saveReceiptToDatabase = async (userId, message, analysisResult, receiptType = 'truth', tokensUsed = 0) => {
  try {
    // First check if user has save_receipts enabled
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('save_receipts, subscription_status')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return { success: false, error: 'Failed to check user settings' };
    }

    // Check if user is premium and has saving enabled
    const isPremium = userData?.subscription_status === 'premium' || 
                     userData?.subscription_status === 'yearly' || 
                     userData?.subscription_status === 'founder';

    const hasSavingEnabled = userData?.save_receipts === true;

    if (!isPremium) {
      return { success: false, error: 'Receipt saving is a premium feature' };
    }

    if (!hasSavingEnabled) {
      return { success: false, error: 'User has receipt saving disabled' };
    }

    // Save the receipt to database
    const { data: receiptData, error: receiptError } = await supabase
      .from('receipts')
      .insert([
        {
          user_id: userId,
          message,
          analysis_result: analysisResult,
          receipt_type: receiptType,
          tokens_used: tokensUsed
        }
      ])
      .select()
      .single();

    if (receiptError) {
      console.error('Error saving receipt:', receiptError);
      return { success: false, error: 'Failed to save receipt' };
    }

    return { success: true, data: receiptData };
  } catch (error) {
    console.error('Unexpected error in saveReceiptToDatabase:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

/**
 * Check if user can save receipts (premium + setting enabled)
 * @param {string} userId - The user's ID
 * @returns {Promise<boolean>} - Whether user can save receipts
 */
export const canUserSaveReceipts = async (userId) => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('save_receipts, subscription_status')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking user save receipts status:', error);
      return false;
    }

    const isPremium = userData?.subscription_status === 'premium' || 
                     userData?.subscription_status === 'yearly' || 
                     userData?.subscription_status === 'founder';

    return isPremium && userData?.save_receipts === true;
  } catch (error) {
    console.error('Unexpected error in canUserSaveReceipts:', error);
    return false;
  }
};