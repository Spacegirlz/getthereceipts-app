import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import GoogleIcon from '@/components/icons/GoogleIcon';

const AuthModal = () => {
    const { isOpen, closeModal, view, setView } = useAuthModal();
    const { signUp, signIn, signInWithGoogle, user } = useAuth();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (view === 'sign_in') {
            const { error } = await signIn(email, password);
            if (!error) {
                closeModal();
            }
        } else {
            const { error } = await signUp(email, password);
             if (!error) {
                toast({ title: 'Account created!', description: 'Please check your email to verify your account.' });
                closeModal();
            }
        }
        setLoading(false);
    };
    
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            // The modal will close on redirect, so no need to setLoading(false) here
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
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-md meme-card text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center gradient-text">
                        {view === 'sign_in' ? 'Welcome Back!' : 'Create Your Account'}
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        {view === 'sign_in' ? 'Sign in to see your receipts and credits.' : 'Sign up to get your first 5 free receipts!'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                     <Button
                        variant="outline"
                        className="w-full bg-white text-black hover:bg-gray-200"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>

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
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-gray-800 border-gray-700" />
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
    );
};

export default AuthModal;