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
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading your referral dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 py-8 overflow-hidden">
      <Helmet>
        <title>Refer & Earn - Get The Receipts</title>
        <meta name="description" content="Share your unique referral link and earn credits for every friend who joins! Unlock milestone rewards and become an OG Founder." />
        <meta property="og:title" content="Refer & Earn - Get The Receipts" />
        <meta property="og:description" content="Share your unique referral link and earn credits for every friend who joins! Unlock milestone rewards and become an OG Founder." />
      </Helmet>
      
      <header className="max-w-4xl mx-auto mb-8 text-center relative">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-0 left-0 text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
        </Button>
        
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white hover:bg-white/10"
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
              <Crown className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                <span className="gradient-text">Receipts & Riches Program</span>
              </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto">
                    Share your link and earn cash for every friend who joins! 🚀
                  </p>
              <p className="text-lg font-semibold text-yellow-400 mb-8">
                30% commission • Monthly payments • $1000+ earning potential
              </p>
              
              <div className="max-w-4xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <span className="text-white font-semibold">30% commission on subscriptions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <span className="text-white font-semibold">Monthly payouts via PayPal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <span className="text-white font-semibold">$1000+ earning potential</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🎯</span>
                      </div>
                      <span className="text-blue-200">Perfect for content creators</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📱</span>
                      </div>
                      <span className="text-blue-200">Social media influencers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">👥</span>
                      </div>
                      <span className="text-blue-200">Community builders</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 mb-6"
                  onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfA0MUe-4ETNT019CmER3KHH7usL2H6qmWtOub9oLeQtODIYg/viewform', '_blank')}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Apply to Receipts & Riches
                </Button>
                <p className="text-sm text-gray-400 mb-4">
                  Join our exclusive creator program and start earning today
                </p>
              </div>
              <div className="text-center">
                <button
                  onClick={() => openModal('sign_up')}
                  className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                >
                  Sign up first to get started →
                </button>
              </div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-16 w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Apply & Get Approved</h3>
                  <p className="text-gray-400 text-sm">
                    Apply to our creator program and get approved for commission rates
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Promote & Earn</h3>
                  <p className="text-gray-400 text-sm">
                    Share with your audience and earn commission on every signup
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <Gift className="h-32 w-32 text-yellow-400 mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                <span className="gradient-text">Refer & Earn</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Share your link and earn cash for every friend who joins! 🚀
              </p>

              {/* Receipts & Riches CTA (logged-in) */}
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="rounded-3xl p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center mb-8">
                    <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      <span className="gradient-text">Receipts & Riches</span>
                    </h2>
                    <p className="text-xl text-blue-200 mb-6 max-w-2xl mx-auto">
                      Our affiliate program for creators and connectors. Earn real cash.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-white font-semibold">30% commission on subscriptions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-white font-semibold">Monthly payouts via PayPal</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <span className="text-white font-semibold">$1000+ earning potential</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🎯</span>
                        </div>
                        <span className="text-blue-200">Perfect for content creators</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">📱</span>
                        </div>
                        <span className="text-blue-200">Social media influencers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">👥</span>
                        </div>
                        <span className="text-blue-200">Connectors with friend networks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 mb-4"
                      onClick={() => navigate('/refer/apply')}
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Apply to Receipts & Riches
                    </Button>
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
              <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Apply & Get Approved</h3>
                  <p className="text-gray-400 text-sm">
                    Apply to our creator program and get approved for commission rates
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Promote & Earn</h3>
                  <p className="text-gray-400 text-sm">
                    Share with your audience and earn commission on every signup
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-green-500/40 mb-8"
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
                <Link to="/refund-policy" className="block text-gray-400 hover:text-white transition-colors">Refund Policy</Link>
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

export default EnhancedReferralPage;
