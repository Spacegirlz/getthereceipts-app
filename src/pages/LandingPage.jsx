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

// Demo receipt images  -  All receipt types
// Truth Receipts
import ghostingChampionTruth from '@/assets/GTR Demo Assets/Truth Receipts/ghosting-champion-sage-receipt-1761066312906.png';
import maybeMerchantTruth from '@/assets/GTR Demo Assets/Truth Receipts/maybe-merchant-sage-receipt-1761067025449.png';
import reassuringPartnerTruth from '@/assets/GTR Demo Assets/Truth Receipts/reassuring-partner-sage-receipt-1761068554637.png';

// Playbook Receipts
import ghostingChampionPlaybook from '@/assets/GTR Demo Assets/ghosting-champion-sage-playbook-1761066320799.png';
import maybeMerchantPlaybook from '@/assets/GTR Demo Assets/maybe-merchant-sage-playbook-1761067383678.png';
import reassuringPartnerPlaybook from '@/assets/GTR Demo Assets/reassuring-partner-sage-playbook-1761068561011.png';

// Immunity Receipts
import ghostingChampionImmunity from '@/assets/GTR Demo Assets/ghosting-champion-sage-immunity-1761067753743.png';
import maybeMerchantImmunity from '@/assets/GTR Demo Assets/maybe-merchant-sage-immunity-1761067388991.png';
import reassuringPartnerImmunity from '@/assets/GTR Demo Assets/reassuring-partner-sage-immunity-1761068566579.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const { user } = useAuth();
  const { toast } = useToast();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [showDemoResult, setShowDemoResult] = useState(false);
  const [liveUserCount, setLiveUserCount] = useState(1247);
  const [selectedArchetype, setSelectedArchetype] = useState('ghosting-champion');
  const [currentReceiptType, setCurrentReceiptType] = useState('truth');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Testimonials array
  const testimonials = [
    { text: "Finally stopped overthinking every text", author: "Sarah M." },
    { text: "Sage called out my situationship perfectly", author: "Alex K." },
    { text: "No more analyzing mixed signals for hours", author: "Jordan L." },
    { text: "Finally got clarity on that confusing conversation", author: "Maya R." },
    { text: "Sage saved me from another toxic situation", author: "Taylor S." },
    { text: "The immunity training actually works", author: "Casey D." }
  ];

  // Typing animation state
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStreak, setShowStreak] = useState(false);

  // Messages to cycle through  -  Gen Z nightmare scenarios
  const messages = [
    { text: '💬 "watches my story instantly but takes 8 hours to reply... lol"', color: 'text-purple-200', archetype: '📱👻 The WiFi Ghoster' },
    { text: '💬 "soft-launched me on close friends then hard-launched their ex"', color: 'text-purple-200', archetype: '📸🤡 The Backup Plan' },
    { text: '💬 "they really typed \'wyd\' at 1:47am thinking that\'s flirting! how am i not confused."', color: 'text-purple-200', archetype: '🌙💔 The 2AM Breadcrumber' },
    { text: '💬 "is this normal  -  games 10 hours straight but can\'t call for 5 min?? WTF!"', color: 'text-purple-200', archetype: '🎮⚰️ The AFKer' },
    { text: '💬 "they said \'I love you\' on date 2 and wants to meet my parents... help"', color: 'text-purple-200', archetype: '💣💕 The Love Bomber' },
    { text: '💬 "date 1: life story trauma dump. date 2: complete ghost. make it make sense"', color: 'text-purple-200', archetype: '💣👻 The Emotional Hit & Run' },
    { text: '💬 "u plan trips we\'ll never take but can\'t plan dinner.. I don\'t get it."', color: 'text-purple-200', archetype: '✈️🎭 The Dream Seller' }
  ];

  const handleGetStarted = () => navigate('/chat-input');
  const handleRefer = () => navigate('/refer');
  
  const handleGoPremium = () => navigate('/pricing');
  
  const handleFounderPurchase = async () => {
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
      answer: "Yep. No account. No strings. You get 1 free Sage Receipt  -  no login, no credit card, no judgment. Just paste your chat and go. Want more? Join the Free Plan: you\'ll get 3 bonus Receipts right away, plus 1 full Sage read every day (archetype, verdict, and playbook). Still no card. Still no pressure."
    },
    {
      question: "What do I get with the free plan?",
      answer: "Sign up = 3 free Receipts, no expiry. Plus, you get 1 fresh Sage Receipt every day. That\'s a full decode: the read, the archetype, the receipt, and the playbook. All free. No card needed. If it\'s 2:00am and your brain won\'t quit, Sage is here. You\'ll get another one tomorrow."
    },
    {
      question: "Is this actual advice or just for fun?",
      answer: "Sage is an AI character created for entertainment. Sage is that friend who sees patterns and has opinions  -  lots of them. While many users say Sage's takes are eerily accurate (94% relate), Sage is not a therapist or counselor. Think of Sage like your horoscope: somehow relevant, technically entertainment, and screen-shot worthy when it hits."
    },
    {
      question: "Why does Sage sound so sure when it\'s just for entertainment?",
      answer: "That\'s Sage's character  -  the friend who\'s so done watching you spiral that everything sounds like fact. It\'s not. Sage is an AI with opinions, not a mind reader. But that confidence can help calm an overthinking brain. Take what resonates, leave what doesn\'t."
    },
    {
      question: "Does Sage only work on toxic situations?",
      answer: "Hell no. Sage reads everything. Bring your healthy relationship and Sage will validate why it\'s working. Bring your ex from 2009 for laughs. Bring your mom\'s guilt-trip texts. Bring that Love Island chat you\'re obsessed with. Sage has takes on all of it  -  the good, the bad, and the \"what even is this?\""
    },
    {
      question: "Why is Privacy First such a big deal here?",
      answer: "Because when you\'re pasting real, messy convos into an app, you deserve to feel safe. From day one, we built Get The Receipts to protect your privacy like it\'s our own. No chat logs. No training on your data. No digging into your history. You\'re not here to hand over secrets  -  you\'re here to get clarity, without judgment or surveillance."
    },
    {
      question: "Data: What do you keep, and what do you delete?",
      answer: "We keep only what\'s needed to run your account and instantly delete everything else. We keep: email (for login), encrypted password, and payment info (if paid). We delete: all receipts and messages after Sage processes it (gone in ~3 seconds), your receipt results, and any record of what you pasted in. We never track your behavior, message history, or usage for training or marketing. We use zero-storage architecture plus real-time processing with contractual no-training AI services. Sage doesn\'t learn from you  -  Sage helps you learn from your own patterns."
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

  // Archetype data structure
  const archetypes = {
    'ghosting-champion': {
      name: 'Ghosting Champion',
      message: 'you up?',
      time: '2:17 AM',
      interest: '25%',
      color: 'pink',
      images: {
        truth: ghostingChampionTruth,
        playbook: ghostingChampionPlaybook,
        immunity: ghostingChampionImmunity
      },
      insights: {
        truth: 'Late night texts with zero follow-through. They\'re keeping you as a backup option, bestie.',
        playbook: 'Here\'s your game plan to handle this situation and protect your energy.',
        immunity: 'Build emotional armor against this pattern and recognize the red flags faster.'
      }
    },
    'maybe-merchant': {
      name: 'Maybe Merchant',
      message: 'definitely maybe we can hang out this weekend',
      time: '3 days later',
      interest: '30%',
      color: 'purple',
      images: {
        truth: maybeMerchantTruth,
        playbook: maybeMerchantPlaybook,
        immunity: maybeMerchantImmunity
      },
      insights: {
        truth: 'All the enthusiasm, none of the commitment. You\'re getting the premium mixed signals package.',
        playbook: 'Here\'s your strategy to cut through the mixed signals and get real answers.',
        immunity: 'Build resistance to mixed signals and stop getting strung along by vague promises.'
      }
    },
    'reassuring-partner': {
      name: 'Reassuring Partner',
      message: 'I\'d love to see you Saturday! What time works for you?',
      time: 'Actually planned',
      interest: '85%',
      color: 'green',
      images: {
        truth: reassuringPartnerTruth,
        playbook: reassuringPartnerPlaybook,
        immunity: reassuringPartnerImmunity
      },
      insights: {
        truth: 'Clear communication, genuine interest, and actual plans. This is how healthy relationships work!',
        playbook: 'Here\'s how to recognize and appreciate healthy communication patterns.',
        immunity: 'Build confidence in recognizing healthy patterns and stop second-guessing good behavior.'
      }
    }
  };

  // Generate demo scenarios based on selected archetype
  const demoScenarios = [
    {
      id: `${selectedArchetype}-truth`,
      text: archetypes[selectedArchetype].name,
      message: archetypes[selectedArchetype].message,
      time: archetypes[selectedArchetype].time,
      analysis: `${archetypes[selectedArchetype].name}  -  Truth Receipt`,
      insight: archetypes[selectedArchetype].insights.truth,
      interest: archetypes[selectedArchetype].interest,
      color: archetypes[selectedArchetype].color,
      receiptImage: archetypes[selectedArchetype].images.truth,
      receiptType: 'truth'
    },
    {
      id: `${selectedArchetype}-playbook`,
      text: archetypes[selectedArchetype].name,
      message: archetypes[selectedArchetype].message,
      time: archetypes[selectedArchetype].time,
      analysis: `${archetypes[selectedArchetype].name}  -  Playbook`,
      insight: archetypes[selectedArchetype].insights.playbook,
      interest: archetypes[selectedArchetype].interest,
      color: archetypes[selectedArchetype].color,
      receiptImage: archetypes[selectedArchetype].images.playbook,
      receiptType: 'playbook'
    },
    {
      id: `${selectedArchetype}-immunity`,
      text: archetypes[selectedArchetype].name,
      message: archetypes[selectedArchetype].message,
      time: archetypes[selectedArchetype].time,
      analysis: `${archetypes[selectedArchetype].name}  -  Immunity Training`,
      insight: archetypes[selectedArchetype].insights.immunity,
      interest: archetypes[selectedArchetype].interest,
      color: archetypes[selectedArchetype].color,
      receiptImage: archetypes[selectedArchetype].images.immunity,
      receiptType: 'immunity'
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

  const handleReceiptSwitch = () => {
    const receiptTypes = ['truth', 'playbook', 'immunity'];
    const currentIndex = receiptTypes.indexOf(currentReceiptType);
    const nextIndex = (currentIndex + 1) % receiptTypes.length;
    setCurrentReceiptType(receiptTypes[nextIndex]);
  };

  const handleArchetypeSelect = (archetypeKey) => {
    setSelectedArchetype(archetypeKey);
    setSelectedDemo(null);
    setShowDemoResult(false);
    setCurrentReceiptType('truth'); // Reset to truth receipt when switching archetypes
  };

  // Pre-load first demo scenario for immediate impact
  useEffect(() => {
    if (demoScenarios.length > 0) {
      setSelectedDemo(demoScenarios[0]);
      setShowDemoResult(true);
    }
  }, [selectedArchetype]);


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
        const change = Math.random() > 0.5 ? 1 : - 1;
        const newCount = prev + change;
        return Math.max(1200, Math.min(1300, newCount)); // Keep between 1200-1300
      });
    }, 8000); // Update every 8 seconds
    return () => clearInterval(interval);
  }, []);

  // Testimonial rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Trust badge streak effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowStreak(true);
      setTimeout(() => setShowStreak(false), 1000);
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Deep Charcoal Background  -  Glassmorphism Optimized */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      
      {/* Subtle Depth with Cyan Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      
      {/* Glassmorphism Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Hero Section  -  World-Class SaaS Design */}
        <section className="pt-20 pb-32 px-4">
          <div className="max-w-7xl mx-auto">
        <motion.div
              initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
              className="text-center"
        >

        {/* Scarcity Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: [0, - 1, 1, - 1, 0]
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            rotate: {
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut"
            }
          }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-6 py-2 text-sm text-purple-300 inline-block">
            <motion.span
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, - 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 8,
                ease: "easeInOut"
              }}
            >
              🔥
            </motion.span> Limited: First 500 get lifetime access
          </div>
        </motion.div>

        {/* Typing Animation  -  Complete the sentence */}
          <motion.div
          initial={{ opacity: 0, y: - 10 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-4 max-w-3xl mx-auto shadow-2xl shadow-cyan-500/20">
            <div className="relative overflow-hidden h-24 flex items-center justify-center">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: - 20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className={`text-xl sm:text-2xl font-medium ${messages[currentMessageIndex].color}`}>
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

        {/* Headline  -  LARGE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 max-w-5xl mx-auto"
        >
          <span className="text-white">The message that won't leave your </span>
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            brain alone?
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

        {/* Process  -  SIMPLE */}
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 25px 50px - 12px rgba(6, 182, 212, 0.4)",
                "0 25px 50px - 12px rgba(6, 182, 212, 0.6)",
                "0 25px 50px - 12px rgba(6, 182, 212, 0.4)"
              ]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/40 transition-all duration-300 hover:scale-105 min-h-[56px] min-w-[200px] border border-cyan-300/50"
            >
              Get Your First Receipt Free (No Signup)
            </Button>
          </motion.div>
          
          <Button
            variant="outline"
            className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 text-lg px-6 py-3 rounded-xl transition-all duration-300"
          >
            See How It Works →
          </Button>
          
        </motion.div>

        {/* Trust Badges */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: showStreak ? [
                "0 0 0 rgba(6, 182, 212, 0)",
                "0 0 20px rgba(6, 182, 212, 0.6)",
                "0 0 0 rgba(6, 182, 212, 0)"
              ] : "0 0 0 rgba(6, 182, 212, 0)"
            }}
          transition={{ 
            duration: 0.8, 
            delay: 0.8,
            boxShadow: showStreak ? {
              duration: 1,
              ease: "easeInOut"
            } : {}
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-base text-gray-400"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Bank-level encryption</span>
            </div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-400" />
            <span>Data deleted in 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-white" />
            <span>Results in 60s</span>
          </div>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex justify-center gap-8 text-sm text-gray-400 mb-8"
        >
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">2.1K+</div>
            <div>People who stopped overthinking</div>
          </div>
          <div className="text-center">
            <div className="text-emerald-400 font-bold text-lg">94%</div>
            <div>Accuracy rate</div>
          </div>
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, - 3, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 8,
                ease: "easeInOut"
              }}
              className="text-purple-400 font-bold text-lg"
            >
              60s
            </motion.div>
            <div>Average response time</div>
          </div>
        </motion.div>

            </motion.div>
          </div>
        </section>

        {/* Subtle Section Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* Trust Bridge Section  -  Enhanced with Live Social Proof */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 shadow-lg shadow-cyan-500/10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Join <span className="text-cyan-400">2.1K+ people</span> getting clarity
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Get instant clarity on what they really mean. No more guessing games.
              </p>
              
              {/* Live Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0, y: - 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm text-gray-300 mb-6 shadow-lg shadow-black/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-medium">247</span> people online now
              </motion.div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Join the conversation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Start free today</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Meet Sage Section  -  Enhanced with Personality */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
          >
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-cyan-400/15 backdrop-blur-sm border border-cyan-400/40 text-cyan-300 text-sm font-semibold mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Meet Sage
              </div>
              {/* Main heading */}
              <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto leading-tight text-white">
                Stop overthinking every <span className="text-cyan-400">text</span>
              </h2>
              {/* Body paragraph */}
              <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Sage has seen every pattern: breadcrumbing, ghosting, love bombing  -  no judgment, just clarity.
              </p>
            </motion.div>

            {/* Sage's Personality Card  -  Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl mx-auto mb-16"
            >
              <div className="bg-white/8 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-cyan-500/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-emerald-300/15 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                    <div className="relative">
                      <div className="w-64 h-64 bg-gradient-to-br from-cyan-400 to-emerald-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xl shadow-cyan-400/40">
                        <img 
                          src={sageLanding} 
                          alt="Sage" 
                          className="w-64 h-64 rounded-full object-cover"
                        />
                      </div>
                      {/* Floating personality indicators */}
                      <div className="absolute - top-2 - right-2 w-12 h-12 bg-purple-400/20 backdrop-blur-sm border border-purple-400/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">🗣️</span>
                      </div>
                      <div className="absolute - bottom-2 - left-2 w-12 h-12 bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">💖</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-3">The friend you wish you had</h3>
                          <p className="text-gray-300 leading-relaxed text-lg">
                            Not a therapist. Not your mom. Not even <em>really</em> real.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                          <p className="text-gray-300 leading-relaxed">
                            Just that friend who's had enough of your spiral and loves you too much to watch it continue. Created for your entertainment (and maybe some perspective).
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-cyan-400/10 to-purple-400/10 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-4">
                          <p className="text-cyan-300 font-medium italic text-lg">
                            "Savage takes. Zero filter. Made with love." 🪄
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced feature tags */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-cyan-400/10 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <h4 className="font-semibold text-cyan-300 mb-1">Anonymous</h4>
                      <p className="text-gray-400 text-sm">Your secrets stay safe</p>
                    </div>
                    <div className="bg-purple-400/10 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">🗣️</div>
                      <h4 className="font-semibold text-purple-300 mb-1">Zero Filter</h4>
                      <p className="text-gray-400 text-sm">Brutal honesty always</p>
                    </div>
                    <div className="bg-emerald-400/10 backdrop-blur-sm border border-emerald-400/20 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-semibold text-emerald-300 mb-1">Made with Love</h4>
                      <p className="text-gray-400 text-sm">Savage but caring</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
        </section>



        {/* How It Works Section  -  MOVED ABOVE DEMO */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How <span className="text-cyan-400">Sage Works</span> (it's embarrassingly simple)
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                From confused to confident in under 60 seconds
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-cyan-400/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-400/20">
                    <span className="text-2xl">🧠</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-3">1. Paste Your Chat</h3>
                <p className="text-gray-300 leading-relaxed">
                  Copy any conversation and paste it in. Sage instantly analyzes every message, emoji, and timing pattern.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-purple-400/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-400/20">
                    <span className="text-2xl">💡</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-purple-400 mb-3">2. Get the Truth</h3>
                <p className="text-gray-300 leading-relaxed">
                  Sage gives you the unfiltered breakdown: what they really mean, not what you want to hear. No sugar-coating.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-400/20">
                    <span className="text-2xl">📱</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-3">3. Share the Receipt</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get a beautiful receipt you can screenshot and share. Finally, proof you were right all along.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
          >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                See Sage work in <span className="text-cyan-400">10 seconds</span>
            </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Choose an archetype to see how Sage analyzes different communication patterns
              </p>
          </motion.div>

            {/* Step 1: Archetype Selection */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Step 1: Choose an Archetype</h3>
              <p className="text-gray-400 text-sm">Select a communication pattern to analyze</p>
            </div>
            
            {/* Archetype Selection  -  Clean & Consistent */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-4xl mx-auto">
              {Object.entries(archetypes).map(([key, archetype]) => {
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleArchetypeSelect(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-center min-w-[180px] ${
                      selectedArchetype === key 
                        ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 border-2 border-cyan-300' 
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-cyan-300 hover:text-cyan-100'
                    }`}
                  >
                    {archetype.name}
                  </motion.button>
                );
              })}
            </div>


          {/* Receipt Display  -  Responsive Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-7xl mx-auto"
          >

            {/* Premium 3D Container */}
            <div className="relative max-w-6xl mx-auto">
              {/* 3D Container with Depth */}
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/3 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-2xl shadow-black/20 min-h-[600px]">
                {/* Inner Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
                
                {/* Top Border Accent */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                
                {/* Left Border Accent */}
                <div className="absolute top-4 bottom-4 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
                
                {/* Right Border Accent */}
                <div className="absolute top-4 bottom-4 right-0 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
                
                {/* Bottom Shadow Effect */}
                <div className="absolute - bottom-4 left-4 right-4 h-4 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl blur-sm"></div>
                
                {/* Content Grid  -  Wider Info Panel */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch h-full min-h-[550px]">
              
              {/* Left Side  -  Large Receipt Display */}
              <div className="flex justify-center lg:justify-start lg:col-span-3 - ml-1">
                <div className="relative group w-full max-w-lg">
                  {/* Receipt Container with Premium Styling */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 w-full h-full cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-cyan-500/20 hover:border-cyan-400/30" onClick={handleReceiptSwitch}>
                    {/* Premium Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                    
                    {/* Receipt Image */}
                    <div className="relative z-10">
                      <img 
                        src={archetypes[selectedArchetype].images[currentReceiptType]}
                        alt={`${archetypes[selectedArchetype].name}  -  ${currentReceiptType.charAt(0).toUpperCase() + currentReceiptType.slice(1)} Receipt`}
                        className="w-full h-auto object-contain brightness-110 contrast-110 saturate-110 transition-all duration-300 group-hover:brightness-120"
                        onLoad={() => console.log('Image loaded:', archetypes[selectedArchetype].images[currentReceiptType])}
                        onError={() => console.error('Image failed to load:', archetypes[selectedArchetype].images[currentReceiptType])}
                      />
                    </div>
                    
                    {/* Premium Switch Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-cyan-400/30 border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-400/40">
                      <div className="flex items-center gap-2">
                        <span>Switch</span>
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Receipt Type Indicator */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                      {currentReceiptType.charAt(0).toUpperCase() + currentReceiptType.slice(1)} Receipt
                    </div>
                  </div>
                  
                  {/* Floating Action Hint */}
                  <div className="absolute - bottom-6 left-1/2 transform - translate-x-1/2 bg-white/10 backdrop-blur-sm text-white/70 text-xs px-3 py-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Click to cycle through receipt types
                  </div>
                </div>
              </div>

              {/* Right Side  -  Wider Analysis Panel */}
              <div className="lg:col-span-2 flex flex-col justify-center h-full px-2">
                <div className="max-w-md mx-auto w-full">
                {/* Spacious Header */}
                <div className="mb-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2">
                      <span className="text-cyan-300 text-sm font-semibold">Live Demo</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-cyan-400 leading-tight">
                    {archetypes[selectedArchetype].name}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {archetypes[selectedArchetype].insights[currentReceiptType]}
                  </p>
                </div>

                {/* Step 2: Receipt Type Selection */}
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-purple-400 mb-1">Step 2: Choose Receipt Style</h4>
                    <p className="text-gray-400 text-sm">Select the type of analysis you want to see</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: 'truth', label: 'Truth Receipt', icon: '🔍' },
                      { type: 'playbook', label: "Playbook", icon: '📋' },
                      { type: 'immunity', label: 'Immunity', icon: '🛡️' }
                    ].map((item) => (
                      <div 
                        key={item.type}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                          currentReceiptType === item.type 
                            ? 'bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setCurrentReceiptType(item.type)}
                      >
                        <div className="text-xl">{item.icon}</div>
                        <p className={`text-base font-medium ${currentReceiptType === item.type ? 'text-purple-300' : 'text-white'}`}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Key Insights Card */}
                <div className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Key Insights</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Pattern recognition identifies communication styles</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Interest level analysis with psychological backing</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm">Actionable strategies for better communication</p>
                    </div>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="mb-6 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex - space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full border-2 border-white/20"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white/20"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white/20"></div>
                    </div>
                    <p className="text-white font-semibold text-sm">Join 5K+ users</p>
                  </div>
                  <p className="text-gray-300 text-xs transition-all duration-500 ease-in-out">
                    "{testimonials[currentTestimonialIndex].text}"  -  {testimonials[currentTestimonialIndex].author}
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-center">
                      <div className="text-emerald-400 text-lg mb-1">🔒</div>
                      <p className="text-gray-300 text-xs">Bank-level encryption</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-center">
                      <div className="text-cyan-400 text-lg mb-1">⚡</div>
                      <p className="text-gray-300 text-xs">60 seconds</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-center">
                      <div className="text-purple-400 text-lg mb-1">👻</div>
                      <p className="text-gray-300 text-xs">Anonymous</p>
                    </div>
                  </div>
                </div>

                {/* Spacious CTA */}
                <div className="mt-auto">
                  <Button 
                    onClick={() => navigate('/input')}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25 text-base border border-white/20"
                  >
                    Get My Full Analysis
                  </Button>
                  <p className="text-gray-400 text-sm text-center mt-3">
                    Free • No signup • 60 seconds
                  </p>
                </div>
                </div>
                </div>
              </div>
                </div>
            </div>
          </motion.div>
          </div>
        </section>


        {/* Social Proof Section  -  Premium SaaS Style */}
        <section className="py-24 px-4 bg-white/2">
          <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
          >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                  Trusted by thousands who are <span className="text-cyan-400">DONE</span> guessing 💯
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
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                  2.1K+
              </div>
                <div className="text-sm text-gray-400">Early Adopters</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">
                  8.7K+
            </div>
                <div className="text-sm text-gray-400">Receipts That Hit Different</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
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
                <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">
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
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
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
        <section className="py-24 px-4 bg-white/3">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                <span className="text-purple-400">Simple pricing.</span> <span className="text-cyan-400">No surprises.</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Start free, upgrade when you're ready for unlimited clarity
              </p>
            </motion.div>

            {/* Netflix-Style Clean Cards  -  All Same Size */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* MOST POPULAR Badge for Premium Card */}
              <div className="absolute top-0 left-1/2 transform - translate-x-1/2 - translate-y-3 z-20 hidden md:block">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl shadow-cyan-500/30 animate-pulse border border-cyan-300/50">
                  MOST POPULAR
                </div>
              </div>
              
              {/* BEST VALUE Badge for OG Founder Card */}
              <div className="absolute top-0 right-0 transform translate-x-1/2 - translate-y-3 z-20 hidden md:block">
                <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl shadow-emerald-500/30 border border-emerald-300/50">
                  BEST VALUE
                </div>
              </div>
              
              {/* Free Daily Receipt Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="meme-card p-8 rounded-2xl flex flex-col border-2 border-emerald-400/60 bg-emerald-500/5 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300" 
                style={{ minHeight: '420px' }}
              >
                <div className="flex-grow">
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-xl mb-3 text-emerald-400">Start Free</h3>
                      <div className="text-3xl font-bold text-white mb-2">$0</div>
                      <p className="text-gray-400 text-sm mb-1">Join 2.1K+ Getting Clarity</p>
                      <p className="text-cyan-400 text-xs">No Login • Start in 10 seconds</p>
                    </div>
                    
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">🧠</span><span>3 Truth Receipts to try</span></div>
                    <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">💬</span><span>3 Ask Sage Anything chats</span></div>
                    <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">👀</span><span>See why everyone's obsessed</span></div>
                    <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">🆓</span><span>No commitment required</span></div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <div className="flex items-center text-cyan-400 text-xs">
                        <span className="mr-2">→</span>
                        <span>Login to get daily FREE Receipts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-emerald-400 font-medium mb-4">Perfect for: Curious but cautious</div>
                  <Button onClick={handleGetStarted} className="bg-emerald-500 hover:bg-emerald-600 text-white w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-emerald-500/25">
                    Start Free →
                  </Button>
                </div>
              </motion.div>
              
              {/* Premium Monthly Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="meme-card p-8 rounded-2xl flex flex-col border-2 border-cyan-500/60 bg-cyan-500/5 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all duration-300" 
                style={{ minHeight: '420px' }}
              >
                <div className="flex-grow">
                  {/* Mobile Badge */}
                  <div className="md:hidden text-center mb-4">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-cyan-500/30 border border-cyan-300/50 inline-block">
                      MOST POPULAR
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-xl mb-3 text-cyan-400">Premium Monthly</h3>
                    <div className="text-4xl font-black text-white mb-2">$4.99</div>
                    <p className="text-gray-400 text-sm">per month • Cancel anytime</p>
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
                  <div className="pt-2 text-xs text-cyan-400 font-medium mb-4">Perfect for: Done with the drama</div>
                  <Button onClick={handleGoPremium} className="bg-cyan-500 hover:bg-cyan-600 text-white w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-cyan-500/25">
                    Go Premium
                  </Button>
                </div>
              </motion.div>
              
              {/* OG Founder's Club Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="p-8 rounded-2xl flex flex-col border-2 border-purple-400/60 bg-purple-500/5 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300" 
                style={{ minHeight: '420px' }}
              >
                
                <div className="flex-grow">
                  {/* Mobile Badge */}
                  <div className="md:hidden text-center mb-4">
                    <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/30 border border-emerald-300/50 inline-block">
                      BEST VALUE
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-2xl mb-3 text-purple-400">OG Founder's Club</h3>
                    <div className="text-4xl font-black text-white mb-1">$29.99 / year</div>
                    <p className="text-gray-400 text-sm">($2.49/month) <span className="text-green-400 font-semibold">40% OFF</span></p>
                  </div>
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="text-xs text-gray-400 mb-2">Everything in Premium, plus:</div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🔒</span><span>Price locked FOREVER</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🛡️</span><span>Build emotional defense strategies</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">⚡</span><span>Priority support for 2am spiral texting</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🏆</span><span>Beta features first</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">💬</span><span>Direct feedback channel</span></div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-purple-400 font-medium mb-4">Perfect for: First 500 who get it</div>
                  <Button onClick={handleFounderPurchase} className="bg-purple-500 hover:bg-purple-600 text-white w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/25">
                    Lock In Founder's Price
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* Subtitle under pricing table */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-400 text-center mt-8"
            >
              Start free, upgrade when you're ready for unlimited clarity
            </motion.p>
          </div>
        </section>


        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
          >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                  <span className="text-purple-400">FAQ</span>
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
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl shadow-black/20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to stop guessing?<br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Start knowing. 💅
                </span>
          </h2>
          
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join 5K+ early adopters getting the truth about their chats. 
                <span className="text-white font-semibold italic"> No more mixed signals.</span>
              </p>
              
              {/* Live Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0, y: - 10 }}
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
                          
                          {/* Try Anonymous Link */}
                          <div className="text-center mt-4">
                            <button
                              onClick={handleGetStarted}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-cyan-500/25"
                            >
                              Try Anonymous (No Signup)
                            </button>
                          </div>
        </motion.div>
                          </div>
        </section>

        {/* Subtle Section Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>

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

