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
    const debugModal = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugModal') === '1';
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
                    
                    // Note: Conversion tracking happens on success page after payment, not on signup
                    
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
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <DialogContent className={`sm:max-w-md w-full max-h-[90vh] overflow-auto bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20 text-white ${debugModal ? 'ring-4 ring-red-500' : ''}`}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        {view === 'sign_in' ? 'Welcome Back!' : 'Create Your Account'}
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-300">
                        {view === 'sign_in' ? 'Welcome back! Ready to decode some texts?' : 'Join us and start decoding the tea.'}
                    </DialogDescription>
                </DialogHeader>
                {debugModal && (
                    <div className="text-xs text-red-400 mb-2">AuthModal mounted · view: {view}</div>
                )}

                <div className="flex flex-col gap-4 py-4">
                     <Button
                        variant="outline"
                        className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        {view === 'sign_up' ? 'Sign up with Google (Recommended)' : 'Sign in with Google'}
                    </Button>
                    
                    {view === 'sign_up' && (
                        <div className="text-center">
                            <p className="text-xs text-emerald-400 font-medium">
                                ⚡ Instant signup • No email confirmation needed
                            </p>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/8 backdrop-blur-sm px-2 text-gray-300">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20" />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={handlePasswordChange} 
                                required 
                                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20" 
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
                                        className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                    >
                                        Forgot your password?
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowResendConfirmation(true)}
                                        className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors"
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
                        
                        <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105" disabled={loading}>
                            {loading ? 'Processing...' : (view === 'sign_in' ? 'Sign In' : 'Sign Up')}
                        </Button>
                    </form>
                </div>
                
                <p className="text-center text-sm text-gray-300">
                    {view === 'sign_in' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setView(view === 'sign_in' ? 'sign_up' : 'sign_in')} className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                         {view === 'sign_in' ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </DialogContent>
        </Dialog>

        {/* Forgot Password Modal */}
        <Dialog open={showForgotPassword} onOpenChange={(open) => setShowForgotPassword(!!open)}>
            <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-auto bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        Reset Your Password
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-300">
                        Enter your email address and we'll send you a password reset link.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <Label htmlFor="reset-email" className="text-gray-300">Email</Label>
                        <Input 
                            id="reset-email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20" 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowForgotPassword(false)}
                            className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleForgotPassword}
                            disabled={loading || !email}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Resend Confirmation Modal */}
        <Dialog open={showResendConfirmation} onOpenChange={(open) => setShowResendConfirmation(!!open)}>
            <DialogContent className="sm:max-w-md w-full max-h-[90vh] overflow-auto bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        Resend Confirmation Email
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-300">
                        Enter your email address and we'll send you a new confirmation link.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <Label htmlFor="resend-email" className="text-gray-300">Email</Label>
                        <Input 
                            id="resend-email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20" 
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowResendConfirmation(false)}
                            className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            onClick={handleResendConfirmation}
                            disabled={loading || !email}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300"
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