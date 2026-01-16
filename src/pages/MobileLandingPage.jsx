import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Capacitor } from '@capacitor/core';
import { ShieldCheck, Eye, Zap } from 'lucide-react';
import HorizontalTicker from '@/components/HorizontalTicker';
import sageLanding from '@/assets/sage-landing.png';

// Demo receipt images
import ghostingChampionTruth from '@/assets/GTR Demo Assets/Truth Receipts/ghosting-champion-sage-receipt-1761066312906.png';
import ghostingChampionPlaybook from '@/assets/GTR Demo Assets/ghosting-champion-sage-playbook-1761066320799.png';
import ghostingChampionImmunity from '@/assets/GTR Demo Assets/ghosting-champion-sage-immunity-1761067753743.png';

const MobileLandingPage = () => {
  const navigate = useNavigate();
  const [liveUserCount, setLiveUserCount] = useState(150);
  const [currentReceiptDemo, setCurrentReceiptDemo] = useState(0);
  const [showMeetSage, setShowMeetSage] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  // Debug: Log that MobileLandingPage is rendering
  useEffect(() => {
    console.log('📱 MobileLandingPage rendering - isNative:', isNative);
  }, [isNative]);

  // Auto-rotate demo receipts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReceiptDemo((prev) => (prev + 1) % 3);
    }, 3000);
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

  const demoReceipts = [
    { image: ghostingChampionTruth, label: 'Truth Receipt' },
    { image: ghostingChampionPlaybook, label: 'Playbook' },
    { image: ghostingChampionImmunity, label: 'Immunity Training' }
  ];

  const handleStartFree = () => {
    navigate('/new-receipt');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#0F0F0F] overflow-hidden relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Ticket Tape - Social Proof at Top */}
        <div className="flex-shrink-0">
          <HorizontalTicker />
        </div>
        
        {/* Top: Logo/App Name (8%) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-4 pb-2 px-4 text-center"
        >
          <h1 className="text-2xl font-black text-white">
            Get The <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Receipts</span>
          </h1>
        </motion.div>

        {/* Main Content (Centered, scrollable if needed) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-2 sm:space-y-3 min-h-0 overflow-y-auto">
          
          {/* Sage Visual - Smaller */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMeetSage(true)}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 p-1 shadow-2xl shadow-cyan-500/30 cursor-pointer active:scale-95 transition-transform flex-shrink-0"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0F0F0F] flex items-center justify-center">
              <img 
                src={sageLanding} 
                alt="Sage" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Headline - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center flex-shrink-0"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight px-2">
              Get the receipts on<br />any text. Fast.
            </h2>
          </motion.div>

          {/* Who Sage Is - Smaller */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => setShowMeetSage(true)}
            className="text-sm sm:text-base text-gray-300 text-center px-4 leading-relaxed hover:text-cyan-300 transition-colors active:opacity-80 flex-shrink-0"
          >
            Meet Sage, your no-BS bestie<br />who refuses to watch you spiral.
            <span className="block text-xs text-cyan-400/70 mt-1 italic">
              🎭 Entertainment with eerily accurate takes
            </span>
            <span className="block text-xs text-cyan-400/70 mt-0.5">Tap to learn more →</span>
          </motion.button>

          {/* Mini Demo Receipt - Constrained Height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-xs px-4 flex-shrink-0"
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReceiptDemo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden shadow-2xl border border-cyan-400/20 max-h-[200px] sm:max-h-[240px]"
                >
                  <img 
                    src={demoReceipts[currentReceiptDemo].image} 
                    alt={demoReceipts[currentReceiptDemo].label}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Receipt Type Indicator */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-cyan-500/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white">
                {demoReceipts[currentReceiptDemo].label}
              </div>
            </div>
          </motion.div>

          {/* Social Proof - Smaller */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-cyan-400 font-semibold flex-shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>{liveUserCount} people decoded today</span>
          </motion.div>

        </div>

        {/* Bottom: Trust Badges + CTA - Always Visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pb-4 sm:pb-6 px-4 space-y-2 flex-shrink-0 border-t border-white/5 pt-3"
        >
          {/* Trust Badges - Above CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 mb-1.5"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              <span>Never Stored</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>60 Seconds</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <Button
            onClick={handleStartFree}
            className="w-full bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_100%] hover:bg-[length:200%_100%] animate-gradient text-black font-black text-base sm:text-lg py-4 sm:py-5 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[56px]"
          >
            START FREE
          </Button>
          
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-0.5">
            No card. No judgment.
          </p>
          
          {/* Age Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-gray-500 text-[10px] sm:text-xs text-center"
          >
            For 16+ Entertainment Purposes Only
          </motion.p>
        </motion.div>

      </div>

      {/* Meet Sage Modal */}
      <AnimatePresence>
        {showMeetSage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMeetSage(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F0F0F] border-2 border-cyan-400/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMeetSage(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Sage Visual */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 p-1 shadow-xl shadow-cyan-500/30">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0F0F0F]">
                    <img 
                      src={sageLanding} 
                      alt="Sage" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Meet Sage Content */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-white">Meet Sage</h3>
                <p className="text-base text-cyan-300 font-semibold italic">
                  Your soda-pop buzzed bestie who's seen this 47 times.
                </p>
                <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                  <p>Not a therapist. Not your mom. Not even real.</p>
                  <p>Just your no-BS bestie who refuses to watch you spiral.</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg p-3 mt-3">
                  <p className="text-sm text-cyan-300 font-medium">
                    🎭 Entertainment with eerily accurate takes. Like your horoscope, but savage.
                  </p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    Sage reads everything - healthy, toxic, confusing, or chaotic. Bring your relationship wins, your ex from 2009, your mom's texts, or that Love Island chat. Sage has takes on all of it.
                  </p>
                </div>
                <p className="text-base text-white font-semibold italic pt-2">
                  "Savage takes. Zero filter. Made with love."
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Animation */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default MobileLandingPage;

