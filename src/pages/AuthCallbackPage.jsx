import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/database/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleAuthCallback = async () => {
      try {
        // Add more debug logging for mobile
        console.log('Starting auth callback, user agent:', navigator.userAgent);
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        console.log('Auth callback:', { code: !!code, error, errorDescription });

        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: errorDescription || "An unknown error occurred during authentication.",
          });
          navigate(`/?error=${encodeURIComponent(errorDescription || 'unknown_error')}`);
          return;
        }

        if (code) {
          console.log('Exchanging code for session...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            toast({
              variant: "destructive",
              title: "Authentication Failed",
              description: exchangeError.message,
            });
            navigate(`/?error=${encodeURIComponent(exchangeError.message)}`);
          } else {
            console.log('Code exchange successful, user:', data.user?.email);
            // Check if user has saved form data and should return to receipts processing
            const hasSavedFormData = localStorage.getItem('chatInputFormData');
            if (hasSavedFormData) {
              console.log('🚀 Auth Callback: Found saved form data, setting auto-submit flag and redirecting to receipts');
              localStorage.setItem('shouldAutoSubmit', 'true');
              setTimeout(() => navigate('/receipts'), 1000);
            } else {
              // Check if user was trying to access a specific page before auth
              const postAuthRedirect = localStorage.getItem('postAuthRedirect');
              if (postAuthRedirect) {
                console.log('🚀 Auth Callback: Found post-auth redirect destination:', postAuthRedirect);
                localStorage.removeItem('postAuthRedirect'); // Clear it after use
                setTimeout(() => navigate(postAuthRedirect), 1000);
              } else {
                console.log('🚀 Auth Callback: No saved form data or redirect, redirecting to dashboard');
                setTimeout(() => navigate('/dashboard'), 1000);
              }
            }
          }
        } else {
          // This handles the implicit flow (from email link) which uses a hash
          const hashParams = new URLSearchParams(url.hash.substring(1));
          console.log('Hash params:', Object.fromEntries(hashParams));
          
          if (hashParams.has('access_token')) {
            console.log('Found access token in hash');
            // Check if user has saved form data and should return to receipts processing
            const hasSavedFormData = localStorage.getItem('chatInputFormData');
            if (hasSavedFormData) {
              console.log('🚀 Auth Callback: Found saved form data, setting auto-submit flag and redirecting to receipts');
              localStorage.setItem('shouldAutoSubmit', 'true');
              setTimeout(() => navigate('/receipts'), 1000);
            } else {
              // Check if user was trying to access a specific page before auth
              const postAuthRedirect = localStorage.getItem('postAuthRedirect');
              if (postAuthRedirect) {
                console.log('🚀 Auth Callback: Found post-auth redirect destination:', postAuthRedirect);
                localStorage.removeItem('postAuthRedirect'); // Clear it after use
                setTimeout(() => navigate(postAuthRedirect), 1000);
              } else {
                console.log('🚀 Auth Callback: No saved form data or redirect, redirecting to dashboard');
                setTimeout(() => navigate('/dashboard'), 1000);
              }
            }
          } else {
            // No code and no hash, something is wrong
            console.error('No auth code or token found');
            toast({
              variant: "destructive",
              title: "Invalid Callback",
              description: "No authentication code or token found.",
            });
            navigate('/');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An unexpected error occurred.",
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <Loader2 className="h-16 w-16 animate-spin text-purple-400 mb-4" />
      <h1 className="text-2xl font-bold">Finalizing sign in...</h1>
      <p className="text-gray-400">Please wait, we're redirecting you.</p>
    </div>
  );
};

export default AuthCallbackPage;