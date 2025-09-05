import { supabase } from '@/lib/database/customSupabaseClient';

export class SubscriptionService {
  
  /**
   * Get user's current subscription status and credits
   */
  static async getUserStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_status, credits_remaining, stripe_customer_id, stripe_subscription_id, last_free_receipt_date')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user status:', error);
        return { 
          subscription_status: 'free', 
          credits_remaining: 1, 
          can_generate_receipt: false 
        };
      }

      // Check if user can generate a receipt
      const can_generate_receipt = this.canGenerateReceipt(data);

      return {
        ...data,
        can_generate_receipt
      };
    } catch (error) {
      console.error('getUserStatus error:', error);
      return { 
        subscription_status: 'free', 
        credits_remaining: 1, 
        can_generate_receipt: false 
      };
    }
  }

  /**
   * Check if user can generate a receipt based on their subscription and credits
   */
  static canGenerateReceipt(userData) {
    if (!userData) return false;

    const { subscription_status, credits_remaining, last_free_receipt_date } = userData;
    const today = new Date().toISOString().split('T')[0];

    switch (subscription_status) {
      case 'premium':
      case 'founder':
        return true; // Unlimited
      
      case 'emergency':
        return credits_remaining > 0;
      
      case 'free':
      default:
        // Free users get 1 per day
        return last_free_receipt_date !== today;
    }
  }

  /**
   * Consume a credit (for free/emergency users) or track usage (premium users)
   */
  static async consumeCredit(userId) {
    try {
      // Use the stored function for credit consumption
      const { data, error } = await supabase.rpc('consume_credit', {
        user_uuid: userId
      });

      if (error) {
        console.error('Error consuming credit:', error);
        return { success: false, error: error.message };
      }

      return { success: data, remaining_credits: null };
    } catch (error) {
      console.error('consumeCredit error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add emergency pack credits to user account
   */
  static async addEmergencyCredits(userId) {
    try {
      const { error } = await supabase.rpc('add_emergency_credits', {
        user_uuid: userId
      });

      if (error) {
        console.error('Error adding emergency credits:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('addEmergencyCredits error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update subscription status (called from Stripe webhooks)
   */
  static async updateSubscriptionStatus(userId, status, stripeSubscriptionId = null) {
    try {
      const { error } = await supabase.rpc('update_subscription_status', {
        user_uuid: userId,
        new_status: status,
        stripe_sub_id: stripeSubscriptionId
      });

      if (error) {
        console.error('Error updating subscription status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('updateSubscriptionStatus error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Store a truth receipt in the database
   */
  static async storeReceipt(userId, message, analysisResult, receiptType = 'truth') {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .insert({
          user_id: userId,
          message: message,
          analysis_result: analysisResult,
          receipt_type: receiptType,
          tokens_used: this.estimateTokens(message, analysisResult)
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing receipt:', error);
        return { success: false, error: error.message };
      }

      return { success: true, receipt: data };
    } catch (error) {
      console.error('storeReceipt error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's receipt history
   */
  static async getReceiptHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('id, message, analysis_result, receipt_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching receipt history:', error);
        return { success: false, error: error.message };
      }

      return { success: true, receipts: data };
    } catch (error) {
      console.error('getReceiptHistory error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get subscription events for user (for debugging/support)
   */
  static async getSubscriptionEvents(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('subscription_events')
        .select('event_type, subscription_data, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching subscription events:', error);
        return { success: false, error: error.message };
      }

      return { success: true, events: data };
    } catch (error) {
      console.error('getSubscriptionEvents error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Estimate token usage for cost tracking
   */
  static estimateTokens(message, analysisResult) {
    // Rough estimation: input message + analysis response
    const inputTokens = Math.ceil(message.length / 4);
    const outputTokens = analysisResult ? Math.ceil(JSON.stringify(analysisResult).length / 4) : 0;
    return inputTokens + outputTokens;
  }

  /**
   * Check if user needs to upgrade (for conversion tracking)
   */
  static async checkUpgradeNeeded(userId) {
    const userStatus = await this.getUserStatus(userId);
    
    if (!userStatus.can_generate_receipt) {
      return {
        needs_upgrade: true,
        reason: userStatus.subscription_status === 'free' ? 'daily_limit' : 'no_credits',
        suggested_plan: userStatus.subscription_status === 'free' ? 'emergency' : 'premium'
      };
    }

    return { needs_upgrade: false };
  }

  /**
   * Get user analytics for dashboard
   */
  static async getUserAnalytics(userId) {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_receipts_generated, created_at, subscription_status')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { data: receiptsData, error: receiptsError } = await supabase
        .from('receipts')
        .select('created_at, receipt_type')
        .eq('user_id', userId);

      if (receiptsError) throw receiptsError;

      // Calculate analytics
      const totalReceipts = userData.total_receipts_generated || 0;
      const thisMonth = receiptsData.filter(r => {
        const receiptDate = new Date(r.created_at);
        const now = new Date();
        return receiptDate.getMonth() === now.getMonth() && 
               receiptDate.getFullYear() === now.getFullYear();
      }).length;

      const accountAge = Math.floor(
        (new Date() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24)
      );

      return {
        success: true,
        analytics: {
          totalReceipts,
          thisMonth,
          accountAge,
          subscription_status: userData.subscription_status,
          receiptTypes: {
            truth: receiptsData.filter(r => r.receipt_type === 'truth').length,
            emergency: receiptsData.filter(r => r.receipt_type === 'emergency').length
          }
        }
      };
    } catch (error) {
      console.error('getUserAnalytics error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SubscriptionService;