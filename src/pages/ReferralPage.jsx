import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Gift, Zap, Star, Clock, Heart, Copy, Share2, Users, Award } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { getUserReferralCode, processReferral, getReferralLink } from '@/lib/services/referralService';
import { useToast } from '@/components/ui/use-toast';
import ReferralQRCode from '@/components/ReferralQRCode';

const ReferralPage = () => {
  console.log('🚀 ReferralPage component mounted');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { toast } = useToast();
  
  console.log('👤 ReferralPage user from useAuth:', user);
  
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({ totalReferrals: 0, totalRewards: 0 });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Emergency fallback - set loading to false after 3 seconds no matter what
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      console.log('🚨 Emergency timeout - forcing loading to false');
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(emergencyTimeout);
  }, []);

  // Check if this is a referral link
  const incomingCode = searchParams.get('code');

  useEffect(() => {
    console.log('🔄 ReferralPage useEffect triggered, user:', user);
    
    const loadReferralData = async () => {
      console.log('📊 Starting loadReferralData, user:', user);
      try {
        if (user) {
          console.log('👤 User exists, calling getUserReferralCode...');
          // Get user's referral code
          const result = await getUserReferralCode(user.id);
          console.log('📋 getUserReferralCode result:', result);
          if (result.success) {
            setReferralCode(result.referralCode);
            setReferralLink(getReferralLink(result.referralCode));
            setStats({
              totalReferrals: result.totalReferrals,
              totalRewards: result.totalRewards
            });
          }
        } else {
          console.log('❌ No user, showing public content');
        }
      } catch (error) {
        console.error('❌ Error loading referral data:', error);
      } finally {
        console.log('✅ Setting loading to false');
        setLoading(false);
      }
    };

    // For non-logged-in users, set loading to false immediately
    if (!user) {
      console.log('🚀 No user detected, setting loading to false immediately');
      setLoading(false);
      return;
    }

    // Add timeout to prevent infinite loading for logged-in users
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout reached, forcing loading to false');
      setLoading(false);
    }, 3000); // 3 second timeout

    loadReferralData();

    return () => {
      console.log('🧹 Cleaning up timeout');
      clearTimeout(timeoutId);
    };
  }, [user]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard."
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleProcessReferral = async () => {
    if (!user || !incomingCode) return;
    
    setIsProcessing(true);
    try {
      const result = await processReferral(incomingCode, user.id);
      if (result.success) {
        toast({
          title: "🎉 Referral Processed!",
          description: `You earned 3 credits for the referral!`,
        });
        // Remove the code from URL
        navigate('/refer', { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Referral Error",
          description: result.error
        });
      }
    } catch (error) {
      console.error('Error processing referral:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process referral"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // If there's an incoming referral code and user is logged in, process it
  useEffect(() => {
    if (incomingCode && user && !loading) {
      handleProcessReferral();
    }
  }, [incomingCode, user, loading]);

  if (loading) {
    console.log('⏳ Still loading, showing spinner. User:', user);
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <div className="ml-4">Loading your referral dashboard...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen text-white px-4 py-8 overflow-hidden">
      <Helmet>
        <title>Refer & Earn - Coming Soon - Get The Receipts</title>
        <meta name="description" content="Refer friends feature coming soon! Stay tuned for an exciting way to share Get The Receipts and earn rewards." />
        <meta property="og:title" content="Refer & Earn - Coming Soon - Get The Receipts" />
        <meta property="og:description" content="Refer friends feature coming soon! Stay tuned for an exciting way to share Get The Receipts and earn rewards." />
      </Helmet>
      
      <header className="max-w-4xl mx-auto mb-8 text-center relative">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-0 left-0 text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
        </Button>
      </header>
      
      <main className="max-w-4xl mx-auto flex flex-col items-center text-center min-h-[80vh] justify-center">
        
        {!user ? (
          // Not logged in - show sign up prompt
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <Gift className="h-32 w-32 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              <span className="gradient-text">Refer & Earn</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Sign up to get your unique referral link and start earning rewards!
            </p>
            <Button 
              size="lg" 
              className="viral-button font-bold"
              onClick={() => openModal('sign_up')}
            >
              Sign Up to Start Earning
            </Button>
          </motion.div>
        ) : (
          // Logged in - show referral system
          <>
            <motion.div 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <Gift className="h-32 w-32 text-yellow-400 mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                <span className="gradient-text">Refer & Earn</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Share your unique link and earn coupon codes for every friend who joins!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-3xl meme-card p-8 rounded-3xl text-center"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">{stats.totalReferrals}</h3>
                  <p className="text-gray-400 text-sm">Friends Referred</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">{stats.totalRewards}</h3>
                  <p className="text-gray-400 text-sm">Rewards Earned</p>
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Your Referral Link</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={referralLink}
                    readOnly
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="border-purple-400 text-white hover:bg-purple-500/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">
                  Share this link with friends. When they sign up, you both get rewards!
                </p>
              </div>

              {/* QR Code Section */}
              <ReferralQRCode 
                referralLink={referralLink}
                className="mb-6"
              />

              {/* How it works */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Share2 className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Share Your Link</h3>
                  <p className="text-gray-400 text-sm">Send your unique referral link to friends</p>
                </div>
                <div className="text-center">
                  <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Friend Signs Up</h3>
                  <p className="text-gray-400 text-sm">They create an account using your link</p>
                </div>
                <div className="text-center">
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
                  <p className="text-gray-400 text-sm">Get coupon codes for premium receipts!</p>
                </div>
              </div>

              {/* OG Founder Milestones */}
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center">🎯 OG Founder Milestones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-purple-400">Free Premium Month</h4>
                      <span className="text-sm text-gray-400">10 referrals</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (stats.totalReferrals / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.max(0, 10 - stats.totalReferrals)} more needed
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-yellow-400">OG Founders Pass</h4>
                      <span className="text-sm text-gray-400">50 referrals</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (stats.totalReferrals / 50) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.max(0, 50 - stats.totalReferrals)} more needed
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="viral-button font-bold w-full md:w-auto"
                  onClick={() => navigate('/chat-input')}
                >
                  Get Your Receipt Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-400 text-white hover:bg-purple-500/20 font-bold w-full md:w-auto"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </main>
      
      {/* Navigation Links */}
      <div className="mt-16 flex flex-wrap justify-center gap-6 mb-8">
        <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
        <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
        <Link to="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
        <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
      </div>

      {/* Footer */}
      <footer className="relative px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔮</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Get The Receipts
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Stop second-guessing their texts. Get clarity in 60 seconds with Sage, your AI bestie with opinions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link to="/refer" className="block text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-3">
              © 2025 Get The Receipts. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mb-3">
              16+ only • For Entertainment Purposes Only • Not therapy, legal, or medical advice • Sage is an AI character with opinions, not facts
            </p>
            <p className="text-gray-600 text-sm">
              Support: <a href="mailto:support@getthereceipts.com" className="text-violet-400 hover:text-violet-300 transition-colors">support@getthereceipts.com</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ReferralPage;