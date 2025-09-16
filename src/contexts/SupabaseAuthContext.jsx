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
      // In development mode, show correct plan types but give 3 credits for testing
      if (process.env.NODE_ENV === 'development') {
        const isOwner = email === 'piet@virtualsatchel.com' || email === 'piet@pietmarie.com';
        console.log('🚀 DEV MODE: Giving 3 credits to all accounts for testing:', email);
        
        if (isOwner) {
          return { subscription_status: 'yearly', credits_remaining: 3 }; // Real OG Founders
        } else {
          return { subscription_status: 'free', credits_remaining: 3 }; // Regular users
        }
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
                credits_remaining: isOwner ? 999999 : 3,
                last_free_receipt_date: new Date().toISOString().split('T')[0]
              }),
            3000
          );
        } catch (insertError) {
          console.error('Error creating user record:', insertError);
          // Return fallback data even if insert fails
        }
        return { subscription_status: isOwner ? 'yearly' : 'free', credits_remaining: isOwner ? 999999 : 3 };
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
          try {
            // Check actual database subscription status with timeout
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Database query timeout')), 5000)
            );
            
            const queryPromise = supabase
              .from('users')
              .select('subscription_status')
              .eq('id', session.user.id)
              .single();
            
            const { data: userData, error } = await Promise.race([queryPromise, timeoutPromise]);
            
            if (error) {
              console.warn('🔐 Initial session database query error:', error, 'Defaulting to free tier');
              setIsPremium(false);
            } else {
              const actualIsPremium = userData?.subscription_status === 'premium' || 
                                     userData?.subscription_status === 'yearly' || 
                                     userData?.subscription_status === 'founder';
              
              console.log('🔐 Initial session Auth Debug:', { 
                email: session.user.email, 
                databaseStatus: userData?.subscription_status,
                actualIsPremium 
              });
              setIsPremium(actualIsPremium);
            }
          } catch (error) {
            console.warn('🔐 Initial session database query failed:', error, 'Defaulting to free tier');
            setIsPremium(false);
          }
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
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email || 'No user');
        
        // Only process certain events to prevent infinite loops
        if (['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'INITIAL_SESSION'].includes(event)) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              // Check actual database subscription status with timeout
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database query timeout')), 5000)
              );
              
              const queryPromise = supabase
                .from('users')
                .select('subscription_status')
                .eq('id', session.user.id)
                .single();
              
              const { data: userData, error } = await Promise.race([queryPromise, timeoutPromise]);
              
              if (error) {
                console.warn('🔐 Database query error:', error, 'Defaulting to free tier');
                setIsPremium(false);
              } else {
                const actualIsPremium = userData?.subscription_status === 'premium' || 
                                       userData?.subscription_status === 'yearly' || 
                                       userData?.subscription_status === 'founder';
                
                setIsPremium(actualIsPremium);
                console.log('🔐 User authenticated:', session.user.email, 'Database Status:', userData?.subscription_status, 'Premium:', actualIsPremium);
              }
            } catch (error) {
              console.warn('🔐 Database query failed:', error, 'Defaulting to free tier');
              setIsPremium(false);
            }
          } else {
            setIsPremium(false);
            console.log('🔐 User signed out');
          }
          
          // Always set loading to false regardless of database query success/failure
          setLoading(false);
        }
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

    // In development mode, try to sign in immediately after signup
    if (process.env.NODE_ENV === 'development') {
      // Don't require email confirmation in dev mode
      options.emailRedirectTo = undefined;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      console.error('🔐 Signup error:', error);
      
      // Handle specific error types
      let title = "Sign up Failed";
      let description = error.message || "Something went wrong";
      
      if (error.message?.toLowerCase().includes('rate') || 
          error.message?.toLowerCase().includes('limit') ||
          error.status === 429) {
        title = "Too Many Requests";
        description = "We're experiencing high demand! Please wait a few minutes and try again. Your account is important to us! 🙏";
      } else if (error.status === 500 || error.message?.toLowerCase().includes('internal server error')) {
        title = "Service Temporarily Unavailable";
        description = "Our servers are taking a quick coffee break ☕. Please try again in a few minutes!";
      } else if (error.message?.toLowerCase().includes('email') && error.message?.toLowerCase().includes('already')) {
        title = "Account Already Exists";
        description = "This email is already registered. Try signing in instead, or use 'Forgot Password' if needed.";
      }
      
      toast({
        variant: "destructive",
        title,
        description,
        duration: 8000, // Longer duration for important messages
      });
    } else {
      // Check if user needs email confirmation
      if (data?.user && !data?.session) {
        // User created but needs email confirmation
        toast({
          title: "Check your email!",
          description: "We've sent a confirmation link to your email address.",
        });
      } else if (data?.session) {
        // User is immediately signed in (development mode)
        toast({
          title: "Account Created!",
          description: "You're now signed in and ready to go!",
        });
      } else {
        // Fallback message
        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account.",
        });
      }
    }

    return { data, error };
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
      
      // Check if we're in development mode
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        console.log('🚨 DEVELOPMENT MODE: Using mock auth instead of Google OAuth');
        
        // Mock authentication for localhost development
        try {
          const mockUser = {
            id: '00000000-0000-0000-0000-000000000001', // Valid UUID for development
            email: 'dev@localhost.com',
            user_metadata: {
              full_name: 'Local Developer',
              email: 'dev@localhost.com'
            },
            app_metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated'
          };
          
          const mockSession = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            expires_at: Date.now() + 3600000,
            token_type: 'bearer',
            user: mockUser
          };
          
          // Simulate auth state change
          setTimeout(() => {
            setSession(mockSession);
            setUser(mockUser);
            setIsPremium(true); // Give premium for dev
            setLoading(false);
            console.log('🚨 LOCALHOST: Mock authentication completed');
            
            toast({
              title: "Development Mode Auth",
              description: "Signed in as dev@localhost.com",
            });
          }, 1000);
          
          return { data: { session: mockSession }, error: null };
        } catch (error) {
          console.error('Mock auth error:', error);
          return { error };
        }
      }
      
      // Production OAuth flow
      const redirectUrl = `${window.location.origin}/auth/callback`;
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