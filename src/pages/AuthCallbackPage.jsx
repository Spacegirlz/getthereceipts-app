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
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      const errorDescription = url.searchParams.get('error_description');

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: errorDescription || "An unknown error occurred during authentication.",
        });
        navigate(`/?error=${encodeURIComponent(errorDescription || 'unknown_error')}`);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: exchangeError.message,
          });
          navigate(`/?error=${encodeURIComponent(exchangeError.message)}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        // This handles the implicit flow (from email link) which uses a hash
        const hashParams = new URLSearchParams(url.hash.substring(1));
        if (hashParams.has('access_token')) {
          // The onAuthStateChange listener in SupabaseAuthContext will handle this
          // We just need to navigate to the dashboard
          navigate('/dashboard');
        } else {
          // No code and no hash, something is wrong
          toast({
            variant: "destructive",
            title: "Invalid Callback",
            description: "No authentication code or token found.",
          });
          navigate('/');
        }
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