/**
 * Supabase Email Integration with Resend
 * This service handles email sending through Supabase auth events
 */

import { supabase } from '../database/customSupabaseClient.js';
import { 
  sendSignupConfirmation, 
  sendPasswordReset, 
  sendWelcomeEmail,
  sendReceiptNotification,
  sendReferralNotification 
} from './emailService.js';

/**
 * Handle user signup - send confirmation email via Resend
 */
export async function handleUserSignup(user, confirmationUrl) {
  try {
    console.log('📧 Sending signup confirmation via Resend...');
    
    const result = await sendSignupConfirmation(
      user.email, 
      confirmationUrl, 
      user.user_metadata?.full_name || user.user_metadata?.name
    );
    
    if (result.success) {
      console.log('✅ Signup confirmation sent via Resend:', result.messageId);
      
      // Log the email event in Supabase
      await logEmailEvent(user.id, 'signup_confirmation', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error('Failed to send signup confirmation');
    }
  } catch (error) {
    console.error('❌ Error sending signup confirmation:', error);
    
    // Fallback to Supabase default email
    console.log('🔄 Falling back to Supabase default email...');
    return { success: false, fallback: true, error: error.message };
  }
}

/**
 * Handle password reset - send reset email via Resend
 */
export async function handlePasswordReset(user, resetUrl) {
  try {
    console.log('📧 Sending password reset via Resend...');
    
    const result = await sendPasswordReset(
      user.email, 
      resetUrl, 
      user.user_metadata?.full_name || user.user_metadata?.name
    );
    
    if (result.success) {
      console.log('✅ Password reset sent via Resend:', result.messageId);
      
      // Log the email event in Supabase
      await logEmailEvent(user.id, 'password_reset', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error('Failed to send password reset');
    }
  } catch (error) {
    console.error('❌ Error sending password reset:', error);
    
    // Fallback to Supabase default email
    console.log('🔄 Falling back to Supabase default email...');
    return { success: false, fallback: true, error: error.message };
  }
}

/**
 * Handle successful email confirmation - send welcome email
 */
export async function handleEmailConfirmed(user) {
  try {
    console.log('📧 Sending welcome email via Resend...');
    
    const result = await sendWelcomeEmail(
      user.email, 
      user.user_metadata?.full_name || user.user_metadata?.name
    );
    
    if (result.success) {
      console.log('✅ Welcome email sent via Resend:', result.messageId);
      
      // Log the email event in Supabase
      await logEmailEvent(user.id, 'welcome_email', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error('Failed to send welcome email');
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send receipt notification email
 */
export async function sendReceiptEmail(userId, receiptData) {
  try {
    // Get user data from Supabase
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new Error('User not found');
    }
    
    console.log('📧 Sending receipt notification via Resend...');
    
    const result = await sendReceiptNotification(
      user.email, 
      receiptData, 
      user.user_metadata?.full_name || user.user_metadata?.name
    );
    
    if (result.success) {
      console.log('✅ Receipt notification sent via Resend:', result.messageId);
      
      // Log the email event in Supabase
      await logEmailEvent(userId, 'receipt_notification', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error('Failed to send receipt notification');
    }
  } catch (error) {
    console.error('❌ Error sending receipt notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send referral notification email
 */
export async function sendReferralEmail(userId, referrerName) {
  try {
    // Get user data from Supabase
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new Error('User not found');
    }
    
    console.log('📧 Sending referral notification via Resend...');
    
    const result = await sendReferralNotification(
      user.email, 
      referrerName, 
      user.user_metadata?.full_name || user.user_metadata?.name
    );
    
    if (result.success) {
      console.log('✅ Referral notification sent via Resend:', result.messageId);
      
      // Log the email event in Supabase
      await logEmailEvent(userId, 'referral_notification', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error('Failed to send referral notification');
    }
  } catch (error) {
    console.error('❌ Error sending referral notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Log email events in Supabase for tracking
 */
async function logEmailEvent(userId, emailType, messageId) {
  try {
    const { error } = await supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: emailType,
        message_id: messageId,
        sent_at: new Date().toISOString(),
        provider: 'resend'
      });
    
    if (error) {
      console.error('Failed to log email event:', error);
    }
  } catch (error) {
    console.error('Error logging email event:', error);
  }
}

/**
 * Get email delivery status from Resend
 */
export async function getEmailStatus(messageId) {
  try {
    // This would require Resend's API to check delivery status
    // For now, we'll return a basic status
    return {
      messageId,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting email status:', error);
    return { error: error.message };
  }
}

/**
 * Test the email integration
 */
export async function testEmailIntegration() {
  try {
    console.log('🧪 Testing Supabase + Resend email integration...');
    
    // Test with a mock user
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User'
      }
    };
    
    const mockConfirmationUrl = 'https://www.getthereceipts.com/auth/confirm?token=test';
    
    const result = await handleUserSignup(mockUser, mockConfirmationUrl);
    
    if (result.success) {
      console.log('✅ Email integration test successful!');
      return { success: true, messageId: result.messageId };
    } else {
      console.log('❌ Email integration test failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Email integration test error:', error);
    return { success: false, error: error.message };
  }
}

