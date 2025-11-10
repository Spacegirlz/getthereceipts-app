// Simple Coupon Service
import { supabase } from '@/lib/database/customSupabaseClient';

// Redeem a coupon code
export const redeemCoupon = async (couponCode, userId) => {
  try {
    console.log('🎫 Redeeming coupon:', couponCode, 'for user:', userId);
    
    // Call the database function to redeem coupon
    const { data, error } = await supabase.rpc('redeem_coupon', {
      coupon_code_input: couponCode.toUpperCase(),
      user_id_input: userId
    });
    
    if (error) {
      console.error('Coupon redemption error:', error);
      return {
        success: false,
        error: 'Failed to redeem coupon. Please try again.'
      };
    }
    
    if (!data.success) {
      // Provide user-friendly error messages
      let userMessage = data.error;
      
      if (data.error.includes('Premium users already have unlimited credits')) {
        userMessage = "🎉 You're already Premium! You have unlimited credits - no coupon needed!";
      } else if (data.error.includes('already used this coupon')) {
        userMessage = "❌ You've already used this coupon code. Each code can only be used once per account.";
      } else if (data.error.includes('Invalid coupon code')) {
        userMessage = "🔍 Coupon not found. Please check the spelling or try a different code. Some codes expire after limited uses.";
      } else if (data.error.includes('reached its usage limit')) {
        userMessage = "⏰ This coupon has reached its usage limit. Try a different code!";
      } else if (data.error.includes('expired')) {
        userMessage = "⏰ This coupon has expired. Try a different code!";
      }
      
      return {
        success: false,
        error: userMessage
      };
    }
    
    // Database function already updates credits, so we just return the result
    // The function returns new_credits in the response
    console.log('✅ Coupon redeemed successfully:', data);
    
    return {
      success: true,
      couponName: data.coupon_name,
      receiptsCount: data.receipts_count,
      isPremium: data.is_premium,
      remainingUses: data.remaining_uses,
      newCredits: data.new_credits || (data.previous_credits + data.credits_added),
      creditsAdded: data.credits_added || data.receipts_count
    };
    
  } catch (error) {
    console.error('Coupon service error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
};

// Get coupon usage stats (for admin)
export const getCouponStats = async (couponCode) => {
  try {
    const { data, error } = await supabase
      .from('coupon_codes')
      .select('code, coupon_name, usage_count, max_uses, is_active')
      .eq('code', couponCode.toUpperCase())
      .single();
    
    if (error) {
      console.error('Error fetching coupon stats:', error);
      return null;
    }
    
    return {
      code: data.code,
      name: data.coupon_name,
      used: data.usage_count,
      maxUses: data.max_uses,
      remaining: data.max_uses - data.usage_count,
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Coupon stats error:', error);
    return null;
  }
};

// Get all active coupons (for display)
export const getActiveCoupons = async () => {
  try {
    const { data, error } = await supabase
      .from('coupon_codes')
      .select('code, coupon_name, tier, receipts_count, is_premium, usage_count, max_uses')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active coupons:', error);
      return [];
    }
    
    return data.map(coupon => ({
      code: coupon.code,
      name: coupon.coupon_name,
      tier: coupon.tier,
      receiptsCount: coupon.receipts_count,
      isPremium: coupon.is_premium,
      used: coupon.usage_count,
      maxUses: coupon.max_uses,
      remaining: coupon.max_uses - coupon.usage_count
    }));
  } catch (error) {
    console.error('Active coupons error:', error);
    return [];
  }
};
