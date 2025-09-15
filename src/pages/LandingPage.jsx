import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, TrendingUp, Gift, ArrowRight, Sparkles, ChevronDown, ShieldCheck, Eye, Star, Users, Clock, Trophy, Check, Crown, Rocket } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import sagePurpleSwirl from '@/assets/sage-purple-swirl-circle.png';
import sageReceiptPage from '@/assets/sage-receipt-page.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const [liveUserCount, setLiveUserCount] = useState(2347);
  const [selectedDemo, setSelectedDemo] = useState('breadcrumb');
  const [demoResult, setDemoResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const handleGetStarted = () => navigate('/chat-input');
  const handleGoPremium = () => navigate('/pricing');

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        const change = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -Math.floor(Math.random() * 2) - 1;
        const newCount = prev + change;
        return Math.max(2300, Math.min(2500, newCount));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const demoData = {
    breadcrumb: {
      title: 'The 2am "hey" 🍞',
      question: 'Sage... am I being breadcrumbed?',
      conversation: [
        { sender: 'Ava', text: 'we should hang out soon! 💕', type: 'ava' },
        { sender: 'Chris', text: 'when works?', type: 'chris' },
        { sender: 'Ava', text: 'so busy rn but soon!', type: 'ava' },
        { separator: '— 3 days later, 2:47 AM —' },
        { sender: 'Ava', text: 'hey you up? 👀', type: 'ava' }
      ],
      result: {
        pattern: 'The 2am Breadcrumber',
        verdict: 'Baby, you\'re the backup dancer, not the main act',
        intoYou: '18%',
        wastingTime: '92%',
        redFlags: '6',
        tea: 'Chris. That 2am "hey" is literally her Plan A falling through. You\'re not the headliner, you\'re the understudy. The math ain\'t mathing.',
        prophecy: 'More vague promises. More midnight desperation texts. Same circus, different clown.',
        playbook: 'Screenshot this receipt and RUN. Make her chase YOU for once. Stop being available at her convenience store hours.',
        confidence: '95%',
        confidenceText: 'ABSOLUTELY CERTAIN THIS IS BREADCRUMBING'
      }
    },
    lovebomb: {
      title: 'Too nice to be real 💌',
      question: 'Is this... normal?',
      conversation: [
        { sender: 'Alex', text: 'I\'ve never felt this way about anyone', type: 'alex' },
        { sender: 'Alex', text: 'you\'re literally perfect', type: 'alex' },
        { sender: 'Chris', text: 'wow that\'s sweet but we just met', type: 'chris' },
        { sender: 'Alex', text: 'I know we\'re soulmates. when can I see you again?', type: 'alex' },
        { sender: 'Alex', text: 'I already told my mom about you', type: 'alex' }
      ],
      result: {
        pattern: 'Stage 5 Clinger Alert',
        verdict: 'They went from 0 to wedding planning in 3.5 messages',
        intoYou: '98%',
        wastingTime: '85%',
        redFlags: '9',
        tea: 'Hey! This is not romantic, it\'s UNHINGED. They told their MOM about you? After ONE conversation? This is how horror movies start.',
        prophecy: 'Next week they\'ll be planning your future children\'s names. Run.',
        playbook: 'BLOCK. DELETE. SAGE OUT. This is not love bombing, this is emotional terrorism. Your picker needs immediate repairs.',
        confidence: '99%',
        confidenceText: 'RED ALERT: STAGE 5 CLINGER CONFIRMED'
      }
    },
    gaslighter: {
      title: 'Gaslighting vibes 🧠',
      question: 'Am I losing my mind???',
      conversation: [
        { sender: 'Chris', text: 'you said you\'d call me yesterday', type: 'chris' },
        { sender: 'Jordan', text: 'no I didn\'t? you\'re remembering wrong', type: 'jordan' },
        { sender: 'Chris', text: 'you literally texted "I\'ll call you tomorrow"', type: 'chris' },
        { sender: 'Jordan', text: 'why are you always so dramatic about everything', type: 'jordan' },
        { sender: 'Jordan', text: 'maybe you should work on your communication issues', type: 'jordan' }
      ],
      result: {
        pattern: 'The Reality Rewriter',
        verdict: 'They\'re rewriting history like it\'s Wikipedia',
        intoYou: '8%',
        wastingTime: '97%',
        redFlags: '10',
        tea: 'Listen. Your memory is FINE. They\'re literally watching you question your sanity and ENJOYING it. This is psychological warfare dressed up as dating.',
        prophecy: 'More lies. More confusion. More making you feel crazy. This is their full-time job.',
        playbook: 'SCREENSHOT EVERYTHING. Send this receipt to your bestie. Block immediately. Your sanity is not up for negotiation.',
        confidence: '100%',
        confidenceText: 'TEXTBOOK GASLIGHTING DETECTED'
      }
    },
    coffeeshop: {
      title: 'Actually decent ☕',
      question: 'Are they actually into me?',
      conversation: [
        { sender: 'Jamie', text: 'hey! how was your presentation today?', type: 'jamie' },
        { sender: 'Chris', text: 'went really well actually, thanks for asking!', type: 'chris' },
        { sender: 'Jamie', text: 'that\'s awesome! want to celebrate over coffee this weekend?', type: 'jamie' },
        { sender: 'Chris', text: 'I\'d love that', type: 'chris' },
        { sender: 'Jamie', text: 'perfect! Saturday 2pm at Blue Bottle work?', type: 'jamie' }
      ],
      result: {
        pattern: 'Coffee Shop Crusher',
        verdict: 'Two people vibing over coffee? It\'s like a rom-com scene and Jamie\'s all in!',
        intoYou: '85%',
        wastingTime: '10%',
        redFlags: '2',
        tea: 'Chris, you\'re not crazy for reading those signals! Jamie\'s definitely interested. They\'re dropping hints like breadcrumbs on a trail to your heart - coffee dates and remembered conversations? That\'s a vibe!',
        prophecy: 'Watch: Jamie\'s going to bring their A-game for that coffee date.',
        playbook: 'Go on that coffee date! This one\'s actually showing up with genuine interest.',
        confidence: '90%',
        confidenceText: 'SURE THIS ONE\'S ACTUALLY DECENT'
      }
    },
    busy: {
      title: 'The Disappearing Act 👻',
      question: 'Why does this feel off?',
      conversation: [
        { sender: 'Chris', text: 'hey! still on for dinner tonight? 😊', type: 'chris' },
        { sender: 'Ava', text: 'omggg sorry just saw this! 🙈', type: 'ava' },
        { sender: 'Ava', text: 'I\'ve been absolutely swamped with work', type: 'ava' },
        { sender: 'Chris', text: 'no worries! want to reschedule?', type: 'chris' },
        { sender: 'Ava', text: 'yes definitely! I\'ll check my calendar', type: 'ava' },
        { separator: '— 5 days later: Still no follow-up —' }
      ],
      result: {
        pattern: 'The Disappearing Act',
        verdict: 'She\'s busier than the President, apparently',
        intoYou: '12%',
        wastingTime: '88%',
        redFlags: '7',
        tea: 'Real talk. She\'s not busy, she\'s just not that into you. "Definitely" with no follow-up is code for "absolutely never." Stop making excuses for her.',
        prophecy: 'Radio silence until she needs attention. You\'ll hear from her when her ego needs feeding.',
        playbook: 'DELETE HER NUMBER. Stop chasing ghosts. If she wanted to see you, you\'d know it. Your energy is too precious for this.',
        confidence: '92%',
        confidenceText: 'CLASSIC GHOSTING PATTERN DETECTED'
      }
    }
  };

  const analyzeDemo = async (demoType) => {
    setIsAnalyzing(true);
    setDemoResult(null);
    
    setTimeout(() => {
      setDemoResult(demoData[demoType].result);
      setIsAnalyzing(false);
    }, 2500);
  };

  const stats = [
    { value: '2.3M+', label: 'Messages Decoded', subtext: 'Since launch' },
    { value: '94%', label: 'Accuracy Rate', subtext: 'User verified' },
    { value: '60s', label: 'Average Time', subtext: 'To get clarity' }
  ];

  const testimonials = [
    {
      text: "I wish I had this years ago. Finally stopped wasting months on people who weren't serious.",
      author: "@sarah_k",
      type: "Premium user"
    },
    {
      text: "The real tea feature is *chef's kiss*. Sometimes you need someone to just tell you the truth.",
      author: "@mike_dating",
      type: "Daily user"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.3),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-8 py-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔮</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-500 bg-clip-text text-transparent">
            Get The Receipts
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:flex items-center space-x-8"
        >
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
          <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-6 py-2 rounded-full shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-20 pb-32">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Live Activity Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-8"
            >
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="text-sm text-emerald-300 font-medium">
                {liveUserCount.toLocaleString()} people getting receipts right now
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent">
                Stop second-guessing
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                their texts.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
            >
              Not sure what that text meant? Let Sage decode it for you.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-blue-300 mb-12 font-medium"
            >
              The clarity you need 24/7.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
              >
                Get Your Free Receipts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleGoPremium}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
              >
                See Pricing
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Deleted in 60 seconds</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-red-400" />
                <span>Never stored or shared</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-8 w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-8 w-32 h-32 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full opacity-20 blur-xl"
        />
      </section>

      {/* Meet Sage Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-violet-300 font-medium">Meet Sage</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your AI bestie and text decoder
              </h2>
              
              <div className="space-y-4 text-lg text-gray-300 mb-8">
                <p>She's seen it all: breadcrumbing, ghosting, gaslighting, and the rest of the emotional gymnastics.</p>
                <p>Not a therapist. Not your mom.</p>
                <p className="text-violet-300 font-medium">Just the voice your gut needed, finally written down.</p>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-2xl border border-violet-500/20 mb-8">
                <span className="text-2xl">🪄</span>
                <span className="text-violet-300 font-medium">Honest. Sharp. Always on your side.</span>
              </div>

              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
              >
                👉 Try it free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-violet-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="w-full aspect-square bg-gradient-to-br from-violet-400 to-blue-500 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={sagePurpleSwirl} 
                    alt="Sage - Your AI bestie and text decoder" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-blue-500 rounded-3xl blur-3xl opacity-20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-full px-4 py-2">
                <MessageSquare className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-violet-300 font-medium">
                  💌 Want your own Truth Receipt? Get One →
                </span>
              </div>
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              What's <em className="text-violet-400">really</em> going on in that chat?
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="space-y-4 text-lg text-gray-300 max-w-4xl mx-auto">
              <p>Sage breaks it down in 60 seconds. No fluff. No false hope. Just the truth.</p>
              <p className="text-violet-300">Real texts. Real patterns. Real talk.</p>
              <p className="text-xl font-semibold text-white">Pick a scenario and get your Truth Receipt.</p>
            </motion.div>
          </motion.div>

          {/* Demo Tabs */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {Object.entries(demoData).map(([key, demo]) => (
              <motion.button
                key={key}
                variants={fadeInUp}
                onClick={() => setSelectedDemo(key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedDemo === key
                    ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {demo.title}
              </motion.button>
            ))}
          </motion.div>

          {/* Demo Interface */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white font-semibold">Sage, Online</span>
              </div>

              {/* Chat Content */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-violet-500/10 rounded-full px-4 py-2 mb-4">
                    <span className="text-violet-400">💬</span>
                    <span className="text-violet-300 text-sm">Someone just asked Sage</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl px-6 py-4 inline-block">
                    <span className="text-white font-medium">{demoData[selectedDemo].question}</span>
                  </div>
                </div>

                {/* Conversation */}
                <div className="space-y-3 mb-8 max-w-md mx-auto">
                  {demoData[selectedDemo].conversation.map((item, index) => (
                    <div key={index}>
                      {item.separator ? (
                        <div className="text-center text-gray-500 text-sm py-2 italic">
                          {item.separator}
                        </div>
                      ) : (
                        <div className={`flex ${item.type === 'chris' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                            item.type === 'chris' 
                              ? 'bg-violet-600 text-white ml-8' 
                              : 'bg-slate-700 text-gray-200 mr-8'
                          }`}>
                            <div className="text-xs opacity-70 mb-1">{item.sender}</div>
                            <div className="text-sm">{item.text}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Analyze Button */}
                <div className="text-center mb-8">
                  <Button
                    onClick={() => analyzeDemo(selectedDemo)}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        👑 Sage is reading them...
                      </>
                    ) : (
                      '👑 Click HERE to see Sage spill the tea'
                    )}
                  </Button>
                </div>

                {/* Loading State */}
                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="text-violet-300 mb-4">👑 Sage is brewing the tea... Reading between the lines, bestie</div>
                  </div>
                )}

                {/* Demo Result */}
                {demoResult && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-gray-700 pt-8"
                  >
                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <div className="text-2xl font-bold text-red-400 mb-1">Into You: {demoResult.intoYou}</div>
                        <div className="text-sm text-gray-400">Interest Level</div>
                      </div>
                      <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                        <div className="text-2xl font-bold text-orange-400 mb-1">Wasting Time: {demoResult.wastingTime}</div>
                        <div className="text-sm text-gray-400">Time Waste Factor</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">Red Flags: {demoResult.redFlags}</div>
                        <div className="text-sm text-gray-400">Warning Count</div>
                      </div>
                    </div>

                    {/* Analysis Sections */}
                    <div className="space-y-6 text-left">
                      <div className="p-6 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
                        <h4 className="font-bold text-pink-400 mb-3 flex items-center">
                          🎯 Pattern: {demoResult.pattern}
                        </h4>
                        <p className="text-gray-300">{demoResult.verdict}</p>
                      </div>
                      
                      <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                        <h4 className="font-bold text-purple-400 mb-3 flex items-center">
                          ☕ Sage's Tea:
                        </h4>
                        <p className="text-gray-300">{demoResult.tea}</p>
                      </div>
                      
                      <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                        <h4 className="font-bold text-cyan-400 mb-3 flex items-center">
                          🔮 The Prophecy:
                        </h4>
                        <p className="text-gray-300">{demoResult.prophecy}</p>
                      </div>
                      
                      <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                        <h4 className="font-bold text-green-400 mb-3 flex items-center">
                          📖 Your Playbook:
                        </h4>
                        <p className="text-gray-300">{demoResult.playbook}</p>
                      </div>

                      {/* Confidence */}
                      <div className="p-6 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-center">
                        <div className="text-violet-400 font-bold text-lg mb-2">⚡ Sage's Confidence: {demoResult.confidence}</div>
                        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                          <div 
                            className="bg-gradient-to-r from-violet-400 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                            style={{ width: demoResult.confidence }}
                          />
                        </div>
                        <div className="text-violet-300 text-sm">{demoResult.confidenceText}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Four steps to clarity in 60 seconds
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: '📱', title: '1. PASTE', desc: 'Drop in the confusing text that\'s keeping you up' },
              { icon: '🧠', title: '2. ANALYZE', desc: 'Sage\'s AI detects patterns humans miss' },
              { icon: '🧾', title: '3. RECEIPT', desc: 'Get your complete truth receipt with metrics' },
              { icon: '💪', title: '4. IMMUNITY', desc: 'Learn to spot these patterns yourself' }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="text-5xl mb-6">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-violet-400">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              What You Get
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-4"
            >
              Every Sage Receipt Includes 3 Stages
            </motion.p>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-violet-300"
            >
              More than just analysis - it's a complete breakdown
            </motion.p>
          </motion.div>

          {/* 3 Stages */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-12"
          >
            {/* Level 1: Free */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-emerald-400 mb-4">Level 1: Sage's Truth Receipt (Free)</h3>
                  <p className="text-gray-300 text-lg mb-6">The foundation - we decode what's really happening</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: '🎯', title: 'Pattern Detection', desc: 'The Breadcrumber, Ghoster, Love Bomber - we name it' },
                      { icon: '📊', title: 'Real Metrics', desc: 'Into You %, Wasting Time %, Red Flag count' },
                      { icon: '⚖️', title: 'The Verdict', desc: 'Clear explanation of what\'s actually happening' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-4">🧾</div>
                  <div className="text-3xl font-bold text-emerald-400">FREE</div>
                </div>
              </div>
            </motion.div>

            {/* Level 2: Free */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-blue-400 mb-4">Level 2: Sage's Tea (Free)</h3>
                  <p className="text-gray-300 text-lg mb-6">The real talk - no filter, just truth</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: '☕', title: 'Sage\'s Tea', desc: 'The real talk your friends are too nice to say' },
                      { icon: '🔮', title: 'The Prophecy', desc: 'What they\'ll do next (we\'re usually right)' },
                      { icon: '📖', title: 'The Playbook', desc: 'Your next moves to protect your energy' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-4">☕</div>
                  <div className="text-3xl font-bold text-blue-400">FREE</div>
                </div>
              </div>
            </motion.div>

            {/* Level 3: Premium */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center">
                  <Crown className="h-4 w-4 mr-1" />
                  PREMIUM
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-4">Level 3: Sage's Immunity Training 👑</h3>
                  <p className="text-gray-300 text-lg mb-6">Premium: Build your own pattern recognition superpowers</p>
                  <div className="space-y-4">
                    {[
                      { icon: '🛡️', title: 'Archetype Decoder', desc: 'Deep dive into their personality patterns and motivations' },
                      { icon: '🔍', title: 'Pattern Loop Recognition', desc: 'Learn to spot cycles before they trap you' },
                      { icon: '💪', title: 'Sage\'s Real Talk', desc: 'Advanced coaching on building emotional immunity' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-4">🛡️</div>
                  <div className="text-3xl font-bold text-yellow-400">PREMIUM</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Join 100K+ People Getting Real Answers
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-4xl mx-auto"
            >
              Stop living in the "what if" zone. Our community gets the clarity they need to make confident decisions.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl"
              >
                <div className="text-4xl md:text-5xl font-bold text-violet-400 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.subtext}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-3xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {testimonial.author.charAt(1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-violet-300">{testimonial.type}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              FAQ
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300"
            >
              The questions everyone asks (but is afraid to admit)
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-6"
          >
            {[
              {
                q: "How does Sage know what's really going on?",
                a: "Real talk: Our AI is scarily good because it's trained on millions of real-world situations, not just textbook theories. Think of Sage as your brutally honest friend who has seen every game in the book. While this is for \"entertainment,\" our 94% pattern accuracy means your gut was probably right. We just give you the receipts to prove it."
              },
              {
                q: "Who will know I used this app?",
                a: "Your privacy is our entire foundation. You alone choose what you share. Your conversations are analyzed in real-time and are never stored, never used for AI training, and deleted immediately unless you explicitly create an account and choose to save your history. We don't want your drama; we just want to give you clarity. Your secret is safe with us."
              },
              {
                q: "Can I trust the AI's judgment over my own feelings?",
                a: "This is the most important question. Sage isn't here to replace your feelings; it's here to validate them. That feeling of confusion you have is real. Sage just gives you the vocabulary and pattern recognition to understand why you feel that way. The goal isn't to trust the AI over yourself, but to use the AI to learn to trust your own gut again."
              },
              {
                q: "What if I don't like what Sage tells me?",
                a: "Sage isn't here to sugarcoat. She calls out the patterns based on the information you give her. She doesn't have all the context, and she's not a mind reader. So the more details you include, the sharper her receipts will be. Sometimes her read won't match the story you were hoping for, and that's okay. Think of it like holding up a mirror: it's a perspective, not a verdict. You always decide what to do next. Sage's job is to cut down the spirals so you spend less time guessing and more time choosing what you want."
              },
              {
                q: "What do I get with the free plan?",
                a: "You get one free Truth Receipt every single day. That's a full, deep-dive analysis: the truth receipt, archetype, the verdict and the playbook on us, once a day. No credit card required. Have a crisis at 2 AM? We got you. Get another one tomorrow."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-8 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-white pr-4">{faq.q}</h3>
                    <ChevronDown 
                      className={`h-6 w-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8">
                      <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300"
            >
              Start free. Upgrade when you need more clarity.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Free Plan */}
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Free Daily Plan</h3>
              <div className="text-4xl font-bold text-emerald-400 mb-2">$0<span className="text-lg text-gray-400">/month</span></div>
              <p className="text-gray-400 mb-6">Perfect for occasional clarity</p>
              <ul className="space-y-3 mb-8">
                {[
                  '3 free receipts to start',
                  'Then 1 receipt per day',
                  'Full analysis & insights',
                  'Shareable receipt cards'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-xl"
              >
                Start Free
              </Button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-violet-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-violet-500/50 rounded-3xl relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-violet-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-violet-400 mb-2">$6.99<span className="text-lg text-gray-400">/month</span></div>
              <p className="text-gray-400 mb-6">For the chronically confused</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited receipts',
                  'Sage\'s Immunity Training',
                  'Vibe Check™ analysis',
                  'Priority processing',
                  'Advanced pattern detection'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-violet-400" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleGoPremium}
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white py-3 rounded-xl"
              >
                Go Premium
              </Button>
            </motion.div>

            {/* Founder's Club */}
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-3xl"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Founder's Club Plan</h3>
              <div className="text-4xl font-bold text-yellow-400 mb-2">$29.99<span className="text-lg text-gray-400">/year</span></div>
              <p className="text-gray-400 mb-6">Save 70% - Limited time</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Premium',
                  'Price locked forever',
                  'Beta features first',
                  'Direct feedback channel',
                  'Founder badge on receipts'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleGoPremium}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 rounded-xl"
              >
                Lock in Founder Price
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative px-6 lg:px-8 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 backdrop-blur-sm border border-violet-500/30 rounded-3xl p-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Ready to Stop Guessing?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands who've stopped spiraling and started knowing. Get your first receipt free.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105"
              >
                Get My Free Receipt
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleGoPremium}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                See Pricing
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔮</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Get The Receipts
                </span>
              </div>
              <p className="text-gray-400 max-w-md">
                Stop second-guessing their texts. Get clarity in 60 seconds with Sage, your AI bestie and text decoder.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link to="/earn-refer" className="block text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-3">
              © 2025 Get The Receipts. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mb-3">
              For Entertainment & Insight Purposes Only.<br />
              18+ only • Not therapy, legal, or medical advice • Use at your own risk
            </p>
            <p className="text-gray-600 text-sm">
              Support: <a href="mailto:support@getthereceipts.com" className="text-violet-400 hover:text-violet-300 transition-colors">support@getthereceipts.com</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Sage Floating Companion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
      >
        <div className="relative">
          <img 
            src={sagePurpleSwirl} 
            alt="Sage - Your AI Dating Advisor"
            className="w-16 h-16 object-contain drop-shadow-lg animate-bounce"
            style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full blur-lg opacity-20" />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;