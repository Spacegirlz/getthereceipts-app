import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Sparkles, Ghost, Crown, Zap, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Helmet } from 'react-helmet';
import { useStripe } from '@stripe/react-stripe-js';
import PurchasePopup from '@/components/PurchasePopup';
import { injectMovingGradientStyles } from '@/utils/gradientUtils';

// Helper function to get price value for Rewardful tracking
const getPriceValue = (priceId) => {
  const priceMap = {
    'price_1QZ8Xj2eZvKYlo2C1234567890': 9.99, // Monthly
    'price_1QZ8Xj2eZvKYlo2C0987654321': 29.99, // OG Founder
    'price_1QZ8Xj2eZvKYlo2C1122334455': 99.99, // Yearly
  };
  return priceMap[priceId] || 0;
};

const SocialProofTicker = () => {
  const items = [
    "Jessica just found out he's breadcrumbing",
    "Marcus discovered she actually likes him",
    "Tyler realized the red flags were a parade",
    "Sarah's mom is indeed guilt tripping",
    "Alex confirmed it was, in fact, 'just a joke'",
    "Megan's Hinge date is love-bombing her",
  ];

  return (
    <div className="relative w-full h-12 overflow-hidden bg-gray-900/50 mt-8 rounded-full border-2 border-blue-500/30">
      <div className="absolute top-0 left-0 w-max h-full flex items-center animate-scroll">
        {items.concat(items).map((item, index) => (
          <span key={index} className="text-gray-300 text-md mx-6 whitespace-nowrap">
             <Sparkles className="inline-block h-4 w-4 mr-2 text-yellow-400" /> {item} •
          </span>
        ))}
      </div>
    </div>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const { openModal } = useAuthModal();
  const stripe = useStripe();
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [founderCount, setFounderCount] = useState(353); // Dynamic counter - 147 spots remaining
  const [spotsLeft, setSpotsLeft] = useState(73); // Dynamic spots counter
  const [isChanging, setIsChanging] = useState(false); // Track when counter is changing
  const [referralId, setReferralId] = useState(null);

  // Scroll to top on page load to ensure consistent landing position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Detect referral from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralParam = urlParams.get('via') || urlParams.get('ref') || urlParams.get('referral');
    if (referralParam) {
      setReferralId(referralParam);
      console.log('Referral detected on pricing page:', referralParam);
    }
  }, []);

  // Inject moving gradient styles
  useEffect(() => {
    injectMovingGradientStyles();
  }, []);

  // Dynamic founder counter that ticks up very slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setFounderCount(prev => {
        if (prev < 487) {
          // Only increase by 1 every 5-10 minutes (much slower)
          const shouldIncrease = Math.random() < 0.1; // 10% chance each interval
          if (shouldIncrease) {
            return Math.min(prev + 1, 487);
          }
          return prev;
        }
        return 487; // Cap at 487
      });
    }, 300000 + Math.random() * 300000); // 5-10 minutes between checks

    return () => clearInterval(interval);
  }, []);

  // Dynamic spots counter that decreases slowly (ticker effect) - DISABLED FOR NOW
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSpotsLeft(prev => {
  //       if (prev > 1) {
  //         // Decrease by 1 every 10-30 seconds for testing (was 2-5 minutes)
  //         const shouldDecrease = Math.random() < 0.5; // 50% chance each interval for testing
  //         if (shouldDecrease) {
  //           console.log(`🎯 TICKER: Decreasing spots from ${prev} to ${prev - 1}`);
  //           setIsChanging(true);
  //           setTimeout(() => setIsChanging(false), 800); // Reset after animation
  //           return Math.max(prev - 1, 1);
  //         }
  //         return prev;
  //       }
  //       return 1; // Minimum of 1 spot left
  //     });
  //   }, 5000 + Math.random() * 5000); // 5-10 seconds between decreases for testing

  //   return () => clearInterval(interval);
  // }, []);

  const handleCheckout = async (priceId, tierName) => {
    if (!user) {
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

      // Note: Conversion tracking happens on success page after payment, not before checkout

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
        description: "Failed to initialize payment. Please try again.",
      });
      setLoadingPriceId(null);
    }
  };

  const pricingTiers = [
    {
      id: 'free',
      name: 'Free Truth Receipt',
      price: '$0',
      priceSub: '/forever',
      subtitle: 'For testing the waters',
      features: [
        '1 Receipt from Sage per day',
        'Pattern detection + verdict',
        'Shareable result card',
        'No login or credit card required',
        '🔒 Zero storage. Never used for training. Privacy-first'
      ],
      tag: 'Start free. Upgrade when you\'re ready.',
      buttonText: 'Start FREE',
      buttonAction: () => navigate('/chat-input'),
      buttonClass: 'bg-transparent border-2 border-purple-500 text-white hover:bg-purple-500/10 hover:border-purple-400 font-semibold',
      icon: '🕊️',
      microcopy: 'For testing the waters'
    },
    {
      id: 'premium',
      name: 'Unlimited Monthly Clarity',
      price: '$6.99',
      priceSub: '/month',
      originalPrice: '$9.99',
      subtitle: 'For the ones who spiral in silence',
      features: [
        'UNLIMITED Receipts from Sage',
        'Sage\'s Pattern Masterclass™ (she\'ll teach you her tricks)',
        'Vibe Check™ real-time detection',
        'Cancel anytime',
        '🔒 Zero storage. Never used for training. Privacy-first'
      ],
      tag: 'Never spiral alone again.',
      buttonText: 'Unlock Unlimited Monthly Clarity',
      priceId: 'price_1RzgEZG71EqeOEZejcCAFxQs',
      buttonClass: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/25',
      icon: '🔥',
      microcopy: 'For the ones who spiral in silence',
      discount: '30% OFF'
    },
    {
      id: 'founder',
      name: 'OG Founder\'s Club',
      price: '$29.99',
      priceSub: '/year',
      originalPrice: '$99.99',
      subtitle: 'For the ones ready to trust their gut',
      monthlyEquivalent: 'Less than $2.50/month',
      features: [
        'Everything in Monthly plan',
        'Price locked forever',
        'First access to new features',
        'Direct input to improve Sage',
        'Group Chat Receipts COMING SOON',
        '🔒 Zero storage. Never used for training. Privacy-first'
      ],
      get tag() { return `Next ${spotsLeft} members pay $49/month`; },
      buttonText: 'Lock in OG Founders Price',
      priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R',
      buttonClass: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden',
      icon: '👑',
      founder: true,
      discount: '70% OFF',
      microcopy: 'For the ones ready to trust their gut',
      sagePick: true,
      spotsLeft: 73
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white overflow-hidden px-4 py-8 relative">
      <Helmet>
        <title>Pricing - Get The Receipts</title>
        <meta name="description" content="Choose your truth level. From free daily receipts to unlimited chaos decoded." />
      </Helmet>

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.3),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Matte Rich Design System */}
      <style jsx="true">{`
        .founder-card {
          position: relative;
          background: rgba(20, 25, 45, 0.6);
          backdrop-filter: blur(25px);
          border: 1px solid;
          border-radius: 24px;
          padding: 32px;
          transform: scale(1.03);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 24px 70px rgba(255, 215, 0, 0.15);
          animation: founderBorderPulse 5s ease-in-out infinite;
        }

        .founder-card:hover {
          backdrop-filter: blur(30px);
          transform: scale(1.04);
          box-shadow: 0 32px 90px rgba(255, 215, 0, 0.22);
        }

        .premium-founder-button {
          background: linear-gradient(135deg, #9D5FFF, #00E0E0);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 8px 25px rgba(157, 95, 255, 0.3);
        }

        .premium-founder-button:hover {
          background: linear-gradient(135deg, #8B4FE6, #00C5C5);
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(157, 95, 255, 0.4);
        }

        .free-card {
          background: rgba(15, 20, 35, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 116, 139, 0.25);
          border-radius: 24px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }

        .free-card:hover {
          backdrop-filter: blur(25px);
          border-color: rgba(100, 116, 139, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .premium-card {
          background: rgba(30, 27, 75, 0.5);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(157, 95, 255, 0.35);
          border-radius: 24px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 45px rgba(157, 95, 255, 0.12);
        }

        .premium-card:hover {
          backdrop-filter: blur(30px);
          border-color: rgba(157, 95, 255, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 18px 60px rgba(157, 95, 255, 0.18);
        }

        .discount-badge {
          animation: badgePulse 2s ease-in-out infinite;
          z-index: 50;
        }

        @keyframes badgePulse {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.05);
          }
        }

        @keyframes subtleBorderPulse {
          0% {
            border: 1px solid rgba(131, 88, 255, 0.3);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
          50% {
            border: 1px solid rgba(131, 88, 255, 0.8);
            box-shadow: 0 0 10px rgba(131, 88, 255, 0.3);
          }
          100% {
            border: 1px solid rgba(131, 88, 255, 0.3);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
          }
        }

        .free-tier-glow {
          background: linear-gradient(135deg, #0D0A1F, #1A1C2B);
          border: 1px solid rgba(131, 88, 255, 0.4);
          box-shadow: 0 0 8px rgba(131, 88, 255, 0.2);
          transition: all 0.3s ease-in-out;
        }

        .free-tier-glow:hover {
          box-shadow: 0 0 15px rgba(131, 88, 255, 0.3);
          border-color: rgba(131, 88, 255, 0.6);
        }

        .premium-tier-glow {
          background: linear-gradient(135deg, #0D0A1F, #1A1C2B);
          border: 1px solid rgba(131, 88, 255, 0.4);
          box-shadow: 0 0 8px rgba(131, 88, 255, 0.2);
          transition: all 0.3s ease-in-out;
        }

        .premium-tier-glow:hover {
          box-shadow: 0 0 15px rgba(131, 88, 255, 0.3);
          border-color: rgba(131, 88, 255, 0.6);
        }


        @keyframes premiumButtonGlow {
          0% { 
            box-shadow: 
              0 6px 25px rgba(255, 215, 0, 0.4),
              0 3px 12px rgba(0, 0, 0, 0.2);
          }
          100% { 
            box-shadow: 
              0 8px 30px rgba(255, 215, 0, 0.5),
              0 4px 15px rgba(0, 0, 0, 0.25);
          }
        }

        @keyframes tickerPulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
            color: #fbbf24;
          }
          50% { 
            opacity: 0.9;
            transform: scale(1.05);
            color: #f59e0b;
          }
        }

        @keyframes tickerChange {
          0% { 
            transform: scale(1);
            color: #fbbf24;
          }
          50% { 
            transform: scale(1.2);
            color: #ef4444;
          }
          100% { 
            transform: scale(1);
            color: #fbbf24;
          }
        }

        .ticker-counter {
          animation: tickerPulse 3s ease-in-out infinite;
          transition: all 0.5s ease;
          display: inline-block;
          font-weight: bold;
        }

        .ticker-counter.changing {
          animation: tickerChange 0.8s ease-in-out;
        }

        .gradient-text {
          background: linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .most-popular-banner {
          position: absolute;
          top: -15px;
          right: -15px;
          background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(255, 107, 53, 0.4);
          z-index: 50;
          animation: bannerGlow 3s ease-in-out infinite alternate;
        }

        @keyframes bannerGlow {
          0% { 
            box-shadow: 0 2px 10px rgba(255, 107, 53, 0.4);
          }
          100% { 
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.6);
          }
        }

        .urgent-pulse {
          animation: urgentPulse 1.5s ease-in-out infinite;
        }

        @keyframes urgentPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
          }
        }

        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .emergency-pack-border {
          border-color: #ff1493;
        }

        .emergency-pack-border:hover {
          animation: emergencyPulse 1.5s ease-in-out infinite;
        }

        @keyframes emergencyPulse {
          0%, 100% { 
            border-color: #ff1493;
            box-shadow: 0 0 10px rgba(255, 20, 147, 0.3);
          }
          50% { 
            border-color: #ff69b4;
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
          }
        }

        .premium-border {
          border-color: #4de0d3;
          box-shadow: 0 0 15px rgba(77, 224, 211, 0.4);
        }

        .premium-border:hover {
          box-shadow: 0 0 25px rgba(77, 224, 211, 0.6);
        }


        .animate-gradient {
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes founderBorderPulse {
          0% {
            border-color: #00FFFF;
            box-shadow: 0 24px 70px rgba(0, 255, 255, 0.15);
          }
          25% {
            border-color: #20B2AA;
            box-shadow: 0 24px 70px rgba(32, 178, 170, 0.15);
          }
          50% {
            border-color: #8A2BE2;
            box-shadow: 0 24px 70px rgba(138, 43, 226, 0.15);
          }
          75% {
            border-color: #FF69B4;
            box-shadow: 0 24px 70px rgba(255, 105, 180, 0.15);
          }
          100% {
            border-color: #00FFFF;
            box-shadow: 0 24px 70px rgba(0, 255, 255, 0.15);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-8 py-6 bg-black/85 border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔮</span>
          </div>
          <a href="/" className="text-xl font-bold moving-gradient-text hover:opacity-80 transition-opacity">
            Get The Receipts
          </a>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center space-x-6"
        >
          <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="/refer" className="text-gray-300 hover:text-white transition-colors">Earn Rewards</a>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
          <Button
            onClick={() => openModal('sign_in')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            → Sign In
          </Button>
        </motion.div>
      </nav>

      <div className="max-w-6xl mx-auto pt-32">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.h1 
            id="pricing_1"
            className="text-5xl md:text-7xl font-black mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your gut already knew.<br />
            <span className="moving-gradient-text">Sage just gives her take.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Receipts in 60 seconds. No shame. No storage. Just Sage's take.
          </motion.p>

          {/* Bullet Points */}
          <motion.div 
            className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-300">Bank-level encryption</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-300">Never stored, always deleted</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-300">Results in 60 seconds</span>
            </div>
          </motion.div>

        </div>


        {/* Pricing Grid - Enhanced Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col h-full p-8 transition-all duration-300 ${
                tier.founder 
                  ? 'founder-card' 
                  : tier.id === 'premium'
                    ? 'premium-card'
                    : 'free-card'
              }`}
            >
              {/* Badges */}
              {tier.sagePick && (
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full text-base font-bold shadow-lg" style={{zIndex: 50}}>
                  SAGE'S PICK
                </div>
              )}
              {tier.discount && (
                <div className={`absolute -top-4 ${tier.sagePick ? '-right-4' : 'left-1/2 transform -translate-x-1/2'} bg-purple-500 text-white px-4 py-2 rounded-full text-base font-bold`} style={{zIndex: 50}}>
                  {tier.discount}
                </div>
              )}

              {/* SECTION 1: Header - Icon & Name (Fixed Height) */}
              <div className="text-center h-32 flex flex-col justify-center mb-2">
                <div className="text-4xl mb-3">
                  {tier.icon}
                </div>
                <h3 
                  className={`text-xl font-semibold leading-tight tracking-tight ${tier.founder ? '' : 'text-white'}`}
                  style={tier.founder ? {
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  } : {}}
                >
                  {tier.name}
                </h3>
              </div>

              {/* SECTION 2: Price & Subtitle (Fixed Height) */}
              <div className="text-center h-44 flex flex-col justify-start mb-4">
                {/* Main Price - This will align perfectly */}
                <div className="h-12 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-3">
                    {tier.originalPrice && (
                      <span className="text-lg text-gray-500 line-through font-medium">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span 
                      className={`text-4xl font-light tracking-tight ${tier.founder ? 'gradient-text' : 'text-white'}`}
                    >
                      {tier.price}
                    </span>
                    {tier.priceSub && (
                      <span 
                        className={`text-lg font-light ${tier.founder ? 'gradient-text' : 'text-gray-300'}`}
                      >
                        {tier.priceSub}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Monthly Equivalent - Consistent spacing for all cards */}
                <div className="h-5 mb-2 flex items-center justify-center">
                  {tier.monthlyEquivalent ? (
                    <p 
                      className={`text-sm font-medium tracking-wide ${tier.founder ? 'gradient-text' : 'text-gray-400'}`}
                    >
                      {tier.monthlyEquivalent}
                    </p>
                  ) : (
                    <div></div>
                  )}
                </div>
                
                <p className="text-sm text-gray-200 font-light italic tracking-wide">
                  "{tier.subtitle}"
                </p>
                
                {/* Spots Left Box - Inside pricing section */}
                {tier.founder && (
                  <div className="relative bg-transparent border border-purple-400/50 rounded-lg p-3 pt-4 mt-3 w-full mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/5 rounded-lg"></div>
                    <div className="relative z-10">
                      <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-violet-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(100 - spotsLeft)}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs text-purple-300 sm:whitespace-nowrap break-words">
                        Price jumps to $49 in <span className={`ticker-counter font-bold ${isChanging ? 'changing' : ''}`}>{spotsLeft}</span> signups
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Features (Fixed Height) */}
              <div className="h-64 mb-4 mt-2">
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-100 text-sm leading-relaxed font-medium tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Bottom - Button and Tag line (Fixed Height) */}
              <div className="h-32 flex flex-col justify-between">
                {/* Button */}
                <Button
                  className={`w-full py-3 rounded-xl transition-all duration-500 mb-2 font-semibold tracking-wide ${tier.buttonClass}`}
                  onClick={() => {
                    if (tier.buttonAction) {
                      tier.buttonAction();
                    } else if (tier.priceId) {
                      handleCheckout(tier.priceId, tier.name);
                    }
                  }}
                  disabled={loadingPriceId === tier.priceId}
                >
                  {loadingPriceId === tier.priceId ? (
                    'Redirecting...'
                  ) : (
                    tier.buttonText
                  )}
                </Button>
                
                {/* Clean Social Proof */}
                <div className="text-center">
                  {tier.founder ? (
                    <div className="text-xs text-gray-300">
                      <span className="font-bold text-white">{founderCount}</span> founders joined • Only <span className={`ticker-counter font-bold text-yellow-300 ${isChanging ? 'changing' : ''}`}>{spotsLeft}</span> spots left
                    </div>
                  ) : (
                    <p className="text-sm text-gray-200 leading-relaxed text-center font-light tracking-wide">
                      {tier.tag}
                    </p>
                  )}
                </div>
                
                {/* Instant Access for Founder's Club */}
                {tier.founder && (
                  <p className="text-xs text-center mt-1 text-yellow-300 font-bold tracking-wider uppercase">
                    ⚡ INSTANT ACCESS
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emotional Anchor Tagline */}
        <div className="text-center mt-12 mb-8">
          <p className="text-xl font-medium text-gray-300">
            ✨ <span className="text-white">Start free. Upgrade when you're ready.</span>
          </p>
        </div>

        {/* How OG Founder Pricing Works Section */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-12 md:p-16 text-center">
              
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{color: '#C3B1E1'}}>
                How OG Founder Pricing Works
              </h2>
              
              <div className="text-lg text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed space-y-4">
                <p>
                  <span className="text-white font-semibold">Let's be real: OGs get the best perks.</span>
                </p>
                <p className="font-medium">
                  This price is for you → the ones getting in on the ground floor before this thing blows up.
                </p>
                <p className="text-sm font-light">
                  Here's the deal: As we add more game-changing features and the community grows, the value will go up. And so will the price. Your reward for believing in Sage first is locking in this price for life. It will never increase for you. Ever.
                </p>
                <p className="text-yellow-400">
                  As our community grows, Sage's annual price increases:
                </p>
              </div>

              {/* Tiered Pricing List */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-red-400 text-2xl">✅</span>
                    <span className="text-red-400 text-lg">First 200 users: <span className="text-red-400 font-semibold">$19/year</span> <span className="text-red-400">(SOLD OUT)</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400 text-2xl">🔥</span>
                    <span className="text-yellow-300 text-lg">Users 201-500: <span className="text-yellow-300 font-semibold">$29.99/year</span> <span className="text-yellow-300">(73 spots left)</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400 text-2xl">📈</span>
                    <span className="text-gray-500 text-lg">Users 501-1,000: <span className="text-gray-400">$49/year</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400 text-2xl">📈</span>
                    <span className="text-gray-500 text-lg">Users 1,001-2,000: <span className="text-gray-400">$69/year</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400 text-2xl">📈</span>
                    <span className="text-gray-500 text-lg">Users 2,000+: <span className="text-gray-400">$99/year +</span></span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-8 max-w-2xl mx-auto">
                The $19 price is gone forever, but you can still lock in $29.99 before it jumps to $49.
              </p>

              {/* Progress Bar - Matches the ticker counter */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative bg-transparent border border-purple-400/50 rounded-lg p-3 pt-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/5 rounded-lg"></div>
                  <div className="relative z-10">
                    <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-violet-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(100 - spotsLeft)}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-sm text-purple-300 sm:whitespace-nowrap break-words">
                      Price jumps to $49 in <span className={`ticker-counter font-bold ${isChanging ? 'changing' : ''}`}>{spotsLeft}</span> signups
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-yellow-400 mb-8 max-w-2xl mx-auto sm:whitespace-nowrap break-words">
                Once you lock in a founder price, it never changes - even when everyone else pays more.
              </p>

              <Button
                className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-pink-500/30 transform hover:scale-105"
                onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
              >
                👑 Claim OG Founder Status
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Privacy Trust Block */}
        <motion.div 
          className="mt-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900/60 via-green-900/10 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-green-500/20 p-8 md:p-12 text-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <p className="text-lg text-gray-300 font-medium tracking-wide leading-relaxed">
                  Sage doesn't keep tabs on your receipts. Your texts vanish the second she's done reading them. No storage, no training, no judgment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Animated Testimonials */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <SocialProofTicker />
        </motion.div>

        {/* Enhanced Comparison Section */}
        <motion.div 
          className="mt-20 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still thinking? Let's compare.
            </h2>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900/40 via-orange-900/10 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-orange-500/20 overflow-hidden">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-600">
                {/* What $6.99 gets you elsewhere */}
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">🍸</div>
                    <h3 className="text-xl font-bold text-red-400">
                      What $6.99 gets you elsewhere
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">❌</span>
                      <span className="text-gray-300">One overpriced latte you'll Instagram</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">❌</span>
                      <span className="text-gray-300">Half a therapy session you'll cancel</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">❌</span>
                      <span className="text-gray-300">3 minutes with a psychic who'll lie</span>
                    </div>
                  </div>
                </div>

                {/* What $6.99 gets you here */}
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">🧾</div>
                    <h3 className="text-xl font-bold text-green-400">
                      What $6.99 gets you here
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✅</span>
                      <span className="text-gray-300">Unlimited receipts from someone who gets it</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✅</span>
                      <span className="text-gray-300">Screenshots that'll vindicate you in the group chat</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✅</span>
                      <span className="text-gray-300">Finally knowing if 'k' was aggressive or just lazy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="p-6 text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-t border-gray-600">
                <p className="text-xl font-bold text-white">The math is mathing, bestie.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA Block */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900/60 via-green-900/20 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-green-500/20 p-12 md:p-16 text-center">
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-gradient">Ready for Sage's Take?</h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                Drop the chat. Get Sage's take. <span className="italic text-violet-300">She's already rolling her eyes at their text.</span>
              </p>
              <p className="text-lg text-gray-400 italic mb-12">
                One click. No judgment. Just perspective.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center max-w-4xl mx-auto">
                <Button
                  onClick={() => navigate('/chat-input')}
                  className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-bold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg"
                >
                  Start Free
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/30 transform hover:scale-105"
                  onClick={() => handleCheckout('price_1S0Po4G71EqeOEZeSqdB1Qfa', 'Emergency Pack')}
                >
                  🚨 Emergency Pack
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/30 transform hover:scale-105"
                  onClick={() => handleCheckout('price_1RzgEZG71EqeOEZejcCAFxQs', 'Premium')}
                >
                  Go Unlimited Monthly
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 transform hover:scale-105"
                  onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
                >
                  Claim OG Founder Status
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Trust Footnote */}
        <motion.div 
          className="text-center mt-16 pb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/15 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/80 via-purple-900/30 to-slate-800/80 backdrop-blur-xl rounded-3xl border-2 border-purple-500/30 p-10 md:p-12 shadow-2xl shadow-purple-500/10">
              <div className="text-center">
                <p className="text-gray-300 text-base mb-6 font-medium">
                  For 16+ Entertainment Purposes Only. Sage is an AI character with opinions, not facts. Her takes are for fun and perspective, not professional advice.
                </p>
                <p className="text-gray-400 text-sm">
                  By using this site, you agree to our <a href="/terms-of-service" className="text-purple-400 hover:text-purple-300 underline font-medium">Terms</a> & <a href="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline font-medium">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

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
                <a href="/about" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="/refer" className="block text-gray-400 hover:text-white transition-colors">Earn & Refer</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="/refund-policy" className="block text-gray-400 hover:text-white transition-colors">Refund Policy</a>
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

      {/* Purchase Notification Popup */}
      <PurchasePopup />
    </div>
  );
};

export default PricingPage;