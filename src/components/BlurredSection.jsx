import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlurredSection = ({ 
  children, 
  surface = 'playbook', // 'playbook' or 'immunity'
  previewHeight = '320px',
  showPreview = true,
  previewContent = null, // Actual content to show as preview
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleOpenPaywall = () => {
    // Track analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'blur_tap_open_paywall', {
        surface: surface,
        event_category: 'paywall',
        event_label: `${surface}_blur_tap`
      });
    }
    
    // Navigate to pricing page
    navigate('/pricing');
  };

  const getSurfaceConfig = () => {
    switch (surface) {
      case 'immunity':
        return {
          title: "Immunity Training",
          icon: "🛡️",
          description: "Micro-lessons to break the cycle",
          previewText: "Get your personalized immunity checkpoints, field test, and Sage's blessing.",
          ctaText: "Unlock Training",
          features: [
            "Training Checkpoints",
            "Field Test", 
            "Sage's Blessing"
          ]
        };
      case 'playbook':
      default:
        return {
          title: "Sage's Playbook",
          icon: "📖",
          description: "Your tailored steps to handle this pattern",
          previewText: "Get your personalized playbook with specific steps and strategies.",
          ctaText: "Unlock Playbook",
          features: [
            "Step-by-step strategies",
            "Pattern analysis",
            "Action plan"
          ]
        };
    }
  };

  const config = getSurfaceConfig();

  return (
    <div className={`relative ${className}`}>
      {/* Content Container with Blur */}
      <div 
        className="relative overflow-hidden rounded-2xl"
        style={{ height: previewHeight }}
      >
        {/* Actual Content - Hidden from screen readers */}
        <div 
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            filter: 'blur(10px) saturate(120%) brightness(0.95)',
            WebkitFilter: 'blur(10px) saturate(120%) brightness(0.95)',
            transform: 'scale(1.02)' // Slight scale to hide blur edges
          }}
        >
          {children}
        </div>

        {/* Blur Overlay with Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,14,0) 0%, rgba(10,10,14,0.6) 40%, rgba(10,10,14,0.8) 100%)',
            backdropFilter: 'blur(10px) saturate(120%) brightness(0.95)',
            WebkitBackdropFilter: 'blur(10px) saturate(120%) brightness(0.95)'
          }}
        />

        {/* Lock Ribbon */}
        <div className="absolute top-3 right-3 z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 rgba(212, 175, 55, 0.3)',
                '0 0 20px rgba(212, 175, 55, 0.5)',
                '0 0 0 rgba(212, 175, 55, 0.3)'
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/40"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 tracking-wide">LOCKED</span>
          </motion.div>
        </div>

        {/* Preview Content */}
        {showPreview && (
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 z-20">
            {previewContent ? (
              // Show actual content as preview
              <div className="w-full max-w-md">
                {previewContent}
              </div>
            ) : (
              // Show generic preview
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-md"
              >
                <div className="text-4xl mb-3">{config.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{config.description}</p>
                
                {/* Preview Features */}
                <div className="space-y-2 mb-6">
                  {config.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-green-400 text-sm">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-400 text-xs mb-4">
                  You're 1 tap from the full {config.title.toLowerCase()}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Interactive Overlay */}
        <motion.button
          onClick={handleOpenPaywall}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute inset-0 w-full h-full z-30 cursor-pointer"
          aria-label={`Locked content. Upgrade to view ${config.title}.`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Hover Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>

      {/* Sticky Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky bottom-0 mt-4 p-4 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-amber-400/30 rounded-2xl shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold text-sm">
              Unlimited Receipts + full {config.title} + Immunity Training
            </p>
            <p className="text-amber-300 text-xs">
              Less than $2.49/month • Cancel anytime
            </p>
          </div>
          
          <motion.button
            onClick={handleOpenPaywall}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="w-4 h-4" />
            {config.ctaText}
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            Cancel anytime. Entertainment/Education - no therapy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BlurredSection;
