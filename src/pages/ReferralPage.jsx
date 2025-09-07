import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Zap, Star, Clock, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet';

const ReferralPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white px-4 py-8 overflow-hidden">
      <Helmet>
        <title>Refer & Earn - Coming Soon - Get The Receipts</title>
        <meta name="description" content="Refer friends feature coming soon! Stay tuned for an exciting way to share Get The Receipts and earn rewards." />
        <meta property="og:title" content="Refer & Earn - Coming Soon - Get The Receipts" />
        <meta property="og:description" content="Refer friends feature coming soon! Stay tuned for an exciting way to share Get The Receipts and earn rewards." />
      </Helmet>
      
      <header className="max-w-4xl mx-auto mb-8 text-center relative">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="absolute top-0 left-0 text-white hover:bg-white/10">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back Home
        </Button>
      </header>
      
      <main className="max-w-4xl mx-auto flex flex-col items-center text-center min-h-[80vh] justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="relative mb-8">
            <Gift className="h-32 w-32 text-yellow-400 mx-auto mb-6" />
            <div className="absolute top-4 right-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                Coming Soon!
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
            <span className="gradient-text">Refer & Earn</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We're building something amazing! Soon you'll be able to invite friends and earn awesome rewards.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-3xl meme-card p-8 rounded-3xl text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Share the Love</h3>
              <p className="text-gray-400 text-sm">Invite friends to discover their truth receipts</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Earn Points</h3>
              <p className="text-gray-400 text-sm">Get rewarded for every friend who joins</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Unlock Rewards</h3>
              <p className="text-gray-400 text-sm">Redeem points for premium features & credits</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">What's Coming:</h3>
            <ul className="text-left text-gray-300 space-y-2 max-w-md mx-auto">
              <li>• Unique referral links for every user</li>
              <li>• Point-based reward system</li>
              <li>• Free premium time for referrals</li>
              <li>• Special badges and recognition</li>
              <li>• Leaderboards and competitions</li>
            </ul>
          </div>
          
          <p className="text-gray-400 mb-6">
            In the meantime, feel free to share Get The Receipts with friends the old-fashioned way!
          </p>
          
          <div className="space-y-3">
            <Button 
              size="lg" 
              className="viral-button font-bold w-full md:w-auto"
              onClick={() => navigate('/chat-input')}
            >
              Get Your Receipt Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400 text-white hover:bg-purple-500/20 font-bold w-full md:w-auto"
              onClick={() => navigate('/pricing')}
            >
              View Premium Plans
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-8 text-gray-500 text-sm max-w-2xl"
        >
          <p>Follow us for updates on when the refer & earn program launches. It's going to be worth the wait! 🚀</p>
        </motion.div>
      </main>
    </div>
  );
};

export default ReferralPage;