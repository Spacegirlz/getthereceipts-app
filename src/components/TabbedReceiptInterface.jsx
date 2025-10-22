import React, { useState, useEffect, Fragment, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Lock, Brain, Shield, Sparkles, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ReceiptCardViral from '@/components/ReceiptCardViral';
import DeepDive from '@/components/DeepDive';
import ImmunityTraining from '@/components/ImmunityTraining';
import { AskSageChat } from '@/components/AskSageSimple';
import sageDarkCircle from '@/assets/sage-dark-circle.png';

const TabbedReceiptInterface = ({ 
  analysis, 
  originalMessage,
  context,
  archetypeName, 
  archetypeNameForImmunity,
  onSaveReceipt,
  onScreenshot,
  isSharing,
  onShowInstructions
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const sageTabRef = useRef(null);

  // Ensure first tab content is immediately visible on mount
  useEffect(() => {
    // Force a re-render to ensure content is visible
    const timer = setTimeout(() => {
      if (activeTab === 0 && isTransitioning) {
        setIsTransitioning(false);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTab, isTransitioning]);

  // Check if this is a crisis situation (strict boolean)
  const isCrisisSituation = Boolean(
    (archetypeName && (archetypeName.includes('Emergency Support') || archetypeName.includes('Crisis'))) ||
    (analysis?.archetype && (analysis.archetype.includes('Emergency Support') || analysis.archetype.includes('Crisis'))) ||
    (analysis?.mode === 'safety_override') ||
    (analysis?.safetyOverride?.triggered === true)
  );

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
          onShowInstructions={onShowInstructions}
        />
      ),
      isPremium: false
    },
    {
      id: 'deepdive',
      label: "Playbook",
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
          isPremium={isPremium}
        />
      ),
      isPremium: true
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
    },
    {
      id: 'sage',
      label: 'Sage',
      icon: '🔮',
      component: (
        <div ref={sageTabRef} className="w-full max-w-2xl mx-auto">
          <AskSageChat
            receiptData={analysis}
            isPremium={isPremium}
            userId={analysis?.userId}
            // For anonymous users, limit chats per receipt to 3. Free users keep 5/day via other checks.
            maxExchangesOverride={!isPremium && !analysis?.userId ? 3 : undefined}
          />
        </div>
      ),
      isPremium: false // Sage chat is free for all users
    }
  ];

  // Navigation functions
  const navigateToTab = (newIndex) => {
    if (newIndex === activeTab) return;
    if (newIndex < 0 || newIndex >= tabs.length) return;
    
    // Check premium access for immunity tab
    if (newIndex === 2 && !isPremium) {
      // Allow viewing the premium lock screen
    }
    
    setIsTransitioning(true);
    setActiveTab(newIndex);
    
    // Scroll to top of the tab content
    // For Sage tab, scroll to the chat interface
    if (newIndex === 3) { // Sage tab (4th tab, index 3)
      // Scroll to the Sage chat interface
      setTimeout(() => {
        if (sageTabRef.current) {
          sageTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Reset transition state after animation (reduced from 300ms to 200ms)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
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
      {/* Tab Navigation with Premium Styling */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-3xl p-3 sm:p-4 border border-cyan-400/20 shadow-lg shadow-cyan-500/20">

            {/* Tab Labels */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center">
                {tabs.map((tab, index) => {
                  const getTabColors = () => {
                    if (index === 0) { // Receipt
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-xl shadow-teal-500/30 border border-teal-400/40 transform scale-105' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/15 hover:to-cyan-500/15 hover:shadow-lg hover:shadow-teal-500/20 border border-transparent hover:border-teal-400/25 hover:scale-102';
                    } else if (index === 1) { // Playbook
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/30 border border-purple-400/40 transform scale-105' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/15 hover:to-pink-600/15 hover:shadow-lg hover:shadow-purple-500/20 border border-transparent hover:border-purple-400/25 hover:scale-102';
                    } else if (index === 2) { // Immunity
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5E6D3] text-black shadow-xl shadow-amber-500/30 border border-[#D4AF37]/60 transform scale-105' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-[#D4AF37]/15 hover:to-[#F5E6D3]/15 hover:shadow-lg hover:shadow-amber-500/20 border border-transparent hover:border-[#D4AF37]/25 hover:scale-102';
                    } else { // Sage
                      return activeTab === index 
                        ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-xl shadow-purple-500/30 border border-purple-400/40 transform scale-105' 
                        : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/15 hover:via-blue-600/15 hover:to-indigo-700/15 hover:shadow-lg hover:shadow-purple-500/20 border border-transparent hover:border-purple-400/25 hover:scale-102';
                    }
                  };

                  const getLockIconColor = () => {
                    // Make lock/crown icons visible based on active state and tab
                    if ((index === 1 || index === 2) && activeTab === index) {
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
                          group relative w-28 sm:w-36 px-3 sm:px-4 py-3 sm:py-4 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 ease-out
                          ${getTabColors()}
                          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {tab.isPremium && !isPremium && (
                          <Lock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${getLockIconColor()} animate-pulse absolute top-1 right-1`} />
                        )}
                        {tab.isPremium && isPremium && (
                          <Crown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${getLockIconColor()} absolute top-1 right-1`} />
                        )}
                        <span className="text-lg sm:text-xl flex-shrink-0 relative z-10">{tab.icon}</span>
                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap tracking-wide relative z-10" style={{
                          textShadow: activeTab === index && index !== 2 ? '0 2px 4px rgba(0, 0, 0, 0.8)' : 'none'
                        }}>{tab.label}</span>
                        
                        {/* Premium hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/8 to-white/12 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-0" />
                        
                        {/* Active state glow */}
                        {activeTab === index && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/15 rounded-2xl animate-pulse z-0" />
                        )}
                      </button>
                      
                      {/* Premium divider between tabs */}
                      {index < tabs.length - 1 && (
                        <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-slate-500/30 via-slate-400/50 to-slate-500/30 mx-2 sm:mx-3" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Premium Progress Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-3 items-center">
              {tabs.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ease-out cursor-pointer hover:scale-125 ${
                    index === activeTab 
                      ? 'bg-gradient-to-r from-teal-400 to-cyan-400 w-10 shadow-lg shadow-teal-400/60' 
                      : 'bg-slate-600/60 hover:bg-slate-500/80 w-2'
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
              stiffness: 400, 
              damping: 25,
              opacity: { duration: 0.15 }
            }}
            className="w-full"
          >
            {activeTab === 2 && !isPremium ? (
              // Premium Lock Screen (constrained to same width as Playbook/Immunity)
              <div className="w-full max-w-2xl mx-auto text-center py-16 px-8">
                <div className="relative">
                  {/* Premium Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/30 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-3xl"></div>
                  
                  {/* Content */}
                  <div
                    className="relative backdrop-blur-xl bg-black/40 border rounded-3xl p-12"
                    style={{
                      border: '1px solid rgba(212, 175, 55, 0.65)',
                      boxShadow: '0 0 0 1px rgba(212, 175, 55, 0.25), 0 8px 32px rgba(212, 175, 55, 0.18), 0 0 60px rgba(212, 175, 55, 0.10)'
                    }}
                  >
                    {/* Lock Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center border border-yellow-400/30">
                        <Lock className="w-10 h-10 text-yellow-400" />
                      </div>
                    </div>

                    {/* Updated Header Design - Matching New Immunity Training */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-3 bg-black/40 px-8 py-2 rounded-full border border-stone-400/20 mb-2">
                        <img
                          src={sageDarkCircle}
                          alt="Sage"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-teal-400/40"
                          style={{ 
                            filter: 'brightness(1.2) contrast(1.1)',
                            boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
                          }}
                        />
                        <span className="text-sm sm:text-lg font-bold tracking-widest"
                          style={{
                            color: '#14B8A6',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(20, 184, 166, 0.4)'
                          }}>
                          IMMUNITY TRAINING
                        </span>
                      </div>
                      {/* Pattern Verified subline */}
                      <div className="mt-2 mb-6">
                        <h3
                          className="heading-font font-extrabold text-lg sm:text-xl md:text-2xl leading-tight"
                          style={{ color: '#14B8A6', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                          Pattern Verified: {archetypeNameForImmunity?.replace(/^The /, '') || 'Pattern'}
                        </h3>
                      </div>
                    </div>

                    {/* Preview Content - Matching New Design */}
                    <div className="mb-8 space-y-6">
                      {/* Pattern DNA Preview */}
                      <div className="bg-black/30 rounded-xl border border-transparent overflow-hidden backdrop-blur-sm">
                        <div className="px-4 py-3 border-b border-transparent">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🧬</span>
                            <h4 className="font-bold text-sm tracking-wide uppercase" style={{ color: '#14B8A6' }}>What This Looks Like</h4>
                          </div>
                        </div>
                        <div className="p-6 text-center">
                          <div className="text-lg sm:text-xl font-medium text-stone-200/90 leading-relaxed"
                            style={{ 
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                              lineHeight: '1.6'
                            }}>
                            {analysis.immunityTraining?.patternDNA || `${archetypeNameForImmunity} shows mixed signals and vague communication patterns`}
                          </div>
                        </div>
                      </div>

                      {/* The Cycle Preview */}
                      <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg"
                        style={{
                          border: '1px solid rgba(20, 184, 166, 0.35)',
                          boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.25), 0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                          backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                        }}>
                        <div className="px-4 py-3 border-b border-transparent">
                          <div className="flex items-center justify-start gap-2">
                            <span className="text-lg">🔄</span>
                            <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                              The Cycle
                            </h4>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            {analysis.immunityTraining?.patternLoop?.slice(0, 3).map((step, index) => (
                              <div key={step} className="contents">
                                <div className="bg-cyan-900/30 text-cyan-300 px-3 py-2 rounded-xl text-sm font-medium text-center border border-cyan-500/20 min-w-[100px]">
                                  {step}
                                </div>
                                {index < 2 && (
                                  <span className="text-cyan-300 text-lg">→</span>
                                )}
                              </div>
                            ))}
                            <div className="bg-cyan-900/30 text-cyan-300 px-3 py-2 rounded-xl text-sm font-medium text-center border border-cyan-500/20 opacity-50 min-w-[100px]">
                              ...
                            </div>
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-xs tracking-wide text-cyan-300">
                              ↻ Endless Loop
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* See Both Sides Preview - headings only */}
                      <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm"
                        style={{
                          border: '1px solid rgba(20, 184, 166, 0.35)',
                          boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.25), 0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                          backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                        }}>
                        <div className="px-4 py-3 border-b border-transparent">
                          <div className="flex items-center justify-start gap-2">
                            <span className="text-lg">👀</span>
                            <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                              See Both Sides
                            </h4>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-green-400 text-sm sm:text-base font-semibold">Healthy Version:</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-red-400 text-sm sm:text-base font-semibold">What You Get:</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compact SaaS Paywall Card for Immunity (mobile-first, single card) */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-slate-600/30 mb-8">
                      <div className="p-5 sm:p-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400/50 mb-3 sm:mb-5 shadow-lg shadow-yellow-500/30">
                          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                          Unlock Immunity Training
                        </h3>
                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6 max-w-md mx-auto">
                          Break the cycle, train your responses, and protect your peace
                        </p>
                        <ul className="text-sm text-gray-300/90 mb-5 sm:mb-6 space-y-2 max-w-md mx-auto">
                          <li>• Personalized drills that actually stick</li>
                          <li>• Exact wording for tough moments</li>
                          <li>• One quick test to know your status</li>
                        </ul>
                        <button
                          onClick={handleUpgradeClick}
                          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          Unlock Immunity
                        </button>
                        <p className="text-xs sm:text-sm text-gray-400 mt-3">
                          $29.99/year • Cancel anytime
                        </p>
                      </div>
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
            
            {/* Premium Mobile Navigation */}
            <div className="flex justify-center items-center mt-10 sm:hidden">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => navigateToTab(activeTab - 1)}
                  disabled={activeTab === 0}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-cyan-400/20 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                  aria-label="Previous section"
                >
                  👈
                </button>
                <div className="text-xs text-gray-400 text-center px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-cyan-400/20">
                  <div className="font-medium">Swipe or tap to explore</div>
                </div>
                <button
                  onClick={() => navigateToTab(activeTab + 1)}
                  disabled={activeTab === tabs.length - 1}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-cyan-400/20 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                  aria-label="Next section"
                >
                  👉
                </button>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
      {/* Footer disclaimer removed to avoid duplication; containerized versions remain in each receipt */}
    </div>
  );
};

export default TabbedReceiptInterface;
