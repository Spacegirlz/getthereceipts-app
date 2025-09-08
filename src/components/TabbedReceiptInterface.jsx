import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Lock, Brain, Shield, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('receipt');
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'receipt',
      label: 'Truth Receipt',
      icon: '📋',
      component: <ReceiptCardViral results={analysis} />,
      isPremium: false
    },
    {
      id: 'deepdive',
      label: 'Deep Dive',
      icon: '🔍',
      component: <DeepDive deepDive={analysis.deepDive} analysisData={analysis} />,
      isPremium: false
    },
    {
      id: 'immunity',
      label: 'Immunity Training',
      icon: '🛡️',
      component: <ImmunityTraining 
        immunityData={analysis.immunityTraining} 
        archetypeName={archetypeNameForImmunity}
      />,
      isPremium: true
    }
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'immunity' && !isPremium) {
      // Don't change tab, but could show upgrade modal
      return;
    }
    setActiveTab(tabId);
  };

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  console.log('TabbedReceiptInterface rendering with:', { analysis, archetypeName, isPremium });
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* DEBUG: Component is rendering */}
      <div className="bg-blue-500 p-2 text-white text-xs mb-2">
        DEBUG: TabbedReceiptInterface is rendering
      </div>
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
          {/* Mobile: Horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:flex-row sm:gap-0 sm:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  relative flex-shrink-0 sm:flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-400/50' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }
                  ${tab.isPremium && !isPremium ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm sm:text-base">{tab.label}</span>
                {tab.isPremium && !isPremium && (
                  <Lock className="w-4 h-4 text-yellow-400" />
                )}
                {tab.isPremium && isPremium && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {activeTab === 'immunity' && !isPremium ? (
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
                          onClick={() => setActiveTab('deepdive')}
                          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 border border-white/20"
                        >
                          Continue with Deep Dive
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
                {tabs.find(tab => tab.id === activeTab)?.component}
                
                {/* Save/Share Actions for Receipt Tab */}
                {activeTab === 'receipt' && (
                  <div className="w-full max-w-2xl mx-auto mt-8">
                    <div className="flex gap-3 justify-center px-4">
                      <button 
                        onClick={onSaveReceipt} 
                        disabled={isSharing}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        style={{
                          border: '1px solid rgba(212, 175, 55, 0.5)',
                          boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
                        }}
                      >
                        <span className="text-lg">💾</span>
                        {isSharing ? 'Saving...' : 'Save Receipt'}
                      </button>

                      <button 
                        onClick={onScreenshot}
                        className="flex-1 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                          border: '1px solid rgba(212, 175, 55, 0.8)',
                          boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                        }}
                      >
                        <span className="text-lg">📤</span>
                        Share Receipt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabbedReceiptInterface;
