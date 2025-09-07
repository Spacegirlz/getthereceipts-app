import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/database/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { initializeUserCredits, processReferral } from '@/lib/services/creditsSystem';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const { referralCode } = useAuthModal();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('subscription_status, credits_remaining')
            .eq('id', session.user.id)
            .single();
          
          // Owner email gets automatic premium access
          const isOwner = session.user.email === 'piet@virtualsatchel.com';
          
          if (error && error.code === 'PGRST116') {
            // User doesn't exist in users table - create them
            console.log('Creating user record for:', session.user.email);
            await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                subscription_status: isOwner ? 'yearly' : 'free',
                credits_remaining: isOwner ? 999999 : 1,
                last_free_receipt_date: new Date().toISOString().split('T')[0]
              });
            setIsPremium(isOwner);
          } else {
            setIsPremium(isOwner || (data && ['premium', 'yearly'].includes(data.subscription_status)));
          }
        } catch (_) {
          // Owner email gets automatic premium access even if database query fails
          setIsPremium(session?.user?.email === 'piet@virtualsatchel.com');
        }
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (_event === "SIGNED_IN") {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
          
          // Initialize credits for new user
          if (session?.user) {
            await initializeUserCredits(session.user.id);
            
            // Process referral if there's a referral code
            if (referralCode && session.user.created_at) {
              const userCreatedAt = new Date(session.user.created_at);
              const now = new Date();
              const timeDiff = now - userCreatedAt;
              
              // Only process referral for users created within the last 5 minutes (fresh signups)
              if (timeDiff < 5 * 60 * 1000) {
                const success = await processReferral(referralCode, session.user.id);
                if (success) {
                  toast({
                    title: "Bonus Credits! 🎉",
                    description: "You earned +3 bonus credits for using a referral link!",
                  });
                }
              }
            }
          }
          // refresh premium flag
          if (session?.user) {
            try {
              const { data, error } = await supabase
                .from('users')
                .select('subscription_status, credits_remaining')
                .eq('id', session.user.id)
                .single();
              
              // Owner email gets automatic premium access
              const isOwner = session.user.email === 'piet@virtualsatchel.com';
              
              if (error && error.code === 'PGRST116') {
                // User doesn't exist in users table - create them
                console.log('Creating user record for:', session.user.email);
                await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    subscription_status: isOwner ? 'yearly' : 'free',
                    credits_remaining: isOwner ? 999999 : 1,
                    last_free_receipt_date: new Date().toISOString().split('T')[0]
                  });
                setIsPremium(isOwner);
              } else {
                setIsPremium(isOwner || (data && ['premium', 'yearly'].includes(data.subscription_status)));
              }
            } catch (_) {
              // Owner email gets automatic premium access even if database query fails
              setIsPremium(session?.user?.email === 'piet@virtualsatchel.com');
            }
          } else {
            setIsPremium(false);
          }
        } else if (_event === "SIGNED_OUT") {
          setIsPremium(false);
        }
        
        // Always ensure loading is false after auth state changes
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = useCallback(async (email, password) => {
    const options = {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    };
    if (referralCode) {
      options.data = { referral_code: referralCode };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    } else {
       toast({
        title: "Check your email!",
        description: "We've sent a confirmation link to your email address.",
      });
    }

    return { error };
  }, [toast, referralCode]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    try {
      console.log('Starting Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        toast({
          variant: "destructive",
          title: "Google Sign-in Failed", 
          description: error.message || "Something went wrong with Google sign-in",
        });
      } else {
        console.log('Google OAuth initiated successfully');
      }
      
      return { data, error };
    } catch (err) {
      console.error('Sign-in preparation error:', err);
      toast({
        variant: "destructive",
        title: "Google Sign-in Failed",
        description: "Please try again in a moment.",
      });
      return { error: err };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isPremium,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }), [user, session, loading, isPremium, signUp, signIn, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};