import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Sparkles, Ghost, Crown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Helmet } from 'react-helmet';
import { useStripe } from '@stripe/react-stripe-js';

const CountdownTimer = () => {
  const getEndDate = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  };

  const [endDate] = useState(getEndDate());

  const calculateTimeLeft = () => {
    const difference = +endDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0};
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex justify-center gap-4 text-xl font-bold text-yellow-300">
      {timeLeft.days > 0 && <div>{timeLeft.days}<span className="text-sm font-normal opacity-70">d</span></div>}
      {timeLeft.hours >= 0 && <div>{timeLeft.hours}<span className="text-sm font-normal opacity-70">h</span></div>}
      {timeLeft.minutes >= 0 && <div>{timeLeft.minutes}<span className="text-sm font-normal opacity-70">m</span></div>}
      {timeLeft.seconds >= 0 && <div>{timeLeft.seconds}<span className="text-sm font-normal opacity-70">s</span></div>}
    </div>
  );
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
    <div className="relative w-full h-12 overflow-hidden bg-gray-900/50 mt-26 meme-card rounded-full border-2 border-purple-500/30">
      <div className="absolute top-0 left-0 w-max h-full flex items-center animate-scroll">
        {items.concat(items).map((item, index) => (
          <span key={index} className="text-gray-300 text-md mx-6 whitespace-nowrap">
             <Sparkles className="inline-block h-4 w-4 mr-2 text-yellow-400" /> {item} •
          </span>
        ))}
      </div>
       <style jsx>{`
          @keyframes scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
          }
          .animate-scroll {
              animation: scroll 40s linear infinite;
          }
          @keyframes founderPulse {
              0% { transform: scale(1); }
              2% { transform: scale(1.05); }
              4% { transform: scale(1); }
              100% { transform: scale(1); }
          }
      `}</style>
    </div>
  );
};

