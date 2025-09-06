import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/database/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Gift, Settings, Receipt, Loader2, Frown, CreditCard, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { getUserCredits, getUserReferralCode, getReferralStats, initializeUserCredits, addCredits } from '@/lib/services/creditsSystem';
import { useStripe } from '@stripe/react-stripe-js';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const stripe = useStripe();
  
  const [receipts, setReceipts] = useState([]);
  const [userCredits, setUserCredits] = useState({ credits: 0, subscription: 'free' });
  const [referralData, setReferralData] = useState({ referralCode: '', uses: 0 });
  const [referralStats, setReferralStats] = useState({ totalReferrals: 0, bonusCreditsEarned: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (userId) => {
    setLoading(true);
    try {
      // Fetch receipts
      const { data: receiptsData, error: receiptsError } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (receiptsError) throw receiptsError;
      setReceipts(receiptsData || []);

      // Initialize user credits if they don't exist
      await initializeUserCredits(userId);

      // Fetch user credits
      const creditsData = await getUserCredits(userId);
      setUserCredits(creditsData);

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
      
      // Check if user just purchased credits
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('credits_purchased') === 'true') {
        // Add 10 credits for the $2.49 purchase
        addCredits(user.id, 10, 'credit_pack_purchase').then(() => {
          toast({
            title: '🚀 Credits Added!',
            description: '10 credits have been added to your account.',
          });
          // Remove the parameter from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          // Refresh data to show new credits
          fetchData(user.id);
        });
      }
    } else if (!authLoading && !user) {
      setLoading(false);
      navigate('/');
    }
  }, [user, authLoading, fetchData, navigate, toast]);

  const handleBuyCredits = async () => {
    if (!stripe || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to process payment. Please try again.',
      });
      return;
    }

    try {
      // Redirect to Stripe Checkout for the $2.49 credit pack
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_1SoPo4G71EqeOEZe8qcB1Qfa', quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/dashboard`,
        customerEmail: user.email,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        toast({
          variant: 'destructive',
          title: 'Payment Error',
          description: error.message || 'Could not redirect to checkout.',
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unable to process payment. Please try again.',
      });
    }
  };

  const getPlanName = (subscription) => {
    if (subscription === 'premium') return 'Premium Monthly';
    if (subscription === 'yearly') return "Founder's Pass";
    return 'Forever Free';
  };

  const getCreditsDisplay = () => {
    if (userCredits.subscription === 'premium' || userCredits.subscription === 'yearly') {
      return 'Unlimited';
    }
    return userCredits.credits.toString();
  };

  const MiniReceiptCard = ({ receipt }) => {
    const analysisResult = receipt.analysis_result || {};
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="rounded-2xl p-4 text-white cursor-pointer h-full flex flex-col justify-between bg-gray-800/50"
        onClick={() => navigate(`/receipts/${receipt.id}`, { state: { ...receipt, analysis: analysisResult } })}
      >
        <div>
          <h3 className="font-bold text-lg truncate">{analysisResult.archetype || 'Analysis'}</h3>
          <p className="text-sm opacity-80 truncate">{receipt.original_message}</p>
        </div>
        <div className="mt-4 text-xs opacity-70">
          {new Date(receipt.created_at).toLocaleDateString()}
        </div>
      </motion.div>
    );
  };
  
  if (authLoading || loading) {
     return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
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
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button className="viral-button" onClick={() => navigate('/chat-input')}><PlusCircle className="mr-2 h-4 w-4" /> New Receipt</Button>
            <Button variant="outline" className="text-white border-purple-400 hover:bg-purple-500/20" onClick={() => navigate('/refer')}><Gift className="mr-2 h-4 w-4" /> Refer Friends</Button>
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
            <h2 className="font-bold text-xl mb-2 flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-green-400" />
              Credits
            </h2>
            <p className="text-2xl font-bold gradient-text">{getCreditsDisplay()}</p>
            {userCredits.subscription === 'free' && (
              <p className="text-sm text-gray-400 mt-1">Resets monthly</p>
            )}
          </div>

          <div className="meme-card p-6 rounded-2xl">
            <h2 className="font-bold text-xl mb-2 flex items-center">
              <Gift className="mr-2 h-5 w-5 text-purple-400" />
              Referrals
            </h2>
            <p className="text-2xl font-bold gradient-text">{referralStats.totalReferrals}</p>
            <p className="text-sm text-gray-400 mt-1">+{referralStats.bonusCreditsEarned} bonus credits</p>
          </div>
           
          <div className="meme-card p-6 rounded-2xl flex flex-col justify-center items-center">
            <h2 className="font-bold text-xl mb-3 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
              Actions
            </h2>
            <div className="flex flex-col gap-2 w-full">
              {userCredits.subscription === 'free' && userCredits.credits < 2 && (
                <Button size="sm" className="viral-button text-xs" onClick={handleBuyCredits}>
                  Buy 10 Credits ($2.49)
                </Button>
              )}
              {userCredits.subscription === 'free' && (
                <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate('/pricing')}>
                  Upgrade Plan
                </Button>
              )}
              <Button size="sm" variant="secondary" className="text-xs" onClick={() => navigate('/refer')}>
                Refer Friends
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center"><Receipt className="mr-3"/>Your Receipt History</h2>
          {receipts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {receipts.map(receipt => <MiniReceiptCard key={receipt.id} receipt={receipt} />)}
            </div>
          ) : (
            <div className="text-center meme-card p-10 rounded-2xl">
              <Frown className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-2xl font-bold">No Receipts Found</h3>
              <p className="text-gray-400 mb-6">Looks like you haven't decoded any messages yet, or you have history turned off.</p>
              <Button className="viral-button" onClick={() => navigate('/chat-input')}>Get Your First Receipt</Button>
            </div>
          )}
        </motion.section>
      </div>
    </>
  );
};

export default DashboardPage;