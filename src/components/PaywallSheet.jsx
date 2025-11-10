import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, Check, Star, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaywallSheet = ({ 
  isOpen, 
  onClose, 
  surface = 'playbook', // 'playbook' or 'immunity'
  price = 29.99,
  spotsLeft = 287
}) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Track analytics
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'paywall_view', {
        surface: surface,
        price_shown: price,
        plan_default: selectedPlan,
        ladder_step: spotsLeft
      });
    }
  }, [isOpen, surface, price, selectedPlan, spotsLeft]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    // Track CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_click_unlock', {
        plan: selectedPlan,
        trial: false,
        surface: surface
      });
    }

    // Navigate to pricing page
    navigate('/pricing');
  };

  const handleDecline = () => {
    // Track decline
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'decline_continue_free', {
        surface: surface
      });
    }
    onClose();
  };

  const getSurfaceConfig = () => {
    switch (surface) {
      case 'immunity':
        return {
          title: "Unlock Immunity Training",
          subtitle: "Get your personalized defense strategies",
          icon: "🛡️",
          features: [
            "Training checkpoints for your situation",
            "Field test to verify patterns",
            "Sage's blessing and protection",
            "Unlimited receipt analysis"
          ]
        };
      case 'playbook':
      default:
        return {
          title: "Unlock Sage's Playbook",
          subtitle: "Get your personalized action plan",
          icon: "📖",
          features: [
            "Step-by-step strategies",
            "Pattern analysis and insights",
            "Personalized action plan",
            "Unlimited receipt analysis"
          ]
        };
    }
  };

  const config = getSurfaceConfig();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-amber-400/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="text-4xl mb-3">{config.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>
              <p className="text-gray-300 text-sm">{config.subtitle}</p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-400/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-green-300 font-semibold text-sm">4.7★ average reaction</span>
              </div>
              <p className="text-center text-gray-300 text-xs">
                98,217 receipts generated • Trusted by thousands
              </p>
            </div>
          </div>

          {/* Value Bullets */}
          <div className="px-6 pb-4">
            <div className="space-y-3">
              {config.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-200 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price Ladder Badge */}
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl p-4 border border-amber-400/30 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 font-bold text-lg">${price}/yr</span>
              </div>
              <p className="text-amber-200 text-xs">
                {spotsLeft} spots left at this price
              </p>
            </div>
          </div>

          {/* Plan Toggle */}
          <div className="px-6 pb-4">
            <div className="bg-slate-800/50 rounded-2xl p-1 flex">
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                  selectedPlan === 'yearly'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="px-6 pb-4">
            <motion.button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-500 text-black font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Unlock Unlimited
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>

          {/* Secondary CTA */}
          <div className="px-6 pb-6">
            <button
              onClick={handleDecline}
              className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
            >
              Continue free for now
            </button>
          </div>

          {/* Footnote */}
          <div className="px-6 pb-6">
            <p className="text-center text-xs text-gray-500">
              Cancel anytime. Entertainment/Education - no therapy.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaywallSheet;
