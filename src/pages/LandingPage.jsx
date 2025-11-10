import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, TrendingUp, Gift, ArrowRight, Sparkles, ChevronDown, ShieldCheck, Eye, Lock } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js';
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
  const [liveUserCount, setLiveUserCount] = useState(150);
  const [selectedArchetype, setSelectedArchetype] = useState('ghosting-champion');
  const [currentReceiptType, setCurrentReceiptType] = useState('truth');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const stripe = useStripe() || null; // Fallback if Stripe not loaded yet
  const autoRotateIntervalRef = useRef(null);
  const userInteractedRef = useRef(false);

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

  const handleGetStarted = () => navigate('/new-receipt');
  const handleRefer = () => navigate('/refer');
  
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.email,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

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

  const handleFounderPurchase = () => handleCheckout('price_1RzgBYG71EqeOEZer7ojcw0R', 'OG Founders Club');

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
    userInteractedRef.current = false; // Reset interaction flag when archetype changes
  };

  // Auto-rotate receipt types every 5 seconds
  useEffect(() => {
    // Clear any existing interval
    if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current);
    }

    // Only auto-rotate if user hasn't manually interacted
    if (!userInteractedRef.current) {
      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentReceiptType((prevType) => {
          const receiptTypes = ['truth', 'playbook', 'immunity'];
          const currentIndex = receiptTypes.indexOf(prevType);
          const nextIndex = (currentIndex + 1) % receiptTypes.length;
          return receiptTypes[nextIndex];
        });
      }, 5000); // 5 seconds
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
    };
  }, [selectedArchetype]); // Restart when archetype changes

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
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(137, Math.min(168, newCount)); // Keep between 137-168
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
      
      {/* Glassmorphism Glow Effect - Enhanced for Desktop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      {/* Additional Desktop Depth - Subtle Radial Gradients */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {/* Top-center glow (hero focus) */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, rgba(168, 85, 247, 0.10) 40%, transparent 70%)'
          }}
        />
        {/* Bottom-right accent */}
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 60%)'
          }}
        />
        {/* Subtle grid texture - very faint */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      <div className="relative z-10">
        {/* Hero Section  -  World-Class SaaS Design */}
        <section className="pt-20 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
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
          className="mb-6 md:mb-10 lg:mb-12"
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
              🚀
            </motion.span> Just Launched: First 500 Lock in OG Founders Lifetime Access
          </div>
        </motion.div>

        {/* Headline Group - Integrated Unit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 md:mb-12 lg:mb-16 max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-0"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight sm:leading-[1.1] md:leading-[1.05] mb-3 md:mb-4">
            <span className="text-white">Stop spiraling.&nbsp;</span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Start&nbsp;knowing.
            </span>
          </h1>
          
          {/* Even-if Tagline - Tightly Integrated */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 font-light leading-relaxed max-w-4xl md:max-w-5xl mx-auto"
          >
            Even if you've done a full FBI investigation and called it "closure."
          </motion.p>
        </motion.div>

        {/* Typing Animation  -  Supporting Examples Below Headline */}
          <motion.div
          initial={{ opacity: 0, y: - 10 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8 md:mb-12 lg:mb-16"
        >
          <div className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300">
            <div className="relative overflow-hidden min-h-[100px] sm:min-h-[110px] flex items-center justify-center py-3">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: - 20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className={`text-lg sm:text-xl md:text-2xl font-medium ${messages[currentMessageIndex].color}`}>
                  {currentText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </div>
                {!isTyping && currentText && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-base sm:text-lg md:text-xl text-gray-400 mt-1"
                  >
                    {messages[currentMessageIndex].archetype}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
          </motion.div>

        {/* Combined Process & Description - Streamlined */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 lg:mb-16 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed md:leading-loose px-4 sm:px-0"
        >
          Paste the text. Get the truth. 60&nbsp;seconds.<br />
          <span className="text-sm sm:text-base text-gray-400 italic">Sage is your advanced AI Decoder who reads between the patterns, subtext and hidden&nbsp;messages.</span>
        </motion.p>


        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center justify-center mb-8 md:mb-12 lg:mb-16"
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
            className="group mb-4"
          >
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-4 md:py-5 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 md:hover:scale-110 min-h-[56px] md:min-h-[64px] w-full sm:min-w-[200px] md:min-w-[280px] sm:w-auto border border-cyan-300/50 hover:border-cyan-200/70 relative overflow-hidden"
            >
              <span className="relative z-10">Get Your First Receipt Free (No Signup)</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
          </motion.div>
          
          {/* Privacy First Badge - Right Under CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex justify-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-emerald-400/30 rounded-full text-xs sm:text-sm text-gray-300 hover:bg-white/10 transition-all duration-300">
              <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
              <span className="font-medium">
                <span className="text-emerald-400">Privacy First Policy</span>
                <span className="text-gray-500 mx-1.5">•</span>
                Your Data Your Choice
              </span>
            </div>
          </motion.div>
          
        </motion.div>

            </motion.div>
          </div>
        </section>

        {/* Subtle Section Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

        {/* Trust Bridge Section  -  Enhanced with Live Social Proof */}
        <section className="py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 shadow-lg shadow-cyan-500/10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Join the first 500 getting clarity
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
                <span className="font-medium">{liveUserCount}</span> people online now
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

        {/* Gradient Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-80 my-10 sm:my-12 lg:my-16"></div>

        {/* Meet Sage Section  -  Enhanced with Personality */}
        <section className="py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-6"
          >
              {/* Badge with gradient */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-emerald-400/20 backdrop-blur-sm border-2 border-cyan-400/40 text-white text-sm font-bold mb-0 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-extrabold">Meet Sage</span>
              </div>
            </motion.div>

            {/* Sage's Personality Card  -  Sage as the Star */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl mx-auto mb-16"
            >
              {/* Gradient border wrapper */}
              <div className="rounded-3xl p-[2px] bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-emerald-400/50">
                <div className="bg-white/8 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                {/* Subtle background glow - neutral */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                    <div className="relative">
                      {/* Sage - VIBRANT and PROMINENT */}
                      <div className="relative">
                        {/* Strong radial glow behind Sage */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 via-purple-400/35 to-emerald-300/40 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/25 to-emerald-400/30 rounded-full blur-xl"></div>
                        
                        {/* Sage container - more vibrant */}
                        <div className="relative w-72 h-72 bg-gradient-to-br from-cyan-400/30 via-purple-400/25 to-emerald-300/30 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xl border-2 border-cyan-400/50" style={{
                          boxShadow: '0 0 60px rgba(6, 182, 212, 0.4), 0 0 100px rgba(168, 85, 247, 0.3), 0 0 140px rgba(16, 185, 129, 0.2)'
                        }}>
                          <img 
                            src={sageLanding} 
                            alt="Sage" 
                            className="w-72 h-72 rounded-full object-cover relative z-10"
                            style={{
                              filter: 'brightness(1.1) contrast(1.05) saturate(1.1)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-3">
                            <span className="text-white">She's the friend </span>
                            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">we all wish we&nbsp;had</span>
                          </h3>
                          <p className="text-gray-300 leading-relaxed text-lg">
                            Not a therapist. Not your mom. Not even <em>really</em> real.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                          <p className="text-gray-300 leading-relaxed">
                            Just that friend who's had enough of your spiral and loves you too much to watch it continue. Created for your entertainment (and maybe some perspective).
                          </p>
                        </div>
                        
                        <div className="bg-white/8 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                          <p className="text-white font-medium italic text-lg">
                            "Savage takes. Zero filter. Made with love." 🪄
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Feature tags - NEUTRAL to let Sage shine */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <h4 className="font-semibold text-white mb-1">Anonymous</h4>
                      <p className="text-gray-300 text-sm">Your secrets stay safe</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">🗣️</div>
                      <h4 className="font-semibold text-white mb-1">Zero Filter</h4>
                      <p className="text-gray-300 text-sm">Brutal honesty always</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-semibold text-white mb-1">Made with Love</h4>
                      <p className="text-gray-300 text-sm">Savage but caring</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </motion.div>
            </div>
        </section>

        {/* Gradient Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-purple-400/25 to-transparent opacity-80 my-10 sm:my-12 lg:my-16"></div>

        {/* How It Works Section  -  MOVED ABOVE DEMO - Compact Mobile */}
        <section className="py-8 md:py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-6 md:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4">
                How <span className="text-white">Sage Works</span> (it's embarrassingly simple)
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                From confused to confident in under 60 seconds
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center"
              >
                <div className="mb-3 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-xl md:text-2xl">🧠</span>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">1. Paste Your Chat</h3>
                <p className="text-sm md:text-base text-gray-300 leading-snug md:leading-relaxed">
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
                <div className="mb-3 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-xl md:text-2xl">💡</span>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">2. Get the Truth</h3>
                <p className="text-sm md:text-base text-gray-300 leading-snug md:leading-relaxed">
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
                <div className="mb-3 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-xl md:text-2xl">📱</span>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">3. Share the Receipt</h3>
                <p className="text-sm md:text-base text-gray-300 leading-snug md:leading-relaxed">
                  Get a beautiful receipt you can screenshot and share. Finally, proof you were right all along.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gradient Divider */}
        <div className="w-full max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent opacity-80 my-10 sm:my-12 lg:my-16"></div>

        {/* Interactive Demo Section */}
        <section className="py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
          >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
                See Sage work in&nbsp;<span className="text-white font-extrabold">10&nbsp;seconds</span>
            </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Choose an archetype to see how Sage analyzes different communication patterns
              </p>
          </motion.div>

            {/* Step 1: Archetype Selection */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Step 1: Choose an Archetype</h3>
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
                    className={`px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-300 text-center min-w-[140px] sm:min-w-[180px] text-sm sm:text-base ${
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
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/3 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-2xl shadow-black/20 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
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
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch h-full min-h-[350px] sm:min-h-[450px] md:min-h-[550px]">
              
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
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <div className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2">
                      <span className="text-white text-sm font-semibold">Live Demo</span>
                    </div>
                    {/* NEW! Ask Sage Anything Chatbot Badge */}
                    <div className="bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-purple-400/40 rounded-full px-3 py-1.5 animate-pulse">
                      <span className="text-white text-xs font-bold">
                        <span className="text-purple-300">NEW!</span> Ask Sage Anything Chatbot - Unlimited Chats
                      </span>
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
                        onClick={() => {
                          userInteractedRef.current = true; // Mark that user manually selected
                          setCurrentReceiptType(item.type);
                          // Clear auto-rotate interval when user interacts
                          if (autoRotateIntervalRef.current) {
                            clearInterval(autoRotateIntervalRef.current);
                            autoRotateIntervalRef.current = null;
                          }
                        }}
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
                    <p className="text-white font-semibold text-sm">Join the first 500</p>
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
                    onClick={() => navigate('/new-receipt')}
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

        {/* Social Proof Section  -  Premium SaaS Style - Segmented */}
        <section className="py-20 md:py-24 lg:py-32 px-4 relative overflow-hidden" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          {/* Distinct Background for Segmentation */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/8 via-cyan-500/5 to-purple-500/8 pointer-events-none"></div>
          
          {/* Subtle Radial Glows for Depth */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
          }}></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full blur-3xl opacity-15 pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, transparent 70%)'
          }}></div>
          
          {/* Top Border - Visual Separation */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"></div>
          
          {/* Bottom Border - Visual Separation */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
          >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                  Trust by those who are <span className="text-cyan-400">DONE</span> guessing 💯
                </h2>
                <p className="text-base sm:text-lg text-gray-300 max-w-5xl mx-auto tracking-tight px-4">
                  Join the community that's finally getting the real talk (and proving their friends wrong)
                </p>
          </motion.div>

            {/* Just Launched Badge - Replaces Fake Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-base sm:text-lg font-semibold text-white">
                  Just Launched • Join the first 500 users
                </span>
              </div>
            </motion.div>

            {/* Testimonial Cards - Enhanced for Segmented Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="bg-white/12 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-400/50 hover:scale-[1.02]"
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
                className="bg-white/12 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 shadow-xl shadow-cyan-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/50 hover:scale-[1.02]"
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
                className="bg-white/12 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-400/50 hover:scale-[1.02]"
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
          
          {/* Built By Line - After Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mt-12 mb-8"
          >
            <p className="text-sm sm:text-base text-gray-400">
              <em>Built by a team that's generated $7M+ with AI systems because we were tired of spiraling over 2am texts and what "k..." really means. First 500 users lock in lifetime access.</em>
            </p>
          </motion.div>
          
          </div>
        </section>

        {/* Premium Pricing Section */}
        <section className="py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Simple pricing.{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  No surprises.
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6">
                Receipts in 60 seconds. No shame. No storage. Just Sage's take.
              </p>
              
              {/* Urgency Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/30 rounded-full text-sm text-purple-300 font-medium mb-8"
              >
                <span className="animate-pulse text-purple-400">🚀</span>
                <span>Just Launched: First 500 Lock in OG Founders Lifetime Access</span>
              </motion.div>
            </motion.div>

            {/* Netflix-Style Clean Cards - OG Founders Gets Special Treatment */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 mt-8 sm:mt-12">
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
                      <p className="text-gray-400 text-sm mb-1">Join 2.1K+ Getting Clarity</p>
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
                  <Button onClick={handleGetStarted} variant="outline" className="border-cyan-400/40 text-white hover:bg-cyan-500/20 w-full">
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
                      <p className="text-sm text-gray-300 mb-4">Locked in FOREVER</p>
                      <p className="text-xs text-gray-400">(Regular price: $59.99/year starting user #501)</p>
                    </div>
                    <div className="space-y-3 text-sm text-gray-200 text-left mb-6">
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Everything in Premium</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Unlimited receipts</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Priority support</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Early access to new features</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Founder badge</span></div>
                      <div className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">✅</span><span className="text-white">Price locked forever - even when we raise prices</span></div>
                    </div>
                    {/* Spots Remaining Counter */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-full">
                        <span className="text-xs sm:text-sm font-semibold text-purple-300">⏰</span>
                        <span className="text-xs sm:text-sm text-white font-medium">487/500 spots remaining</span>
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
          </div>
        </section>


        {/* FAQ Section */}
        <section className="py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
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
        <section className="py-16 px-4" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'normal' }}>
          <div className="max-w-4xl mx-auto text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl shadow-black/20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to stop&nbsp;guessing?<br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Start&nbsp;knowing. 💅
                </span>
          </h2>
          
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join the first 500 getting the truth about their&nbsp;chats. 
                <span className="text-white font-semibold italic"> No&nbsp;more mixed&nbsp;signals.</span>
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
                <span className="font-medium">{liveUserCount}</span> people getting Sage's take right now
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
            <p className="text-gray-500 text-xs mb-2">For 16+ Entertainment Purposes Only</p>
            
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

