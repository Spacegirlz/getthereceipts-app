import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Check, Shield, Zap } from 'lucide-react';
import { useStripe } from '@stripe/react-stripe-js';
import HorizontalTicker from '../components/HorizontalTicker';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { useToast } from '../components/ui/use-toast';

const PricingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isPremium, loading } = useAuth();
  const { openModal } = useAuthModal();
  const stripe = useStripe();
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [referralId, setReferralId] = useState(null);
  const [liveUserCount, setLiveUserCount] = useState(150);
  const OG_TOTAL_SPOTS = 500;
  const OG_SPOTS_LEFT = 487;
  const ogClaimedPercent = Math.max(3, ((OG_TOTAL_SPOTS - OG_SPOTS_LEFT) / OG_TOTAL_SPOTS) * 100);

  // Scroll to top on page load to ensure consistent landing position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Live user counter - increments between 137-168
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        // Randomly fluctuate the number to show live activity
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(137, Math.min(168, newCount)); // Keep between 137-168
      });
    }, 8000); // Update every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async (priceId, tierName) => {
    if (loading) return; // wait for auth to settle
    if (!user) {
      // Store the intended destination for after authentication
      localStorage.setItem('postAuthRedirect', '/pricing');
      openModal('sign_up');
      toast({ 
        title: 'Create an account to upgrade!', 
        description: 'Sign up to unlock premium features and get receipts.'
      });
      return;
    }

    if (!stripe) {
      toast({
        variant: "destructive",
        title: "Stripe Error",
        description: "Stripe is not configured correctly. Please check the console.",
      });
      return;
    }

    setLoadingPriceId(priceId);

    try {
      // Create checkout session via our API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.email,
          referralId: referralId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: error.message || "Could not redirect to checkout.",
        });
        setLoadingPriceId(null);
      }
    } catch (error) {
      console.error("Checkout session error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Could not create checkout session.",
      });
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white px-4 py-8">
      {/* Deep Charcoal Background - Glassmorphism Optimized */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      
      {/* Subtle Depth with Cyan Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      
      {/* Glassmorphism Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10">
      <Helmet>
        <title>Pricing - Get The Receipts</title>
        <meta name="description" content="Choose your truth level. From free daily receipts to unlimited chaos decoded." />
      </Helmet>

        {/* Top Banner - BF5 Freebie */}
        <div className="w-full bg-gradient-to-r from-emerald-500/10 via-emerald-500/10 to-emerald-500/10 backdrop-blur-sm border-b border-emerald-400/30 py-3">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="text-emerald-300 font-semibold text-sm sm:text-base uppercase tracking-[0.35em]">
                Limited Time · Sage's BF Freebie
              </div>
              <div className="text-xs sm:text-sm text-gray-200 font-medium">
                Redeem the <span className="text-emerald-300 font-semibold">BF5</span> coupon in your dashboard for 5 premium receipts + unlimited Sage chat while they last.
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            >
              Simple pricing.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            No surprises.
          </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6"
          >
            Receipts in 60 seconds. No shame. No storage. Just Sage's take.
          </motion.p>
          
          {/* Netflix-Style Clean Cards - OG Founders Gets Special Treatment */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {/* MOST POPULAR Badge for Premium Card - Desktop */}
              <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  MOST POPULAR
                </div>
              </div>
              
              {/* BEST VALUE Badge for OG Founder Card - Desktop */}
              <div className="hidden md:block absolute top-0 right-0 transform translate-x-1/2 -translate-y-3 z-20">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  BEST VALUE
                </div>
              </div>
              
              {/* Free Daily Receipt Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/8 backdrop-blur-xl p-6 sm:p-8 rounded-2xl flex flex-col border-2 border-cyan-400/20 shadow-xl shadow-cyan-500/10" 
                style={{ minHeight: '420px' }}
              >
                <div className="flex-grow">
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-xl mb-3 text-white">Start Free</h3>
                      <div className="text-3xl font-bold text-white mb-2">$0</div>
                      <p className="text-gray-400 text-sm mb-1">Join the first 500</p>
                      <p className="text-cyan-400 text-xs">No Login Needed</p>
                    </div>
                    
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">🧠</span><span>3 Truth Receipts to try</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">💬</span><span>3 Ask Sage Anything chats</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">👀</span><span>See why everyone's obsessed</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">🆓</span><span>No commitment required</span></div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <div className="flex items-center text-cyan-400 text-xs">
                        <span className="mr-2">→</span>
                        <span>Login to get daily FREE Receipts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-gray-300 font-medium mb-4">Perfect for: Curious but cautious</div>
                  <Button onClick={() => navigate('/new-receipt')} variant="outline" className="border-cyan-400/40 text-white hover:bg-cyan-500/20 w-full">
                    Start Free →
                  </Button>
                </div>
              </motion.div>
              
              {/* Premium Monthly Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/8 backdrop-blur-xl p-6 sm:p-8 rounded-2xl flex flex-col border-2 border-cyan-400/30 shadow-xl shadow-cyan-500/15 relative" 
                style={{ minHeight: '420px' }}
              >
                {/* MOST POPULAR Badge - Mobile */}
                <div className="md:hidden absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    MOST POPULAR
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-xl mb-3 text-white">Premium Monthly</h3>
                    <div className="text-4xl font-black text-white mb-2">$4.99</div>
                    <p className="text-gray-400 text-sm">per month</p>
                  </div>
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="text-xs text-gray-400 mb-2">Everything in Free, plus:</div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">🧠</span><span>UNLIMITED Truth Receipts</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">💬</span><span>UNLIMITED Ask Sage Anything</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">🛡️</span><span>Sage's Immunity Training (NEW!)</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">⚡</span><span>Vibe Check™ real-time analysis</span></div>
                    <div className="flex items-start"><span className="text-cyan-400 mr-2 mt-0.5">🚀</span><span>Priority processing</span></div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-gray-300 font-medium mb-4">Perfect for: Done with the drama</div>
                  <Button onClick={() => handleCheckout('price_1SI49tG71EqeOEZe0p9LNpbP', 'Premium Monthly')} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white w-full font-semibold py-3 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-[1.02]">
                    Go Premium
                  </Button>
                </div>
              </motion.div>
              
              {/* OG Founder's Club Card - Special Distinct Component */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative md:col-span-1"
              >
                {/* Distinct Wrapper - Creates Component Feel */}
                <div className="relative bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-cyan-900/30 backdrop-blur-xl p-6 sm:p-8 rounded-3xl flex flex-col border-4 border-purple-400/60 shadow-2xl shadow-purple-500/50 overflow-hidden" 
                  style={{ minHeight: '420px' }}
                >
                  {/* Enhanced Animated Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-purple-500/20 animate-pulse pointer-events-none"></div>
                  
                  {/* Radial Glow Effects for Depth */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Special Badge - Mobile */}
                <div className="md:hidden absolute -top-2 left-1/2 transform -translate-x-1/2 z-30">
                  <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl animate-pulse border-2 border-white/30">
                    🔥 FIRST 500 ONLY
                  </div>
                </div>
                
                {/* BEST VALUE Badge - Desktop */}
                <div className="hidden md:block absolute top-0 right-0 transform translate-x-1/2 -translate-y-3 z-20">
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/50" style={{ willChange: 'transform' }}>
                    BEST VALUE
                  </div>
                </div>
                
                  <div className="flex-grow relative z-10">
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-2xl sm:text-3xl mb-2 text-white">OG FOUNDER'S CLUB</h3>
                      <div className="text-xs sm:text-sm text-purple-300 mb-3 font-semibold">FIRST 500 ONLY</div>
                      <div className="text-4xl sm:text-5xl font-black text-white mb-2">$29.99/year</div>
                      <p className="text-sm text-gray-300 mb-2">Locked in FOREVER</p>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                          <span>{OG_SPOTS_LEFT} spots left</span>
                          <span>{OG_TOTAL_SPOTS - OG_SPOTS_LEFT} claimed</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-300/80 rounded-full" style={{ width: `${ogClaimedPercent}%` }}></div>
                        </div>
                      </div>
                      {/* FOMO Price Comparison */}
                      <div className="mb-3 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                        <p className="text-xs text-gray-300 line-through mb-1">Regular: $59.99/year</p>
                        <p className="text-sm font-bold text-emerald-400">You save $30/year</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-gray-200 text-left mb-6">
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Everything in Premium</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Unlimited receipts</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Priority support</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Early access to new features</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Founder badge</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Price locked forever - even when we raise prices</span></div>
                    </div>
                    {/* Spots Remaining Counter - Enhanced FOMO */}
                    <div className="text-center mb-4">
                      <div className="inline-flex flex-col items-center gap-2 px-4 py-2 bg-red-500/10 backdrop-blur-sm border-2 border-red-400/40 rounded-full">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-red-300 animate-pulse">⏰</span>
                          <span className="text-xs sm:text-sm text-white font-bold">487/500 spots remaining</span>
                        </div>
                        <p className="text-xs text-red-300 font-semibold">After #500: Price doubles to $59.99/year</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto relative z-10">
                    <Button 
                      onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founders Club')} 
                      className="w-full font-bold py-4 sm:py-3 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.03] text-base sm:text-lg relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                        color: '#000000',
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(6, 182, 212, 0.3), 0 8px 32px rgba(139, 92, 246, 0.4)'
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-xl">🔒</span>
                        <span className="font-black">Lock In Founder's Price</span>
                      </span>
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Emergency Packs - Compact 1x2 Row (Below Main Pricing) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-8 max-w-2xl mx-auto mt-12"
            >
              {/* Sage's Voice Explanation */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center text-sm sm:text-base text-gray-300 italic mb-4 px-4"
              >
                Sometimes you just need an emergency pack to put your mind at ease or test out the Premium features. 💅
              </motion.p>
              
              {/* Compact 1x2 Grid */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {/* Emergency Pack x 5 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="bg-white/5 backdrop-blur-xl p-4 rounded-xl flex flex-col border border-purple-400/30 shadow-lg shadow-purple-500/10 hover:border-purple-400/50 transition-all"
                >
                  <div className="text-center mb-3">
                    <div className="text-2xl font-black text-white mb-1">$0.99</div>
                    <p className="text-xs text-gray-400">5 Receipts</p>
                    <p className="text-xs text-purple-400 font-semibold mt-1">+ Premium</p>
                  </div>
                  <Button 
                    onClick={() => handleCheckout('price_1SRl6hG71EqeOEZebPJkKJB6', 'Emergency Pack x5')} 
                    disabled={loadingPriceId === 'price_1SRl6hG71EqeOEZebPJkKJB6'}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white w-full font-semibold py-2 text-sm rounded-lg shadow-md transition-all duration-300 mt-auto"
                  >
                    {loadingPriceId === 'price_1SRl6hG71EqeOEZebPJkKJB6' ? 'Loading...' : 'Get 5'}
                  </Button>
                </motion.div>

                {/* Emergency Pack x 10 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="bg-white/5 backdrop-blur-xl p-4 rounded-xl flex flex-col border border-cyan-400/30 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/50 transition-all"
                >
                  <div className="text-center mb-3">
                    <div className="text-2xl font-black text-white mb-1">$1.99</div>
                    <p className="text-xs text-gray-400">10 Receipts</p>
                    <p className="text-xs text-cyan-400 font-semibold mt-1">+ Premium</p>
                  </div>
                  <Button 
                    onClick={() => handleCheckout('price_1S0Po4G71EqeOEZeSqdB1Qfa', 'Emergency Pack x10')} 
                    disabled={loadingPriceId === 'price_1S0Po4G71EqeOEZeSqdB1Qfa'}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white w-full font-semibold py-2 text-sm rounded-lg shadow-md transition-all duration-300 mt-auto"
                  >
                    {loadingPriceId === 'price_1S0Po4G71EqeOEZeSqdB1Qfa' ? 'Loading...' : 'Get 10'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Subtitle under pricing table */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-lg text-gray-400 text-center mt-8"
            >
              Start free, upgrade when you're ready for unlimited clarity
            </motion.p>
            
            {/* Security Badges - Unified Design (Compact, Single Line) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-8 px-4"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Bank-level encryption</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-cyan-400" />
                <span>Privacy First</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Anonymous</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">💯</span>
                <span>7-day guarantee</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Horizontal Ticker */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <HorizontalTicker />
          </div>
        </section>

        {/* How OG Founder Pricing Works */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How OG Founder Pricing Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Let's be real: <span className="text-white font-semibold">OG Founders and Early Birds get the best perks.</span>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Explanation */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-cyan-400/40 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔒</span>
                    Lifetime Locked Price Deal
                  </h3>
                  <p className="text-gray-300 mb-4">
                    When you lock in your Founder's price, you're not just getting a discount - you're getting a <span className="text-cyan-300 font-semibold">lifetime locked price deal that gets better as we grow.</span>
                  </p>
                  <p className="text-gray-300 mb-3">
                    Lock in your <span className="text-cyan-400 font-bold text-lg">$29.99/year</span> before this one-time OG Launch Offer disappears forever.
                  </p>
                  <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mt-4">
                    <p className="text-sm text-red-300 font-semibold mb-1">⚠️ Price doubles after user #500</p>
                    <p className="text-xs text-gray-300">Starting at user #501, the price increases to <span className="text-red-300 font-bold">$59.99/year</span>. Lock in now to save $30/year forever.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/15 to-cyan-500/10 border border-purple-400/40 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-purple-500/10">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    The Cost of Confusion
                  </h3>
                  <p className="text-gray-300 mb-4">
                    That feeling of confusion is costing you more than just your peace of mind - <span className="text-purple-300 font-semibold">it's costing you time.</span>
                  </p>
                  <p className="text-gray-300">
                    Our OG Founder's Deal gives you unlimited access to Sage's wisdom for just <span className="text-purple-400 font-bold text-lg">$2.49/month</span> (billed annually at $29.99).
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-400/40 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    Privacy First
                  </h3>
                  <p className="text-gray-300">
                    Never stored. Never used for training. <span className="text-emerald-300 font-semibold">Deleted instantly.</span>
                  </p>
                </div>
              </motion.div>

              {/* Right Side - CTA */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-slate-600/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-slate-900/50">
                  <div className="mb-8">
                    <div className="text-6xl font-black text-white mb-2">$29.99</div>
                    <div className="text-xl text-gray-300 mb-2">per year</div>
                    <div className="text-sm text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1 rounded-full inline-block">
                      ($2.49/month) • 40% OFF
                    </div>
                  </div>

                  <div className="space-y-5 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">Price locked FOREVER</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">Unlimited receipts</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">All premium features</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">Founder badge</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founders Club')}
                    className="w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 text-white font-bold py-4 text-lg rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2">🔒</span>
                    Lock In Founder's Price
                  </Button>
                  
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Secure your clarity - before it disappears.
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-600/30">
                    <p className="text-sm text-gray-400 mb-4 text-center">Not ready to commit?</p>
                    <Button 
                      onClick={() => navigate('/new-receipt')}
                      variant="outline"
                      className="border-slate-500/50 text-gray-300 hover:bg-slate-700/30 hover:border-slate-400/70 w-full transition-all duration-300"
                    >
                      Get your free daily receipt first
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Value Comparison */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Let's Do The Math
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-slate-800/40 border border-slate-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-slate-300">"What $29.99 gets you elsewhere:"</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">❌</span>
                    <span className="text-sm sm:text-base">Half a week of overpriced cold lattes you'll Instagram anyway</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">❌</span>
                    <span className="text-sm sm:text-base">10 minutes with a psychic who'll say "someone's thinking of you"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">❌</span>
                    <span className="text-sm sm:text-base">1 month of a dating app subscription that feels icky</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">❌</span>
                    <span className="text-sm sm:text-base">A fraction of a therapy session you can't afford</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">❌</span>
                    <span className="text-sm sm:text-base">That one "self-care" purchase you'll forget about next week</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 }}
                className="bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-cyan-900/30 border-2 border-cyan-400/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl shadow-cyan-500/15"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-white italic">"What $29.99 gets you here:"</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span className="text-sm sm:text-base text-gray-200">Stop replaying that text at 2am. Get clarity whenever your gut's screaming and your brain won't shut up.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span className="text-sm sm:text-base text-gray-200">Price locked forever - while everyone else pays more, you're locked in. Your future self will thank you.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span className="text-sm sm:text-base text-gray-200">Build immunity to the patterns that keep you stuck. See the breadcrumbs before you're already in the forest.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span className="text-sm sm:text-base text-gray-200">Screenshots that'll vindicate you in the group chat. Finally prove you're not crazy - you were right all along.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">✅</span>
                    <span className="text-sm sm:text-base text-gray-200">No more wondering if 'k' was shady or just lazy. No more waiting for clarity. Know what's real, when you need it.</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-12 mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              The math is mathing, bestie.
            </motion.h2>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-12 shadow-2xl shadow-cyan-500/20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to stop guessing?<br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Start knowing. 💅
                </span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join the first 500 getting the truth about their chats. 
                <span className="text-white font-semibold italic"> No more mixed signals.</span>
              </p>
              
              {/* Live Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-full text-sm text-gray-300 mb-8 shadow-lg shadow-cyan-500/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-medium">{liveUserCount}</span> people getting Sage's take right now
              </motion.div>
              
              {/* FOMO Callout */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-400/30 rounded-full">
                      <span className="text-sm text-red-300 font-semibold">⚡ 487 spots left at $29.99</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-300">Price doubles to $59.99 after #500</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button
                  onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founders Club')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 min-h-[56px] min-w-[200px]"
                >
                  Lock In Founder's Price
                </Button>
                
                <Button
                  onClick={() => handleCheckout('price_1SI49tG71EqeOEZe0p9LNpbP', 'Premium Monthly')}
                  variant="outline"
                  className="border-cyan-400/60 text-white hover:bg-cyan-500/10 hover:border-cyan-400/80 font-medium px-6 py-4 rounded-xl transition-all duration-300 min-h-[56px] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                >
                  Go Unlimited Monthly
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span>Bank-level encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>Results in 60 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Never stored or shared</span>
                </div>
              </div>
              
              
              {/* Tiny Badge - Clickable Link */}
              <div className="mt-2">
                <button
                  onClick={() => navigate('/new-receipt')}
                  className="inline-flex items-center px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-xs text-cyan-300 font-medium hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  Click Here to Start Free. Anonymous. No Login Required.
                </button>
              </div>
            </motion.div>
          </div>
        </section>


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
            <p className="text-gray-500 text-xs mb-2">For 16+ Entertainment Purposes Only</p>
            
            {/* Copyright */}
            <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
            
            {/* Support */}
            <p className="text-gray-500 text-xs">
              Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@gettherecipts.com</a>
            </p>
          </div>
        </footer>
        </div>
    </div>
  );
};

export default PricingPage;