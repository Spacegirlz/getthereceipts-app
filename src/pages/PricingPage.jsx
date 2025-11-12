import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Check, Shield, Zap, Sparkles, ChevronDown } from 'lucide-react';
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
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const OG_TOTAL_SPOTS = 500;
  const OG_SPOTS_LEFT = 487;
  const ogClaimedPercent = Math.max(3, ((OG_TOTAL_SPOTS - OG_SPOTS_LEFT) / OG_TOTAL_SPOTS) * 100);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Live user counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(137, Math.min(168, prev + change));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = async (priceId, tierName) => {
    if (loading) return;
    if (!user) {
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
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.email,
          referralId: referralId
        })
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

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

  // FAQ with scannable summaries - Gen Z optimized
  const pricingFAQs = [
    {
      question: "What's the difference between Free and Premium?",
      summary: "🆓 Free = 1 daily receipt. 💎 Premium = Unlimited everything + Immunity Training.",
      answer: "Free gives you 1 full Sage Receipt every day - that's the complete breakdown, archetype, and receipt. Premium unlocks unlimited receipts, unlimited Ask Sage Anything chats, plus Sage's Immunity Training to help you recognize patterns faster. Think of Free as your daily dose of clarity, Premium as your unlimited truth access."
    },
    {
      question: "Can I cancel Premium anytime?",
      summary: "✅ Yes. Cancel anytime, no questions asked. Your access lasts until the end of your billing period.",
      answer: "Absolutely. Cancel anytime from your dashboard. No questions asked, no guilt trips. Your Premium access continues until the end of your current billing period, then you automatically move to the Free plan. No hidden fees, no surprise charges."
    },
    {
      question: "What happens if I don't use all my receipts?",
      summary: "💅 Nothing. They don't expire. Use them when you need them, not when we tell you to.",
      answer: "Your receipts don't expire. Use them when you actually need clarity, not because a timer's running. We're not here to create urgency around your confusion - we're here to give you clarity when you need it. Premium monthly gives you 30 receipts per month, and they roll over if you don't use them all."
    },
    {
      question: "Is OG Founder's Club really worth it?",
      summary: "🔒 Yes. Price locked forever at $29.99/year. After #500, it doubles to $59.99/year.",
      answer: "If you're planning to use Sage regularly, absolutely. You're locking in $29.99/year forever - even when we raise prices for new users. That's $2.49/month for unlimited everything. After the first 500 users, the price doubles to $59.99/year. Plus you get the founder badge and early access to new features. Your future self will thank you."
    },
    {
      question: "What if I'm not happy with Premium?",
      summary: "💰 7-day money-back guarantee. If it's not for you, we'll refund you. No drama.",
      answer: "We offer a 7-day money-back guarantee. If Premium isn't giving you the clarity you need, just reach out and we'll refund you. No questions, no drama. We want you to actually find value here, not just pay for something you're not using."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background - Same as landing page */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10">
        <Helmet>
          <title>Pricing - Get The Receipts</title>
          <meta name="description" content="Simple pricing. No surprises. From free daily receipts to unlimited clarity." />
        </Helmet>

        {/* ============================================
            HERO SECTION - SIMPLIFIED
            ============================================ */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
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
              className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              Receipts in 60 seconds. No shame. No storage. Just Sage's take.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base text-gray-400 italic max-w-2xl mx-auto mb-8"
            >
              House rules: You're the boss here.
            </motion.p>

            {/* Visual Interest: Animated pricing badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1, 
                y: 0,
                scale: [1, 1.05, 1],
              }}
              transition={{
                delay: 0.4,
                opacity: { duration: 0.6 },
                y: { duration: 0.6 },
                scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
                }
              }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-full">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-semibold">No hidden fees. Ever.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* ============================================
            PRICING CARDS - ENHANCED VISUAL HIERARCHY
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Trust Signal - 82% Stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-lg text-gray-300 mb-2">
                82% said Sage spotted the pattern they were missing.
              </p>
              <p className="text-base text-gray-400 italic">
                We're not flexing four-digit user counts yet - we're flexing how often Sage tells people what their friends couldn't tell them.
              </p>
            </motion.div>
            {/* Two Main Options - Equal height */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white/8 backdrop-blur-xl p-8 rounded-2xl border-2 border-cyan-400/20 shadow-xl h-full flex flex-col"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Start Free</h3>
                  <div className="text-5xl font-black text-white mb-2">$0</div>
                  <p className="text-gray-400">No login. No judgment. Just receipts.</p>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>1 free receipt (no signup)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>3 bonus receipts when you sign up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>1 daily receipt (free plan)</span>
                  </li>
                </ul>
                <Button
                  onClick={() => navigate('/new-receipt')}
                  variant="outline"
                  className="w-full border-cyan-400/40 text-white hover:bg-cyan-500/20 py-6 text-lg mt-auto"
                >
                  Start Free →
                </Button>
              </motion.div>

              {/* Premium Plan - ENHANCED VISUAL HIERARCHY */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl p-8 rounded-2xl border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/20 relative h-full flex flex-col"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                </motion.div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Premium Monthly</h3>
                  <div className="text-5xl font-black text-white mb-2">$4.99</div>
                  <p className="text-gray-400">per month • Cancel anytime</p>
                </div>
                <ul className="space-y-3 mb-8 text-gray-200 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span className="font-semibold">UNLIMITED Truth Receipts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span className="font-semibold">UNLIMITED Ask Sage Anything</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Immunity Training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>Priority processing</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleCheckout('price_1SI49tG71EqeOEZe0p9LNpbP', 'Premium Monthly')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-6 text-lg shadow-xl hover:scale-105 transition-all mt-auto"
                >
                  Go Premium
                </Button>
              </motion.div>
            </div>

            {/* Emergency Packs - Thin Horizontal Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto"
            >
              {/* Emergency Pack x5 - $0.99 - ENHANCED VISIBILITY */}
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                className="bg-gradient-to-br from-cyan-500/15 via-cyan-500/10 to-cyan-500/15 backdrop-blur-xl border-2 border-cyan-400/50 rounded-xl p-6 hover:border-cyan-400/70 hover:bg-gradient-to-br hover:from-cyan-500/20 hover:via-cyan-500/15 hover:to-cyan-500/20 transition-all duration-300 cursor-pointer group shadow-lg shadow-cyan-500/20"
                onClick={() => handleCheckout('price_1SRl6hG71EqeOEZebPJkKJB6', 'Emergency Pack x5')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🆘</span>
                    <h4 className="text-xl font-bold text-white">Emergency Pack</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-cyan-400">$0.99</div>
                    <div className="text-xs text-gray-300 font-medium">one-time</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-gray-200 font-bold">5 Sage Receipts</p>
                    <p className="text-xs text-gray-400 mt-1">Perfect for one more spiral</p>
                  </div>
                  <div className="px-5 py-2.5 bg-cyan-500/30 border-2 border-cyan-400/60 rounded-lg text-sm font-bold text-cyan-100 group-hover:bg-cyan-500/40 group-hover:border-cyan-400/80 transition-all shadow-md shadow-cyan-500/30">
                    Get 5 →
                  </div>
                </div>
              </motion.div>

              {/* Emergency Pack x10 - $1.99 */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/6 backdrop-blur-xl border border-purple-400/30 rounded-xl p-5 hover:border-purple-400/50 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
                onClick={() => handleCheckout('price_1S0Po4G71EqeOEZeSqdB1Qfa', 'Emergency Pack x10')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🆘</span>
                    <h4 className="text-lg font-bold text-white">Emergency Pack</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-purple-400">$1.99</div>
                    <div className="text-xs text-gray-400">one-time</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 font-semibold">10 Sage Receipts</p>
                    <p className="text-xs text-gray-400 mt-1">Double the clarity</p>
                  </div>
                  <div className="px-4 py-2 bg-purple-500/20 border border-purple-400/40 rounded-lg text-sm font-semibold text-purple-300 group-hover:bg-purple-500/30 group-hover:border-purple-400/60 transition-all">
                    Get 10 →
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Founder's Club - Below as Special Offer with Visual Interest */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-cyan-900/30 backdrop-blur-xl p-8 rounded-2xl border-4 border-purple-400/60 shadow-2xl shadow-purple-500/50 text-center overflow-hidden"
            >
              {/* Animated Background Glow - Visual Interest */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/10 to-purple-500/20 pointer-events-none"
              />
              
              {/* Radial Glow Effects for Depth */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
              <div className="mb-6">
                <h3 className="text-3xl font-black text-white mb-2">OG FOUNDER'S CLUB</h3>
                <div className="text-sm text-purple-300 mb-4 font-semibold">FIRST 500 ONLY</div>
                <div className="text-5xl font-black text-white mb-2">$29.99/year</div>
                <p className="text-gray-300 mb-2">Locked in FOREVER</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-full text-sm text-purple-300 mb-4">
                  <span>⏰</span>
                  <span>487/500 spots remaining</span>
                </div>
              </div>
              <Button
                onClick={() => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founders Club')}
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-purple-600 text-black font-black py-6 text-lg shadow-2xl hover:scale-105 transition-all relative z-10"
              >
                🔒 Lock In Founder's Price
              </Button>
              </div>
            </motion.div>

            {/* Sage's Take - Quick Value Validation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-white italic mb-2">
                "The math is mathing, bestie."
              </p>
              <p className="text-base text-gray-400">— Sage, definitely</p>
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>

        {/* ============================================
            HORIZONTAL TICKER - SOCIAL PROOF
            ============================================ */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <HorizontalTicker />
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* ============================================
            FAQ SECTION - WITH SCANNABLE SUMMARIES
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-purple-400">Pricing FAQ</span>
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                The real talk about what you're actually paying for
              </p>
              <p className="text-base text-gray-400 italic">
                (No BS, just Sage's take)
              </p>
            </motion.div>

            <div className="space-y-4">
              {pricingFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all ${
                    openFAQ === index
                      ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20'
                      : 'hover:border-cyan-400/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <span className={`font-semibold text-lg pr-4 ${openFAQ === index ? 'text-cyan-400' : 'text-white'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-gray-300 leading-relaxed pt-4"
                    >
                      {/* Scannable Summary - Gen Z optimized */}
                      <div className="mb-4 pb-4 border-b border-white/10">
                        <p className="text-lg font-semibold text-cyan-400 leading-relaxed">
                          {faq.summary}
                        </p>
                      </div>
                      {/* Detailed Answer */}
                      <p className="text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* ============================================
            FINAL CTA SECTION
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight relative">
                Ready to stop guessing?<br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent relative inline-block">
                  Start knowing. 💅
                  {/* Final CTA sparkles - Strategic accent */}
                  <motion.span
                    animate={{
                      y: [0, -6, 0],
                      rotate: [0, 180, 360],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-1 -right-6 text-lg md:text-xl"
                  >
                    ✨
                  </motion.span>
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                Join the first 500 getting the truth about their chats.
              </p>
              <p className="text-base text-gray-400 italic mb-8 max-w-2xl mx-auto">
                No more mixed signals. No more doing CPR on a ghost.
              </p>
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
            </motion.div>
          </div>
        </section>

        {/* Mobile Sticky CTA - Shows after scrolling past hero */}
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
          >
            <Button
              onClick={() => handleCheckout('price_1SI49tG71EqeOEZe0p9LNpbP', 'Premium Monthly')}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-lg py-4 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300"
            >
              Go Premium - $4.99/month
            </Button>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="px-6 py-8 bg-black border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
              <Link to="/refer" className="text-gray-400 hover:text-white transition-colors text-sm">Earn & Refer</Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</Link>
            </div>
            <p className="text-gray-500 text-xs mb-2">For 16+ Entertainment Purposes Only</p>
            <p className="text-gray-500 text-xs">© 2025 Get The Receipts. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PricingPage;

