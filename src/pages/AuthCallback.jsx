import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/database/customSupabaseClient';
import { motion } from 'framer-motion';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 AuthCallback: Starting auth callback process...');
        
        // Add timeout to prevent infinite waiting
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
        );
        
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (data.session) {
          console.log('🔐 AuthCallback: Session found, user authenticated:', data.session.user.email);
          setStatus('success');
          
          // 🎯 OPTION A: Process referral with 3 credits to both parties
          try {
            // Check for referral code in user metadata (from signup)
            const userMetadata = data.session.user.user_metadata;
            let referralCode = userMetadata?.referral_code;
            
            // If no referral code in metadata, check localStorage (from landing page)
            if (!referralCode) {
              referralCode = localStorage.getItem('pendingReferralCode');
              if (referralCode) {
                console.log('🎯 AuthCallback: Found referral code in localStorage:', referralCode);
                // Clear it from localStorage after processing
                localStorage.removeItem('pendingReferralCode');
              }
            }
            
            if (referralCode) {
              console.log('🎯 AuthCallback: Processing referral for code:', referralCode, 'user:', data.session.user.email);
              
              // Use the proper referral processing function that gives 3 credits to both parties
              const { data: referralResult, error: referralError } = await supabase.rpc('process_referral', {
                referral_code_input: referralCode,
                new_user_id: data.session.user.id
              });
              
              if (referralError) {
                console.error('❌ AuthCallback: Error processing referral:', referralError);
              } else if (referralResult && referralResult.success) {
                console.log('✅ AuthCallback: Referral processed successfully! Both users earned 3 credits!');
              } else {
                console.log('⚠️ AuthCallback: Referral processing failed:', referralResult?.error);
              }
            }
          } catch (referralError) {
            console.error('❌ AuthCallback: Error processing referral:', referralError);
          }
          
          // Check if there's saved form data that should trigger auto-processing
          const savedFormData = localStorage.getItem('chatInputFormData');
          if (savedFormData) {
            console.log('🔐 AuthCallback: Found saved form data, redirecting to chat-input for auto-submit');
            // Shorter delay since we fixed the auth context loading issue
            setTimeout(() => navigate('/chat-input'), 1500);
          } else {
            console.log('🔐 AuthCallback: No saved form data, redirecting to dashboard');
            setTimeout(() => navigate('/dashboard'), 1000);
          }
        } else {
          console.log('🔐 AuthCallback: No session found');
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        setStatus('error');
        // Shorter error timeout for better UX
        setTimeout(() => navigate('/'), 2000);
      }
    };

    // Add safety timeout for the entire callback process
    const safetyTimeout = setTimeout(() => {
      console.warn('🔐 AuthCallback: Safety timeout triggered, redirecting to home');
      setStatus('error');
      navigate('/');
    }, 15000);

    handleAuthCallback().finally(() => {
      clearTimeout(safetyTimeout);
    });

    return () => clearTimeout(safetyTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <motion.div 
        className="text-center max-w-md mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-4">Signing you in...</h2>
            <p className="text-gray-400">Just a moment while we get you ready for the tea ☕</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-2xl font-bold mb-4 text-green-400">Welcome back!</h2>
            <p className="text-gray-400">Redirecting you to get your receipts...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Oops!</h2>
            <p className="text-gray-400">Something went wrong. Taking you back home...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;