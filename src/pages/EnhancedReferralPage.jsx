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
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 rounded-xl p-1 flex">
                <button
                  onClick={() => setViewMode('forYou')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'forYou' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  For You
                </button>
                <button
                  onClick={() => setViewMode('forCreators')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'forCreators' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  For Creators
                </button>
              </div>
            </div>

            {/* Content based on view mode */}
            <AnimatePresence mode="wait">
              {viewMode === 'forYou' ? (
                <motion.div
                  key="forYou"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Gift className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                    <span className="gradient-text">Share & Earn Free Receipts</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto">
                    Your friends get clarity. You get credits.
                  </p>
                  <p className="text-lg font-semibold text-yellow-400 mb-8">
                    Every friend who signs up = You get 🎁 3 free Sage receipts = Use or trade in for bonus packages
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 mb-6"
                    onClick={() => openModal('sign_up')}
                  >
                    Sign Up to Start Sharing
                  </Button>
                  <div className="text-center">
                    <button
                      onClick={() => setViewMode('forCreators')}
                      className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                    >
                      Are you a content creator? Make real money with Receipts & Riches →
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="forCreators"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Gift className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                    <span className="gradient-text">Receipts & Riches Program</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto">
                    Turn confusing text messages into steady income
                  </p>
                  <p className="text-lg font-semibold text-yellow-400 mb-8">
                    30% commission • Monthly payments • 🎁 $1000+ potential
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-2xl border-0 shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40 mb-6"
                    onClick={() => navigate('/refer/apply')}
                  >
                    Apply to Earn Cash
                  </Button>
                  <div className="text-center">
                    <button
                      onClick={() => setViewMode('forYou')}
                      className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
                    >
                      Just want free credits? Join our regular referral program →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {viewMode === 'forYou' ? 'Share Your Link' : 'Get Approved'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {viewMode === 'forYou' 
                      ? 'Get your unique referral link and share it with friends'
                      : 'Apply to our creator program and get approved for commission rates'
                    }
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {viewMode === 'forYou' ? 'Friends Sign Up' : 'Promote & Earn'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {viewMode === 'forYou' 
                      ? 'Your friends create accounts and start getting receipts'
                      : 'Share with your audience and earn commission on every signup'
                    }
                  </p>
                </motion.div>
                <motion.div 
                  className="text-center p-6 bg-gray-800/30 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {viewMode === 'forYou' ? 'Earn Credits' : 'Get Paid'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {viewMode === 'forYou' 
                      ? 'Get 3 free receipts for every friend who joins'
                      : 'Receive monthly payments for your referrals'
                    }
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
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Share your unique link and earn credits for every friend who joins! 🚀
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-3xl meme-card p-8 rounded-3xl text-center"
            >
              {/* Real-time Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white">{stats.totalReferrals}</h3>
                  <p className="text-gray-400 text-sm">Friends Referred</p>
                  <p className="text-green-400 text-xs mt-1">+{stats.totalRewards * 3} credits earned</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white">{stats.totalRewards}</h3>
                  <p className="text-gray-400 text-sm">Rewards Earned</p>
                  <p className="text-yellow-400 text-xs mt-1">Milestone progress</p>
                </motion.div>
              </div>

              {/* Milestone Progress */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-center">
                  <Target className="h-5 w-5 mr-2" />
                  Milestone Progress
                </h3>
                <div className="space-y-4">
                  {milestoneProgress.map((milestone, index) => (
                    <motion.div
                      key={milestone.target}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{milestone.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold text-white">{milestone.reward}</p>
                          <p className="text-sm text-gray-400">
                            {milestone.completed ? 'Completed!' : `${milestone.remaining} more referrals needed`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {milestone.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                          <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${milestone.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Referral Link */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 flex items-center justify-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Your Referral Link
                </h3>
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
                  Share this link with friends. When they sign up, you both get rewards! 🎁
                </p>
              </div>

              {/* How it works */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Share2 className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Share Your Link</h3>
                  <p className="text-gray-400 text-sm">Send your unique referral link to friends</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Friend Signs Up</h3>
                  <p className="text-gray-400 text-sm">They create an account using your link</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Earn Credits</h3>
                  <p className="text-gray-400 text-sm">Get 3 credits instantly + milestone rewards!</p>
                </motion.div>
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
