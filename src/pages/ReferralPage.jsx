import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Gift, Zap, Star, Clock, Heart, Copy, Share2, Users, Award } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getUserReferralCode, processReferral, getReferralLink } from '@/lib/services/referralService';
import { useToast } from '@/components/ui/use-toast';

const ReferralPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({ totalReferrals: 0, totalRewards: 0 });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if this is a referral link
  const incomingCode = searchParams.get('code');

  useEffect(() => {
    const loadReferralData = async () => {
      if (user) {
        // Get user's referral code
        const result = await getUserReferralCode(user.id);
        if (result.success) {
          setReferralCode(result.referralCode);
          setReferralLink(getReferralLink(result.referralCode));
          setStats({
            totalReferrals: result.totalReferrals,
            totalRewards: result.totalRewards
          });
        }
      }
      setLoading(false);
    };

    loadReferralData();
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
          description: `You earned a reward coupon: ${result.rewardCoupon}`,
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
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
              onClick={() => navigate('/auth')}
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
    </div>
  );
};

export default ReferralPage;