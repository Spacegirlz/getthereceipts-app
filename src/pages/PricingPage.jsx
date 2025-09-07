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
    <div className="relative w-full h-12 overflow-hidden bg-gray-900/50 mt-8 rounded-full border-2 border-purple-500/30">
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
      name: 'Free Daily Truth',
      price: '$0',
      subtitle: 'Test the waters',
      features: [
        '1 Truth Receipt daily',
        'See if we\'re your vibe',
        'No credit card needed'
      ],
      tag: 'Even broke deserves clarity',
      buttonText: 'Start Free',
      buttonAction: () => navigate('/chat-input'),
      buttonClass: 'border-2 border-white text-white hover:bg-white hover:text-black font-bold',
      icon: '🔍'
    },
    {
      id: 'emergency',
      name: 'Emergency Pack',
      price: '$1.99',
      subtitle: 'When you can\'t wait till tomorrow',
      features: [
        '5 Truth Receipts',
        '5 Sage\'s Tea bombs',
        'Instant Clarity'
      ],
      tag: 'For the 2am spirals',
      buttonText: 'Decode This Now',
      priceId: 'price_1S0Po4G71EqeOEZeSqdB1Qfa',
      buttonClass: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold',
      icon: '🚨',
      urgent: true,
      newBadge: true
    },
    {
      id: 'premium',
      name: 'Premium Monthly',
      price: '$6.99',
      priceSub: '/month',
      subtitle: 'Stop asking the group chat',
      features: [
        'UNLIMITED Truth Receipts',
        'Sage\'s Immunity Training™',
        'Vibe Check™ their replies',
        'Save your receipts',
        'Cancel anytime'
      ],
      tag: 'No more second-guessing',
      buttonText: 'Get Unlimited Clarity',
      priceId: 'price_1RzgEZG71EqeOEZejcCAFxQs',
      buttonClass: 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold',
      icon: '⚡'
    },
    {
      id: 'founder',
      name: 'OG Founder\'s Club ⭐',
      price: '$29.99',
      priceSub: '/year',
      originalPrice: '$69.99',
      subtitle: 'Lock it in before we blow up',
      monthlyEquivalent: '$2.49/month when billed yearly',
      features: [
        'Everything in Premium',
        'Price locked FOREVER (even when we\'re $20/month)',
        'OG Founder badge on your receipts',
        'Direct line to tell us what to build'
      ],
      get tag() { return `⚠️ Only ${500 - founderCount} remaining before the price goes up`; },
      buttonText: 'Lock In Founder Price',
      priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R',
      buttonClass: 'text-black font-bold premium-founder-button',
      icon: '👑',
      founder: true,
      discount: '57% OFF'
    }
  ];

  return (
    <div className="min-h-screen text-white px-4 py-8 relative">
      <Helmet>
        <title>Pricing - Get The Receipts</title>
        <meta name="description" content="Choose your truth level. From free daily receipts to unlimited chaos decoded." />
      </Helmet>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,105,180,0.1),transparent_50%)]" />
      </div>

      {/* Premium CSS for OG Founder's Circle */}
      <style jsx="true">{`
        .founder-glow {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(255, 215, 0, 0.12) 0%, 
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 215, 0, 0.06) 100%
          );
          border: 2px solid;
          border-image: linear-gradient(135deg, 
            #FFD700 0%, 
            #E8B4B8 50%, 
            #F7E7CE 100%
          ) 1;
          box-shadow: 
            0 0 40px rgba(255, 215, 0, 0.4),
            0 0 80px rgba(255, 215, 0, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            inset 0 -2px 4px rgba(255, 215, 0, 0.1);
          transform: scale(1.02);
          animation: premiumPulse 5s ease-in-out infinite;
        }


        .founder-glow::after {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, 
            rgba(255, 215, 0, 0.3) 0%, 
            rgba(232, 180, 184, 0.2) 50%, 
            rgba(247, 231, 206, 0.3) 100%
          );
          border-radius: inherit;
          filter: blur(3px);
          z-index: -1;
          opacity: 0.8;
        }

        .founder-glow:hover {
          transform: scale(1.02) translateY(-5px);
          box-shadow: 
            0 8px 60px rgba(255, 215, 0, 0.5),
            0 4px 40px rgba(255, 215, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.4),
            inset 0 -2px 4px rgba(255, 215, 0, 0.2);
        }

        .premium-founder-button {
          background: linear-gradient(135deg, #D4AF37 0%, #FFB300 50%, #F5E6D3 100%);
          box-shadow: 
            0 6px 25px rgba(255, 215, 0, 0.4),
            0 3px 12px rgba(0, 0, 0, 0.2);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          animation: premiumButtonGlow 4s ease-in-out infinite alternate;
        }

        .premium-founder-button:hover {
          background: linear-gradient(135deg, #FFD700 0%, #FFC300 50%, #FFFBF0 100%);
          box-shadow: 
            0 8px 35px rgba(255, 215, 0, 0.6),
            0 5px 20px rgba(0, 0, 0, 0.25);
          transform: translateY(-2px);
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

        @keyframes premiumPulse {
          0%, 100% { 
            box-shadow: 
              0 0 40px rgba(255, 215, 0, 0.4),
              0 0 80px rgba(255, 215, 0, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.3),
              inset 0 -2px 4px rgba(255, 215, 0, 0.1);
            transform: scale(1.02);
          }
          50% { 
            box-shadow: 
              0 0 60px rgba(255, 215, 0, 0.6),
              0 0 120px rgba(255, 215, 0, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px rgba(255, 215, 0, 0.2);
            transform: scale(1.025);
          }
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

        <div className="text-center mb-16">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-8 pb-4 gradient-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Get the clarity you deserve.
          </motion.h1>
          <motion.p 
            className="text-xl text-stone-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Choose your level of truth. From testing the waters to unlimited chaos decoded.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-none lg:max-w-8xl xl:max-w-9xl mx-auto px-2">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col h-full p-8 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 ${
                tier.founder 
                  ? 'founder-glow' 
                  : tier.urgent 
                    ? 'emergency-pack-border bg-red-900/10' 
                    : tier.id === 'premium'
                      ? 'premium-border bg-white/5'
                      : 'border-gray-500/30 bg-white/5 hover:border-gray-400/40'
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
              <div className="text-center h-28 flex flex-col justify-center mb-2">
                <div className="text-3xl mb-2">
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {tier.name}
                </h3>
              </div>

              {/* SECTION 2: Price & Subtitle (Fixed Height) */}
              <div className="text-center h-32 flex flex-col justify-center mb-4">
                <div className="mb-2">
                  <div className="flex items-center justify-center gap-2">
                    {tier.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-white" style={{
                      textShadow: tier.founder ? '0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
                    }}>
                      {tier.price}
                    </span>
                    {tier.priceSub && (
                      <span className="text-lg text-gray-400">{tier.priceSub}</span>
                    )}
                  </div>
                  {tier.monthlyEquivalent && (
                    <p className="text-xs text-gray-400 mt-1">{tier.monthlyEquivalent}</p>
                  )}
                </div>
                <p className="text-sm italic text-gray-300">"{tier.subtitle}"</p>
              </div>

              {/* SECTION 3: Features (Fixed Height) */}
              <div className="h-40 mb-4">
                <div className="space-y-2">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-200 text-sm leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Bottom - Button and Tag line (Fixed Height) */}
              <div className="h-24 flex flex-col justify-between">
                {/* Button */}
                <Button
                  className={`w-full py-3 rounded-xl transition-all duration-300 mb-4 ${tier.buttonClass}`}
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
                  <p className="text-xs text-center mt-2 text-yellow-400 font-semibold">
                    ⚡ INSTANT ACCESS
                  </p>
                )}

                {/* Tag line underneath */}
                <p className="text-xs text-gray-400 italic leading-relaxed text-center">
                  {tier.tag}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-400 mb-4">
            Still not sure? Start with our free daily truth receipt.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/chat-input')}
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
          >
            Try It Free First
          </Button>
        </motion.div>

        {/* OG Founder Special Section */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="founder-glow p-8 rounded-2xl text-center">
            <div className="text-3xl mb-4">👑</div>
            <h3 className="text-2xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              OG Founder Price - Limited Time
            </h3>
            <p className="text-lg mb-2">
              <span className="text-2xl font-bold">🧾</span> Get unlimited receipts for <span className="text-yellow-400 font-bold">$29.99/year</span>
            </p>
            <p className="text-gray-400 mb-6">That's just $2.49/month for unlimited clarity.</p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">6</div>
                <div className="text-xs text-gray-400">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">7</div>
                <div className="text-xs text-gray-400">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">39</div>
                <div className="text-xs text-gray-400">MIN</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">51</div>
                <div className="text-xs text-gray-400">SEC</div>
              </div>
            </div>
            
            <Button
              className="premium-founder-button py-3 px-8 text-black font-bold rounded-xl"
              onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
            >
              Claim your OG Founder status.
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

        {/* Comparison Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              🤔 Still Thinking? Let's Compare:
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* What $6.99 gets you elsewhere */}
            <div className="bg-red-900/20 border-2 border-red-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">
                ❌ What $6.99 gets you elsewhere:
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 2/3 of a cocktail you'll regret</li>
                <li>• 1/2 of a movie ticket to cry alone</li>
                <li>• 1 month of that dating app that isn't working</li>
                <li>• 45 minutes of parking while you stalk their Instagram</li>
              </ul>
            </div>

            {/* What $6.99 gets you here */}
            <div className="bg-green-900/20 border-2 border-green-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">
                🎯 What $6.99 gets you here:
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Unlimited clarity for an entire month</li>
                <li>• The truth about EVERY confusing text</li>
                <li>• Your friends thinking you're psychic</li>
                <li>• Actually knowing what "k" means</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-2xl font-bold text-white">The math is mathing, bestie.</p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="mt-20 rounded-2xl p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%)',
            backdropFilter: 'blur(10px)'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to know for sure?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Stop guessing and start knowing. Your group chat will thank you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="premium-founder-button py-3 px-8 text-black font-bold rounded-xl"
              onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founder')}
            >
              Get OG Founder - $29.99/year
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl"
              onClick={() => navigate('/chat-input')}
            >
              Start Free Daily Receipt
            </Button>
          </div>
        </motion.div>

        {/* Legal Disclaimer & Footer */}
        <div className="text-center mt-8 pb-12 max-w-2xl mx-auto">
          <p className="text-white/60 text-sm mb-4">
            18+ · Entertainment only · Not therapy, legal, or medical advice · You know your truth
          </p>
          <p className="text-white/40 text-xs mb-2">
            Payments processed by Stripe. Subscriptions auto-renew until cancelled.
          </p>
          <p className="text-white/40 text-xs">
            By using this site you agree to our <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">Terms</a> and <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy</a>
          </p>
        </div>
      </div>

      {/* Purchase Notification Popup */}
      <PurchasePopup />
    </div>
  );
};

export default PricingPage;