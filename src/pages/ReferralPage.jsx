import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Share2, Copy, Check, Star, Crown, Users, Loader2, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Helmet } from 'react-helmet';
import { 
  getUserReferralCode, 
  getReferralStats, 
  getUserCredits, 
  processShareBonus 
} from '@/lib/services/creditsSystem';

const ReferralPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { openModal } = useAuthModal();
  const [referralCode, setReferralCode] = useState('');
  const [referralUses, setReferralUses] = useState(0);
  const [stats, setStats] = useState({ totalReferrals: 0, bonusCreditsEarned: 0 });
  const [credits, setCredits] = useState(0);
  const [subscription, setSubscription] = useState('free');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const [referralData, referralStats, userCredits] = await Promise.all([
        getUserReferralCode(user.id),
        getReferralStats(user.id),
        getUserCredits(user.id)
      ]);

      if (referralData) {
        setReferralCode(referralData.referralCode);
        setReferralUses(referralData.uses);
      }
      
      setStats(referralStats);
      setCredits(userCredits.credits);
      setSubscription(userCredits.subscription);

    } catch (error) {
       console.error('Error fetching referral data:', error);
       toast({ title: 'Error', description: 'Could not load your referral information.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfileData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, fetchProfileData]);

  const referralLink = user && referralCode ? `${window.location.origin}/?ref=${referralCode}` : '';

  const handleCopy = async () => {
    if (!referralLink) return;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'Your referral link is ready to share 🚀'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Please copy the link manually'
      });
    }
  };

  const handleShare = async () => {
    const shareText = `Check out Get The Receipts! It's like having a psychology bestie who calls out toxic behavior 🔥 Get your first 5 free analysis with my link:`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Get The Receipts - Psychology Bestie',
          text: shareText,
          url: referralLink
        });
        
        // Award share bonus
        const result = await processShareBonus(user.id);
        if (result.success) {
          toast({
            title: "Bonus Earned! 🎉",
            description: `You earned ${result.creditsAwarded} bonus credit for sharing!`
          });
          setCredits(prev => prev + result.creditsAwarded);
        }
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copying
      await navigator.clipboard.writeText(`${shareText}\n\n${referralLink}`);
      toast({
        title: "Share Text Copied!",
        description: "Paste it anywhere to share your referral 📱"
      });
    }
  };

  const handleRedeem = async (reward) => {
    setRedeeming(reward.id);
    try {
      const { error } = await supabase.functions.invoke('redeem-reward', {
        body: { rewardId: reward.id }
      });

      if (error) {
        const errorJson = await error.context.json();
        throw new Error(errorJson.error || 'An unknown error occurred.');
      }

      toast({ title: 'Success!', description: `You've redeemed ${reward.name}!` });
      await fetchProfileData();

    } catch (err) {
      toast({ title: 'Redemption Failed', description: err.message, variant: 'destructive' });
    } finally {
      setRedeeming(null);
    }
  };

  const rewards = [
    { id: '1-month-premium', name: '1 Month Premium', points: 25, icon: <Star className="h-8 w-8 text-yellow-400" />, description: "Unlock unlimited receipts for a full month." },
    { id: '1-year-premium', name: '1 Year Premium', points: 200, icon: <Crown className="h-8 w-8 text-orange-400" />, description: "Become a receipt-reading master for a whole year." },
  ];

  const points = referralCount * 5;

  return (
    <div className="min-h-screen text-white px-4 py-8 overflow-hidden">
      <Helmet>
        <title>Refer & Earn - Get The Receipts</title>
        <meta name="description" content="Share the love, get more receipts! Invite friends to Get The Receipts and earn points to redeem for premium rewards." />
        <meta property="og:title" content="Refer & Earn - Get The Receipts" />
        <meta property="og:description" content="Share the love, get more receipts! Invite friends to Get The Receipts and earn points to redeem for premium rewards." />
      </Helmet>
      <header className="max-w-4xl mx-auto mb-8 text-center relative">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-0 left-0 text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
        </Button>
      </header>
      
      <main className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Gift className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            <span className="gradient-text">Earn Rewards</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            Invite friends, earn points, and unlock premium features for free. The more you share, the more you earn.
          </p>
        </motion.div>

        {loading || authLoading ? (
          <div className="text-center p-10"><Loader2 className="h-12 w-12 animate-spin mx-auto"/></div>
        ) : user ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="lg:col-span-1 meme-card p-6 rounded-3xl flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Share Your Link</h2>
              <p className="text-gray-400 mb-4 text-sm">Copy your unique link and send it to your friends. You get 5 points for every signup!</p>
              <div className="relative flex items-center w-full">
                <input type="text" value={referralLink} readOnly className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg p-3 pr-12 text-center text-sm" />
                <Button size="icon" variant="ghost" onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9">
                  {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-gray-400" />}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button size="lg" className="viral-button py-3" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline" className="border-purple-400 text-white hover:bg-purple-500/20 py-3" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="lg:col-span-2 meme-card p-6 rounded-3xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Redeem Your Points</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center bg-gray-900/50 p-4 rounded-xl">
                  <Gift className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-black gradient-text">{credits}</p>
                  <p className="text-sm text-gray-400">Credits Available</p>
                </div>
                <div className="text-center bg-gray-900/50 p-4 rounded-xl">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-black gradient-text">{stats.totalReferrals}</p>
                  <p className="text-sm text-gray-400">Friends Referred</p>
                </div>
                <div className="text-center bg-gray-900/50 p-4 rounded-xl">
                  <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-black gradient-text">{stats.bonusCreditsEarned}</p>
                  <p className="text-sm text-gray-400">Bonus Credits</p>
                </div>
              </div>
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <div key={reward.name} className="bg-gray-800/70 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {reward.icon}
                      <div>
                        <h3 className="font-bold text-white">{reward.name}</h3>
                        <p className="text-sm text-gray-400">{reward.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={points < reward.points || redeeming !== null}
                      className="viral-button-popular font-bold"
                    >
                      {redeeming === reward.id ? <Loader2 className="h-4 w-4 animate-spin" /> : `${reward.points} pts`}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md meme-card p-8 rounded-3xl text-center mt-8"
          >
            <Users className="h-16 w-16 mx-auto text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Join to Start Earning</h2>
            <p className="text-lg text-gray-300 mb-4">Create a free account to get your unique referral link and start earning rewards.</p>
            <Button size="lg" className="viral-button" onClick={() => openModal('sign_up')}>
              Sign Up to Get Your Link
            </Button>
          </motion.div>
        )}
        
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-12 text-gray-500 text-sm max-w-2xl"
        >
            <p>Points are awarded for each new user that signs up using your referral link. Rewards are applied to your account instantly upon redemption. Terms and conditions may apply.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default ReferralPage;