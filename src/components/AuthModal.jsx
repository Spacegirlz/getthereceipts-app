import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { supabase } from '@/lib/database/customSupabaseClient';

const AuthModal = () => {
    const { isOpen, closeModal, view, setView } = useAuthModal();
    const { signUp, signIn, signInWithGoogle, user } = useAuth();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showResendConfirmation, setShowResendConfirmation] = useState(false);
    const [referralId, setReferralId] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.rewardful) {
            window.rewardful('ready', function() {
                if (window.Rewardful && window.Rewardful.referral) {
                    setReferralId(window.Rewardful.referral);
                    console.log('Rewardful referral detected:', window.Rewardful.referral);
                }
            });
        }
        
        // Also check URL parameters for referral
        const urlParams = new URLSearchParams(window.location.search);
        const referralParam = urlParams.get('via') || urlParams.get('ref') || urlParams.get('referral');
        if (referralParam) {
            setReferralId(referralParam);
            console.log('Referral detected from URL:', referralParam);
        }
    }, []);

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast({
                variant: "destructive",
                title: "Email Required",
                description: "Please enter your email address first."
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback`,
            });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message
                });
            } else {
                toast({
                    title: "Password reset sent",
                    description: "Check your email and click the link to get back to decoding."
                });
                setShowForgotPassword(false);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again."
            });
        }
        setLoading(false);
    };

    const handleResendConfirmation = async () => {
        if (!email) {
            toast({
                variant: "destructive",
                title: "Email Required",
                description: "Please enter your email address first."
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message
                });
            } else {
                toast({
                    title: "Confirmation email sent! 📧",
                    description: "Check your email and click the link to get back to decoding.",
                    duration: 5000
                });
                setShowResendConfirmation(false);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again."
            });
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (view === 'sign_in') {
            const { error } = await signIn(email, password);
            if (!error) {
                closeModal();
            }
        } else {
            const { data, error } = await signUp(email, password);
            if (!error) {
                // Check if user needs email confirmation
                if (data?.user && !data?.session) {
                    // User created but needs email confirmation
                    toast({ 
                        title: 'Check your email! 📧', 
                        description: 'You\'re just one step away from decoding the tea. Click the confirmation link we sent.',
                        duration: 8000
                    });
                    closeModal();
                } else if (data?.session) {
                    // User is immediately signed in (development mode)
                    toast({ 
                        title: 'Welcome aboard! 👋', 
                        description: 'You\'re officially in. Ready to decode some texts?',
                        duration: 5000
                    });
                    
                    // Track conversion with Rewardful for immediate signup
                    if (window.rewardful && email && referralId) {
                        try {
                            window.rewardful('convert', { email: email });
                            console.log('Rewardful conversion tracked for signup:', email);
                        } catch (error) {
                            console.warn('Rewardful conversion tracking failed:', error);
                        }
                    }
                    
                    closeModal();
                } else {
                    // Fallback message
                    toast({ 
                        title: 'Account created!', 
                        description: 'Check your email to confirm your account and start decoding.',
                        duration: 5000
                    });
                    closeModal();
                }
            }
        }
        setLoading(false);
    };
    
    const handleGoogleSignIn = async () => {
        if (loading) return; // Prevent double-clicks
        
        setLoading(true);
        try {
            const { error } = await signInWithGoogle();
            
            if (!error) {
                // Success - the OAuth redirect should happen
                console.log('Google sign-in initiated successfully');
            } else {
                setLoading(false);
            }
            
            // Reset loading state after timeout as fallback
            setTimeout(() => {
                setLoading(false);
            }, 8000);
            
        } catch (error) {
            console.error('Google sign in error:', error);
            setLoading(false);
            toast({
                variant: "destructive",
                title: "Google Sign-in Failed",
                description: "Please try again or use email/password.",
            });
        }
    };

    if (user || !isOpen) {
        return null;
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-md meme-card text-white z-[110]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center gradient-text">
                        {view === 'sign_in' ? 'Welcome Back!' : 'Create Your Account'}
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        {view === 'sign_in' ? 'Welcome back! Ready to decode some texts?' : 'Join us and start decoding the tea.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                     <Button
                        variant="outline"
                        className="w-full bg-white text-black hover:bg-gray-200 border-2 border-green-400 shadow-lg"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        {view === 'sign_up' ? 'Sign up with Google (Recommended)' : 'Sign in with Google'}
                    </Button>
                    
                    {view === 'sign_up' && (
                        <div className="text-center">
                            <p className="text-xs text-green-400 font-medium">
                                ⚡ Instant signup • No email confirmation needed
                            </p>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" >Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-gray-800 border-gray-700" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={handlePasswordChange} 
                                required 
                                className="bg-gray-800 border-gray-700" 
                            />
                            {view === 'sign_up' && password && (
                                <div className="mt-2">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 w-full rounded ${
                                                    level <= passwordStrength
                                                        ? passwordStrength <= 2
                                                            ? 'bg-red-500'
                                                            : passwordStrength <= 3
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                        : 'bg-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs mt-1 text-gray-400">
                                        {passwordStrength <= 2 && 'Weak password'}
                                        {passwordStrength === 3 && 'Medium password'}
                                        {passwordStrength >= 4 && 'Strong password'}
                                    </p>
                                </div>
                            )}
                            {view === 'sign_in' && (
                                <div className="flex justify-between mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs text-blue-400 hover:underline"
                                    >
                                        Forgot your password?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowResendConfirmation(true)}
                                        className="text-xs text-purple-400 hover:underline"
                                    >
                                        Resend confirmation?
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {view === 'sign_up' && (
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="marketing-consent"
                                        checked={marketingConsent}
                                        onChange={(e) => setMarketingConsent(e.target.checked)}
                                        className="mt-1 h-4 w-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <div>
                                        <label htmlFor="marketing-consent" className="text-sm text-gray-300 cursor-pointer">
                                            I'd like to receive updates, tips, and promotions about Get The Receipts (optional)
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            You can unsubscribe anytime. We respect your privacy and comply with GDPR.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <Button type="submit" className="w-full viral-button" disabled={loading}>
                            {loading ? 'Processing...' : (view === 'sign_in' ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </form>
                </div>
                
                <p className="text-center text-sm text-gray-400">
                    {view === 'sign_in' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setView(view === 'sign_in' ? 'sign_up' : 'sign_in')} className="font-semibold text-blue-400 hover:underline">
                         {view === 'sign_in' ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </DialogContent>
        </Dialog>

        {/* Forgot Password Modal */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
            <DialogContent className="sm:max-w-md meme-card text-white z-[110]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center gradient-text">
                        Reset Your Password
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        Enter your email address and we'll send you a password reset link.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <Label htmlFor="reset-email">Email</Label>
                        <Input 
                            id="reset-email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="bg-gray-800 border-gray-700" 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowForgotPassword(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleForgotPassword}
                            disabled={loading || !email}
                            className="flex-1 viral-button"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Resend Confirmation Modal */}
        <Dialog open={showResendConfirmation} onOpenChange={setShowResendConfirmation}>
            <DialogContent className="sm:max-w-md meme-card text-white z-[110]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center gradient-text">
                        Resend Confirmation Email
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        Enter your email address and we'll send you a new confirmation link.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <Label htmlFor="resend-email">Email</Label>
                        <Input 
                            id="resend-email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="bg-gray-800 border-gray-700" 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowResendConfirmation(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleResendConfirmation}
                            disabled={loading || !email}
                            className="flex-1 viral-button"
                        >
                            {loading ? 'Sending...' : 'Resend Email'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default AuthModal;