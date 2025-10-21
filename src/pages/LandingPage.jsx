import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, TrendingUp, Gift, ArrowRight, Sparkles, ChevronDown, ShieldCheck, Eye } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import sagePurpleSwirl from '@/assets/sage-purple-swirl-circle.png';
import sageLanding from '@/assets/sage-landing.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const { user } = useAuth();
  const { toast } = useToast();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [showDemoResult, setShowDemoResult] = useState(false);
  const [liveUserCount, setLiveUserCount] = useState(1247);

  // Typing animation state
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Messages to cycle through - Gen Z nightmare scenarios
  const messages = [
    { text: '💬 "watches my story instantly but takes 8 hours to reply... lol"', color: 'bg-gradient-to-r from-blue-400 to-indigo-500', archetype: '📱👻 The WiFi Ghoster' },
    { text: '💬 "soft-launched me on close friends then hard-launched their ex 🤡"', color: 'bg-gradient-to-r from-indigo-400 to-purple-500', archetype: '📸🤡 The Backup Plan' },
    { text: '💬 "they really typed \'wyd\' at 1:47am thinking that\'s flirting! how am i not confused."', color: 'bg-gradient-to-r from-purple-400 to-violet-500', archetype: '🌙💔 The 2AM Breadcrumber' },
    { text: '💬 "is this normal - games 10 hours straight but can\'t call for 5 min?? WTF!"', color: 'bg-gradient-to-r from-violet-400 to-pink-500', archetype: '🎮⚰️ The AFKer' },
    { text: '💬 "they said \'I love you\' on date 2 and wants to meet my parents... help 😭"', color: 'bg-gradient-to-r from-pink-400 to-rose-500', archetype: '💣💕 The Love Bomber' },
    { text: '💬 "date 1: life story trauma dump. date 2: complete ghost. make it make sense"', color: 'bg-gradient-to-r from-rose-400 to-pink-500', archetype: '💣👻 The Emotional Hit & Run' },
    { text: '💬 "u plan trips we\'ll never take but can\'t plan dinner.. I don\'t get it."', color: 'bg-gradient-to-r from-blue-400 to-purple-500', archetype: '✈️🎭 The Dream Seller' }
  ];

  const handleGetStarted = () => navigate('/chat-input');
  const handleRefer = () => navigate('/refer');
  
  const handleGoPremium = async () => {
    if (!user) {
      openModal('sign_up');
      toast({ 
        title: 'Create an account to upgrade!', 
        description: 'Sign up to unlock premium features and get receipts.'
      });
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1SI49tG71EqeOEZe0p9LNpbP', // Premium Monthly $4.99
          userId: user.email,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  
  const handleFounderPurchase = async () => {
    if (!user) {
      openModal('sign_up');
      toast({ 
        title: 'Create an account to upgrade!', 
        description: 'Sign up to unlock premium features and get receipts.'
      });
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R', // OG Founders Club $29.99
          userId: user.email,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Who else sees my chats?",
      answer: "Your privacy is our entire foundation. You alone choose what you share. Your conversations are analyzed in real-time and are never stored, never used for AI training, and deleted immediately unless you explicitly choose to save your history. Your secrets and chats are safe."
    },
    {
      question: "Can I try Sage without signing up?",
      answer: "Yep. No account. No strings. You get 1 free Sage Receipt — no login, no credit card, no judgment. Just paste your chat and go. Want more? Join the Free Plan: you\'ll get 3 bonus Receipts right away, plus 1 full Sage read every day (archetype, verdict, and playbook). Still no card. Still no pressure."
    },
    {
      question: "What do I get with the free plan?",
      answer: "Sign up = 3 free Receipts, no expiry. Plus, you get 1 fresh Sage Receipt every day. That\'s a full decode: the read, the archetype, the receipt, and the playbook. All free. No card needed. If it\'s 2:00am and your brain won\'t quit, Sage is here. You\'ll get another one tomorrow."
    },
    {
      question: "Is this actual advice or just for fun?",
      answer: "Sage is an AI character created for entertainment. Sage is that friend who sees patterns and has opinions — lots of them. While many users say Sage's takes are eerily accurate (94% relate), Sage is not a therapist or counselor. Think of Sage like your horoscope: somehow relevant, technically entertainment, and screen-shot worthy when it hits."
    },
    {
      question: "Why does Sage sound so sure when it\'s just for entertainment?",
      answer: "That\'s Sage's character — the friend who\'s so done watching you spiral that everything sounds like fact. It\'s not. Sage is an AI with opinions, not a mind reader. But that confidence can help calm an overthinking brain. Take what resonates, leave what doesn\'t."
    },
    {
      question: "Does Sage only work on toxic situations?",
      answer: "Hell no. Sage reads everything. Bring your healthy relationship and Sage will validate why it\'s working. Bring your ex from 2009 for laughs. Bring your mom\'s guilt-trip texts. Bring that Love Island chat you\'re obsessed with. Sage has takes on all of it — the good, the bad, and the \"what even is this?\""
    },
    {
      question: "Why is Privacy First such a big deal here?",
      answer: "Because when you\'re pasting real, messy convos into an app, you deserve to feel safe. From day one, we built Get The Receipts to protect your privacy like it\'s our own. No chat logs. No training on your data. No digging into your history. You\'re not here to hand over secrets — you\'re here to get clarity, without judgment or surveillance."
    },
    {
      question: "Data: What do you keep, and what do you delete?",
      answer: "We keep only what\'s needed to run your account and instantly delete everything else. We keep: email (for login), encrypted password, and payment info (if paid). We delete: all receipts and messages after Sage processes it (gone in ~3 seconds), your receipt results, and any record of what you pasted in. We never track your behavior, message history, or usage for training or marketing. We use zero-storage architecture plus real-time processing with contractual no-training AI services. Sage doesn\'t learn from you — Sage helps you learn from your own patterns."
    }
  ];

  const activities = [
    "Sarah in NYC just spotted a Breadcrumber",
    "Marcus in London identified a Keeper",
    "Alex in Sydney dodged a Ghoster",
    "Emma in Toronto exposed a Love Bomber", 
    "Jake in Miami called out a Gaslighter",
    "Zoe in Berlin recognized a Genuine Connection"
  ];

  const demoScenarios = [
    {
      id: 'midnight-hey',
      text: 'The midnight "hey u"',
      message: 'hey u',
      time: '11:47 PM',
      analysis: 'The Breadcrumber',
      insight: 'Low-effort contact at convenient hours. They\'re keeping you as an option.',
      interest: '23%',
      color: 'orange'
    },
    {
      id: 'eternal-busy',
      text: 'The eternal "busy"',
      message: 'sorry been so busy lately',
      time: '2 days later',
      analysis: 'The Ghoster',
      insight: 'Generic excuse without offering alternative plans. They\'re not prioritizing you.',
      interest: '15%',
      color: 'pink'
    },
    {
      id: 'dreaded-k',
      text: 'The dreaded "k."',
      message: 'k.',
      time: 'Just now',
      analysis: 'The Passive Aggressor',
      insight: 'Minimal response indicates frustration or disengagement. They\'re shutting down.',
      interest: '8%',
      color: 'red'
    }
  ];

  const handleDemoClick = (scenario) => {
    setSelectedDemo(scenario);
    setShowDemoResult(false);
    
    // Show analysis after a brief delay for realism
    setTimeout(() => {
      setShowDemoResult(true);
    }, 1500);
  };

  // Typing animation effect
  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];
    let charIndex = 0;
    setCurrentText('');
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.text.length) {
        setCurrentText(currentMessage.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Show archetype after typing completes
        setTimeout(() => {
          // Move to next message
          setTimeout(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          }, 2000);
        }, 1500);
      }
    }, 50); // Types 1 character every 50ms

    return () => clearInterval(typingInterval);
  }, [currentMessageIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        // Randomly fluctuate the number to show live activity
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(1200, Math.min(1300, newCount)); // Keep between 1200-1300
      });
    }, 8000); // Update every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean Black Background for Maximum Readability */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Depth - No Blur for Performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-black/20" />
      
      {/* Minimal Accent - Just for Visual Interest */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.03),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Hero Section - World-Class SaaS Design */}
        <section className="pt-20 pb-32 px-4">
          <div className="max-w-7xl mx-auto">
        <motion.div
              initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
              className="text-center"
        >

        {/* Typing Animation - Complete the sentence */}
          <motion.div
          initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 max-w-3xl mx-auto shadow-2xl shadow-purple-500/10">
            <div className="relative overflow-hidden h-24 flex items-center justify-center">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className={`text-xl sm:text-2xl font-medium ${messages[currentMessageIndex].color} bg-clip-text text-transparent`}>
                  {currentText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </div>
                {!isTyping && currentText && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl text-gray-400 mt-1"
                  >
                    {messages[currentMessageIndex].archetype}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
          </motion.div>

        {/* Headline - LARGE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 max-w-5xl mx-auto"
        >
          <span className="text-white">That thing keeping you</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-lime-400 bg-clip-text text-transparent">
            up at night?
          </span>
        </motion.h1>

        {/* Quick Process Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto"
        >
          Paste the chat. Tell the story. Get Sage's take. 💅
        </motion.p>

        {/* Process - SIMPLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xs sm:text-sm md:text-base text-gray-400 font-light mb-12 max-w-2xl mx-auto"
        >
          Sage decodes the chat you can't stop replaying. From crushes to coworkers, breakups to besties. Sage doesn't read minds... she reads patterns. And she's seen it all...
        </motion.p>


        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-8"
        >
            <Button
              onClick={handleGetStarted}
            className="group relative bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold text-xl px-12 py-6 rounded-xl shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50"
            >
            <span className="relative z-10">Get Your First Receipt Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          <p className="text-sm text-gray-400 mt-2">
            Free • No Login Required
          </p>
        </motion.div>

        {/* Trust Badges */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-base text-gray-400"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <span>Privacy First Policy</span>
            </div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-400" />
            <span>Never stored</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            <span>Results in 60s</span>
          </div>
        </motion.div>

            </motion.div>
          </div>
        </section>


        {/* Meet Sage Section - Clean & Cohesive */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
          >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/50 text-sm font-medium text-white mb-4 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105">
                <span className="relative">
                  Meet Sage
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400/30 to-purple-400/30 blur-sm -z-10"></div>
                </span>
              </div>
              {/* Main heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto leading-tight">
                Your AI bestie with opinions
              </h2>
              {/* Body paragraph */}
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Sage has seen every pattern: breadcrumbing, ghosting, love bombing—no judgment, just clarity.
              </p>
            </motion.div>

            {/* Sage's Personality Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-black/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src="/src/assets/sage-landing.png" 
                        alt="Sage" 
                        className="w-40 h-40 rounded-full object-cover"
                      />
              </div>
                    <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Sage</h3>
                        <span className="text-2xl" aria-hidden>💅</span>
              </div>
                      
                      <div className="space-y-4">
                        <p className="text-gray-300 leading-relaxed">
                          Not a therapist. Not your mom. Not even <em>really</em> real.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                          Just that friend who's had enough of your spiral and loves you too much to watch it continue. Created for your entertainment (and maybe some perspective).
                        </p>
                        <p className="text-cyan-400 font-medium italic text-lg">
                          "Savage takes. Zero filter. Made with love." 🪄
              </p>
            </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">Anonymous</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">Pattern Recognition</span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">Instant Clarity</span>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
        </section>

        {/* What Sage Decodes Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                What Sage Decodes
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The patterns that keep you up at night, finally explained.
              </p>
                </motion.div>

            {/* Character Cards - Like the style you loved */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {/* The Breadcrumber */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center shadow-lg shadow-black/10"
              >
                <div className="text-4xl mb-4">👻</div>
                <h3 className="text-xl font-bold text-pink-400 mb-4">The Breadcrumber</h3>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Interest Level</div>
                  <div className="text-2xl font-bold text-white mb-2">12%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" style={{width: '12%'}}></div>
              </div>
              </div>
                <p className="text-gray-300 text-sm">Just enough to keep you hooked, never enough to commit.</p>
                </motion.div>

              {/* The Mixed Signals */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center shadow-lg shadow-black/10"
              >
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-xl font-bold text-blue-400 mb-4">The Mixed Signals</h3>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Confusion Level</div>
                  <div className="text-2xl font-bold text-white mb-2">89%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: '89%'}}></div>
              </div>
              </div>
                <p className="text-gray-300 text-sm">Hot one day, cold the next. Your head is spinning.</p>
                </motion.div>

              {/* The Genuine */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center shadow-lg shadow-black/10"
              >
                <div className="text-4xl mb-4">💚</div>
                <h3 className="text-xl font-bold text-green-400 mb-4">The Genuine</h3>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Availability</div>
                  <div className="text-2xl font-bold text-white mb-2">94%</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
                <p className="text-gray-300 text-sm">Actually interested, actually available, actually worth your time.</p>
          </motion.div>
            </div>

            {/* What Sage Decodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                  <span className="text-2xl mt-1">💬</span>
                <p className="text-gray-300 text-lg leading-relaxed text-left">
                  <span className="font-medium text-pink-400">The 2am spirals</span> - when one "k" keeps you up all night replaying the chat.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                  <span className="text-2xl mt-1">💔</span>
                <p className="text-gray-300 text-lg leading-relaxed text-left">
                  <span className="font-medium text-purple-400">Situationships</span> - when you don't know if it's a catch-up, a date, or just a dead end.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                  <span className="text-2xl mt-1">🤝</span>
                <p className="text-gray-300 text-lg leading-relaxed text-left">
                  <span className="font-medium text-blue-400">Confusing friendships</span> - when "I'm fine" feels anything but fine.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                  <span className="text-2xl mt-1">💗</span>
                <p className="text-gray-300 text-lg leading-relaxed text-left">
                  <span className="font-medium text-cyan-400">Even the good ones</span> - when you just want proof your relationship really is on the right track.
                </p>
              </motion.div>
            </div>

            {/* Key Features Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="text-lg font-bold text-white mb-2">Truth Receipts</h4>
                <p className="text-gray-300 text-sm">9:16 format perfect for sharing on social media</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="text-lg font-bold text-white mb-2">Sage's Playbook</h4>
                <p className="text-gray-300 text-sm">Immunity training to spot patterns before they hurt</p>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="text-lg font-bold text-white mb-2">Vibe Check™</h4>
                <p className="text-gray-300 text-sm">Real-time analysis as conversations happen</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
          >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                See it work in 10 seconds
            </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Click any scenario below to see how Sage analyzes patterns
              </p>
          </motion.div>

            {/* Demo Buttons - POPPING Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            {demoScenarios.map((scenario) => (
                <motion.button
                key={scenario.id}
                onClick={() => handleDemoClick(scenario)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer group transition-all duration-300 ${
                  selectedDemo?.id === scenario.id 
                      ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30' 
                      : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-cyan-500/20 hover:to-blue-500/20 hover:shadow-xl hover:shadow-cyan-500/20'
                  }`}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-lg font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                  {scenario.text}
                </div>
                    <div className="text-gray-300 text-sm bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10 group-hover:bg-black/30 transition-all duration-300">
                  "{scenario.message}"
                </div>
                    <div className={`text-sm font-semibold transition-all duration-300 ${
                      selectedDemo?.id === scenario.id 
                        ? 'text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent' 
                        : 'text-cyan-400 group-hover:text-blue-400'
                    }`}>
                      {selectedDemo?.id === scenario.id ? '✓ Analyzing...' : 'Click to analyze →'}
                </div>
                  </div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                </motion.button>
            ))}
          </div>

          {/* Demo Results */}
          {selectedDemo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              {!showDemoResult ? (
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center shadow-lg shadow-black/10">
                  <div className="flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  </div>
                  <p className="text-gray-300">Analyzing message patterns...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-cyan-400/50 rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-cyan-500/20"
                  >
                    {/* Animated background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <div className="text-3xl mb-2">🔮</div>
                        <div className="text-sm text-gray-300 mb-4 bg-black/20 rounded-lg p-2">
                      Message: "{selectedDemo.message}" • {selectedDemo.time}
                    </div>
                  </div>
                  
                      <div className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {selectedDemo.analysis}
                  </div>
                  
                      <p className="text-gray-200 mb-6 leading-relaxed">
                    {selectedDemo.insight}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-gray-300">Interest Level</span>
                        <span className="font-bold text-white">{selectedDemo.interest}</span>
                  </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-4 mb-6 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: selectedDemo.interest }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        ></motion.div>
                  </div>
                  
                    <Button
                      onClick={handleGetStarted}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-cyan-500/25"
                    >
                      Get My Full Analysis
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          </div>
        </section>

        {/* How it works Section - Below What Sage Decodes */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-5xl mx-auto"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  How it works
                  <span className="text-cyan-400 font-normal ml-2">(it's embarrassingly simple)</span>
                </h3>
                
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Paste & Get Real</h4>
                    <p className="text-sm text-gray-300">
                      Drop in any conversation thread. Sage instantly calls out the patterns.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/30">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Get the Tea</h4>
                    <p className="text-sm text-gray-300">
                      Get the unfiltered breakdown: what they really mean and their interest level.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-4 text-left">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Share & Flex</h4>
                    <p className="text-sm text-gray-300">
                      Screenshot your receipt and share with friends. Finally, proof you were right.
                    </p>
                  </div>
              </div>
            </div>
          </motion.div>
          </div>
        </section>

        {/* Social Proof Section - Premium SaaS Style */}
        <section className="py-24 px-4 bg-gradient-to-b from-slate-900/20 via-purple-900/5 to-slate-900/20">
          <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
          >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                  Trusted by thousands who are DONE guessing 💯
            </h2>
                <p className="text-lg text-gray-300 max-w-5xl mx-auto whitespace-nowrap tracking-tight">
                  Join the community that's finally getting the real talk (and proving their friends wrong)
                </p>
          </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <motion.div
                initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  5K+
              </div>
                <div className="text-sm text-gray-400">Early Adopters</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-lime-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                  50K+
            </div>
                <div className="text-sm text-gray-400">Receipts That Hit Different</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  94%
              </div>
                <div className="text-sm text-gray-400">No BS Accuracy</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
                  60s
            </div>
                <div className="text-sm text-gray-400">Lightning Fast Tea</div>
              </motion.div>
            </div>

            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Sarah M.</div>
                    <div className="text-gray-400 text-sm">Verified User</div>
                  </div>
                </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "FINALLY proof that they were breadcrumbing me. My friends kept saying I was overthinking, but Sage confirmed what I already knew. I was RIGHT."
                  </p>
              </motion.div>

          <motion.div
                initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    M
              </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Marcus L.</div>
                    <div className="text-gray-400 text-sm">Verified User</div>
            </div>
                </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "Sage called out the red flags I was ignoring. Saved me months of wasted time on someone who wasn't serious. My gut was RIGHT."
                  </p>
          </motion.div>

          <motion.div
                initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Alex K.</div>
                    <div className="text-gray-400 text-sm">Verified User</div>
                  </div>
                </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "The accuracy is SCARY good. It's like having a friend who's seen every dating pattern and isn't afraid to spill the tea. No more second-guessing."
                  </p>
          </motion.div>
        </div>
          </div>
        </section>

        {/* Premium Pricing Section */}
        <section className="py-24 px-4 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                Simple pricing. No surprises.
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Start free, upgrade when you're ready for unlimited clarity
              </p>
            </motion.div>

            {/* Netflix-Style Clean Cards - All Same Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Free Daily Receipt Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="meme-card p-8 rounded-2xl flex flex-col justify-between" 
                style={{ minHeight: '420px' }}
              >
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
              </motion.div>
              
              {/* Premium Monthly Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="meme-card p-8 rounded-2xl flex flex-col justify-between border-2 border-teal-500/50" 
                style={{ minHeight: '420px' }}
              >
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
              </motion.div>
              
              {/* OG Founder's Club Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative p-8 rounded-2xl flex flex-col justify-between border-2 border-purple-400/60" 
                style={{ minHeight: '420px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1624 100%)' }}
              >
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
                    <p className="text-gray-400 text-sm">($2.49/month) <span className="text-green-400 font-semibold">40% OFF</span></p>
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
              </motion.div>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section className="py-24 px-4 bg-white/5">
          <div className="max-w-4xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
          >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                  <span className="align-middle mr-3 inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-white/90">FAQ</span>
                  Got Questions? 
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">We've Got ALL the Tea ☕</span>
            </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  The real talk about what you're actually signing up for 
                  <span className="text-cyan-400 font-semibold"> (no BS)</span>
            </p>
          </motion.div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
          <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all duration-500 shadow-lg shadow-black/10 ${
                  openFAQ === index 
                      ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 shadow-xl shadow-cyan-500/30' 
                      : 'hover:border-cyan-400/40 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:shadow-xl hover:shadow-cyan-500/20'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full text-left flex justify-between items-center transition-colors ${
                      openFAQ === index 
                        ? 'text-cyan-400' 
                        : 'text-white hover:text-cyan-400'
                    }`}
                  >
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-300 leading-relaxed pt-4 text-left"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl shadow-black/20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to stop guessing?<br />
                <span className="bg-gradient-to-r from-cyan-400 via-lime-400 to-pink-400 bg-clip-text text-transparent">
                  Start knowing. 💅
                </span>
          </h2>
          
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join 5K+ early adopters getting the truth about their chats. 
                <span className="text-white font-semibold italic"> No more mixed signals.</span>
              </p>
              
              {/* Live Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm text-gray-300 mb-8 shadow-lg shadow-black/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="font-medium">{liveUserCount.toLocaleString()}</span> people getting Sage's take right now
              </motion.div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 min-h-[56px] min-w-[200px]"
                >
                  Get Your First Receipt Free
              </Button>
                
                <Button
                  onClick={handleGetStarted}
                  variant="outline"
                  className="border-cyan-400/60 text-white hover:bg-cyan-500/10 hover:border-cyan-400/80 font-medium px-6 py-4 rounded-xl transition-all duration-300 min-h-[56px] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                >
                  Try Anonymous (No Signup)
              </Button>
            </div>
            
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Bank-level encryption</span>
                          </div>
                          <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span>Never stored or shared</span>
                          </div>
                          <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>Results in 60 seconds</span>
                          </div>
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
            <p className="text-gray-500 text-xs mb-2">For Entertainment Purposes Only</p>
            
            {/* Copyright */}
            <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
            
            {/* Support */}
            <p className="text-gray-500 text-xs">
              Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@getthereceipts.com</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

