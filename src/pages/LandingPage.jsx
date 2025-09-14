import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, TrendingUp, Gift, ArrowRight, Sparkles, ChevronDown, ShieldCheck, Eye } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import sagePurpleSwirl from '@/assets/sage-purple-swirl-circle.png';
import sageLanding from '@/assets/sage-landing.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [showDemoResult, setShowDemoResult] = useState(false);
  const [liveUserCount, setLiveUserCount] = useState(1247);

  const handleGetStarted = () => navigate('/chat-input');
  const handleGoPremium = () => navigate('/pricing');
  const handleRefer = () => navigate('/refer');

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How does Sage know what's really going on?",
      answer: "Real talk: Our AI is scarily good because it's trained on millions of real-world situations, not just textbook theories. Think of Sage as your brutally honest friend who has seen every game in the book. While this is for \"entertainment,\" our 94% pattern accuracy means your gut was probably right. We just give you the receipts to prove it."
    },
    {
      question: "Who will know I used this app?",
      answer: "Your privacy is our entire foundation. You alone choose what you share. Your conversations are analyzed in real-time and are never stored, never used for AI training, and deleted immediately unless you explicitly create an account and choose to save your history. We don't want your drama; we just want to give you clarity. Your secret is safe with us."
    },
    {
      question: "Can I trust the AI's judgment over my own feelings?",
      answer: "This is the most important question. Sage isn't here to replace your feelings; it's here to validate them. That feeling of confusion you have is real. Sage just gives you the vocabulary and pattern recognition to understand why you feel that way. The goal isn't to trust the AI over yourself, but to use the AI to learn to trust your own gut again."
    },
    {
      question: "What if I don't like what Sage tells me?",
      answer: "Honestly, sometimes the truth hurts. But we believe the temporary pain of a clear \"no\" is a thousand times better than the slow, agonizing death of a \"maybe.\" Sage is designed to give you clarity, not just comfort. The goal is to save you from wasting weeks or months on a situation that was never going to work, so you can invest your precious time and energy where it's actually valued."
    },
    {
      question: "What do I get with the free plan?",
      answer: "You get one free Truth Receipt every single day. That's a full, deep-dive analysis: the truth receipt, archetype, the verdict and the playbook on us, once a day. No credit card required. Have a crisis at 2 AM? We got you. Get another one tomorrow."
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen">
      <div className="text-white">
        <div className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto z-10 relative"
        >
          {/* Hero Section: Headline First */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-center gradient-text">
            Stop second-guessing their texts.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-16 max-w-2xl mx-auto text-center">
            You're not spiraling - you're decoding.<br />
            Sage calls out the games <em>before</em> you get played.
          </p>

          {/* Premium Secondary Headline */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-12 md:p-16 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Paste the chat. You know the one.
                </span>
              </h2>

              {/* Emotional Context Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 bg-gradient-to-br from-red-900/20 to-pink-900/20 rounded-xl border border-red-500/20">
                  <div className="text-2xl mb-3">🕐</div>
                  <p className="text-lg font-medium text-red-300">"you up?"</p>
                  <p className="text-sm text-gray-400 mt-2">2am desperation</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 rounded-xl border border-orange-500/20">
                  <div className="text-2xl mb-3">😅</div>
                  <p className="text-lg font-medium text-orange-300">"haha nvm"</p>
                  <p className="text-sm text-gray-400 mt-2">Forced casual</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl border border-blue-500/20">
                  <div className="text-2xl mb-3">🚩</div>
                  <p className="text-lg font-medium text-blue-300">"not ready"</p>
                  <p className="text-sm text-gray-400 mt-2">Classic deflection</p>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="text-center">
                <p className="text-xl md:text-2xl font-semibold text-white mb-4">
                  Sage sees what your gut already knew.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No judgment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Just receipts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Single Primary CTA */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleGetStarted}
              className="viral-button text-white font-bold text-lg px-12 py-6 rounded-full border-0 shadow-2xl"
              size="lg"
            >
              Get My Free Receipt
            </Button>
          </div>

          {/* Enhanced Trust Bar - Immediately below CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-24"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-300 text-sm mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-400" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-teal-400" />
                <span>Never stored or used for training</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-400" />
                <span>Deleted in 60 seconds</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              🔒 Your private conversations are analyzed instantly and deleted immediately. No trace. No judgment. Just clarity.
            </p>
          </motion.div>
        </motion.div>

        {/* Meet Sage - Character Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-5xl mx-auto mb-24 md:mb-32 mt-16 md:mt-24"
        >
          <div className="text-center mb-16">
            {/* Sage Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8"
            >
              <img 
                src={sageLanding} 
                alt="Sage - Your AI Dating Decoder" 
                className="w-full h-full object-contain rounded-full"
              />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Meet Sage - Your AI Dating Decoder
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">
              She's seen a million toxic texts.<br />
              She'll tell you the truth about yours.
            </p>
          </div>

          {/* Three Core Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Point 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/20"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Trained by the group chat.</h3>
              <p className="text-gray-300 leading-relaxed">
                Sage doesn't guess. She's read it all - breadcrumbers, ghosters, gaslighters. 
                She spots the patterns you've been trained to ignore.
              </p>
            </motion.div>

            {/* Point 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-center p-8 bg-gradient-to-br from-teal-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl border border-teal-500/20"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No fluff, just facts.</h3>
              <p className="text-gray-300 leading-relaxed">
                She doesn't do therapy talk. She gives it to you clean: what they said, 
                what it means, and what they're likely to do next.
              </p>
            </motion.div>

            {/* Point 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center p-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm rounded-2xl border border-green-500/20"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Privacy-locked. Judgement-free.</h3>
              <p className="text-gray-300 leading-relaxed">
                Your chats are never saved. Sage sees the truth, then deletes the tea. 
                No shame. No tracing. Just clarity.
              </p>
            </motion.div>
          </div>

          {/* Authority Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-center p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/30"
          >
            <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed">
              "Sage was built by creators sick of second-guessing texts, trained on real-world 
              relationship patterns, and designed to give you <span className="text-teal-400 font-semibold">the clarity your gut already knew.</span>"
            </p>
          </motion.div>
        </motion.div>

        {/* Premium Emotional Reframe Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-5xl mx-auto mb-20 md:mb-24 mt-20 md:mt-24"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/40 via-teal-900/20 to-slate-800/40 backdrop-blur-xl rounded-3xl border border-teal-500/20 p-12 md:p-16 text-center">
              
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>

              {/* Headline */}
              <h3 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  You're not overthinking.
                </span>
                <br />
                <span className="text-white">You're emotionally literate.</span>
              </h3>

              {/* Process Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Drop the chat</h4>
                  <p className="text-gray-300 text-sm">That's been haunting you</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Sage analyzes</h4>
                  <p className="text-gray-300 text-sm">Tone, power, and red flags</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Truth delivered</h4>
                  <p className="text-gray-300 text-sm">The clarity you needed</p>
                </div>
              </div>

              {/* CTA Line */}
              <div className="bg-gradient-to-r from-transparent via-teal-500/20 to-transparent h-px mb-8"></div>
              <p className="text-xl md:text-2xl font-medium text-teal-300">
                Just paste it — the truth's coming.
              </p>
            </div>
          </div>
        </motion.div>

        {/* NEW: Instant Demo Section - The Missing Hook */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto mb-20 md:mb-32 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-8">
            See it work in 10 seconds:
          </h2>
          
          {/* Demo Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleDemoClick(scenario)}
                className={`relative meme-card p-5 rounded-xl text-center hover:scale-105 transition-all duration-300 cursor-pointer border-2 group ${
                  selectedDemo?.id === scenario.id 
                    ? 'border-teal-400 bg-teal-500/20 shadow-lg shadow-teal-500/20' 
                    : 'border-gray-600 hover:border-teal-300 hover:bg-gray-800/50'
                }`}
              >
                {/* Click indicator */}
                <div className="absolute top-3 right-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedDemo?.id === scenario.id
                      ? 'border-teal-400 bg-teal-400'
                      : 'border-gray-500 group-hover:border-teal-400'
                  }`}>
                    {selectedDemo?.id === scenario.id ? (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    ) : (
                      <div className="text-xs text-gray-400 group-hover:text-teal-400">▼</div>
                    )}
                  </div>
                </div>
                
                <div className="text-lg font-semibold text-white mb-3 pr-8">
                  {scenario.text}
                </div>
                <div className="text-gray-300 text-base font-medium mb-3 bg-gray-800/50 rounded-lg p-3">
                  "{scenario.message}"
                </div>
                <div className="text-xs text-teal-400 font-medium group-hover:text-teal-300 transition-colors">
                  {selectedDemo?.id === scenario.id ? 'Selected' : 'Click to analyze →'}
                </div>
              </button>
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
                <div className="meme-card p-6 rounded-2xl">
                  <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                  </div>
                  <p className="text-gray-300">Analyzing message patterns...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="meme-card p-6 rounded-2xl"
                >
                  <div className="text-center mb-4">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-sm text-gray-400 mb-4">
                      Message: "{selectedDemo.message}" • {selectedDemo.time}
                    </div>
                  </div>
                  
                  <div className={`text-2xl font-bold mb-3 text-${selectedDemo.color}-400`}>
                    {selectedDemo.analysis}
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {selectedDemo.insight}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span>Interest Level</span>
                    <span className="font-bold">{selectedDemo.interest}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`bg-${selectedDemo.color}-500 h-3 rounded-full transition-all duration-1000`}
                      style={{ width: selectedDemo.interest }}
                    ></div>
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      onClick={handleGetStarted}
                      className="viral-button text-white font-bold px-6 py-3 rounded-full"
                    >
                      Get My Full Analysis
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        <div className="w-full max-w-6xl mx-auto mt-20 md:mt-32">
          {/* Dynamic Social Proof Activity Bar - Premium Unified Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-16 md:mb-24"
          >
            <div 
              className="relative p-6 md:p-8 rounded-2xl mx-auto max-w-4xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.4) 0%, rgba(22, 33, 62, 0.3) 50%, rgba(15, 22, 36, 0.4) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(94, 234, 212, 0.1)'
              }}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
              
              {/* Live Counter - Primary Focus */}
              <div className="relative z-10 flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold text-white mb-4">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 shadow-lg shadow-green-500/50"></span>
                </span>
                <motion.div
                  key={liveUserCount}
                  initial={{ opacity: 0.7, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">
                    {liveUserCount.toLocaleString()}
                  </span>
                  <span className="text-lg md:text-xl text-gray-200">people are getting receipts right now</span>
                </motion.div>
              </div>
              
              {/* Activity Ticker - Seamless Scroll */}
              <div className="relative z-10 overflow-hidden h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent"></div>
                <motion.div
                  key={currentActivity}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-300 text-sm md:text-base italic"
                >
                  {activities[currentActivity]}...
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Social Proof Section Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12 mt-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Join 50,000+ people who stopped guessing and started knowing
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 md:mb-32"
          >
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3">🍞</div>
              <h3 className="font-bold text-lg mb-2 text-orange-400">The Breadcrumber</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-300 italic">
                  "Finally, proof that their 'maybe' is just a stall."
                </p>
                <div className="flex justify-between text-sm"><span>Interest</span><span>25%</span></div>
                <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full w-[25%]"></div></div>
              </div>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3">👻</div>
              <h3 className="font-bold text-lg mb-2 text-pink-400">The Ghoster</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-300 italic">
                  "Understand their silence, so you can move on faster."
                </p>
                <div className="flex justify-between text-sm"><span>Interest</span><span>12%</span></div>
                <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-pink-500 h-2 rounded-full w-[12%]"></div></div>
              </div>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-lg mb-2 text-green-400">The Keeper</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-300 italic">
                  "Confirm their interest and invest your energy with confidence."
                </p>
                <div className="flex justify-between text-sm"><span>Interest</span><span>87%</span></div>
                <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[87%]"></div></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-20 md:mb-32"
          >
            <div className="space-y-2"><div className="text-3xl font-black gradient-text">2.3M+</div><div className="text-sm text-gray-300">Cards Shared</div><div className="text-xs text-gray-400 mt-1">Proof that clarity is worth sharing with the group chat</div></div>
            <div className="space-y-2"><div className="text-3xl font-black gradient-text">15,000+</div><div className="text-sm text-gray-300">Red Flags Spotted</div><div className="text-xs text-gray-400 mt-1">See the patterns you were taught to ignore</div></div>
            <div className="space-y-2"><div className="text-3xl font-black gradient-text">94%</div><div className="text-sm text-gray-300">Pattern Accuracy</div><div className="text-xs text-gray-400 mt-1">Your gut was right. We just give you the receipts</div></div>
            <div className="space-y-2"><div className="text-3xl font-black gradient-text">50K+</div><div className="text-sm text-gray-300">People Using Sage</div><div className="text-xs text-gray-400 mt-1">Stop second-guessing and start knowing</div></div>
          </motion.div>
        </div>

        <div className="w-full max-w-6xl mx-auto mt-20 md:mt-32">
          {/* Features Section: How Sage Delivers Clarity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              How Sage Delivers the Truth
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 md:mb-32"
          >
            <div className="meme-card p-6 rounded-2xl text-center">
              <MessageSquare className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-3 text-pink-400">💬 Paste the chaos</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Drop in the confusing thread. Sage sees what your friends missed.
              </p>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <Zap className="h-12 w-12 text-teal-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-3 text-teal-400">🧠 Get your truth</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                No more guessing. Sage names the pattern and calls it clean.
              </p>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-3 text-green-400">🔮 See their next move</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Sage's Prophecy predicts their likely next play so you stop waiting.
              </p>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <Gift className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-3 text-blue-400">📸 Save the proof</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Screenshot it. Share it. Use it in the group chat. Sage backs your gut.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-4xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32"
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

        {/* FAQ Section - Moved BEFORE Pricing for Trust Building */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="w-full max-w-3xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32"
        >
          <div className="meme-card p-8 rounded-3xl" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-3 text-center">
              Got Questions? We've Got Tea.
            </h2>
            <p className="text-gray-400 text-center mb-8">
              The truth about what you're really signing up for
            </p>
            
            <div className="space-y-4 mb-12">
              {faqs.map((faq, index) => (
                <div key={index} className={`border-b border-gray-700 pb-4 transition-all duration-300 ${
                  openFAQ === index 
                    ? 'border-l-2 border-l-blue-400 pl-4' 
                    : 'hover:border-l-2 hover:border-l-blue-400 hover:pl-4'
                }`}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full text-left flex justify-between items-center py-4 transition-colors ${
                      openFAQ === index 
                        ? 'text-blue-400' 
                        : 'text-white hover:text-blue-400'
                    }`}
                  >
                    <span className="font-medium text-lg">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-300 leading-relaxed pb-4 text-left"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Comparison Section - "The Math is Mathing, Bestie" - Optimal Placement */}
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
                ❌ What $6.99 Gets You Elsewhere
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
                ✅ What $6.99 Gets You Here
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

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="w-full max-w-5xl mx-auto mb-20 md:mb-32 mt-20 md:mt-32 text-center"
        >
          <h2 className="text-4xl font-bold gradient-text mb-2">Choose Your Clarity Level</h2>
          <p className="text-2xl text-gray-400/80 mb-4">Your peace of mind is priceless. (But we made it affordable.)</p>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Get one free receipt every day to see how it works. When you're ready to stop guessing for good, our Founder's Deal is the smartest investment you can make in your dating life.
          </p>
          
          {/* Netflix-Style Clean Cards - All Same Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Free Daily Receipt Card */}
            <div className="meme-card p-8 rounded-2xl flex flex-col justify-between" style={{ minHeight: '420px' }}>
              <div>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl mb-3 text-teal-400">Free Daily Receipt</h3>
                  <div className="text-4xl font-black text-white mb-2">$0</div>
                  <p className="text-gray-400 text-sm">per month</p>
                </div>
                <div className="space-y-3 text-sm text-gray-300 text-left">
                  <div className="flex items-start"><span className="text-teal-400 mr-2 mt-0.5">🧠</span><span><strong className="text-white">1 Truth Receipt daily</strong> with full analysis</span></div>
                  <div className="pl-6 space-y-1">
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Pattern analysis (Breadcrumber, Ghoster, etc.)</div>
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Sage's Tea included (verdict breakdown)</div>
                    <div className="flex items-center text-xs text-gray-400"><span className="mr-2">└─</span>Shareable receipt card</div>
                  </div>
                  <div className="pt-2 text-xs text-teal-400 font-medium">Perfect for: Curious but cautious</div>
                </div>
              </div>
              <Button onClick={handleGetStarted} variant="outline" className="border-teal-400 text-white hover:bg-teal-500/20 w-full mt-6">
                Start Free Today
              </Button>
            </div>
            
            {/* Premium Monthly Card */}
            <div className="meme-card p-8 rounded-2xl flex flex-col justify-between border-2 border-teal-500/50" style={{ minHeight: '420px' }}>
              <div>
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl mb-3 text-teal-400">Premium Monthly</h3>
                  <div className="text-4xl font-black text-white mb-2">$6.99</div>
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
                              <div className="text-2xl font-black text-white">$6.99</div>
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

          {/* Urgency Bar - Moved Below Comparison */}
          <div className="max-w-xl mx-auto">
            <div 
              className="relative p-4 rounded-2xl border overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(239, 68, 68, 0.12) 50%, rgba(185, 28, 28, 0.15) 100%)',
                borderColor: 'rgba(248, 113, 113, 0.3)',
                backdropFilter: 'blur(5px)'
              }}
            >
              {/* Subtle animated glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
              
              <div className="relative z-10">
                <p className="text-red-300 text-base font-semibold text-center flex items-center justify-center gap-3">
                  <span className="text-xl animate-bounce">🔥</span>
                  <span>OG Founder status ends in: <span className="font-black text-red-100 text-lg px-2 py-1 bg-red-600/30 rounded">6 days</span></span>
                  <span className="text-red-400/60">•</span>
                  <span>Only <span className="font-black text-orange-200 text-lg px-2 py-1 bg-orange-600/30 rounded">147</span> OG spots left</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.8 }}
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
            <Button onClick={handleGoPremium} className="viral-button text-white font-bold py-4 text-xl px-12 shadow-2xl">
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
      
      {/* Sage Floating Companion - Duolingo Owl Strategy */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="cursor-pointer"
        >
          <img 
            src={sagePurpleSwirl} 
            alt="Sage - Your AI Dating Advisor"
            className="w-[70px] h-[70px] object-contain drop-shadow-lg animate-bounce"
            style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}
          />
        </motion.div>
      </div>
      
      <footer className="w-full bg-transparent py-8 px-4 text-center text-gray-500 text-sm">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-4">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="mb-3">For Entertainment & Insight Purposes. Sage provides patterns and perspectives, not professional advice. Always trust your gut first, then verify with us.</p>
          <span className="text-gray-400 mt-4 block">© 2025 Get The Receipts. All rights reserved.</span>
          <p className="mt-2">Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@getthereceipts.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
