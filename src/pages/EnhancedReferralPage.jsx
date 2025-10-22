import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Gift, 
  Zap, 
  Star, 
  Clock, 
  Heart, 
  Copy, 
  Share2, 
  Users, 
  Award,
  RefreshCw,
  TrendingUp,
  Crown,
  Sparkles,
  Target,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Users2
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { 
  getUserReferralCodeEnhanced, 
  processReferralWithCredits, 
  getReferralLink,
  subscribeToReferralUpdates,
  unsubscribeFromReferralUpdates,
  getMilestoneProgress,
  formatReferralStats
} from '@/lib/services/enhancedReferralService';
import { useToast } from '@/components/ui/use-toast';

const EnhancedReferralPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { toast } = useToast();
  
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalRewards: 0,
    milestone10Reached: false,
    milestone50Reached: false,
    referralsTo10: 10,
    referralsTo50: 50
  });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realtimeSubscription, setRealtimeSubscription] = useState(null);
  const [viewMode, setViewMode] = useState('forYou'); // 'forYou' or 'forCreators'

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

  // Load referral data with enhanced stats
  const loadReferralData = useCallback(async () => {
    if (user) {
      try {
        const result = await getUserReferralCodeEnhanced(user.id);
        if (result.success) {
          setReferralCode(result.referralCode);
          setReferralLink(getReferralLink(result.referralCode));
          setStats({
            totalReferrals: result.totalReferrals,
            totalRewards: result.totalRewards,
            milestone10Reached: result.milestone10Reached,
            milestone50Reached: result.milestone50Reached,
            milestone10RewardClaimed: result.milestone10RewardClaimed,
            milestone50RewardClaimed: result.milestone50RewardClaimed,
            referralsTo10: Math.max(0, 10 - result.totalReferrals),
            referralsTo50: Math.max(0, 50 - result.totalReferrals)
          });
        }
      } catch (error) {
        console.error('Error loading referral data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load referral data"
        });
      }
    }
    setLoading(false);
  }, [user, toast]);

  // Refresh data manually
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadReferralData();
    setIsRefreshing(false);
    toast({
      title: "🔄 Refreshed!",
      description: "Your referral stats are up to date"
    });
  };

  // Set up real-time updates
  useEffect(() => {
    console.log('🔄 EnhancedReferralPage useEffect triggered, user:', user);
    
    // For non-logged-in users, set loading to false immediately
    if (!user) {
      console.log('🚀 No user detected, setting loading to false immediately');
      setLoading(false);
      return;
    }

    // Load data for logged-in users
    loadReferralData();
    
    // Subscribe to real-time updates
    const subscription = subscribeToReferralUpdates(user.id, (payload) => {
      console.log('📡 Real-time update received:', payload);
      // Refresh data when changes occur
      loadReferralData();
      
      // Show notification for new referrals
      if (payload.eventType === 'INSERT' && payload.table === 'referrals') {
        toast({
          title: "🎉 New Referral!",
          description: "Someone just used your link! +3 credits earned!",
          duration: 5000
        });
      }
    });
    
    setRealtimeSubscription(subscription);
    
    return () => {
      unsubscribeFromReferralUpdates(subscription);
    };
  }, [user, loadReferralData, toast]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "📋 Link Copied!",
        description: "Your referral link has been copied to clipboard",
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy link to clipboard"
      });
    }
  };

  const handleProcessReferral = async () => {
    if (!user || !incomingCode) return;
    
    setIsProcessing(true);
    try {
      const result = await processReferralWithCredits(incomingCode, user.id, toast);
      if (result.success) {
        // Remove the code from URL
        navigate('/refer', { replace: true });
      }
    } catch (error) {
      console.error('Error processing referral:', error);
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

  // Get milestone progress for UI
  const milestoneProgress = getMilestoneProgress(stats.totalReferrals);
  const formattedStats = formatReferralStats(stats);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0F0F0F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading your referral dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 py-8 overflow-hidden relative">
      {/* Deep Charcoal Background - Glassmorphism Optimized */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      
      {/* Subtle Depth with Cyan Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      
      {/* Glassmorphism Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10">
      <Helmet>
        <title>Refer & Earn - Get The Receipts</title>
        <meta name="description" content="Share your unique referral link and earn credits for every friend who joins! Unlock milestone rewards and become an OG Founder." />
        <meta property="og:title" content="Refer & Earn - Get The Receipts" />
        <meta property="og:description" content="Share your unique referral link and earn credits for every friend who joins! Unlock milestone rewards and become an OG Founder." />
      </Helmet>
      
      <header className="max-w-4xl mx-auto mb-8 text-center relative">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-0 left-0 text-white hover:bg-cyan-500/10 border border-cyan-400/20">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
        </Button>
        
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white hover:bg-cyan-500/10 border border-cyan-400/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto flex flex-col items-center text-center min-h-[80vh] justify-center">
        {!user ? (
          // Not logged in - show toggle and public content
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
            className="text-center mb-12 w-full"
          >

            {/* Receipts & Riches Program */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Crown className="h-24 w-24 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Receipts & Riches Program</span>
              </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                    The <span className="text-cyan-400 font-semibold">highest-paying</span> affiliate program for <span className="text-white font-semibold">nano influencers</span>, <span className="text-white font-semibold">content creators</span>, and <span className="text-white font-semibold">community builders</span> 🚀
                  </p>
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
                <p className="text-2xl font-bold text-cyan-300 mb-2">
                  💰 30% Commission • 💳 Rewardful Payments • 🎯 $1000+ Earning Potential
                </p>
                <p className="text-base text-gray-300">
                  Join our <span className="font-semibold text-white">exclusive launch program</span> - limited spots for early creators
                </p>
              </div>
              
              <div className="max-w-5xl mx-auto mb-12 ml-8 md:ml-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 text-center md:text-left">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">💰</span>
                      </div>
                      <span className="text-white font-semibold leading-relaxed">30% commission on ALL subscriptions (industry-leading rate)</span>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">💳</span>
                      </div>
                      <span className="text-white font-semibold leading-relaxed">Monthly payouts via Rewardful (no waiting)</span>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">🎯</span>
                      </div>
                      <span className="text-white font-semibold leading-relaxed">$1000+ monthly earning potential</span>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">🔥</span>
                      </div>
                      <span className="text-white font-semibold leading-relaxed">Exclusive creator resources & support</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">📺</span>
                      </div>
                      <span className="text-blue-200 leading-relaxed">YouTube creators & nano influencers</span>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">📱</span>
                      </div>
                      <span className="text-blue-200 leading-relaxed">TikTok/Instagram micro & nano influencers</span>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">👥</span>
                      </div>
                      <span className="text-blue-200 leading-relaxed">Friends networks & community builders</span>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">🎙️</span>
                      </div>
                      <span className="text-blue-200 leading-relaxed">Podcasters & relationship coaches</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 25px 50px -12px rgba(0, 229, 255, 0.4)",
                      "0 25px 50px -12px rgba(0, 229, 255, 0.6)",
                      "0 25px 50px -12px rgba(0, 229, 255, 0.4)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 mb-6"
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfA0MUe-4ETNT019CmER3KHH7usL2H6qmWtOub9oLeQtODIYg/viewform', '_blank')}
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Apply to Receipts & Riches
                  </Button>
                </motion.div>
                <p className="text-sm text-gray-400 mb-4">
                  Join our exclusive creator program and start earning today
                </p>
                <div className="text-center">
                  <button
                    onClick={() => openModal('sign_up')}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
                  >
                    Sign up first to get started →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-16 w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center p-6 bg-white/8 backdrop-blur-sm border border-cyan-400/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Apply & Get Approved</h3>
                  <p className="text-gray-400 text-sm">
                    Apply to our creator program and get approved for commission rates
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-white/8 backdrop-blur-sm border border-cyan-400/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Promote & Earn</h3>
                  <p className="text-gray-400 text-sm">
                    Share with your audience and earn commission on every signup
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-white/8 backdrop-blur-sm border border-cyan-400/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Earn Riches</h3>
                  <p className="text-gray-400 text-sm">
                    Receive monthly payments for your referrals
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Logged in - show enhanced referral system
          <>
            <motion.div 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <Gift className="h-32 w-32 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Refer & Earn</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Share your link and earn cash for every friend who joins! 🚀
              </p>

              {/* Receipts & Riches CTA (logged-in) */}
              <div className="max-w-5xl mx-auto ml-8 md:ml-16">
                <motion.div 
                  className="rounded-3xl p-8 bg-white/8 backdrop-blur-xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center mb-8">
                    <Crown className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Receipts & Riches</span>
                    </h2>
                    <p className="text-xl text-blue-200 mb-6 max-w-2xl mx-auto">
                      Our affiliate program for creators and connectors. Earn real cash.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-12 text-center md:text-left">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-white font-semibold leading-relaxed">30% commission on subscriptions</span>
                      </div>
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-white font-semibold leading-relaxed">Monthly payouts via Rewardful</span>
                      </div>
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-white font-semibold leading-relaxed">$1000+ earning potential</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">🎯</span>
                        </div>
                        <span className="text-blue-200 leading-relaxed">Nano & micro influencers</span>
                      </div>
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">📱</span>
                        </div>
                        <span className="text-blue-200 leading-relaxed">Content creators & social media</span>
                      </div>
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-sm">👥</span>
                        </div>
                        <span className="text-blue-200 leading-relaxed">Friends networks & community builders</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          "0 25px 50px -12px rgba(0, 229, 255, 0.4)",
                          "0 25px 50px -12px rgba(0, 229, 255, 0.6)",
                          "0 25px 50px -12px rgba(0, 229, 255, 0.4)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 mb-4"
                        onClick={() => navigate('/refer/apply')}
                      >
                        <Crown className="mr-2 h-5 w-5" />
                        Apply to Receipts & Riches
                      </Button>
                    </motion.div>
                    <p className="text-sm text-gray-400">
                      Join our exclusive creator program and start earning today
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-16 w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center p-6 bg-white/8 backdrop-blur-sm border border-cyan-400/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Apply & Get Approved</h3>
                  <p className="text-gray-400 text-sm">
                    Apply to our creator program and get approved for commission rates
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-white/8 backdrop-blur-sm border border-cyan-400/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Promote & Earn</h3>
                  <p className="text-gray-400 text-sm">
                    Share with your audience and earn commission on every signup
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-white/8 backdrop-blur-sm border border-cyan-400/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Earn Riches</h3>
                  <p className="text-gray-400 text-sm">
                    Receive monthly payments for your referrals
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Ready to Apply Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-16 w-full"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Apply?</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Ready to apply? Tap below to open the secure portal and submit in under 2 minutes.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 mb-8"
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfA0MUe-4ETNT019CmER3KHH7usL2H6qmWtOub9oLeQtODIYg/viewform', '_blank')}
                  >
                    Apply Now
                  </Button>
                </div>
                
                <div className="bg-gray-800/30 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">Program Requirements</h3>
                  <div className="max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-gray-300 text-center">Active social presence or a strong friend-network</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-gray-300 text-center">Content aligns with respect, privacy, and honesty</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-gray-300 text-center">You must be over 18 years old</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-lg text-purple-300 font-medium">
                      Creator or connector, you are welcome. If your voice moves conversations, you've got this!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </>
        )}
      </main>
      

      {/* Simple Clean Footer */}
      <footer className="px-6 py-8 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
            <Link to="/refer" className="text-gray-400 hover:text-white transition-colors text-sm">Earn & Refer</Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
          </div>
          
          {/* Disclaimer */}
          <p className="text-gray-500 text-xs mb-2">For Entertainment Purposes Only</p>
          
          {/* Copyright */}
          <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
          
          {/* Support */}
          <p className="text-gray-500 text-xs">
            Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@getthereceipts.com</a>
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default EnhancedReferralPage;