const PricingCard = ({ plan, onPurchase, loadingPlan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative meme-card p-8 rounded-3xl h-full flex flex-col ${plan.dimmed ? 'opacity-85' : ''} ${plan.popular && !plan.dimmed ? 'border-2 border-yellow-400 shadow-yellow-400/30 shadow-2xl' : plan.premiumGlow ? 'border-2 shadow-2xl' : plan.pinkGlow ? 'border-2 shadow-lg' : plan.dimmed ? 'border-2 border-blue-400/60 shadow-blue-400/20 shadow-lg' : 'border-2 border-gray-700'}`}
      style={plan.premiumGlow ? { 
        borderColor: '#14b8a6',
        borderRadius: '24px',
        boxShadow: '0 0 40px rgba(20, 184, 166, 0.4), 0 0 80px rgba(139, 92, 246, 0.3)',
        background: 'radial-gradient(circle at center, rgba(20, 184, 166, 0.05) 0%, transparent 70%)',
        animation: 'premiumBorderColor 3s ease-in-out infinite'
      } : plan.glow ? { 
        borderImage: 'linear-gradient(135deg, #fbbf24, #f59e0b) 1',
        boxShadow: '0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(245, 158, 11, 0.3)'
      } : plan.pinkGlow ? {
        borderColor: '#ec4899',
        boxShadow: '0 0 15px rgba(236, 72, 153, 0.3), 0 0 30px rgba(236, 72, 153, 0.1)'
      } : {}}
    >
        {plan.glow && (
          <>
            <div className="absolute inset-0 rounded-3xl animate-pulse -z-10"></div>
            <div className="absolute inset-0 -z-10 rounded-3xl" style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.3), 0 0 20px rgba(245, 158, 11, 0.15)' }}></div>
          </>
        )}
        {plan.premiumGlow && (
          <div className="absolute inset-0 -z-10 rounded-3xl" style={{ 
            boxShadow: '0 0 40px rgba(20, 184, 166, 0.4), 0 0 80px rgba(139, 92, 246, 0.3)',
            borderRadius: '24px'
          }}></div>
        )}
        {plan.badge && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-[10px] font-black shadow-xl border border-yellow-300 whitespace-nowrap">
                    {plan.badge}
                </div>
            </div>
        )}
      <div className="flex-grow">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white mb-1 flex items-center justify-center gap-2">{plan.icon}{plan.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{plan.tagline}</p>
          <div className="mb-4 h-12 flex items-center justify-center">
            <span className="text-4xl font-black text-white">{plan.price}</span>
            {plan.priceSub && <span className="text-gray-400 ml-1">{plan.priceSub}</span>}
            {plan.slashedPrice && <span className="text-gray-500 line-through ml-2">{plan.slashedPrice}</span>}
          </div>
          <p className="text-xs text-pink-400 font-semibold h-8">"{plan.viralSubtext}"</p>
        </div>

        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-200 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4">
        <Button
          onClick={() => onPurchase(plan.name, plan.priceId)}
          disabled={loadingPlan === plan.priceId}
          className={`w-full py-3 text-md font-bold rounded-xl transition-all duration-300 ${plan.buttonClass}`}
          style={plan.buttonStyle || {}}
        >
          {loadingPlan === plan.priceId && plan.priceId !== null ? 'Redirecting...' : plan.buttonText}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-3 h-8">{plan.footerText}</p>
      </div>
    </motion.div>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const stripe = useStripe();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePurchase = async (planName, priceId) => {
    // Handle Free Daily - works for both logged in and not logged in users
    if (planName === 'Free Daily') {
        navigate('/chat-input');
        return;
    }

    // For premium plans, require login
    if (!user) {
      openModal('sign_up');
      toast({ title: 'Create an account to upgrade!', description: 'Sign up to unlock premium features and get receipts.'})
      return;
    }

    if (!priceId || !stripe) {
        toast({
            variant: "destructive",
            title: "Stripe Error",
            description: "Stripe is not configured correctly. Please check the console.",
        });
        console.error("Stripe.js has not loaded or priceId is missing.");
        return;
    }

    setLoadingPlan(priceId);

    try {
        // Emergency Pack is one-time payment, others are subscriptions
        const mode = planName === 'Emergency Pack' ? 'payment' : 'subscription';
        
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: mode,
            successUrl: `${window.location.origin}/chat-input?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/pricing`,
            customerEmail: user.email, 
        });

        if (error) {
            console.error("Stripe redirect error:", error);
            toast({
                variant: "destructive",
                title: "Payment Error",
                description: error.message || "Could not redirect to checkout.",
            });
            setLoadingPlan(null);
        }
    } catch (error) {
        console.error("Stripe catch error:", error);
        toast({
            variant: "destructive",
            title: "An Unexpected Error Occurred",
            description: "Please try again later.",
        });
        setLoadingPlan(null);
    }
  };

  const handleSignInClick = () => {
    openModal('sign_in');
  };

  const plans = [
    {
      icon: "🥖",
      name: "Free Daily",
      price: "$0",
      tagline: "One truth receipt a day",
      viralSubtext: "Test the waters",
      features: [
        '1 Truth Receipt daily',
        'Including Sage\'s Tea (the REAL tea)',
        'Decode any message',
        'Share the drama',
        'Come back tomorrow',
      ],
      perfect_for: "Testing the waters",
      buttonText: "Go Free",
      buttonClass: "bg-white/10 text-white hover:bg-white/20",
      footerText: "Even broke deserves clarity",
      priceId: null,
      popular: false,
    },
    {
      icon: "🚨",
      name: "Emergency Pack",
      price: "$1.99",
      units: "5 receipts",
      urgency: "ONE-TIME DEAL",
      tagline: "When you need to know NOW",
      psychology: "It's just $2... less than gum",
      viralSubtext: "5 instant answers",
      features: [
        '5 Truth Receipts for one crisis',
        'Includes everything in Free Daily',
        'Valid 7 days',
        'Brutal clarity included',
        'Confirm what your gut is telling you',
      ],
      pinkGlow: true,
      buttonText: "Go Emergency Pack",
      buttonClass: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white",
      footerText: "Cheaper than the drink you'll stress-buy",
      priceId: 'price_1S0Po4G71EqeOEZeSqdB1Qfa',
      popular: false,
    },
    {
      icon: "🔥",
      name: "Premium Monthly", 
      price: "$6.99",
      priceSub: "/month",
      tagline: "Never wonder again",
      viralSubtext: "Never wonder again",
      features: [
        'UNLIMITED chaos decoded',
        'Sage\'s Immunity Training NEW!',
        'Vibe Check™ their replies',
        'Save your receipts',
        '2am spiral support hotline* (*hotline is the app, not actual humans)',
      ],
      buttonText: "Go Premium",
      buttonClass: "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white",
      footerText: "For serial overthinkers",
      priceId: 'price_1RzgEZG71EqeOEZejcCAFxQs',
      popular: false,
      badge: "POPULAR",
      dimmed: true,
    },
    {
      icon: "👑",
      name: "OG Founders Club",
      price: "$29.99",
      priceSub: "/year",
      slashedPrice: "$69.99",
      tagline: "Lock this price or lose it forever",
      viralSubtext: "That's just $2.49/month",
      features: [
        "UNLIMITED forever (like their excuses)",
        "Price locked at $29.99 (going to $69)",
        "Includes everything in Premium",
        "Beta features (be the friend who knew first)",
        "Always know where you stand",
      ],
      buttonText: "Claim Founder's Deal",
      buttonClass: "text-black font-bold",
      buttonStyle: { 
        background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
        border: '1px solid rgba(212, 175, 55, 0.8)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        animation: 'founderPulse 5s infinite'
      },
      footerText: "One bad date costs more than this",
      priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R',
      popular: true,
      badge: "DISAPPEARING: 50% OFF",
      glow: true,
      premiumGlow: true,
    },
  ];

  return (
    <div className="min-h-screen text-white px-4 py-8 overflow-hidden">
        <style jsx global>{`
          @keyframes founderPulse {
              0% { transform: scale(1); }
              2% { transform: scale(1.05); }
              4% { transform: scale(1); }
              100% { transform: scale(1); }
          }
          @keyframes premiumBorderColor {
              0% { border-color: #14b8a6; }
              50% { border-color: #8b5cf6; }
              100% { border-color: #14b8a6; }
          }
        `}</style>
        <Helmet>
            <title>Pricing - Choose Your Power Level</title>
            <meta name="description" content="Savage pricing for savage truths. Choose a plan from Free to Founder's and stop getting played." />
            <meta property="og:title" content="Pricing - Choose Your Power Level" />
            <meta property="og:description" content="Savage pricing for savage truths. Choose a plan from Free to Founder's and stop getting played." />
        </Helmet>
      
        <header className="max-w-6xl mx-auto mb-12 text-center relative">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-0 left-0 text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
            </Button>
            {!user && (
              <div className="absolute top-0 right-0">
                <Button
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                  onClick={handleSignInClick}
                >
                  Sign In
                </Button>
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 pt-12">
                    <span className="gradient-text">Get the clarity you deserve</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                    From confusion to confidence. Choose your level.
                </p>
            </motion.div>
        </header>

        <main className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                {plans.map((plan, index) => (
                    <PricingCard key={index} plan={plan} onPurchase={handlePurchase} loadingPlan={loadingPlan} />
                ))}
            </div>

            <div className="text-center mt-8">
                <p className="text-xs text-gray-500">For entertainment purposes only. Trust your gut, but verify with us.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-24 mb-24 text-center meme-card p-6 rounded-3xl max-w-3xl mx-auto relative overflow-hidden shadow-2xl border-4"
                style={{ 
                  borderImage: 'linear-gradient(135deg, #fbbf24, #f59e0b) 1',
                  boxShadow: '0 0 60px rgba(251, 191, 36, 0.8), 0 0 100px rgba(245, 158, 11, 0.4)'
                }}
            >
                <div className="absolute inset-0 rounded-3xl animate-pulse"></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
                        <Ghost className="h-8 w-8 mr-3 text-yellow-400 animate-pulse" />
                        Don't get ghosted by the price.
                    </h3>
                    <p className="text-gray-300 mb-4">
                        ⏰ Real talk: After 147 people, it's <span className="font-bold text-yellow-400">$69.99/year forever</span><br/>
                        That's $40 more. Every year. Forever.
                    </p>
                    <div className="bg-gray-800/50 rounded-full p-2 inline-block mb-4">
                        <CountdownTimer />
                    </div>
                     <p className="font-bold text-white">Lock it in now. Keep it forever.</p>
                </div>
            </motion.div>
            
            <SocialProofTicker />

            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-32 max-w-6xl mx-auto text-center"
            >
                 <h2 className="text-3xl font-bold mb-12">
                    <span className="gradient-text">💭 Still Thinking? Let's Compare:</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="meme-card p-6 rounded-2xl border-2 border-red-500/50 bg-red-900/10">
                        <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                            <span className="text-red-500">❌</span> What $6.99 gets you elsewhere:
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-left">
                            <li>• 2/3 of a cocktail you'll regret</li>
                            <li>• 1/2 of a movie ticket to cry alone</li>
                            <li>• 1 month of that dating app that isn't working</li>
                            <li>• 45 minutes of parking while you stalk their Instagram</li>
                        </ul>
                    </div>
                    <div className="meme-card p-6 rounded-2xl border-2 border-green-500/50 bg-green-900/10">
                        <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                            <span className="text-green-500">🎁</span> What $6.99 gets you here:
                        </h3>
                        <ul className="text-gray-300 space-y-2 text-left">
                            <li>• Unlimited clarity for an entire month</li>
                            <li>• The truth about EVERY confusing text</li>
                            <li>• Your friends thinking you're psychic</li>
                            <li>• Actually knowing what "k" means</li>
                        </ul>
                    </div>
                </div>
                <p className="text-xl font-bold text-white">The math is mathing, bestie.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-24 w-full max-w-4xl mx-auto meme-card p-8 rounded-3xl text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to know for sure?</h2>
              <p className="text-gray-300 mb-6">Stop guessing and start knowing. Your group chat will thank you.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => handlePurchase("OG Founder's Yearly Deal", 'price_1RzgBYG71EqeOEZer7ojcw0R')} className="bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-bold py-4" disabled={loadingPlan === 'price_1RzgBYG71EqeOEZer7ojcw0R'}>
                    {loadingPlan === 'price_1RzgBYG71EqeOEZer7ojcw0R' ? 'Redirecting...' : 'Lock In Forever - $29.99'}
                </Button>
                <Button onClick={() => handlePurchase("Free Daily", null)} variant="outline" className="border-purple-400 text-white hover:bg-purple-500/20 font-bold py-4">Start Free Daily</Button>
              </div>
            </motion.div>

        </main>
    </div>
  );
};

export default PricingPage;