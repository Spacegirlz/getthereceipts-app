import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Lock, Brain, Shield, Sparkles, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ReceiptCardViral from '@/components/ReceiptCardViral';
import DeepDive from '@/components/DeepDive';
import ImmunityTraining from '@/components/ImmunityTraining';

const TabbedReceiptInterface = ({ 
  analysis, 
  originalMessage,
  context,
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

  // Check if this is a crisis situation
  const isCrisisSituation = archetypeName?.includes('Emergency Support') || 
                           archetypeName?.includes('Crisis') ||
                           analysis?.archetype?.includes('Emergency Support') ||
                           analysis?.archetype?.includes('Crisis') ||
                           analysis?.mode === 'safety_override' ||
                           analysis?.safetyOverride?.triggered;

  // Debug logging for crisis detection
  if (process.env.NODE_ENV === 'development') {
    console.log('🆘 Crisis Detection Debug:', {
      archetypeName,
      analysisArchetype: analysis?.archetype,
      analysisMode: analysis?.mode,
      safetyOverride: analysis?.safetyOverride,
      isCrisisSituation
    });
  }

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
      label: "Deep Dive",
      icon: '🎯',
      component: (
        <DeepDive 
          deepDive={analysis?.deepDive}
          analysisData={analysis}
          originalMessage={originalMessage}
          context={context}
          onSaveReceipt={onSaveReceipt}
          onScreenshot={onScreenshot}
          isSharing={isSharing}
        />
      ),
      isPremium: false
    },
    {
      id: 'immunity',
      label: isCrisisSituation ? 'Safety' : 'Immunity',
      icon: isCrisisSituation ? '🆘' : '🛡️',
      component: (
        <ImmunityTraining 
          immunityData={analysis?.immunityTraining}
          archetypeName={archetypeNameForImmunity}
          riskLevel={analysis?.immunityTraining?.riskLevel || 'medium'}
          isCrisisSituation={isCrisisSituation}
          isPremium={isPremium}
          originalMessage={originalMessage}
          context={context}
          analysisData={analysis}
          onSaveReceipt={onSaveReceipt}
          onScreenshot={onScreenshot}
          isSharing={isSharing}
        />
      ),
      isPremium: !isCrisisSituation // Make crisis safety guidance free
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
        <div className="relative max-w-lg mx-auto">
          <div className="flex items-center justify-center bg-gradient-to-r from-slate-800/70 to-slate-900/70 rounded-2xl p-2 sm:p-3 backdrop-blur-md border-2 border-slate-500/50 shadow-xl shadow-slate-900/40">

            {/* Tab Labels */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center">
                {tabs.map((tab, index) => {
                  const getTabColors = () => {
                    if (index === 0) { // Receipt
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:shadow-md border border-transparent hover:border-purple-400/30';
                    } else if (index === 1) { // Tea
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/30' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-cyan-600/20 hover:shadow-md border border-transparent hover:border-teal-400/30';
                    } else { // Immunity
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5E6D3] text-black shadow-lg shadow-amber-500/25 border border-[#D4AF37]/50' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-[#D4AF37]/20 hover:to-[#F5E6D3]/20 hover:shadow-md border border-transparent hover:border-[#D4AF37]/30';
                    }
                  };

                  const getLockIconColor = () => {
                    // Make lock/crown icons visible based on active state and tab
                    if (index === 2 && activeTab === index) {
                      return 'text-black'; // Black icon on gold background when active
                    }
                    return 'text-amber-400'; // Default amber color
                  };

                  return (
                    <React.Fragment key={tab.id}>
                      <button
                        onClick={() => handleTabClick(index)}
                        disabled={isTransitioning}
                        className={`
                          group relative w-24 sm:w-32 px-2 sm:px-3 py-2.5 sm:py-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all duration-300 ease-out transform hover:scale-105
                          ${getTabColors()}
                          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {tab.isPremium && !isPremium && (
                          <Lock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${getLockIconColor()} animate-pulse absolute top-1 right-1`} />
                        )}
                        {tab.isPremium && isPremium && (
                          <Crown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${getLockIconColor()} absolute top-1 right-1`} />
                        )}
                        <span className="text-base sm:text-xl flex-shrink-0">{tab.icon}</span>
                        <span className="text-xs sm:text-base font-medium whitespace-nowrap">{tab.label}</span>
                        
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </button>
                      
                      {/* Divider between tabs */}
                      {index < tabs.length - 1 && (
                        <div className="w-px h-8 sm:h-10 bg-slate-600/50 mx-1 sm:mx-2" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

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
            
            {/* Mobile Navigation - Single Set */}
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
                  <div>Swipe or tap to explore</div>
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

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabbedReceiptInterface;
