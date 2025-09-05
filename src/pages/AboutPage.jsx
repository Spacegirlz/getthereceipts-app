import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Shield, Zap } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8">
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
        
        <p className="text-xl text-gray-300 mb-8">
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
              We believe everyone deserves clarity in their relationships. No more guessing games, 
              no more mixed signals. Get the truth and make informed decisions.
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
              <span className="font-bold text-pink-400">Real talk:</span> Get The Receipts is designed 
              for entertainment and insight purposes only. While our AI is pretty smart and trained on 
              tons of data, we can't guarantee 100% accuracy in reading minds (yet).
            </p>
            
            <p>
              Use our analysis as a fun way to gain perspective, but remember that real communication 
              happens when you actually talk to people. Don't make major life decisions based solely 
              on our receipts cards.
            </p>
            
            <p className="font-bold text-yellow-400">
              TL;DR: We're here for the tea, the laughs, and the insights - but don't sue us if your 
              ex ghosts you again. 💀
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
          onClick={() => navigate('/chat-input')}
          className="viral-button text-white font-bold text-lg px-8 py-4 rounded-full border-0 shadow-2xl"
          size="lg"
        >
          Start Getting Receipts 🧾
        </Button>
      </motion.div>
    </div>
  );
};

export default AboutPage;