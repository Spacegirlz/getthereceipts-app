import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap, TrendingUp, Gift, ArrowRight, Sparkles, ChevronDown, ShieldCheck, Eye } from 'lucide-react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import sagePurpleSwirl from '@/assets/sage-purple-swirl-circle.png';
import sageLanding from '@/assets/sage-landing.png';

const LandingPageRedesign = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModal();
  const [liveUserCount, setLiveUserCount] = useState(1247);
  const [selectedDemo, setSelectedDemo] = useState('breadcrumb');
  const [demoResult, setDemoResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGetStarted = () => navigate('/chat-input');
  const handleGoPremium = () => navigate('/pricing');

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(1200, Math.min(1300, newCount));
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const demoData = {
    breadcrumb: {
      title: 'The 2am "hey" 🍞',
      question: '"Is she breadcrumbing me?"',
      conversation: [
        { sender: 'Ava', text: 'maybe we should hang soon', type: 'ava' },
        { sender: 'Chris', text: 'yeah when?', type: 'chris' },
        { sender: 'Ava', text: 'idk I\'ll let u know', type: 'ava' },
        { separator: '— 2 days later, 2:47 AM —' },
        { sender: 'Ava', text: 'hey', type: 'ava' }
      ],
      result: {
        pattern: 'The Breadcrumber',
        verdict: 'Classic breadcrumbing pattern detected',
        intoYou: '23%',
        wastingTime: '87%',
        redFlags: '3',
        tea: 'She\'s keeping you as a backup option. That "hey" at 2am? That\'s when her main plan fell through.',
        prophecy: 'She\'ll be vague about plans again, then disappear until her next convenient moment.',
        playbook: 'Stop responding immediately. Make her work for your attention.'
      }
    },
    busy: {
      title: '"Sorry been busy" 👻',
      question: '"Is she ghosting me?"',
      conversation: [
        { sender: 'Chris', text: 'still on for tonight?', type: 'chris' },
        { sender: 'Ava', text: 'omg sorry just saw this', type: 'ava' },
        { sender: 'Ava', text: 'been sooo busy lately', type: 'ava' },
        { sender: 'Chris', text: 'ok so another time?', type: 'chris' },
        { sender: 'Ava', text: 'yeah definitely!', type: 'ava' },
        { separator: '[Never follows up]' }
      ],
      result: {
        pattern: 'The Ghoster',
        verdict: 'Soft ghosting in progress',
        intoYou: '15%',
        wastingTime: '95%',
        redFlags: '4',
        tea: 'She\'s not busy, she\'s just not prioritizing you. "Definitely" with no follow-up = never.',
        prophecy: 'Radio silence until she needs something or gets bored.',
        playbook: 'Stop chasing. If she was interested, she\'d make time.'
      }
    },
    maybe: {
      title: 'The "maybe" loop 🔄',
      question: '"Does she actually want to see me?"',
      conversation: [
        { sender: 'Chris', text: 'want to grab dinner this weekend?', type: 'chris' },
        { sender: 'Ava', text: 'maybe! I might be free', type: 'ava' },
        { sender: 'Chris', text: 'should I make a reservation?', type: 'chris' },
        { sender: 'Ava', text: 'let me see how the week goes', type: 'ava' },
        { separator: '— Weekend passes —' },
        { sender: 'Ava', text: 'sorry this weekend got crazy!', type: 'ava' }
      ],
      result: {
        pattern: 'The Maybe Master',
        verdict: 'Commitment avoidance detected',
        intoYou: '31%',
        wastingTime: '78%',
        redFlags: '2',
        tea: 'She likes the attention but not enough to commit. "Maybe" = probably not.',
        prophecy: 'More "maybes" and last-minute cancellations ahead.',
        playbook: 'Make concrete plans or walk away. Your time has value.'
      }
    }
  };

  const analyzeDemo = async (demoType) => {
    setIsAnalyzing(true);
    setDemoResult(null);
    
    setTimeout(() => {
      setDemoResult(demoData[demoType].result);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="text-white">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto z-10 relative"
          >
            {/* Live Activity Counter */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2 mb-8 text-sm text-teal-300"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              <span className="font-semibold">{liveUserCount.toLocaleString()}</span> people getting receipts right now
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-center">
              Get the truth about<br />
              <span className="gradient-text">any text in 60 seconds</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto text-center">
              Stop overthinking. Start knowing. Sage's AI reveals what they really mean.
            </p>

            {/* Primary CTA Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-black font-bold text-lg px-12 py-6 rounded-full border-0 shadow-2xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                Get Your First Receipt Free →
              </Button>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-300 text-sm mb-8"
            >
              <div className="flex items-center gap-2">
                <span className="text-teal-400">🔒</span>
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-teal-400">⚡</span>
                <span>Deleted in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-teal-400">🚫</span>
                <span>Never stored or shared</span>
              </div>
            </motion.div>

            {/* Sage Mini Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-gray-400 text-sm mb-4">Powered by Sage AI</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl">🔮</span>
                <span className="text-lg text-teal-300 italic">"I read between the lines, bestie"</span>
                <span className="text-2xl">☕</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto mb-24"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Try it right now - Click any message
              </h2>
              <p className="text-gray-300 text-lg">
                Is that "hey" at 2am what you think it is?
              </p>
            </div>

            {/* Demo Tabs */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
              {Object.entries(demoData).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDemo(key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedDemo === key
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>

            {/* Demo Display */}
            <div className="meme-card p-8 rounded-3xl">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span>💭</span>
                  <span className="text-gray-300">Chris asks:</span>
                  <strong className="text-white">{demoData[selectedDemo].question}</strong>
                </div>
                
                <div className="space-y-3 mb-6 max-w-md mx-auto">
                  {demoData[selectedDemo].conversation.map((item, index) => (
                    <div key={index}>
                      {item.separator ? (
                        <div className="text-center text-gray-500 text-sm py-2 italic">
                          {item.separator}
                        </div>
                      ) : (
                        <div className={`flex ${item.type === 'chris' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                            item.type === 'chris' 
                              ? 'bg-blue-600 text-white ml-8' 
                              : 'bg-gray-700 text-gray-200 mr-8'
                          }`}>
                            <div className="text-xs opacity-70 mb-1">{item.sender}</div>
                            <div>{item.text}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button
                    onClick={() => analyzeDemo(selectedDemo)}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-black font-bold px-8 py-3 rounded-full transition-all duration-300"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Get Receipt →'}
                  </Button>
                </div>
              </div>

              {/* Demo Result */}
              {isAnalyzing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Analyzing conversation patterns...</p>
                </div>
              )}

              {demoResult && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border-t border-gray-700 pt-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">Into You: {demoResult.intoYou}</div>
                      <div className="text-sm text-gray-400">Interest Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400 mb-1">Wasting Time: {demoResult.wastingTime}</div>
                      <div className="text-sm text-gray-400">Time Waste Factor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">Red Flags: {demoResult.redFlags}</div>
                      <div className="text-sm text-gray-400">Warning Count</div>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div>
                      <h4 className="font-bold text-pink-400 mb-2">🎯 Pattern: {demoResult.pattern}</h4>
                      <p className="text-gray-300">{demoResult.verdict}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-400 mb-2">☕ Sage's Tea:</h4>
                      <p className="text-gray-300">{demoResult.tea}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-400 mb-2">🔮 The Prophecy:</h4>
                      <p className="text-gray-300">{demoResult.prophecy}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-green-400 mb-2">📖 Your Playbook:</h4>
                      <p className="text-gray-300">{demoResult.playbook}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-24 px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              How Sage Works Her Magic
            </h2>
            <p className="text-xl text-gray-300">Four steps to clarity in 60 seconds</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3 text-teal-400">1. PASTE</h3>
              <p className="text-gray-300">Drop in the confusing text that's keeping you up</p>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-3 text-blue-400">2. ANALYZE</h3>
              <p className="text-gray-300">Sage's AI detects patterns humans miss</p>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🧾</div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">3. RECEIPT</h3>
              <p className="text-gray-300">Get your complete truth receipt with metrics</p>
            </div>
            <div className="meme-card p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-3 text-green-400">4. IMMUNITY</h3>
              <p className="text-gray-300">Learn to spot these patterns yourself</p>
            </div>
          </div>
        </motion.div>

        {/* What You Get Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-24 px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Every Receipt Includes
            </h2>
            <p className="text-xl text-gray-300">More than just analysis - it's a complete breakdown</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Pattern Detection', desc: 'The Breadcrumber, Ghoster, Love Bomber - we name it' },
              { icon: '📊', title: 'Real Metrics', desc: 'Into You %, Wasting Time %, Red Flag count' },
              { icon: '⚖️', title: 'The Verdict', desc: 'Clear explanation of what\'s actually happening' },
              { icon: '☕', title: 'Sage\'s Tea', desc: 'The real talk your friends are too nice to say' },
              { icon: '🔮', title: 'The Prophecy', desc: 'What they\'ll do next (we\'re usually right)' },
              { icon: '📖', title: 'The Playbook', desc: 'Your next moves to protect your energy' },
              { icon: '🔍', title: 'Receipt Autopsy', desc: 'Line-by-line breakdown of manipulation' },
              { icon: '🛡️', title: 'Immunity Training™', desc: 'Premium: Learn to spot patterns yourself', premium: true }
            ].map((feature, index) => (
              <div
                key={index}
                className={`meme-card p-6 rounded-2xl text-center ${
                  feature.premium ? 'border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-900/10 to-yellow-800/10' : ''
                }`}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className={`text-lg font-bold mb-3 ${feature.premium ? 'text-yellow-400' : 'text-white'}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto meme-card p-8 rounded-3xl text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Ready to Stop Guessing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands who've stopped spiraling and started knowing. Get your first receipt free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-black font-bold py-4 text-xl px-12 shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get My Free Receipt
            </Button>
            <Button
              onClick={handleGoPremium}
              variant="outline"
              className="border-teal-400 text-white hover:bg-teal-500/20 font-bold py-4 text-xl px-12"
            >
              See Pricing
            </Button>
          </div>
        </motion.div>

        {/* Footer Links */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/refer" className="text-gray-400 hover:text-white transition-colors">Earn & Refer</Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="mt-8 mb-8 p-8 bg-gradient-to-r from-slate-900/50 to-blue-900/30 rounded-2xl border border-slate-500/20">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-3">
                © 2025 Get The Receipts. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mb-3">
                For Entertainment & Insight Purposes Only.<br />
                13+ only (under 18 requires parental consent) • Not therapy, legal, or medical advice • Use at your own risk
              </p>
              <p className="text-gray-500 text-sm">
                Support: <a href="mailto:support@getthereceipts.com" className="text-teal-400 hover:text-teal-300 transition-colors">support@getthereceipts.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sage Floating Companion */}
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
    </div>
  );
};

export default LandingPageRedesign;