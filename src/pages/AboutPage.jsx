import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Shield, Zap } from 'lucide-react';
import sagePurpleSwirl from '@/assets/sage-purple-swirl-circle.png';
import { injectMovingGradientStyles } from '@/utils/gradientUtils';

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    injectMovingGradientStyles();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white px-4 py-8">
      {/* Clean Black Background for Maximum Readability */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Depth - No Blur for Performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-black/20" />
      
      {/* Minimal Accent - Just for Visual Interest */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.03),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative z-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="text-6xl mb-6 floating-emoji">🕵️‍♀️</div>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
          About <span className="gradient-text">Get The Receipts</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 sm:whitespace-nowrap break-words">
          We're here to decode the chaos of modern communication, one confusing text at a time.
        </p>
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="meme-card p-8 rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Story</h2>
          
          <div className="prose prose-lg text-gray-300 max-w-none">
            <p className="mb-6">
              We've all been there. You get a text that leaves you staring at your phone for 20 minutes, 
              screenshot it to your group chat, and spend the next hour analyzing every word, emoji, and 
              the time it was sent.
            </p>
            
            <p className="mb-6">
              <span className="font-bold text-pink-400">Get The Receipts</span> was born from those 2am 
              conversations where you're trying to decode if "hey" means they're interested or just bored. 
              We built an AI that's seen it all and can give you the real tea on what they actually meant.
            </p>
            
            <p className="mb-6">
              Our mission? To save you from overthinking and give you the confidence to know where you 
              stand. Whether it's dating, friendships, or family drama - we've got the receipts you need.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Meet Sage Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="meme-card p-8 rounded-3xl">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img 
                src={sagePurpleSwirl} 
                alt="Sage - Your AI Text Whisperer" 
                className="w-32 h-32 object-contain floating-emoji"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Sage</h2>
            <p className="text-pink-400 font-semibold text-lg italic">Your resident text whisperer</p>
          </div>
          
          <div className="prose prose-lg text-gray-300 max-w-none text-center">
            <p className="text-lg leading-relaxed">
              Sage reads the vibes, catches the subtext, and serves up insights with a side of sass. 
              She's that friend who notices when someone's "fine" isn't really fine, or when "k" 
              means someone's definitely not okay. 
            </p>
            <p className="text-lg leading-relaxed mt-4">
              <span className="text-purple-400 font-semibold">Part pattern detective, part conversation therapist, all AI-powered realness.</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-12 text-center">What We Stand For</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="meme-card p-8 rounded-2xl text-center">
            <Heart className="h-16 w-16 text-pink-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Empowerment</h3>
            <p className="text-gray-300">
              Get the clarity you deserve. Because sometimes you need an outside perspective to confirm 
              what your gut's been telling you all along. No more guessing games, no more mixed signals.
            </p>
          </div>
          
          <div className="meme-card p-8 rounded-2xl text-center">
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Privacy First</h3>
            <p className="text-gray-300">
              Your conversations are yours. You control whether we save your receipt history. Our AI analysis happens in real-time without long-term data retention. You can delete your history anytime.
            </p>
          </div>
          
          <div className="meme-card p-8 rounded-2xl text-center">
            <Zap className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Fun First</h3>
            <p className="text-gray-300">
              While we provide real insights, we never forget that this should be entertaining. 
              Life's too short to take every text message too seriously.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="meme-card p-8 rounded-3xl text-center">
          <div className="text-4xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-white mb-6">The Fine Print (But Make It Fun)</h2>
          
          <div className="text-gray-300 space-y-4">
            <p>
              <span className="font-bold text-pink-400">Real talk:</span> Sage uses advanced AI to spot patterns humans might miss. 
              She reads between the lines with surprising insight - though remember, she's analyzing words, not reading minds. 
              Think of her as your witty friend who's really good at noticing things.
            </p>
            
            <p>
              Use her analysis as one perspective among many, but remember that real communication 
              happens when you actually talk to people. Your intuition combined with Sage's insights? 
              That's where the magic happens.
            </p>
            
            <p className="font-bold text-yellow-400">
              TL;DR: We're here for the tea, the laughs, and the insights - but don't sue us if your 
              ex ghosts you again. 💀
            </p>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Common Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="meme-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-3">❓ Can Sage be wrong?</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sometimes the truth is subtle. Sage reads what's written, not the full story or hidden context. 
              If a reading doesn't land or feel right, it might not be the right moment, or there might be 
              missing pieces. <span className="text-purple-400 font-semibold">Trust your gut first. Then check again.</span>
            </p>
          </div>
          
          <div className="meme-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-3">🎭 Is Sage a real person?</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sage is an AI assistant with personality. She uses advanced language models to analyze patterns in text 
              and deliver insights with attitude. Think of her as your digital bestie who happens to be powered by 
              cutting-edge tech and has analyzed thousands of conversations.
            </p>
          </div>
          
          <div className="meme-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-3">🔮 How does Sage "read" my texts?</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sage analyzes patterns in language, timing, word choice, and emotional markers. She picks up on things 
              like response delays, tone shifts, and conversation flow. But remember - she only sees what you paste, 
              not the full relationship context.
            </p>
          </div>
          
          <div className="meme-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-3">🔒 What happens to my conversations?</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              They disappear instantly after your analysis. We don't store, share, or train AI models on your conversations. 
              Your secrets stay between you and Sage, and then they're gone forever.
            </p>
          </div>
        </div>
        
        {/* Accuracy Disclaimer */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-2xl border border-amber-500/30">
          <div className="text-center">
            <p className="text-amber-200 font-semibold mb-2">💡 Remember</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sage is incredibly insightful, but she's not a mind reader or a crystal ball. She's here to give you 
              perspective and help you trust your instincts - not to make your decisions for you. The best receipts 
              come when you combine her insights with your own intuition.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Your Receipts?</h2>
        <p className="text-gray-300 mb-8">
          Join thousands of people who are done with mixed signals and ready for the truth.
        </p>
        
        <Button
          onClick={() => navigate('/new-receipt')}
          className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full border-0 shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
          size="lg"
        >
          Start Getting Receipts 🧾
        </Button>
      </motion.div>

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

export default AboutPage;