import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { supabase, withRetry, withTimeout } from '@/lib/database/customSupabaseClient';
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
  const [userData, setUserData] = useState(null); // Cache user data to avoid duplicate queries

  // Helper function to fetch user data with retry and timeout
  const fetchUserData = useCallback(async (userId, email) => {
    if (!userId) return null;
    
    try {
      const isOwner = email === 'piet@virtualsatchel.com' || email === 'piet@pietmarie.com';
      
      // For development, return owner status immediately to avoid database issues
      if (process.env.NODE_ENV === 'development' && isOwner) {
        console.log('🚀 DEV MODE: Giving premium access to owner:', email);
        return { subscription_status: 'yearly', credits_remaining: 999999 };
      }
      
      const { data, error } = await withTimeout(
        withRetry(async () => {
          return await supabase
            .from('users')
            .select('subscription_status, credits_remaining')
            .eq('id', userId)
            .single();
        }),
        3000 // Reduced timeout to 3 seconds
      );
      
      if (error && error.code === 'PGRST116') {
        // User doesn't exist in users table - create them
        console.log('Creating user record for:', email);
        try {
          await withTimeout(
            supabase
              .from('users')
              .insert({
                id: userId,
                email: email,
                subscription_status: isOwner ? 'yearly' : 'free',
                credits_remaining: isOwner ? 999999 : 1,
                last_free_receipt_date: new Date().toISOString().split('T')[0]
              }),
            3000
          );
        } catch (insertError) {
          console.error('Error creating user record:', insertError);
          // Return fallback data even if insert fails
        }
        return { subscription_status: isOwner ? 'yearly' : 'free', credits_remaining: isOwner ? 999999 : 1 };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Return owner status as fallback
      return { subscription_status: (email === 'piet@virtualsatchel.com' || email === 'piet@pietmarie.com') ? 'yearly' : 'free' };
    }
  }, []);

  useEffect(() => {
    // Simple, clean auth setup
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Simple owner check - no database calls to prevent loops
          const isOwner = session.user.email === 'piet@virtualsatchel.com' || session.user.email === 'piet@pietmarie.com';
          console.log('🔐 Auth Debug:', { 
            email: session.user.email, 
            isOwner, 
            premiumStatus: isOwner 
          });
          setIsPremium(isOwner);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Minimal auth state change handler to prevent loops
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const isOwner = session.user.email === 'piet@virtualsatchel.com' || session.user.email === 'piet@pietmarie.com';
          setIsPremium(isOwner);
        } else {
          setIsPremium(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [toast, fetchUserData, referralCode]);

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second safety timeout

    return () => clearTimeout(safetyTimeout);
  }, [loading]);

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
      
      // For development, use localhost redirect
      const redirectUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5174/auth/callback'
        : `${window.location.origin}/auth/callback`;
      
      console.log('Using redirect URL:', redirectUrl);
      
      const { data, error } = await withTimeout(
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'select_account consent',
            },
          },
        }),
        10000 // 10 second timeout for OAuth initiation
      );

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
        description: err.message === 'Operation timed out' 
          ? "Sign-in is taking too long. Please try again." 
          : "Please try again in a moment.",
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