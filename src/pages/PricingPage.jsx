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
          userId: user.email
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
      subtitle: 'For the quietly anxious',
      features: [
        '1 AI Truth Receipt per day',
        'Pattern detection + verdict',
        'Shareable result card',
        'No login or credit card required',
        '🔒 Zero storage. Never used for training.'
      ],
      tag: 'Start free. Upgrade when you\'re ready.',
      buttonText: 'Try Free Receipt',
      buttonAction: () => navigate('/chat-input'),
      buttonClass: 'bg-transparent border-2 border-slate-400 text-slate-300 hover:bg-slate-700 hover:border-slate-300 font-semibold',
      icon: '🕊️',
      microcopy: 'For the quietly anxious'
    },
    {
      id: 'premium',
      name: 'Unlimited Clarity',
      price: '$6.99',
      priceSub: '/month',
      subtitle: 'For the ones who spiral in silence',
      features: [
        'UNLIMITED Truth Receipts',
        'Sage\'s Immunity Training™ (learn to spot the patterns yourself)',
        'Vibe Check™ real-time detection',
        'Cancel anytime',
        '🔒 Zero storage. Never used for training.'
      ],
      tag: 'Never spiral alone again.',
      buttonText: 'Unlock Unlimited Clarity',
      priceId: 'price_1RzgEZG71EqeOEZejcCAFxQs',
      buttonClass: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25',
      icon: '🔥',
      microcopy: 'For the ones who spiral in silence'
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
        'Group Chat Receipts coming soon',
        '🔒 Zero storage. Never used for training.'
      ],
      get tag() { return `Founder pricing ends in 6 days. ${500 - founderCount} spots left.`; },
      buttonText: 'Claim OG Founder Status',
      priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R',
      buttonClass: 'text-white font-bold premium-founder-button',
      icon: '👑',
      founder: true,
      discount: '70% OFF',
      microcopy: 'For the ones ready to trust their gut'
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
          border: 2px solid;
          border-image: linear-gradient(135deg, #FFD700, #FFA500) 1;
          border-radius: 24px;
          padding: 40px;
          transform: scale(1.03);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 24px 70px rgba(255, 215, 0, 0.15);
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
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-8 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-10 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your gut already knew.<br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 bg-clip-text text-transparent">
              Sage just puts it in writing.
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Truth Receipts in 60 seconds. No shame. No storage. Just clarity.
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-400 text-sm mt-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Never stored, always deleted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Results in 60 seconds</span>
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
              {tier.founder && (
                <div className="most-popular-banner" style={{zIndex: 50}}>
                  MOST POPULAR
                </div>
              )}
              {tier.founder && tier.discount && (
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold discount-badge" style={{zIndex: 50}}>
                  {tier.discount}
                </div>
              )}
              {!tier.founder && tier.discount && (
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold discount-badge" style={{zIndex: 50}}>
                  {tier.discount}
                </div>
              )}

              {tier.newBadge && (
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold" style={{zIndex: 50}}>
                  NEW
                </div>
              )}

              {/* SECTION 1: Header - Icon & Name (Fixed Height) */}
              <div className="text-center h-32 flex flex-col justify-center mb-3">
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
              <div className="text-center h-36 flex flex-col justify-center mb-6">
                <div className="mb-3">
                  <div className="flex items-center justify-center gap-3">
                    {tier.originalPrice && (
                      <span className="text-lg text-gray-500 line-through font-medium">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-light text-white tracking-tight" style={{
                      textShadow: tier.founder ? '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
                    }}>
                      {tier.price}
                    </span>
                    {tier.priceSub && (
                      <span className="text-lg text-gray-300 font-light">{tier.priceSub}</span>
                    )}
                  </div>
                  {tier.monthlyEquivalent && (
                    <p className="text-sm text-gray-400 mt-2 font-medium tracking-wide">{tier.monthlyEquivalent}</p>
                  )}
                </div>
                <p className="text-sm text-gray-200 font-light italic tracking-wide">
                  "{tier.subtitle}"
                </p>
              </div>

              {/* SECTION 3: Features (Fixed Height) */}
              <div className="h-52 mb-6">
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
              <div className="h-36 flex flex-col justify-between">
                {/* Button */}
                <Button
                  className={`w-full py-4 rounded-xl transition-all duration-500 mb-4 font-semibold tracking-wide ${tier.buttonClass}`}
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
                
                {/* Instant Access for Founder's Club */}
                {tier.founder && (
                  <p className="text-xs text-center mt-2 mb-3 text-yellow-300 font-bold tracking-wider uppercase">
                    ⚡ INSTANT ACCESS
                  </p>
                )}

                {/* Tag line underneath */}
                <p className="text-sm text-gray-200 leading-relaxed text-center font-light tracking-wide">
                  {tier.tag}
                </p>
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

        {/* Trust Block */}
        <motion.div 
          className="mt-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 backdrop-blur-xl rounded-3xl border border-blue-500/20 p-12 md:p-16 text-center">
              
              {/* Enhanced Trust Message */}
              <div className="text-center mb-12">
                <p className="text-sm text-gray-300 font-medium tracking-wide leading-relaxed">
                  🔒 Bank-level encryption.<br />
                  Your chats are never stored, never used for training, and deleted instantly.<br />
                  <span className="text-gray-400">No judgment. No trace. Just clarity.</span>
                </p>
              </div>

              {/* Section Title */}
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                <span className="text-3xl mr-3">🔮</span>
                Still doubting your gut?
              </h3>

              {/* Binary Switch Cards - Side by Side */}
              <div className="max-w-5xl mx-auto mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Card - Gut Noticing */}
                  <div className="relative p-8 bg-gradient-to-b from-red-900/10 via-purple-900/15 to-violet-900/20 rounded-2xl backdrop-blur-sm border border-blue-500/10">
                    <div className="text-center">
                      <div className="text-4xl mb-6">😕</div>
                      <h4 className="text-2xl font-bold text-white mb-4 leading-tight">
                        You're not imagining it.
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        That message stuck for a reason. Your gut noticed what their words tried to hide.
                      </p>
                    </div>
                  </div>

                  {/* Right Card - Sage Confirms */}
                  <div className="relative p-8 bg-gradient-to-b from-purple-900/15 via-blue-900/20 to-violet-900/15 rounded-2xl backdrop-blur-sm border border-blue-500/10">
                    <div className="text-center">
                      <div className="text-4xl mb-6">🕵️</div>
                      <h4 className="text-2xl font-bold text-white mb-4 leading-tight">
                        Sage sees what they missed.
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        She reads the tone, the silence, the shift. <span className="text-violet-300 font-semibold">She says what they won't.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anchor Line - Compressed */}
                <div className="text-center mt-8">
                  <p className="text-lg text-gray-400 italic">
                    You've replayed that message more times than you'd admit.
                  </p>
                </div>
              </div>

              {/* Call-to-Action Quote - Compressed */}
              <div className="text-center py-12 mb-8 relative">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-500/20">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <blockquote className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto mb-12">
                    You noticed. Now get the proof.
                  </blockquote>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                  <Button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-slate-700/40 border border-slate-500/40 text-slate-200 hover:bg-slate-600/50 hover:border-slate-400 hover:text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300"
                  >
                    See How It Works
                  </Button>
                  <Button
                    onClick={() => navigate('/chat-input')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    Get My First Receipt
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* OG Founder Special Section */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="founder-card text-center">
            <div className="text-4xl mb-6">🌟</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              OG Founder Price — Limited Time
            </h3>
            <p className="text-lg md:text-xl mb-4 text-gray-300">
              Get <span className="font-bold text-white">unlimited Truth Receipts</span> for just <span className="text-yellow-400 font-bold text-2xl">$29.99/year</span>
            </p>
            <p className="text-gray-300 mb-8">That's less than $2.50/month to never spiral alone again.</p>
            
            {/* Countdown Notice */}
            <div className="mb-8 p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-500/30">
              <div className="text-orange-400 font-bold text-lg mb-2">⚡️ Founder pricing ends in 6 days. {500 - founderCount} spots left.</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{width: `${((500 - founderCount) / 500) * 100}%`}}></div>
              </div>
            </div>
            
            <Button
              className="premium-founder-button py-4 px-10 text-white font-bold rounded-xl text-lg"
              onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
            >
              Claim OG Founder Status
            </Button>
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
                      <span className="text-gray-300">2/3 of a cocktail you'll regret</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">❌</span>
                      <span className="text-gray-300">Half a therapy session you'll cancel</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">❌</span>
                      <span className="text-gray-300">1 month of that dating app that ghosted you</span>
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
                      <span className="text-gray-300">Unlimited receipts</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✅</span>
                      <span className="text-gray-300">Proof for your group chat</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 mt-1">✅</span>
                      <span className="text-gray-300">Actually knowing what "k." meant</span>
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
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to stop guessing?</h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                Drop the chat. Get the receipt.
              </p>
              <p className="text-lg text-gray-400 italic mb-12">
                One click. No judgment. Just the truth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Button
                  onClick={() => navigate('/chat-input')}
                  className="flex-1 bg-transparent border-2 border-slate-400 text-slate-300 hover:bg-slate-700 hover:border-slate-300 font-semibold py-3 px-5 rounded-xl transition-all duration-300"
                >
                  Start Free
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                  onClick={() => handleCheckout('price_1RzgEZG71EqeOEZejcCAFxQs', 'Premium')}
                >
                  Go Unlimited
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                  onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
                >
                  Claim Founder Status
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Trust Footnote */}
        <div className="text-center mt-16 pb-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900/40 via-purple-900/10 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-blue-500/10 p-8">
            <div className="text-center mb-6">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="text-xl font-bold text-white mb-4">Your privacy comes first.</h3>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Every chat is processed anonymously, <strong className="text-white">never stored, and never used for training</strong> or machine learning models.<br />
                When Sage's job is done, the message is gone — for good.
              </p>
            </div>
            
            <div className="border-t border-gray-600 pt-6">
              <p className="text-gray-400 text-sm mb-4">
                18+ only. Entertainment use. Not therapy, legal or medical advice.
              </p>
              <p className="text-gray-500 text-xs">
                By using this site, you agree to our <a href="/terms-of-service" className="text-blue-400 hover:text-blue-300 underline">Terms</a> & <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 mb-8">
          <a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a>
          <a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          <a href="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</a>
          <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
        </div>

        {/* Perfect Footer Block */}
        <div className="mt-8 mb-8 p-6 bg-gradient-to-r from-gray-900/60 to-purple-900/40 rounded-2xl border border-gray-600/30">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-3">
              © 2025 Get The Receipts. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mb-3">
              For Entertainment & Insight Purposes Only.<br />
              Sage reads patterns, not people. Trust your gut first. Then verify with us.
            </p>
            <p className="text-gray-500 text-xs mb-3">
              18+ only • Not therapy, legal, or medical advice • Use at your own risk
            </p>
            <p className="text-gray-500 text-sm">
              Support: <a href="mailto:support@getthereceipts.com" className="text-blue-400 hover:text-blue-300 transition-colors">support@getthereceipts.com</a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mb-16">
          <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">Back to Home</a>
        </div>
      </div>

      {/* Purchase Notification Popup */}
      <PurchasePopup />
    </div>
  );
};

export default PricingPage;