import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/database/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Gift, Settings, Receipt, Loader2, Frown, CreditCard, Zap, LogIn, LogOut, User, Trash2 } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import CouponModal from '@/components/CouponModal';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { getUserCredits, getUserReferralCode, getReferralStats, initializeUserCredits } from '@/lib/services/creditsSystem';
import ReferralProgressCard from '@/components/ReferralProgressCard';

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
    if (!subscription) return 'Free Daily Receipt';
    if (subscription === 'premium') return 'Unlimited Monthly';
    if (subscription === 'yearly') return 'OG Founder Yearly';
    if (subscription === 'founder') return 'OG Founder Yearly';
    return 'Free Daily Receipt';
  };

  const getCreditsDisplay = () => {
    if (!userCredits) return '0';
    if (userCredits.subscription === 'premium' || userCredits.subscription === 'yearly' || userCredits.subscription === 'founder') {
      return 'Unlimited';
    }
    return String(userCredits.credits || 0);
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
        className="rounded-2xl p-4 text-white cursor-pointer h-full flex flex-col justify-between bg-gray-800/50 relative group"
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
      <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Loading your dashboard...</h1>
          <p className="text-purple-200">Getting your credits and receipts ready</p>
        </div>
      </div>
    );
  }

  // Add additional safety check
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Please sign in</h1>
          <p className="text-purple-200">You need to be logged in to view your dashboard</p>
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
      <div className="container mx-auto px-4 py-8 text-white">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-black">Your Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email || 'User'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton 
              to="/chat-input" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Receipt
            </LinkButton>
            <LinkButton to="/pricing" variant="outline" className="text-white border-purple-400 hover:bg-purple-500/20">
              Pricing
            </LinkButton>
            <LinkButton to="/refer" variant="outline" className="text-white border-purple-400 hover:bg-purple-500/20">
              Earn Rewards
            </LinkButton>
            <LinkButton to="/about" variant="outline" className="text-white border-purple-400 hover:bg-purple-500/20">
              About
            </LinkButton>
            {/* Only show coupon button for free users */}
            {userCredits.subscription === 'free' && (
              <Button 
                variant="outline" 
                className="text-white border-yellow-400 hover:bg-yellow-500/20"
                onClick={() => setIsCouponModalOpen(true)}
              >
                <Gift className="mr-2 h-4 w-4" /> Have a Coupon?
              </Button>
            )}
            {user ? (
              <Button variant="outline" className="text-white border-red-400 hover:bg-red-500/20" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <Button variant="outline" className="text-white border-green-400 hover:bg-green-500/20" onClick={handleLogin}>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            )}
          </div>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="meme-card p-6 rounded-2xl">
            <h2 className="font-bold text-xl mb-2 flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-400" />
              Plan Status
            </h2>
            <p className="text-2xl font-bold gradient-text">{getPlanName(userCredits.subscription)}</p>
          </div>
          
          <div className="meme-card p-6 rounded-2xl">
            <h2 className="font-bold text-xl mb-2 flex items-center justify-between">
              <span className="flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-green-400" />
                Credits
              </span>
              <button
                onClick={() => {
                  console.log('🔄 Manual credit refresh requested');
                  if (user?.id) fetchData(user.id);
                }}
                className="text-xs px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-md transition-colors"
                title="Refresh credits"
              >
                Refresh
              </button>
            </h2>
            <p className="text-2xl font-bold gradient-text">{getCreditsDisplay()}</p>
            {userCredits.subscription === 'free' && (
              <p className="text-sm text-gray-400 mt-1">Resets daily at midnight UTC (8pm ET / 5pm PT)</p>
            )}
          </div>

          <div className="meme-card p-6 rounded-2xl">
            <h2 className="font-bold text-xl mb-2 flex items-center">
              <Gift className="mr-2 h-5 w-5 text-purple-400" />
              Referrals
            </h2>
            <p className="text-2xl font-bold gradient-text">{referralStats?.totalReferrals || 0}</p>
            <p className="text-sm text-gray-400 mt-1">+{referralStats?.bonusCreditsEarned || 0} bonus credits</p>
          </div>
           
          <div className="meme-card p-6 rounded-2xl flex flex-col justify-center items-center">
            <h2 className="font-bold text-xl mb-3 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
              Actions
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {/* Receipt Saving Toggle for Premium Users - DISABLED FOR LAUNCH */}
              {/* {(userCredits?.subscription === 'premium' || userCredits?.subscription === 'yearly' || userCredits?.subscription === 'founder') && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">Save Receipts</span>
                    <span className="text-xs text-gray-400">
                      {receipts.length}/50 saved
                      {receipts.length >= 45 && (
                        <span className="text-yellow-400 ml-1">⚠️ Near limit</span>
                      )}
                    </span>
                  </div>
                  <Switch
                    checked={saveReceipts}
                    onCheckedChange={handleSaveReceiptsToggle}
                    className="ml-2"
                  />
                </div>
              )} */}
              
              {userCredits?.subscription === 'free' && (
                <LinkButton to="/pricing" size="sm" variant="outline" className="text-xs">
                  Upgrade Plan
                </LinkButton>
              )}
              <LinkButton to="/refer" size="sm" variant="secondary" className="text-xs">
                Refer Friends
              </LinkButton>
            </div>
          </div>
        </motion.div>

        {/* Referral Progress Section */}
        {user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <ReferralProgressCard userId={user.id} userCredits={userCredits} />
          </motion.section>
        )}

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
      
      {/* Coupon Modal */}
      <CouponModal 
        isOpen={isCouponModalOpen} 
        onClose={() => setIsCouponModalOpen(false)} 
      />
    </>
  );
};

export default DashboardPage;