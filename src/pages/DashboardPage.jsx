import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/database/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Gift, Settings, Receipt, Loader2, Frown, CreditCard, Zap, LogIn, LogOut, User, Trash2, Crown } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import CouponModal from '@/components/CouponModal';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { getUserCredits, getUserReferralCode, getReferralStats, initializeUserCredits } from '@/lib/services/creditsSystem';
import { FreeUsageService } from '@/lib/services/freeUsageService';
import ReferralProgressCard from '@/components/ReferralProgressCard';
import TrialBanner from '@/components/TrialBanner';

const DashboardPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [receipts, setReceipts] = useState([]);
  const [userCredits, setUserCredits] = useState({ 
    credits: 0, 
    subscription: 'free'
  });
  const [referralData, setReferralData] = useState({ 
    referralCode: '', 
    uses: 0 
  });
  const [referralStats, setReferralStats] = useState({ 
    totalReferrals: 0, 
    bonusCreditsEarned: 0 
  });
  const [saveReceipts, setSaveReceipts] = useState(false); // Default OFF - privacy first
  const [loading, setLoading] = useState(true);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [usageData, setUsageData] = useState({
    starterUsed: 0,
    todayReceipts: 0,
    todayChats: 0
  });

  const fetchData = useCallback(async (userId) => {
    setLoading(true);
    try {
      // Initialize user credits if they don't exist
      await initializeUserCredits(userId);

      // Fetch user credits and check subscription
      const creditsData = await getUserCredits(userId);
      setUserCredits(creditsData);
      
      // Check if user has receipt saving enabled (premium feature)
      const isPremiumUser = creditsData.subscription === 'premium' || creditsData.subscription === 'yearly' || creditsData.subscription === 'founder';
      
      // Fetch user's receipt saving preference (defaults to OFF for privacy)
      const { data: userData } = await supabase
        .from('users')
        .select('save_receipts')
        .eq('id', userId)
        .single();
      
      const shouldSaveReceipts = userData?.save_receipts === true; // Explicit false unless explicitly true
      setSaveReceipts(shouldSaveReceipts);

      // Only fetch receipts if user is premium AND has saving enabled
      if (isPremiumUser && shouldSaveReceipts) {
        const { data: receiptsData, error: receiptsError } = await supabase
          .from('receipts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (receiptsError) throw receiptsError;
        setReceipts(receiptsData || []);
      } else {
        setReceipts([]); // No receipts for free users or when saving is disabled
      }

      // Fetch referral data
      const referralCodeData = await getUserReferralCode(userId);
      if (referralCodeData) {
        setReferralData(referralCodeData);
      }

      // Fetch referral stats
      const statsData = await getReferralStats(userId);
      setReferralStats(statsData);

      // Get actual usage data from FreeUsageService
      const actualUsage = {
        starterUsed: FreeUsageService.getStarterUsed(userId),
        todayReceipts: FreeUsageService.getTodayReceiptCount(userId),
        todayChats: FreeUsageService.getTodayChatCount(userId)
      };
      setUsageData(actualUsage);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData(user.id);
    } else if (!authLoading && !user) {
      setLoading(false);
      navigate('/');
    }
  }, [user, authLoading, fetchData, navigate]);

  // Force refresh credit data when dashboard becomes visible (after navigation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        console.log('🔄 Dashboard visible - refreshing credit data...');
        fetchData(user.id);
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        console.log('🔄 Dashboard focused - refreshing credit data...');
        fetchData(user.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.id, fetchData]);


  const getPlanName = (subscription) => {
    if (!subscription) return 'Free Forever Plan';
    if (subscription === 'premium') return 'Unlimited Monthly';
    if (subscription === 'yearly') return 'OG Founder Yearly';
    if (subscription === 'founder') return 'OG Founder Yearly';
    return 'Free Forever Plan';
  };

  const getPlanDescription = (subscription) => {
    if (!subscription || subscription === 'free') {
      return '1 Daily Free Receipt + 3 Ask Sage Anything chats';
    }
    if (subscription === 'premium' || subscription === 'yearly' || subscription === 'founder') {
      return 'Full access to all features';
    }
    return '1 Daily Free Receipt + 3 Ask Sage Anything chats';
  };

  const getCreditsDisplay = () => {
    if (!userCredits) return '0';
    if (userCredits.subscription === 'premium' || userCredits.subscription === 'yearly' || userCredits.subscription === 'founder') {
      return 'Unlimited';
    }
    if (userCredits.subscription === 'free') {
      // For free users, show actual usage from FreeUsageService
      if (usageData.starterUsed < 3) {
        return `${3 - usageData.starterUsed} starter left`;
      } else if (usageData.todayReceipts < 1) {
        return '1 daily left';
      } else {
        return '0 left (resets at midnight UTC)';
      }
    }
    return String(userCredits.credits || 0);
  };

  const getUsageProgress = () => {
    if (userCredits.subscription === 'free') {
      if (usageData.starterUsed < 3) {
        // Show starter progress
        return {
          current: usageData.starterUsed,
          total: 3,
          type: 'starter'
        };
      } else {
        // Show daily progress
        return {
          current: usageData.todayReceipts,
          total: 1,
          type: 'daily'
        };
      }
    }
    return null;
  };

  const handleSaveReceiptsToggle = async (checked) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ save_receipts: checked })
        .eq('id', user.id);

      if (error) throw error;
      
      setSaveReceipts(checked);
      
      // Refresh receipts based on new setting
      await fetchData(user.id);
      
      toast({
        title: checked ? "Receipt Saving Enabled" : "Receipt Saving Disabled",
        description: checked 
          ? "Your future receipts will be saved to your dashboard" 
          : "Your receipts will no longer be saved (privacy mode)",
      });
    } catch (error) {
      console.error('Error updating receipt preference:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update receipt saving preference',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
      });
    }
  };

  const handleLogin = () => {
    openModal('sign_in');
  };

  const handleDeleteReceipt = async (receiptId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking delete
    
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', receiptId)
        .eq('user_id', user.id); // Security: only delete own receipts

      if (error) throw error;
      
      // Remove from local state
      setReceipts(prev => prev.filter(r => r.id !== receiptId));
      
      toast({
        title: "Receipt Deleted",
        description: "Receipt has been permanently removed from your dashboard",
      });
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete receipt',
      });
    }
  };

  const MiniReceiptCard = ({ receipt }) => {
    if (!receipt) return null;
    
    const analysisResult = receipt.analysis_result || {};
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (error) {
        return 'N/A';
      }
    };
    
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="rounded-2xl p-4 text-white cursor-pointer h-full flex flex-col justify-between bg-white/8 backdrop-blur-sm border border-cyan-400/20 relative group"
        onClick={() => navigate(`/receipts/${receipt.id}`, { state: { ...receipt, analysis: analysisResult } })}
      >
        <div>
          <h3 className="font-bold text-lg truncate">{analysisResult.archetype || 'Analysis'}</h3>
          <p className="text-sm opacity-80 truncate">{receipt.original_message || 'No message'}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs opacity-70">
            {formatDate(receipt.created_at)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            onClick={(e) => handleDeleteReceipt(receipt.id, e)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>
    );
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex justify-center items-center p-4">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Loading your dashboard...</h1>
          <p className="text-cyan-200">Getting your credits and receipts ready</p>
        </div>
      </div>
    );
  }

  // Add additional safety check
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex justify-center items-center p-4">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Please sign in</h1>
          <p className="text-cyan-200">You need to be logged in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Dashboard - Get The Receipts</title>
        <meta name="description" content="Manage your account, view your past receipts, and access premium features." />
      </Helmet>
      
      <TrialBanner userId={user?.id} />
      
      <div className="min-h-screen relative overflow-hidden">
        {/* Deep Charcoal Background - Glassmorphism Optimized */}
        <div className="absolute inset-0 bg-[#0F0F0F]" />
        
        {/* Subtle Depth with Cyan Accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
        
        {/* Glassmorphism Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-4 py-8 text-white">
        {/* Hero Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-4">
                <span className="text-white">Welcome back,</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  {user?.email?.split('@')[0] || 'Sage User'}
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Your personal command center for decoding conversations and managing your Sage experience
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <LinkButton 
                to="/chat-input" 
                className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/40 transition-all duration-300 hover:scale-105 min-h-[56px] min-w-[200px]"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> New Receipt
              </LinkButton>
              
              <LinkButton 
                to="/refer" 
                variant="outline" 
                className="border-purple-400/60 text-white hover:bg-purple-500/10 hover:border-purple-400/80 font-medium px-6 py-4 rounded-xl transition-all duration-300 min-h-[56px] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
              >
                <Gift className="mr-2 h-5 w-5" /> Earn Rewards
              </LinkButton>
            </motion.div>

            {/* Secondary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {/* Only show coupon button for free users */}
              {userCredits.subscription === 'free' && (
                <Button 
                  variant="outline" 
                  className="text-white border-cyan-400/60 hover:bg-cyan-500/10 hover:border-cyan-400/80 font-medium px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={() => setIsCouponModalOpen(true)}
                >
                  <Gift className="mr-2 h-4 w-4" /> Have a Coupon?
                </Button>
              )}
              
              {user ? (
                <Button 
                  variant="outline" 
                  className="text-white border-cyan-400/60 hover:bg-cyan-500/10 hover:border-cyan-400/80 font-medium px-4 py-2 rounded-lg transition-all duration-300" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="text-white border-cyan-400/60 hover:bg-cyan-500/10 hover:border-cyan-400/80 font-medium px-4 py-2 rounded-lg transition-all duration-300" 
                  onClick={handleLogin}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
              )}
            </motion.div>
          </div>
        </motion.header>


        {/* Main Dashboard Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {/* Plan Status Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Current Plan</h2>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-2">
                {getPlanName(userCredits.subscription)}
              </p>
              <p className="text-sm text-gray-300 mb-4">
                {getPlanDescription(userCredits.subscription)}
              </p>
              
              {/* Additional Plan Info */}
              <div className="space-y-2 text-xs text-gray-400">
                {userCredits.subscription === 'free' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>3 starter receipts (lifetime)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>1 daily receipt (resets at midnight UTC)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>5 Ask Sage Anything chats per day</span>
                    </div>
                  </>
                )}
                {(userCredits.subscription === 'premium' || userCredits.subscription === 'yearly' || userCredits.subscription === 'founder') && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Unlimited Truth Receipts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Unlimited Ask Sage Anything chats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Sage's Playbook & Immunity Training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>Vibe Check™ real-time analysis</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Usage Counter */}
              {userCredits.subscription === 'free' && (() => {
                const progress = getUsageProgress();
                if (!progress) return null;
                
                const percentage = (progress.current / progress.total) * 100;
                const remaining = progress.total - progress.current;
                const isUsedUp = remaining === 0;
                
                return (
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">
                        {progress.type === 'starter' ? 'Starter Receipts' : 'Daily Usage'}
                      </span>
                      <span className={`text-sm font-semibold ${isUsedUp ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {remaining > 0 ? `${remaining} left` : 'Used up'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isUsedUp 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                            : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      ></div>
                    </div>
                    
                    {isUsedUp ? (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-orange-300 text-center">
                          {progress.type === 'starter' 
                            ? "You've used all 3 starter receipts! 🎉" 
                            : "You've used today's free receipt! Come back tomorrow or upgrade for unlimited access."
                          }
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 text-sm font-semibold shadow-lg shadow-cyan-500/25"
                          onClick={() => navigate('/pricing')}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          {progress.type === 'starter' 
                            ? 'Upgrade for Unlimited Receipts' 
                            : 'Get Unlimited Access'
                          }
                        </Button>
                        {progress.type === 'daily' && (
                          <p className="text-xs text-gray-400 text-center">
                            Or wait until midnight UTC for your next free receipt
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">
                        {progress.type === 'starter' 
                          ? `${progress.current}/3 starter receipts used` 
                          : '1 free receipt per day'
                        }
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>

          {/* Upgrade Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/8 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Upgrade</h2>
              </div>
              <p className="text-sm text-gray-300 mb-6">
                Ready to level up? Get unlimited Sage Receipts, Playbook insights, and Immunity training.
              </p>
              <div className="space-y-3">
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 text-sm font-semibold shadow-lg shadow-cyan-500/25"
                  onClick={() => navigate('/pricing')}
                >
                  Monthly Premium - $4.99
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600 text-white border-0 text-sm font-semibold shadow-lg shadow-purple-500/25"
                  onClick={() => navigate('/pricing')}
                >
                  OG Founders Yearly - $29.99
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Account Settings Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/8 backdrop-blur-xl border border-emerald-400/30 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Account</h2>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Email:</span>
                  <span className="text-white text-sm truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Plan:</span>
                  <span className="text-white text-sm">{getPlanName(userCredits.subscription)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Member since:</span>
                  <span className="text-white text-sm">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Status:</span>
                  <span className="text-green-400 text-sm font-medium">Active</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full border-emerald-400/60 text-white hover:bg-emerald-500/10 hover:border-emerald-400/80 text-sm font-medium shadow-lg shadow-emerald-500/20"
                onClick={() => navigate('/pricing')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Plan
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Receipts & Riches Program Section - Compact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-white/8 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-6 shadow-lg shadow-amber-500/20 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          Receipts & Riches
                        </span>
                      </h2>
                      <p className="text-sm text-gray-300">Earn 30% commission on referrals</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-lg border-0 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfA0MUe-4ETNT019CmER3KHH7usL2H6qmWtOub9oLeQtODIYg/viewform', '_blank')}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Apply
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-300">30% commission</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-300">Monthly payouts</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-300">$1000+ potential</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>


        {/* Your Receipt History Section - DISABLED FOR LAUNCH */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center"><Receipt className="mr-3"/>Your Receipt History</h2>
          {receipts && receipts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {receipts.map(receipt => receipt && receipt.id ? <MiniReceiptCard key={receipt.id} receipt={receipt} /> : null)}
            </div>
          ) : (
            <div className="text-center meme-card p-10 rounded-2xl">
              <Frown className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              {userCredits?.subscription === 'free' ? (
                <>
                  <h3 className="text-2xl font-bold">Privacy First 🛡️</h3>
                  <p className="text-gray-400 mb-6">Your receipts aren't saved by default. Upgrade to Premium to enable receipt saving and build your personal analysis library.</p>
                  <LinkButton to="/pricing" className="viral-button">Upgrade for Receipt History</LinkButton>
                </>
              ) : !saveReceipts ? (
                <>
                  <h3 className="text-2xl font-bold">Receipt Saving Off</h3>
                  <p className="text-gray-400 mb-6">Your receipts aren't being saved. Turn on "Save Receipts" above to start building your analysis library.</p>
                  <LinkButton to="/chat-input" className="viral-button">Get Your First Receipt</LinkButton>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold">No Receipts Yet</h3>
                  <p className="text-gray-400 mb-6">You haven't decoded any messages yet. Start analyzing to build your receipt history!</p>
                  <LinkButton to="/chat-input" className="viral-button">Get Your First Receipt</LinkButton>
                </>
              )}
            </div>
          )}
        </motion.section> */}
        </div>
      </div>
      
      {/* Coupon Modal */}
      <CouponModal 
        isOpen={isCouponModalOpen} 
        onClose={() => setIsCouponModalOpen(false)} 
      />
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
    </>
  );
};

export default DashboardPage;