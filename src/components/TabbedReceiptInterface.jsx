import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Lock, Brain, Shield, Sparkles, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ReceiptCardViral from '@/components/ReceiptCardViral';
import DeepDive from '@/components/DeepDive';
import ImmunityTraining from '@/components/ImmunityTraining';

const TabbedReceiptInterface = ({ 
  analysis, 
  archetypeName, 
  archetypeNameForImmunity,
  onSaveReceipt,
  onScreenshot,
  isSharing 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'receipt',
      label: 'Receipt',
      icon: '📄',
      component: (
        <ReceiptCardViral 
          results={analysis}
          onSaveReceipt={onSaveReceipt}
          onScreenshot={onScreenshot}
          isSharing={isSharing}
        />
      ),
      isPremium: false
    },
    {
      id: 'deepdive',
      label: "Tea",
      icon: '☕',
      component: (
        <DeepDive 
          deepDive={analysis?.deepDive}
          analysisData={analysis}
          onSaveReceipt={onSaveReceipt}
          onScreenshot={onScreenshot}
          isSharing={isSharing}
        />
      ),
      isPremium: false
    },
    {
      id: 'immunity',
      label: 'Immunity',
      icon: '🛡️',
      component: (
        <ImmunityTraining 
          immunityData={analysis?.immunityTraining}
          archetypeName={archetypeNameForImmunity}
          riskLevel={analysis?.immunityTraining?.riskLevel || 'medium'}
          onSaveReceipt={onSaveReceipt}
          onScreenshot={onScreenshot}
          isSharing={isSharing}
        />
      ),
      isPremium: true
    }
  ];

  // Navigation functions
  const navigateToTab = (newIndex) => {
    if (newIndex === activeTab || isTransitioning) return;
    if (newIndex < 0 || newIndex >= tabs.length) return;
    
    // Check premium access for immunity tab
    if (newIndex === 2 && !isPremium) {
      // Allow viewing the premium lock screen
    }
    
    setIsTransitioning(true);
    setActiveTab(newIndex);
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handleTabClick = (tabIndex) => {
    navigateToTab(tabIndex);
  };

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        navigateToTab(activeTab - 1);
      } else if (e.key === 'ArrowRight') {
        navigateToTab(activeTab + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const minSwipeDistance = 75; // Minimum distance for a swipe

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeTab < tabs.length - 1) {
      navigateToTab(activeTab + 1);
    }
    if (isRightSwipe && activeTab > 0) {
      navigateToTab(activeTab - 1);
    }
  };

  // Debug logging removed for production
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation with Arrow Controls */}
      <div className="mb-8">
        <div className="relative">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/70 to-slate-900/70 rounded-2xl p-2.5 backdrop-blur-md border-2 border-slate-500/50 shadow-xl shadow-slate-900/40">
            {/* Left Arrow */}
            <button
              onClick={() => navigateToTab(activeTab - 1)}
              disabled={activeTab === 0 || isTransitioning}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 hover:shadow-md hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-out"
              aria-label="Previous section"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Tab Labels */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1">
                {tabs.map((tab, index) => {
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(index)}
                      disabled={isTransitioning}
                      className={`
                        group relative px-2.5 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-300 ease-out transform hover:scale-105
                        ${activeTab === index 
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/30' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md border border-transparent hover:border-slate-600/40'
                        }
                        ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="text-sm flex-shrink-0">{tab.icon}</span>
                      <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
                      {tab.isPremium && !isPremium && (
                        <Lock className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                      )}
                      {tab.isPremium && isPremium && (
                        <Crown className="w-2.5 h-2.5 text-amber-400" />
                      )}
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => navigateToTab(activeTab + 1)}
              disabled={activeTab === tabs.length - 1 || isTransitioning}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 hover:shadow-md hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ease-out"
              aria-label="Next section"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {tabs.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ease-out cursor-pointer hover:scale-110 ${
                    index === activeTab 
                      ? 'bg-gradient-to-r from-teal-400 to-cyan-400 w-8 shadow-sm shadow-teal-400/50' 
                      : 'bg-slate-600 hover:bg-slate-500 w-1.5'
                  }`}
                  onClick={() => navigateToTab(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content with Swipe Support */}
      <div 
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            {activeTab === 2 && !isPremium ? (
              // Premium Lock Screen
              <div className="text-center py-16 px-8">
                <div className="relative">
                  {/* Premium Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/30 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-3xl"></div>
                  
                  {/* Content */}
                  <div className="relative backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-12">
                    {/* Lock Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center border border-yellow-400/30">
                        <Lock className="w-10 h-10 text-yellow-400" />
                      </div>
                    </div>

                    {/* Header */}
                    <h2 className="text-3xl font-bold mb-4"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                      SAGE'S IMMUNITY TRAINING
                    </h2>
                    
                    <h3 className="text-lg font-medium text-amber-300 mb-6">
                      Understanding Your {archetypeNameForImmunity}
                    </h3>

                    {/* Preview Content */}
                    <div className="mb-8 space-y-6">
                      {/* Pattern Recognition Preview */}
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h4 className="text-teal-400 font-bold text-sm mb-4">PATTERN RECOGNITION</h4>
                        <div className="space-y-3">
                          <div className="text-stone-300/90 text-lg">
                            Pattern detected: {analysis.immunityTraining?.patternDetected || `The ${archetypeNameForImmunity} manipulation cycle`}
                          </div>
                          <div className="text-purple-300 text-lg">
                            Success rate: {analysis.immunityTraining?.successRate || '94% will repeat this pattern'}
                          </div>
                          <div className="text-teal-300 text-lg">
                            Your vulnerability: {analysis.immunityTraining?.userVulnerability || 'Your genuine hope for connection'}
                          </div>
                        </div>
                      </div>

                      {/* Pattern Loop Preview */}
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h4 className="text-teal-400 font-bold text-sm mb-4">PATTERN LOOP</h4>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                          {analysis.immunityTraining?.patternLoop?.slice(0, 3).map((step, index) => (
                            <div key={step} className="contents">
                              <div className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-lg border border-purple-500/30 whitespace-nowrap">
                                {step}
                              </div>
                              {index < 2 && (
                                <span className="text-purple-300 text-lg">→</span>
                              )}
                            </div>
                          ))}
                          <div className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-lg border border-purple-500/30 whitespace-nowrap opacity-50">
                            ...
                          </div>
                        </div>
                      </div>

                      {/* Flags Preview */}
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h4 className="text-teal-400 font-bold text-sm mb-4">FLAGS</h4>
                        <div className="space-y-2">
                          {analysis.immunityTraining?.flags?.slice(0, 2).map((flag, index) => (
                            <div key={index} className="flex items-start gap-2 text-base text-red-300">
                              <span className="mt-0.5 flex-shrink-0">🚩</span>
                              <span className="leading-relaxed">{flag.text}</span>
                            </div>
                          ))}
                          <div className="flex items-start gap-2 text-base text-white/50">
                            <span className="mt-0.5 flex-shrink-0">🚩</span>
                            <span className="leading-relaxed">+ more detailed analysis...</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade CTA */}
                    <div className="text-center">
                      <p className="text-white/80 text-lg mb-6">
                        Unlock the complete immunity training to become bulletproof against this pattern
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={handleUpgradeClick}
                          className="px-8 py-4 text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.8)',
                            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                          }}
                        >
                          <Crown className="w-5 h-5" />
                          Unlock Immunity Training
                        </button>
                        
                        <button
                          onClick={() => navigateToTab(1)}
                          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                        >
                          Continue with Sage's Tea
                        </button>
                      </div>
                      
                      <p className="text-white/60 text-sm mt-4">
                        Premium members get unlimited access to all immunity training modules
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Regular Tab Content
              <div className="w-full">
                {tabs[activeTab]?.component}
              </div>
            )}
            
            {/* Mobile Navigation Hands - Clickable */}
            <div className="flex justify-center items-center mt-8 sm:hidden">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigateToTab(activeTab - 1)}
                  disabled={activeTab === 0}
                  className="text-4xl hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous section"
                >
                  👈
                </button>
                <div className="text-xs text-gray-400 text-center px-4">
                  <div>Explore more sections</div>
                  <div className="text-[10px] text-gray-500 mt-1">Tap hands or use arrows above</div>
                </div>
                <button
                  onClick={() => navigateToTab(activeTab + 1)}
                  disabled={activeTab === tabs.length - 1}
                  className="text-4xl hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next section"
                >
                  👉
                </button>
              </div>
            </div>

            {/* Additional Mobile Navigation - Same style as top */}
            <div className="flex justify-center mt-6 sm:hidden">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-2xl p-2 backdrop-blur-md border border-slate-600/40 shadow-lg">
                <div className="flex items-center gap-1">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(index)}
                        disabled={isTransitioning}
                        className={`
                          group relative px-2 py-2 rounded-xl flex items-center gap-1 transition-all duration-300 ease-out transform hover:scale-105
                          ${activeTab === index 
                            ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/30' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md border border-transparent hover:border-slate-600/40'
                          }
                          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <Icon className="w-3 h-3 flex-shrink-0" />
                        <span className="text-[10px] font-medium">{tab.label.split(' ')[0]}</span>
                        {tab.isPremium && !isPremium && (
                          <Lock className="w-2 h-2 text-amber-400 animate-pulse" />
                        )}
                        {tab.isPremium && isPremium && (
                          <Crown className="w-2 h-2 text-amber-400" />
                        )}
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabbedReceiptInterface;
