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
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (data.session) {
          console.log('🔐 AuthCallback: Session found, user authenticated:', data.session.user.email);
          setStatus('success');
          
          // Check if there's saved form data that should trigger auto-processing
          const savedFormData = localStorage.getItem('chatInputFormData');
          if (savedFormData) {
            console.log('🔐 AuthCallback: Found saved form data, redirecting to chat-input for auto-submit');
            // Longer delay to ensure auth context fully propagates
            setTimeout(() => navigate('/chat-input'), 2500);
          } else {
            console.log('🔐 AuthCallback: No saved form data, redirecting to dashboard');
            setTimeout(() => navigate('/dashboard'), 2000);
          }
        } else {
          console.log('🔐 AuthCallback: No session found');
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        setStatus('error');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
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