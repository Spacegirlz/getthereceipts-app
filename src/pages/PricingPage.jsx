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
    'price_1QZ8Xj2eZvKYlo2C1234567890': 6.99, // Monthly
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
  const { user, isPremium, loading } = useAuth();
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
    if (loading) return; // wait for auth to settle
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
      name: 'Premium Monthly',
      price: '$4.99',
      priceSub: '/month',
      originalPrice: '$6.99',
      subtitle: 'For the ones who spiral in silence',
      features: [
        'Unlimited Truth Receipts',
        'Unlimited Sage Companion',
        'Sage\'s Immunity Training',
        'Vibe Check™ real-time detection',
        'Privacy First - Zero storage',
        'Cancel anytime'
      ],
      tag: 'Never spiral alone again.',
      buttonText: 'Go Premium Monthly',
      priceId: 'price_1SI49tG71EqeOEZe0p9LNpbP',
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
      originalPrice: '$49.99',
      subtitle: 'For the ones ready to trust their gut',
      monthlyEquivalent: 'Less than $2.50/month',
      features: [
        'Everything in Premium +',
        'Founder\'s Circle membership',
        'Lifetime price lock',
        'Privacy First - Zero storage',
        'Exclusive beta access',
        'Group features coming soon'
      ],
      get tag() { return `Next ${spotsLeft} members pay $49.99/year`; },
      buttonText: 'Lock in OG Founders Price',
      priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R',
      buttonClass: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300 relative overflow-hidden',
      icon: '👑',
      founder: true,
      discount: '40% OFF',
      microcopy: 'For the ones ready to trust their gut',
      sagePick: true,
      spotsLeft: 73
    }
  ];

  // Handler functions for pricing buttons
  const handleGetStarted = () => navigate('/chat-input');
  const handleGoPremium = () => {
    // For now, just show a toast - you can implement actual premium logic here
    toast({
      title: 'Premium Coming Soon!',
      description: 'Premium features are being finalized. Stay tuned!'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden px-4 py-8 relative">
      {/* Glossy Black Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(255,255,255,0.01),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-800/5 to-transparent pointer-events-none" />
      
      <Helmet>
        <title>Pricing - Get The Receipts</title>
        <meta name="description" content="Choose your truth level. From free daily receipts to unlimited chaos decoded." />
      </Helmet>

      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.3),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Matte Rich Design System */}
      <style>{`
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

      {/* Navigation removed in favor of global MainHeader */}

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto pt-20">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <div className="text-6xl mb-6 floating-emoji">🎁</div>
          
          <motion.h1 
            id="pricing_1"
            className="text-5xl md:text-7xl font-black mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your gut already knew.<br />
            <span className="gradient-text">Sage just gives her take.</span>
          </motion.h1>
          
          {/* Colored line accent */}
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-purple-500 mx-auto mb-6 rounded-full"></div>
          
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

        {/* The Truth, Served Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32"
        >
          <div className="meme-card p-8 rounded-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">The Truth, Served.</h2>
            
            <div className="space-y-6 text-gray-300 text-left">
              <p className="text-lg md:text-xl leading-relaxed">
                <span className="text-white font-medium">Real talk.</span> We know you've spent 20 minutes drafting a reply just to delete it. We know you check if they watched your story even though they haven't texted back.
              </p>
              
              <p className="text-base md:text-lg leading-relaxed">
                We built Sage to be the friend who grabs your phone and says, 
                <span className="text-white font-bold italic"> "No. They're not 'busy,' they're breadcrumbing you."</span>
              </p>
              
              <div className="pt-4 text-center">
                <p className="text-lg md:text-xl font-bold text-white mb-2">
                  Stop spiraling alone. It's time to see what's <em>really</em> going on.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="w-full max-w-3xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32"
        >
          <div className="meme-card p-8 rounded-3xl" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-8">FAQ</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Is this actually private?</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Yes. We use bank-level encryption and your texts are deleted immediately after analysis. We don't store, train on, or share your data. Ever.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">How accurate is Sage?</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sage is trained on millions of text patterns and relationship dynamics. She's not perfect, but she's pretty damn good at spotting the patterns you might miss.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What if I don't agree with her take?</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  That's totally fine! Sage gives you perspective, not gospel. Use her insights as a starting point for your own analysis.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Absolutely. No contracts, no commitments. Cancel whenever you want, but we think you'll want to keep Sage around.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Math is Mathing, Bestie Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32"
          style={{
            background: 'linear-gradient(180deg, rgba(94, 234, 212, 0.03) 0%, transparent 100%)',
            borderTop: '1px solid rgba(94, 234, 212, 0.1)',
            borderBottom: '1px solid rgba(94, 234, 212, 0.1)',
            padding: '60px 0'
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-10">
            The Math is Mathing, Bestie
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
            <div className="meme-card p-8 rounded-2xl">
              <h3 className="font-bold text-xl mb-6 text-red-400 flex items-center">
                ❌ What $4.99 Gets You Elsewhere
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>One regrettable cocktail you'll stress-drink</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Another month on that dating app that's failing you</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>A fancy coffee that just makes you more anxious</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Half a therapy session where you'll talk about this anyway</span>
                </li>
              </ul>
            </div>
            
            <div className="meme-card p-8 rounded-2xl border-2 border-green-500/30">
              <h3 className="font-bold text-xl mb-6 text-green-400 flex items-center">
                ✅ What $4.99 Gets You Here
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Unlimited receipts on every situationship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Proof for your group chat when they doubt you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Finally knowing if you're being gaslit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Your sanity back (priceless, tbh)</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Beautiful Pricing Section from Landing Page */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="w-full max-w-5xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32 text-center"
        >
          <h2 className="text-4xl font-bold gradient-text mb-6">🎁 You get 3 Receipts free. Then it's one a day.</h2>
          
          <div className="text-center mb-10">
            <p className="text-xl text-gray-300 mb-4">Want more?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg text-gray-300">
              <div>• Unlimited monthly: <span className="text-teal-400 font-semibold">$4.99</span></div>
              <div>• Founders Pass: <span className="text-purple-400 font-semibold">$29.99 / year</span></div>
            </div>
          </div>
          
          {/* Netflix-Style Clean Cards - All Same Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Free Daily Receipt Card */}
            <div className="meme-card p-8 rounded-2xl flex flex-col justify-between" style={{ minHeight: '420px' }}>
              <div>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl mb-3 text-teal-400">Start Free</h3>
                  <div className="text-4xl font-black text-white mb-2">$0</div>
                  <p className="text-gray-400 text-sm">3 free Receipts, then 1/day</p>
                </div>
                <div className="space-y-3 text-sm text-gray-300 text-left">
                  <div className="flex items-start"><span className="text-teal-400 mr-2 mt-0.5">🧠</span><span><strong className="text-white">3 Truth Receipts to try</strong> then 1 daily</span></div>
                  <div className="pl-6 space-y-1">
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Pattern analysis (Breadcrumber, Ghoster, etc.)</div>
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Sage's Tea included (verdict breakdown)</div>
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Shareable receipt card</div>
                  </div>
                  <div className="pt-2 text-xs text-teal-400 font-medium">Perfect for: Curious but cautious</div>
                </div>
              </div>
              <Button onClick={handleGetStarted} variant="outline" className="border-teal-400 text-white hover:bg-teal-500/20 w-full mt-6">
                Start Free →
              </Button>
            </div>
            
            {/* Premium Monthly Card */}
            <div className="meme-card p-8 rounded-2xl flex flex-col justify-between border-2 border-teal-500/50" style={{ minHeight: '420px' }}>
              <div>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl mb-3 text-teal-400">Premium Monthly</h3>
                  <div className="text-4xl font-black text-white mb-2">$4.99</div>
                  <p className="text-gray-400 text-sm">per month</p>
                </div>
                <div className="space-y-3 text-sm text-gray-300 text-left">
                  <div className="text-xs text-gray-400 mb-2">Everything in Free, plus:</div>
                  <div className="flex items-start"><span className="text-teal-400 mr-2 mt-0.5">🧠</span><span><strong className="text-white">UNLIMITED Truth Receipts</strong></span></div>
                  <div className="flex items-start"><span className="text-teal-400 mr-2 mt-0.5">🛡️</span><span><strong className="text-white">Sage's Immunity Training</strong> (NEW!)</span></div>
                  <div className="pl-6 space-y-1">
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Learn their manipulation tactics</div>
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Build emotional defense strategies</div>
                  </div>
                  <div className="flex items-start"><span className="text-teal-400 mr-2 mt-0.5">⚡</span><span><strong className="text-white">Vibe Check™</strong> real-time analysis</span></div>
                  <div className="flex items-start"><span className="text-teal-400 mr-2 mt-0.5">🚀</span><span><strong className="text-white">Priority processing</strong></span></div>
                  <div className="pt-2 text-xs text-teal-400 font-medium">Perfect for: Done with the drama</div>
                </div>
              </div>
              <Button onClick={handleGoPremium} className="viral-button-popular text-white w-full mt-6">
                Go Premium
              </Button>
            </div>
            
            {/* OG Founder's Club Card */}
            <div className="relative p-8 rounded-2xl flex flex-col justify-between border-2 border-purple-400/60" style={{ minHeight: '420px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1624 100%)' }}>
              {/* BEST VALUE Badge */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  BEST VALUE
                </div>
              </div>
              
              <div>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl mb-3 text-purple-400">OG Founder's Club</h3>
                  <div className="text-4xl font-black text-white mb-1">$29.99 / year</div>
                  <p className="text-gray-400 text-sm">($2.49/month) <span className="text-green-400 font-semibold">70% OFF</span></p>
                </div>
                <div className="space-y-3 text-sm text-gray-300 text-left">
                  <div className="text-xs text-gray-400 mb-2">Everything in Premium, plus:</div>
                  <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🔒</span><span><strong className="text-white">Price locked FOREVER</strong></span></div>
                  <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🏆</span><span><strong className="text-white">Beta features first</strong></span></div>
                  <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">💬</span><span><strong className="text-white">Direct feedback channel</strong></span></div>
                  <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🎖️</span><span><strong className="text-white">Founder badge</strong> on receipts</span></div>
                  <div className="pt-2 text-xs text-purple-400 font-medium">Perfect for: First 500 who get it</div>
                </div>
              </div>
              <Button onClick={handleGoPremium} className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white w-full font-bold mt-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/25">
                Lock In Founder's Price
              </Button>
            </div>
          </div>
          
          {/* Premium Feature Comparison Table */}
          <div className="max-w-5xl mx-auto mb-8">
            <div 
              className="relative p-8 rounded-3xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 50%, rgba(15, 23, 42, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}
            >
              {/* Subtle animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/5 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-center mb-8 gradient-text">Compare Plans</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-6 px-4"></th>
                        <th className="text-center py-6 px-4">
                          <div className="inline-block">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700/50">
                              <div className="text-lg font-bold text-teal-400 mb-1">Free</div>
                              <div className="text-2xl font-black text-white">$0</div>
                              <div className="text-xs text-gray-400">per month</div>
                            </div>
                          </div>
                        </th>
                        <th className="text-center py-6 px-4">
                          <div className="inline-block">
                            <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/40 rounded-2xl p-4 border border-teal-500/30">
                              <div className="text-lg font-bold text-teal-400 mb-1">Premium</div>
                              <div className="text-2xl font-black text-white">$4.99</div>
                              <div className="text-xs text-gray-300">per month</div>
                            </div>
                          </div>
                        </th>
                        <th className="text-center py-6 px-4">
                          <div className="inline-block relative">
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              BEST
                            </div>
                            <div 
                              className="rounded-2xl p-4 border border-purple-400/50"
                              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1624 100%)' }}
                            >
                              <div className="text-lg font-bold text-purple-400 mb-1">OG Founder's</div>
                              <div className="text-2xl font-black text-white">$29.99</div>
                              <div className="text-xs text-gray-300">per year</div>
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700/30">
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🧾</span>
                            <span className="font-medium text-white">Truth Receipts</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="bg-gray-800/50 rounded-lg px-3 py-2 text-gray-300 font-medium">
                            1/day
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="bg-teal-900/30 rounded-lg px-3 py-2 text-teal-300 font-medium border border-teal-500/20">
                            Unlimited
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="bg-purple-900/30 rounded-lg px-3 py-2 text-purple-300 font-medium border border-purple-500/20">
                            Unlimited
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700/20">
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">☕</span>
                            <span className="font-medium text-white">Sage's Tea</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700/20">
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🛡️</span>
                            <span className="font-medium text-white">Immunity Training</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-sm">–</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700/20">
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⚡</span>
                            <span className="font-medium text-white">Vibe Check™</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-sm">–</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700/20">
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🔒</span>
                            <span className="font-medium text-white">Price Lock</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-sm">–</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-sm">–</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700/20">
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <span className="font-medium text-white">Beta Access</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-sm">–</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mx-auto">
                            <span className="text-gray-400 text-sm">–</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mx-auto">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
                  When you lock in your Founder's price, you're not just getting a discount - you're getting a lifetime deal that gets better as we grow.
                </p>
                <p>
                  <span className="text-yellow-400">As our community grows, Sage's annual price increases:</span>
                </p>
              </div>

              {/* Tiered Pricing List */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-red-400 text-2xl">✅</span>
                    <span className="text-red-400 text-lg">First 200 users: <span className="text-red-400 font-semibold">$19/year</span> <span className="text-red-400">(SOLD OUT)</span></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <span className="text-orange-400 text-2xl">✅</span>
                    <span className="text-orange-400 text-lg">Next 300 users: <span className="text-orange-400 font-semibold">$29/year</span> <span className="text-orange-400">(CURRENT)</span></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <span className="text-yellow-400 text-2xl">⏳</span>
                    <span className="text-yellow-400 text-lg">Next 500 users: <span className="text-yellow-400 font-semibold">$49/year</span> <span className="text-yellow-400">(COMING SOON)</span></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                    <span className="text-gray-400 text-2xl">🔮</span>
                    <span className="text-gray-400 text-lg">Future users: <span className="text-gray-400 font-semibold">$99/year</span> <span className="text-gray-400">(REGULAR PRICE)</span></span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-300 text-base mb-4">
                  <span className="text-white font-semibold">Your price never changes.</span> Once you're in, you're locked in forever.
                </p>
                <p className="text-gray-400 text-sm">
                  By using this site, you agree to our <a href="/terms-of-service" className="text-purple-400 hover:text-purple-300 underline font-medium">Terms</a> & <a href="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline font-medium">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
          className="w-full max-w-4xl mx-auto meme-card p-8 rounded-3xl text-center mt-20 md:mt-32"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            One Bad Date Costs More Than a Year of Clarity.
          </h2>
          <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            That feeling of confusion is costing you more than just your peace of mind - it's costing you time. Our OG Founder's Deal gives you unlimited access to Sage's wisdom for just <strong className="text-green-400">$2.49/month</strong> (billed annually at $29.99). Lock in your 70% discount before this one-time offer disappears forever.
          </p>
          <div className="text-center mb-6">
            <p className="text-white font-semibold text-lg mb-2">
              This is the last time you'll get Sage for less than $3/month.
            </p>
            <p className="text-gray-300 text-base">
              Secure your clarity - before it disappears.
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-center mb-4">
            <Button onClick={handleGoPremium} className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-black font-bold py-4 text-xl px-12 shadow-2xl transition-all duration-300 hover:scale-105">
              Lock In My Founder's Price
            </Button>
          </div>
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 bg-gray-900/30 px-4 py-2 rounded-full inline-flex items-center gap-2 border border-gray-700/50 mb-4">
              🛡️ Never stored. Never used for training. Deleted instantly.
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            Not ready to commit?{' '}
            <button 
              onClick={handleGetStarted}
              className="text-teal-400 hover:text-teal-300 underline transition-colors cursor-pointer"
            >
              Get your free daily receipt first.
            </button>
          </p>
        </motion.div>

        </div>
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
                <h3 className="text-xl font-bold text-white">Get The Receipts</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Decode the chaos of modern communication. Get clarity, not confusion.
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
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <a href="mailto:support@getthereceipts.com" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <a href="/affiliate" className="block text-gray-400 hover:text-white transition-colors">Affiliate Program</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Get The Receipts. All rights reserved.
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
