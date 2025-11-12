import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, Zap, ChevronDown, Sparkles } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useStripe } from '@stripe/react-stripe-js';
import sageLanding from '@/assets/sage-landing.png';

// Demo receipt images - All receipt types for proper rotation
// Truth Receipts
import ghostingChampionTruth from '@/assets/GTR Demo Assets/Truth Receipts/ghosting-champion-sage-receipt-1761066312906.png';
// Playbook Receipts
import ghostingChampionPlaybook from '@/assets/GTR Demo Assets/ghosting-champion-sage-playbook-1761066320799.png';
// Immunity Receipts
import ghostingChampionImmunity from '@/assets/GTR Demo Assets/ghosting-champion-sage-immunity-1761067753743.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const { user } = useAuth();
  const { toast } = useToast();
  const [liveUserCount, setLiveUserCount] = useState(150);
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [currentReceiptDemo, setCurrentReceiptDemo] = useState(0);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const stripe = useStripe() || null;
  
  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Social proof - Sage voice, screenshot-worthy
  const socialFeed = [
    {
      reaction: "Called. Him. OUT.",
      quote: "Sage literally highlighted the receipts I needed to send to the GC. Screenshotted everything in 30 seconds.",
      handle: "@bridgetxo",
      meta: "Brooklyn • Breadcrumb decode"
    },
    {
      reaction: "Gut confirmed.",
      quote: "My therapist told me to trust my instincts. Sage gave me the exact language to shut it down. BF5 code just unlocked my spine.",
      handle: "@devonlive",
      meta: "Austin • Situationship audit"
    },
    {
      reaction: "Sent to the GC.",
      quote: "We were all arguing if he was serious or not. Sage called him a 'future faker' and we howled. Zero lies detected.",
      handle: "@jenandjuice",
      meta: "Toronto • Dream seller breakdown"
    },
    {
      reaction: "Low-key obsessed.",
      quote: "Not a bot acting like my emotionally intelligent bestie. The immunity checklist has me ignoring dry 'wyd' texts now.",
      handle: "@hailey.exe",
      meta: "LA • Immunity training run"
    }
  ];

  // FAQ - Sage voice, no therapy-speak (6 questions)
  const faqs = [
    {
      question: "Who else sees my chats?",
      summary: "🔒 No one. Your chats are never stored, never trained on, deleted immediately.",
      answer: "Your privacy is our entire foundation. You alone choose what you share. Your conversations are analyzed in real-time and are never stored, never used for AI training, and deleted immediately unless you explicitly choose to save your history. Your secrets and chats are safe."
    },
    {
      question: "Can I try Sage without signing up?",
      summary: "✅ Yes! 3 free receipts + 1 daily freebie. No login. No judgment.",
      answer: "Yep. No account. No strings. You get 3 free Sage Receipts instantly — no login, no credit card, no judgment. Just paste your chat and go. Want more? Stay on the Free Plan: you'll still get that daily Sage read for free. Still no card. Still no pressure."
    },
    {
      question: "What do I get with the free plan?",
      summary: "🎁 3 bonus receipts + 1 daily receipt. All free, forever.",
      answer: "Sign up = 3 free Receipts, no expiry. Plus, you get 1 fresh Sage Receipt every day. That's a full decode: the read, the archetype, the receipt, and the playbook. All free. No card needed. If it's 2:00am and your brain won't quit, Sage is here. You'll get another one tomorrow."
    },
    {
      question: "Why is Privacy First such a big deal here?",
      summary: "🛡️ Because your real, messy convos deserve to feel safe. Always.",
      answer: "Because when you're pasting real, messy convos into an app, you deserve to feel safe. From day one, we built Get The Receipts to protect your privacy like it's our own. No chat logs. No training on your data. No digging into your history. You're not here to hand over secrets - you're here to get clarity, without judgment or surveillance."
    },
    {
      question: "Is this actual advice or just for fun?",
      summary: "🎭 Entertainment with eerily accurate takes. Like your horoscope, but savage.",
      answer: "Sage is an AI character created for entertainment. Sage is that friend who sees patterns and has opinions - lots of them. While many users say Sage's takes are eerily accurate (94% relate), Sage is not a therapist or counselor. Think of Sage like your horoscope: somehow relevant, technically entertainment, and screenshot-worthy when it hits."
    },
    {
      question: "Does Sage only work on toxic situations?",
      summary: "💅 Nope. Sage reads everything - healthy, toxic, confusing, or chaotic.",
      answer: "Hell no. Sage reads everything. Bring your healthy relationship and Sage will validate why it's working. Bring your ex from 2009 for laughs. Bring your mom's guilt-trip texts. Bring that Love Island chat you're obsessed with. Sage has takes on all of it - the good, the bad, and the \"what even is this?\""
    }
  ];

  // Sage's signature lines for repeatable interest
  const sageQuotes = [
    "Phones aren't leashes.",
    "You're doing CPR on a ghost.",
    "That's not confusion; it's mixed signals on purpose.",
    "House rules aren't rude. They're clarity.",
    "You're texting like you're in a situationship with their potential, not their reality."
  ];

  const handleGetStarted = () => navigate('/new-receipt');
  const handleGoPremium = () => navigate('/pricing');

  const handleCheckout = async (priceId, tierName) => {
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

  // Auto-rotate demo receipt
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReceiptDemo((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live user count
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(137, Math.min(168, prev + change));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Demo data structure - Images and headers stay in sync
  const demoReceipts = [
    {
      type: 'Truth Receipt',
      description: 'Get the unfiltered breakdown of what they really mean.',
      image: ghostingChampionTruth
    },
    {
      type: 'Playbook',
      description: 'Actionable strategies to handle the situation.',
      image: ghostingChampionPlaybook
    },
    {
      type: 'Immunity Training',
      description: 'Build emotional armor and recognize patterns faster.',
      image: ghostingChampionImmunity
    }
  ];

  // Auto-rotate demo receipts every 4 seconds - Images and headers stay in sync
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReceiptDemo((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - Same as original */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10">
        {/* ============================================
            SECTION 1: HERO - SIMPLIFIED & FOCUSED
            ============================================ */}
        <section className="pt-32 pb-40 md:pt-40 md:pb-48 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Scarcity Banner - Subtle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full text-sm text-purple-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                First 500 lock in OG Founders lifetime access
              </div>
            </motion.div>

            {/* Main Headline - SINGLE FOCUS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-6"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                <span className="text-white">Stop spiraling.</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent relative">
                  Start knowing.
                  {/* Subtle sparkles around headline - Strategic placement */}
                  <motion.span
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 15, -15, 0],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 1,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-8 text-xl md:text-2xl"
                  >
                    ✨
                  </motion.span>
                </span>
              </h1>
            </motion.div>

            {/* Single Supporting Line - Sage Voice - TYPOGRAPHY STANDARDIZED */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              Paste the text. Get the truth. 60 seconds.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base text-gray-400 italic max-w-2xl mx-auto leading-relaxed"
            >
              Even if you've done a full FBI investigation and called it "closure."
            </motion.p>

            {/* Trust Badges - INLINE with CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-cyan-400" />
                <span>Never Stored</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>60 Seconds</span>
              </div>
            </motion.div>

            {/* Primary CTA - SINGLE FOCUS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-6"
              className="flex justify-center"
            >
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black px-10 py-5 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 min-h-[64px] min-w-[280px] flex flex-col items-center leading-tight"
              >
                <span className="font-bold text-lg md:text-xl">Get Your First 3 Receipts Free</span>
                <span className="text-[10px] font-medium text-black/60 tracking-wide uppercase mt-1">no signup needed</span>
              </Button>
            </motion.div>

            {/* Live Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm text-gray-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-medium">{liveUserCount}</span> people getting clarity right now
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* ============================================
            SECTION 2: WHY SAGE - MERGED TRUST + MEET SAGE
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Sage</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
                Your soda-pop buzzed bestie who's seen this 47 times.
              </p>
              <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed italic">
                Not a therapist. Not your mom. Not even real. Just your no-BS bestie who refuses to watch you spiral.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Sage Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/35 via-purple-400/30 to-emerald-300/35 rounded-full blur-2xl animate-pulse"></div>
                  <div
                    className="relative w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-cyan-400/25 via-purple-400/20 to-emerald-300/20 rounded-full flex items-center justify-center overflow-hidden shadow-2xl border border-cyan-400/40"
                    style={{
                      boxShadow: '0 0 40px rgba(6, 182, 212, 0.35), 0 0 80px rgba(168, 85, 247, 0.25)'
                    }}
                  >
                    <img
                      src={sageLanding}
                      alt="Sage"
                      className="w-full h-full object-cover"
                      style={{
                        filter: 'brightness(1.08) contrast(1.05) saturate(1.08)'
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Sage Description */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="bg-white/8 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 shadow-xl shadow-cyan-500/10 relative">
                  <p className="text-xl text-gray-300 leading-relaxed mb-4 italic relative">
                    "Sage is that friend who tells it like it is."
                    {/* Subtle sparkle accent - Very minimal */}
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: 2,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-1 -right-6 text-lg"
                    >
                      ✨
                    </motion.span>
                  </p>
                  {/* Content Density Refinement: Bullet format */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">✨</span>
                      <p className="text-xl text-gray-300 leading-relaxed">Made for laughs, clarity, and maybe a little reality check</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-400 mt-1">💅</span>
                      <p className="text-xl text-gray-300 leading-relaxed">Savage takes. Zero filter. Made with love.</p>
                    </div>
                  </div>
                  <div className="flex justify-center pt-4 border-t border-white/10">
                    <Button
                      onClick={() => navigate('/new-receipt')}
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-black px-6 py-4 rounded-xl shadow-lg shadow-cyan-500/30 flex flex-col items-center justify-center leading-tight whitespace-nowrap min-h-[72px]"
                    >
                      <span className="text-lg font-semibold whitespace-nowrap">Get Your First 3 Receipts Free</span>
                      <span className="text-[10px] font-medium text-black/60 tracking-wide uppercase mt-1.5">no signup needed</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>

        {/* ============================================
            SECTION 3: HOW IT WORKS - SIMPLIFIED
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                From confused to confident in under 60 seconds
              </p>
              {/* Visual Interest: Animated sparkles */}
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🧠', title: '1. Paste Your Chat', desc: 'Copy any conversation and paste it in. Sage analyzes every message instantly.' },
                { icon: '💡', title: '2. Get the Truth', desc: 'Sage gives you the unfiltered breakdown: what they really mean, not what you want to hear.' },
                { icon: '📱', title: '3. Share the Receipt', desc: 'Get a beautiful receipt you can screenshot and share. Finally, proof you were right.' }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 shadow-xl shadow-cyan-500/10"
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"></div>

        {/* ============================================
            SECTION 4: DEMO - SIMPLIFIED AUTO-PLAY
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                See Sage work in <span className="text-cyan-400">10 seconds</span>
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Watch how Sage decodes different communication patterns
              </p>
              <p className="text-base text-gray-400 italic">
                Screenshot-worthy receipts that make it to the group chat
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Receipt Display - Auto-rotating with smooth transitions */}
                <div className="relative">
                  <motion.div
                    key={currentReceiptDemo}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 rounded-2xl p-4 border border-white/20"
                  >
                    <img
                      src={demoReceipts[currentReceiptDemo].image}
                      alt={`Sage ${demoReceipts[currentReceiptDemo].type} Demo`}
                      className="w-full h-auto rounded-lg"
                    />
                  </motion.div>
                  <motion.div
                    key={`badge-${currentReceiptDemo}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  >
                    {demoReceipts[currentReceiptDemo].type}
                  </motion.div>
                </div>

                {/* Description - Stays in sync with image */}
                <motion.div
                  key={`desc-${currentReceiptDemo}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-3xl font-bold text-cyan-400 mb-4">
                    {demoReceipts[currentReceiptDemo].type}
                  </h3>
                  <p className="text-gray-300 text-xl leading-relaxed mb-6">
                    {demoReceipts[currentReceiptDemo].description}
                  </p>
                  <Button
                    onClick={() => navigate('/new-receipt')}
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all"
                  >
                    Get My Full Analysis
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>

        {/* ============================================
            SECTION 5: SOCIAL PROOF - ENHANCED
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Trusted by people who are <span className="text-cyan-400">DONE</span> spiraling 💯
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Real chaos, real receipts. These are the moments the GC can't stop sharing.
              </p>
              <p className="text-base text-gray-400 max-w-3xl mx-auto">
                82% said Sage spotted the pattern they were missing. We're not flexing four-digit user counts yet - we're flexing how often Sage tells people what their friends couldn't tell them.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {socialFeed.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/15 rounded-2xl p-6 shadow-lg hover:border-cyan-300/40 transition-all"
                >
                  <div className="text-sm font-semibold text-emerald-300 uppercase tracking-wide mb-2">{item.reaction}</div>
                  <p className="text-gray-100 leading-relaxed mb-3">{item.quote}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="px-2 py-1 rounded-full bg-white/10 text-white/90 font-medium">{item.handle}</span>
                    <span>{item.meta}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sage Quote Rotator - Repeatable Interest */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-white mb-4 italic">
                "{sageQuotes[currentReceiptDemo % sageQuotes.length]}"
              </p>
              <p className="text-sm text-gray-400">— Sage, probably</p>
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* ============================================
            SECTION 6: PRICING - SIMPLIFIED (2 MAIN OPTIONS)
            ============================================ */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple pricing.{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  No surprises.
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Receipts in 60 seconds. No shame. No storage. Just Sage's take.
              </p>
              <p className="text-base text-gray-400 italic">
                House rules: You get to decide what works for you.
              </p>
              {/* Visual Interest: Animated pricing badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex justify-center mt-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-full">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-300 font-semibold">No hidden fees. Ever.</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Two Main Options - Enhanced spacing for visual hierarchy */}
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
                  <p className="text-gray-400">No login needed</p>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>3 free receipts instantly (no signup)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>1 full Sage read every day (Free Plan)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>No credit card. No pressure.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">🎁</span>
                    <span>Black Friday Freebie: enter BF5 in your dashboard</span>
                  </li>
                </ul>
                <Button
                  onClick={handleGetStarted}
                  variant="outline"
                  className="w-full border-cyan-400/40 text-white hover:bg-cyan-500/20 py-6 text-lg mt-auto"
                >
                  Start Free →
                </Button>
              </motion.div>

              {/* Premium Plan - ENHANCED VISUAL HIERARCHY (subtle emphasis via styling, not scale) */}
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
                  <p className="text-gray-400">per month</p>
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

            {/* Founder's Club - Below as Special Offer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-purple-900/60 via-purple-800/40 to-cyan-900/30 backdrop-blur-xl p-8 rounded-2xl border-4 border-purple-400/60 shadow-2xl shadow-purple-500/50 text-center"
            >
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
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-purple-600 text-black font-black py-6 text-lg shadow-2xl hover:scale-105 transition-all"
              >
                🔒 Lock In Founder's Price
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>

        {/* ============================================
            SECTION 7: FAQ - SIMPLIFIED (3 QUESTIONS)
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
                <span className="text-purple-400">FAQ</span>
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                The real talk about what you're actually signing up for
              </p>
              <p className="text-base text-gray-400 italic">
                (No BS, just Sage's take)
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
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
              <div className="flex justify-center">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black px-10 py-5 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 min-h-[64px] flex flex-col items-center leading-tight whitespace-nowrap"
                >
                  <span className="font-bold text-lg whitespace-nowrap">Get Your First 3 Receipts Free</span>
                  <span className="text-[10px] font-medium text-black/60 tracking-wide uppercase mt-1">no signup needed</span>
                </Button>
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
            <div className="flex justify-center">
              <Button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black py-4 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 flex flex-col items-center leading-tight"
              >
                <span className="font-bold text-lg">Get Your First 3 Receipts Free</span>
                <span className="text-[10px] font-medium text-black/60 tracking-wide uppercase mt-1">no signup needed</span>
              </Button>
            </div>
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

export default LandingPage;

