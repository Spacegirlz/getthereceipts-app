import React, { memo, useMemo, useState, useEffect } from 'react';
import { Shield, AlertTriangle, Zap, Eye, LogOut, Crown, CheckCircle, Calendar, Target, TrendingUp, Clock, Mic, Activity, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast';
import { useSocialExport } from '@/hooks/useSocialExport';
import { ShareInstructionsModal } from '@/components/ShareInstructionsModal';

// Helper function to remove bad emojis (specifically ✅)
const cleanFlagText = (text) => {
  if (!text) return '';
  // Remove the specific ✅ emoji that's causing double flag issues
  return text.replace(/✅/g, '').trim();
};
import sageDarkCircle from '@/assets/sage-dark-circle.png';
import BlurredSection from './BlurredSection';

const ImmunityTraining = memo(({ immunityData, archetypeName = "The Gaslighter", isCrisisSituation = false, isPremium = false, originalMessage, context, analysisData }) => {
  const { toast } = useToast();
  const { captureById, showInstructions, setShowInstructions, instructionsPlatform } = useSocialExport();
  
  // Compact mode state with localStorage persistence
  const [isCompact, setIsCompact] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('gtr_density') : null;
      return saved ? saved === 'compact' : true; // default to compact for mobile-first
    } catch {
      return true;
    }
  });
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('gtr_density', isCompact ? 'compact' : 'standard');
      }
    } catch {}
  }, [isCompact]);

  // Collapsible sections state
  const [showMoreSides, setShowMoreSides] = useState(false);
  const [openImmunityTest, setOpenImmunityTest] = useState(false);
  const [openTraining, setOpenTraining] = useState(false);
  
  // Extract user names from analysis data
  const userName = analysisData?.userName || context?.userName || 'You';
  const otherName = analysisData?.otherName || context?.otherName || 'Them';
  
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ ImmunityTraining received:', immunityData);
      console.log('🛡️ Type:', typeof immunityData, 'Keys:', immunityData ? Object.keys(immunityData) : 'none');
      console.log('🆘 Crisis situation:', isCrisisSituation);
      console.log('🛡️ Original message:', originalMessage);
      console.log('🛡️ Context:', context);
      console.log('🛡️ Analysis data:', analysisData);
      console.log('🛡️ User names:', { userName: analysisData?.userName, otherName: analysisData?.otherName });
      console.log('🛡️ Extracted names:', { userName, otherName });
      console.log('🛡️ Available fields for characteristics:', {
        keyCharacteristics: immunityData?.keyCharacteristics,
        characteristics: immunityData?.characteristics,
        redFlagDrills: immunityData?.redFlagDrills,
        earlyWarnings: immunityData?.earlyWarnings,
        sketchySigns: immunityData?.sketchySigns,
        healthySigns: immunityData?.healthySigns
      });
    }
  }, [immunityData, isCrisisSituation]);

  // Crisis-specific content
  if (isCrisisSituation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Crisis Safety Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/30 rounded-full px-6 py-3 mb-4">
              <span className="text-2xl">🆘</span>
              <span className="text-lg font-bold text-red-300">CRISIS SAFETY GUIDANCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Your Safety Matters Most
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              This situation requires immediate attention and professional support. Here's how to protect yourself and others.
            </p>
          </div>

          {/* Crisis Resources Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Immediate Safety */}
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <span>🚨</span> Immediate Safety
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">•</span>
                  <p className="text-gray-200">If you're in immediate danger, call 911 or your local emergency number</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">•</span>
                  <p className="text-gray-200">Get to a safe location away from the situation</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">•</span>
                  <p className="text-gray-200">Contact a trusted friend or family member immediately</p>
                </div>
              </div>
            </div>

            {/* Professional Support */}
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>🏥</span> Professional Support
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-lg">•</span>
                  <p className="text-gray-200">National Suicide Prevention Lifeline: 988</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-lg">•</span>
                  <p className="text-gray-200">RAINN Sexual Assault Hotline: 1-800-656-4673</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-lg">•</span>
                  <p className="text-gray-200">Crisis Text Line: Text HOME to 741741</p>
                </div>
              </div>
            </div>
          </div>

          {/* Universal Safety Principles */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <span>🛡️</span> Universal Safety Principles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-200 mb-2">If You're Experiencing This:</h4>
                <ul className="space-y-2 text-gray-200">
                  <li>• Your feelings are valid and real</li>
                  <li>• This is not your fault</li>
                  <li>• You deserve safety and support</li>
                  <li>• Professional help is available 24/7</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-200 mb-2">If You're Observing This:</h4>
                <ul className="space-y-2 text-gray-200">
                  <li>• Take the situation seriously</li>
                  <li>• Encourage professional help</li>
                  <li>• Don't try to handle it alone</li>
                  <li>• Report to authorities if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6 text-center">
            <p className="text-yellow-200 text-lg font-medium">
              <span className="text-2xl mr-2">⚠️</span>
              This analysis is not a substitute for professional mental health care, medical attention, or emergency services.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Better element detection using computed styles
  const fixGradientElements = (element) => {
    const allElements = element.querySelectorAll('*');
    const originalElements = [];
    
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.webkitBackgroundClip === 'text' || 
          computedStyle.backgroundClip === 'text' ||
          computedStyle.webkitTextFillColor === 'transparent') {
        
        const originalHTML = el.outerHTML;
        originalElements.push({ element: el, originalHTML });
        
        // Create replacement with solid gold color
        const replacement = el.cloneNode(true);
        replacement.style.background = 'none';
        replacement.style.webkitBackgroundClip = 'initial';
        replacement.style.backgroundClip = 'initial';
        replacement.style.webkitTextFillColor = '#D4AF37';
        replacement.style.color = '#D4AF37';
        
        el.parentNode.replaceChild(replacement, el);
      }
    });
    
    return originalElements;
  };
  
  const restoreOriginalElements = (originalElements) => {
    originalElements.forEach(({ element, originalHTML }) => {
      const parent = element.parentNode || element.parentElement;
      if (parent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        const restoredElement = tempDiv.firstChild;
        parent.replaceChild(restoredElement, element);
      }
    });
  };

  const handleSaveBadge = async () => {
    const element = document.querySelector('[data-immunity-component]');
    if (!element) {
      toast({ 
        title: "Error", 
        description: "Could not find immunity training component to save.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const blob = await domtoimage.toBlob(element, {
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        },
        bgcolor: '#1a1a2e',
        quality: 1,
        filter: (node) => {
          // Remove border styles from captured elements
          if (node.style) {
            node.style.border = 'none';
            node.style.borderTop = 'none';
            node.style.borderBottom = 'none';
            node.style.borderLeft = 'none';
            node.style.borderRight = 'none';
          }
          return true;
        }
      });
      
      const timestamp = Date.now();
      saveAs(blob, `Sage's Immunity #${timestamp}.png`);
      toast({ title: "Badge saved!", description: "Your immunity badge has been downloaded." });
    } catch (error) {
      console.error('Error saving badge:', error);
      toast({ 
        title: "Error", 
        description: "Could not save badge. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleShareTrophy = () => {
    // Use the new social export system for Immunity Training sharing - with share menu
    captureById('social-immunity-card', 'Sage-Immunity', true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "Share text copied to clipboard." });
    }).catch(() => {
      toast({ 
        title: "Error", 
        description: "Could not copy to clipboard.", 
        variant: "destructive" 
      });
    });
  };
  
  // Save Immunity (Clean) using same mechanics as Truth Receipt
  const handleSaveImmunity = () => {
    // Use the new social export system for Immunity Training - direct download only
    captureById('social-immunity-card', 'Sage-Immunity', false);
  };
  
  if (!immunityData || typeof immunityData !== 'object') {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-400/20 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-4">
          <span className="text-2xl">🏗️</span>
        </div>
        <h3 className="text-emerald-300 font-bold text-lg mb-2">Your Immunity Training is Being Crafted</h3>
        <p className="text-stone-300/90 text-xl leading-relaxed">Sage is preparing your personalized protection strategies. This premium feature will be available soon.</p>
      </div>
    );
  }

  // Extract new schema data with fallbacks
  const {
    patternDNA,
    patternLoop = [],
    greenFlags = [],
    thisMessFlags = [],
    immunityTraining = [],
    immunityTest,
    sageBlessing,
    riskLevel = 'medium',
    safetyNote
  } = immunityData;

  
  // Determine risk level based on archetype
  const actualRiskLevel = archetypeName?.includes('Healthy Partner') || 
                         archetypeName?.includes('Green Flag') ||
                         archetypeName?.includes('Communication Champions') ||
                         archetypeName?.toLowerCase().includes('healthy') ||
                         archetypeName?.toLowerCase().includes('champion')
                         ? 'low' : riskLevel;

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400 border-green-500/30 bg-green-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
      case 'high': return 'text-red-400 border-red-500/30 bg-red-900/20';
      default: return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
    }
  };

  // Match Viral Receipt color coding: green (0-3), orange (4-6), red (7-10)
  const getHeaderArchetypeColor = () => {
    if (actualRiskLevel === 'low') return '#4ADE80'; // green-400 (same as DeepDive)
    if (actualRiskLevel === 'high') return '#F87171'; // red-400
    return '#FB923C'; // orange-400
  };

  // For free users, show blurred version with mobile paywall overlay (matches Playbook style)
  if (!isPremium && !isCrisisSituation) {
    return (
      <div className="relative w-full max-w-2xl mx-auto px-0 pb-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-slate-600/30">
          {/* Actual Content (Blurred Preview) */}
          <div className="p-6 sm:p-8 filter blur-sm pointer-events-none">
            {/* Header preview */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/25 to-orange-400/25 border border-yellow-400/40 mb-3">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                Sage's Immunity Training
              </h3>
            </div>
            {/* Preview blocks */}
            <div className="space-y-4">
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2">🔁 Break The Cycle</h4>
                <p className="text-gray-300 leading-relaxed">Spot the pattern early and stop repeating it with field-tested moves…</p>
              </div>
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2">🎯 Micro-Lessons</h4>
                <p className="text-gray-300 leading-relaxed">Short drills that raise your baseline and protect your peace…</p>
              </div>
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2">🧪 Immunity Test</h4>
                <p className="text-gray-300 leading-relaxed">A quick test to know exactly where you stand—and what to do next…</p>
              </div>
              {/* See Both Sides (Locked preview: headings only, blurred placeholders) */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                <div className="grid grid-cols-2">
                  <div className="px-2 py-2 bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-r border-white/10">
                    <h5 className="text-emerald-300 font-bold text-xs sm:text-sm text-center">Healthy Version</h5>
                  </div>
                  <div className="px-2 py-2 bg-gradient-to-br from-rose-500/10 to-pink-500/5">
                    <h5 className="text-rose-300 font-bold text-xs sm:text-sm text-center">What You Got</h5>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-white/10">
                  {/* Left placeholders */}
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded-md bg-white/15 blur-[1px]"></div>
                    <div className="h-3 rounded-md bg-white/15 blur-[1px] w-5/6"></div>
                    <div className="h-3 rounded-md bg-white/15 blur-[1px] w-4/6"></div>
                  </div>
                  {/* Right placeholders */}
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded-md bg-white/15 blur-[1px]"></div>
                    <div className="h-3 rounded-md bg-white/15 blur-[1px] w-5/6"></div>
                    <div className="h-3 rounded-md bg-white/15 blur-[1px] w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unlock Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6 sm:p-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400/50 mb-5 shadow-lg shadow-yellow-500/30">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                Unlock Immunity Training
              </h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-5 max-w-md mx-auto">
                Build real immunity: break the cycle, train your responses, and protect your peace
              </p>
              <ul className="text-sm text-gray-300/90 mb-6 space-y-2 max-w-md mx-auto">
                <li>• Personalized drills that actually stick</li>
                <li>• Micro-lessons for tough moments</li>
                <li>• One quick test to know your status</li>
              </ul>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Unlock Immunity
              </button>
              <p className="text-sm text-gray-400 mt-3">$29.99/year • Cancel anytime</p>
            </div>
          </div>
        </div>

        {/* The blurred preview below retains original layout for continuity, but stays hidden to interactions */}
        <motion.div 
          data-immunity-component
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`relative rounded-[24px] ${isCompact ? 'p-3 sm:p-3 md:p-4' : 'p-3 sm:p-4 md:p-6'} text-stone-200/90 mt-4`}
          style={{
            background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
            backdropFilter: 'blur(20px) saturate(200%)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15), 0 0 80px rgba(212, 175, 55, 0.06)'
          }}
        >
        {/* Premium dot pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Immunity Training Header - Matches Receipt pill header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={isCompact ? 'mb-5' : 'mb-8'}
        >
          <div className="text-center mb-1 relative z-50">
            <div className="inline-flex items-center gap-3 bg-black/40 px-8 py-2 rounded-full border border-stone-400/20 mb-2 relative z-50" data-immunity-pill>
              <img
                src={sageDarkCircle}
                alt="Sage"
                className={`object-contain rounded-full border-2 border-teal-400/40 relative z-50 ${isCompact ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-20 sm:h-20'}`}
            style={{ 
                  filter: 'brightness(1.2) contrast(1.1)',
                  boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
                }}
              />
              <span className={`${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-lg'} font-bold tracking-widest relative z-50`}
                style={{
                  color: '#14B8A6',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(20, 184, 166, 0.4)'
                }}>
                IMMUNITY TRAINING
              </span>
            </div>
            {/* Density toggle */}
            <div className="mt-2 mb-2 flex justify-center">
              <button
                onClick={() => setIsCompact((v) => !v)}
                className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
              >
                View: {isCompact ? 'Compact' : 'Standard'}
              </button>
            </div>
            {/* Pattern Verified subline */}
            <div className={isCompact ? 'mt-1 mb-4' : 'mt-2 mb-6'} data-pattern-verified-section>
              <h3
                className={`heading-font font-semibold ${isCompact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl md:text-2xl'} leading-tight`}
                style={{ color: getHeaderArchetypeColor() + 'E6', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                Pattern Verified: {archetypeName?.replace(/^The /, '') || 'Pattern'}
            </h3>
            </div>
          </div>
        </motion.div>

        {/* Pattern DNA Formula - Central Visual */}
        {patternDNA && (
          <div className={isCompact ? 'mb-5' : 'mb-8'} data-share-hide="true" data-pattern-dna-section>
            <div className="bg-black/30 rounded-xl border border-transparent overflow-hidden backdrop-blur-sm">
              <div className={`${isCompact ? 'px-3 py-2' : 'px-4 py-3'} border-b border-transparent`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧬</span>
                  <h4 className={`font-bold ${isCompact ? 'text-xs' : 'text-sm'} tracking-wide uppercase`} style={{ color: '#14B8A6' }}>What This Looks Like</h4>
                </div>
              </div>
              <div className={`${isCompact ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isCompact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'} font-medium text-stone-200/90 ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'}`}
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    lineHeight: isCompact ? undefined : '1.6'
                  }}>
                  {patternDNA}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* The Cycle - Prominent & Animated */}
        {patternLoop.length > 0 && (
          <div className={isCompact ? 'mb-5' : 'mb-8'} data-cycle-section>
            <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg"
            style={{
                border: '1px solid rgba(20, 184, 166, 0.35)',
                boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.25), 0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              }}>
              <div className={`${isCompact ? 'px-3 py-2' : 'px-4 py-3'} border-b border-transparent`}>
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg animate-pulse">🔄</span>
                  <h4 className={`font-bold ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} tracking-wide uppercase`} style={{ color: '#14B8A6' }}>
                    The Cycle
                  </h4>
                </div>
              </div>
              
              <div className={isCompact ? 'p-3' : 'p-4'}>
                {/* Mobile: Circular Layout with Numbers */}
                <div className="sm:hidden" data-cycle-mobile>
                  <div className="relative flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs relative">
                      {patternLoop.slice(0, 4).map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          className={`bg-cyan-900/30 text-cyan-300 rounded-xl text-xs font-medium text-center border border-cyan-500/20 hover:bg-cyan-800/40 transition-all duration-300 relative ${isCompact ? 'px-2 py-1.5' : 'px-2 py-2'}`}
                          style={{
                            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                          }}
                        >
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                  </div>
                          {step}
                        </motion.div>
                      ))}
                  </div>
                </div>
                <div className="text-center mt-3">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 0.85,
                        color: actualRiskLevel === 'low'
                          ? ['#06B6D4', '#22D3EE', '#06B6D4']
                          : ['#FF6B6B', '#FF8E53', '#FF6B6B']
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="text-xs tracking-wide"
                    >
                    {actualRiskLevel === 'low' ? '↻ Healthy Cycle' : '↻ Endless Loop'}
                    </motion.span>
                </div>
              </div>
              
                {/* Desktop: Prominent Circular Flow */}
                <div className="hidden sm:block" data-cycle-desktop>
                  <div className="relative flex items-center justify-center">
                    <div className="flex items-center justify-center gap-3">
                      {patternLoop.slice(0, 4).map((step, index) => (
                    <React.Fragment key={step}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-cyan-900/30 text-cyan-300 px-3 py-2 rounded-xl text-sm font-medium text-center border border-cyan-500/20 hover:scale-105 hover:bg-cyan-800/40 transition-all duration-300 cursor-default min-w-[100px]"
                            style={{
                              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                            }}
                          >
                        {step}
                          </motion.div>
                          {index < patternLoop.length - 1 && (
                            <span 
                              className="text-lg flex-shrink-0 z-10 relative"
                              style={{
                                color: '#FF6B6B',
                                textShadow: '0 0 8px rgba(255, 107, 107, 0.4)',
                                opacity: 1
                              }}
                            >
                              →
                            </span>
                      )}
                    </React.Fragment>
                      ))}
                    </div>
                </div>
                <div className="w-full flex justify-center mt-3">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 0.85,
                        color: actualRiskLevel === 'low'
                          ? ['#06B6D4', '#22D3EE', '#06B6D4']
                          : ['#FF6B6B', '#FF8E53', '#FF6B6B']
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="text-sm tracking-wide"
                    >
                    {actualRiskLevel === 'low' ? '↻ Healthy Cycle' : '↻ Endless Loop'}
                    </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Green Flags vs This Mess */}
        <div className="mb-8" data-see-both-sides-section>
          <div className="bg-black/30 rounded-xl border border-transparent overflow-hidden backdrop-blur-sm shadow-lg">
            {/* Main Header */}
            <div className="px-4 py-3 border-b border-transparent">
              <div className="flex items-center justify-start gap-2">
                <span className="text-lg">⚖️</span>
                <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>See Both Sides</h4>
              </div>
            </div>
            
            {/* Tab-style Headers */}
            <div className="grid grid-cols-2">
              <div className="px-4 py-3 bg-gradient-to-br from-emerald-500/15 to-green-500/10 border-r border-slate-600/30 relative">
                <div className="absolute inset-0 bg-emerald-400/5"></div>
                <h5 className="text-emerald-400 font-bold text-xs sm:text-sm text-center relative z-10">🟢 Healthy Version</h5>
              </div>
              <div className="px-4 py-3 bg-gradient-to-br from-rose-500/15 to-pink-500/10 relative">
                <div className="absolute inset-0 bg-rose-400/5"></div>
                <h5 className="text-rose-400 font-bold text-xs sm:text-sm text-center relative z-10">🔴 What You Got</h5>
              </div>
            </div>
            
            {/* Content - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-600/20">
              {/* Green Flags */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                <ul className="space-y-3">
                  {Array.isArray(greenFlags) && greenFlags.length > 0 ? greenFlags.slice(0, 3).map((sign, index) => (
                    <li key={index} className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`} data-green-flag={index >= 2 ? "true" : undefined}>
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-emerald-200 text-sm leading-relaxed">{cleanFlagText(sign)}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-emerald-200 text-sm leading-relaxed">No healthy signs detected</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* This Mess Flags */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
                <ul className="space-y-3">
                  {Array.isArray(thisMessFlags) && thisMessFlags.length > 0 ? thisMessFlags.slice(0, 3).map((sign, index) => (
                    <li key={index} className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`} data-red-flag={index >= 2 ? "true" : undefined}>
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className="text-rose-200 text-sm leading-relaxed">{cleanFlagText(sign)}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className="text-rose-200 text-sm leading-relaxed">No red flags detected</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Immunity Test - Field Test */}
        {immunityTest && (
          <div className="mb-8" data-share-hide="true">
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer">
              <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg animate-pulse">🧪</span>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                    Immunity Test
                  </h4>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-stone-200/90 text-sm sm:text-base leading-relaxed text-center font-medium" 
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.6'
                  }}>
                  {immunityTest}
                </p>
              </div>
              
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.06)' }} />
            </div>
          </div>
        )}

        {/* Your Training - Checkpoints */}
        {immunityTraining.length > 0 && (
          <div className="mb-8" data-training-section>
            <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg"
              style={{
                border: 'none',
                boxShadow: '0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              }}>
              <div className="px-4 py-3 border-b border-transparent">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                    Your Training
                  </h4>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {immunityTraining.map((checkpoint, index) => (
                    <motion.div
                      key={index}
                      data-training-item={index > 0 ? "true" : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-transparent hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-transparent">
                        <span className="text-teal-300 text-sm font-bold">✓</span>
                      </div>
                      <p className="text-stone-200/90 text-sm sm:text-base leading-relaxed font-medium">
                        {checkpoint}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        </motion.div>
      </div>
    );
  }

  // For premium users, show full content
  return (
    <div className="relative w-full max-w-2xl mx-auto px-0 pb-6">
      
      {/* Main Immunity Card - Mobile-optimized with max-width constraints */}
      <motion.div 
        data-immunity-component
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={`relative rounded-[24px] ${isCompact ? 'p-3 sm:p-3 md:p-4' : 'p-3 sm:p-4 md:p-6'} text-stone-200/90`}
        style={{
          background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15), 0 0 80px rgba(212, 175, 55, 0.06)'
        }}
      >
        {/* Premium dot pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Immunity Training Header - Matches Receipt pill header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-center mb-1 relative z-50">
            <div className="inline-flex items-center gap-3 bg-black/40 px-8 py-2 rounded-full border border-stone-400/20 mb-2 relative z-50" data-immunity-pill>
              <img
                src={sageDarkCircle}
                alt="Sage"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-teal-400/40 relative z-50"
                style={{ 
                  filter: 'brightness(1.2) contrast(1.1)',
                  boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
                }}
              />
              <span className="text-sm sm:text-lg font-bold tracking-widest relative z-50"
                style={{
                  color: '#14B8A6',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(20, 184, 166, 0.4)'
                }}>
                IMMUNITY TRAINING
              </span>
            </div>
            {/* Pattern Verified subline */}
            <div className="mt-2 mb-6" data-pattern-verified-section>
              <h3
                className="heading-font font-semibold text-lg sm:text-xl md:text-2xl leading-tight"
                style={{ color: getHeaderArchetypeColor() + 'E6', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                Pattern Verified: {archetypeName?.replace(/^The /, '') || 'Pattern'}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Pattern DNA Formula - Central Visual */}
        {patternDNA && (
          <div className="mb-8" data-pattern-dna-section>
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
                  {patternDNA}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* The Cycle */}
        {patternLoop.length > 0 && (
          <div className="mb-8" data-cycle-section>
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
                {/* Mobile: Circular Layout with Numbers */}
                <div className="sm:hidden" data-cycle-mobile>
                  <div className="relative flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs relative">
                      {patternLoop.slice(0, 4).map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          className={`bg-cyan-900/30 text-cyan-300 rounded-xl text-xs font-medium text-center border border-cyan-500/20 hover:bg-cyan-800/40 transition-all duration-300 relative ${isCompact ? 'px-2 py-1.5' : 'px-2 py-2'}`}
                          style={{
                            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                          }}
                        >
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Desktop: Prominent Circular Flow */}
                <div className="hidden sm:block" data-cycle-desktop>
                  <div className="relative flex items-center justify-center">
                    <div className="flex items-center justify-center gap-3">
                      {patternLoop.slice(0, 4).map((step, index) => (
                        <React.Fragment key={step}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-cyan-900/30 text-cyan-300 px-3 py-2 rounded-xl text-sm font-medium text-center border border-cyan-500/20 hover:scale-105 hover:bg-cyan-800/40 transition-all duration-300 cursor-default min-w-[100px]"
                            style={{ boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)' }}
                          >
                            {step}
                          </motion.div>
                          {index < patternLoop.length - 1 && (
                            <span className="text-lg flex-shrink-0 z-10 relative" style={{ color: '#FF6B6B', textShadow: '0 0 8px rgba(255, 107, 107, 0.4)', opacity: 1 }}>
                              →
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* See Both Sides */}
        <div className={isCompact ? 'mb-5' : 'mb-8'} data-see-both-sides-section>
          <div className="bg-black/30 rounded-xl border border-transparent overflow-hidden backdrop-blur-sm shadow-lg">
            <div className={`${isCompact ? 'px-3 py-2' : 'px-4 py-3'} border-b border-transparent`}>
              <div className="flex items-center justify-start gap-2">
                <span className="text-lg">⚖️</span>
                <h4 className={`font-bold ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} tracking-wide uppercase`} style={{ color: '#14B8A6' }}>See Both Sides</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-600/20">
              <div className={`${isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'} bg-gradient-to-br from-emerald-500/5 to-green-500/5`}>
                <ul className={isCompact ? 'space-y-2.5' : 'space-y-3'}>
                  {Array.isArray(greenFlags) && greenFlags.length > 0 ? (showMoreSides ? greenFlags : greenFlags.slice(0, 3)).map((sign, index) => (
                    <li key={index} className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`} data-green-flag={index >= 2 ? "true" : undefined}>
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className={`${isCompact ? 'text-[13.5px]' : 'text-sm'} text-emerald-200 ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'}`}>{cleanFlagText(sign)}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className={`${isCompact ? 'text-[13.5px]' : 'text-sm'} text-emerald-200 ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'}`}>No healthy signs detected</span>
                    </li>
                  )}
                  {(Array.isArray(greenFlags) && greenFlags.length > 3) && (
                    <li className="mt-1">
                      <button onClick={() => setShowMoreSides((v)=>!v)} className="text-xs text-emerald-300/90 underline">
                        {showMoreSides ? 'Show less' : `Show ${greenFlags.length - 3} more`}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
              <div className={`${isCompact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'} bg-gradient-to-br from-rose-500/5 to-pink-500/5`}>
                <ul className={isCompact ? 'space-y-2.5' : 'space-y-3'}>
                  {Array.isArray(thisMessFlags) && thisMessFlags.length > 0 ? (showMoreSides ? thisMessFlags : thisMessFlags.slice(0, 3)).map((sign, index) => (
                    <li key={index} className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`} data-red-flag={index >= 2 ? "true" : undefined}>
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className={`${isCompact ? 'text-[13.5px]' : 'text-sm'} text-rose-200 ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'}`}>{cleanFlagText(sign)}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className={`${isCompact ? 'text-[13.5px]' : 'text-sm'} text-rose-200 ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'}`}>No red flags detected</span>
                    </li>
                  )}
                  {(Array.isArray(thisMessFlags) && thisMessFlags.length > 3) && (
                    <li className="mt-1">
                      <button onClick={() => setShowMoreSides((v)=>!v)} className="text-xs text-rose-300/90 underline">
                        {showMoreSides ? 'Show less' : `Show ${thisMessFlags.length - 3} more`}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Immunity Test */}
        {immunityTest && (
          <div className={isCompact ? 'mb-5' : 'mb-8'} data-share-hide="true">
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm shadow-lg">
              <button onClick={() => setOpenImmunityTest(v=>!v)} className={`${isCompact ? 'px-3 py-2' : 'px-4 py-3'} w-full text-left border-b border-white/10 flex items-center justify-between`}>
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg">🧪</span>
                  <h4 className={`font-bold ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} tracking-wide uppercase`} style={{ color: '#14B8A6' }}>
                    Immunity Test
                  </h4>
                </div>
                <span className="text-white/60 text-xs">{openImmunityTest ? 'Hide' : 'Open'}</span>
              </button>
              {openImmunityTest && (
                <div className={isCompact ? 'p-4' : 'p-6'}>
                  <p className={`${isCompact ? 'text-[13.5px]' : 'text-sm sm:text-base'} text-stone-200/90 ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'} text-center font-medium`} 
                    style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                    {immunityTest}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Your Training */}
        {immunityTraining.length > 0 && (
          <div className={isCompact ? 'mb-5' : 'mb-8'} data-training-section>
            <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg"
              style={{
                border: 'none',
                boxShadow: '0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              }}>
              <button onClick={() => setOpenTraining(v=>!v)} className={`${isCompact ? 'px-3 py-2' : 'px-4 py-3'} w-full text-left border-b border-transparent flex items-center justify-between`}>
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg">🎯</span>
                  <h4 className={`font-bold ${isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} tracking-wide uppercase`} style={{ color: '#14B8A6' }}>
                    Your Training
                  </h4>
                </div>
                <span className="text-white/60 text-xs">{openTraining ? 'Hide' : 'Open'}</span>
              </button>
              {openTraining && (
                <div className={isCompact ? 'p-3' : 'p-4'}>
                  <div className={isCompact ? 'space-y-2.5' : 'space-y-3'}>
                    {immunityTraining.map((checkpoint, index) => (
                      <motion.div
                        key={index}
                        data-training-item={index > 0 ? "true" : undefined}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className={`flex items-start gap-3 ${isCompact ? 'p-2.5' : 'p-3'} bg-white/5 rounded-lg border border-transparent hover:bg-white/10 transition-all duration-300`}
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-transparent">
                          <span className="text-teal-300 text-sm font-bold">✓</span>
                        </div>
                        <p className={`${isCompact ? 'text-[13.5px]' : 'text-sm sm:text-base'} ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'} text-stone-200/90 font-medium`}>
                          {checkpoint}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Sage's Blessing - Premium Sunset Treatment */}
        {sageBlessing && (
        <div className={isCompact ? 'mb-5' : 'mb-8'}>
            <div className={`max-w-2xl mx-auto ${isCompact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'} relative overflow-hidden`} data-sage-blessing-container style={{
              background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.12)'
          }}>
              <div className="text-center mb-6 sm:mb-8" data-sage-blessing-header>
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4" style={{ color: '#F59E0B' }} />
              <h4 className={`font-bold ${isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg md:text-xl'} tracking-wide`} 
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                SAGE'S BLESSING
              </h4>
            </div>
            
              <div className={`${isCompact ? 'px-3 sm:px-4 mb-5' : 'px-4 sm:px-6 mb-8'}`} data-sage-blessing-content>
                <p className={`${isCompact ? 'text-[13.5px] sm:text-sm' : 'text-sm sm:text-base md:text-lg lg:text-xl'} font-medium text-center ${isCompact ? 'leading-[1.45]' : 'leading-relaxed'}`} data-sage-blessing-text
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: isCompact ? undefined : '1.6'
                }}>
                  "{sageBlessing}"
              </p>
            </div>
            
              
              
              <p className="text-center text-white/60 text-xs" data-share-hide="true">Blessed by Sage 🔮</p>
          </div>
        </div>
        )}

            {/* High-End SaaS Footer */}
            <div className="text-center mt-6 mb-4 space-y-3" data-share-hide="true">
              {/* Privacy & Analysis Context */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <p className="text-xs text-yellow-400/90 bg-yellow-900/20 px-4 py-2 rounded-full inline-flex items-center gap-1.5 border border-yellow-700/30 backdrop-blur-sm font-medium">
                  🔒 Private. Chat deleted. Never stored.
                </p>
                <p className="text-xs text-yellow-400/90 bg-yellow-900/20 px-4 py-2 rounded-full inline-flex items-center gap-1.5 border border-yellow-700/30 backdrop-blur-sm font-medium">
                  📍 Based on your message only
                </p>
              </div>
              
              {/* Disclaimer */}
              <p className="text-xs text-yellow-400/90 bg-yellow-900/20 px-4 py-2 rounded-full inline-flex items-center gap-1.5 border border-yellow-700/30 backdrop-blur-sm font-medium italic">
                For entertainment purposes - Sage calls it like she sees it
              </p>
              
              {/* Prominent Clickable Share & Earn CTA */}
              <button 
                onClick={() => window.open('http://localhost:5173/refer', '_blank')}
                className="text-sm text-yellow-300 bg-yellow-900/30 px-6 py-3 rounded-full inline-flex items-center gap-2 border-2 border-yellow-600/50 backdrop-blur-sm font-bold hover:bg-yellow-900/50 hover:border-yellow-500/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
              >
                💰 Share & earn • 30% commission • Join 12K+ creators
              </button>
            </div>
            
            {/* WATERMARK - moved below to render for all users */}
        {/* Global WATERMARK - visible for all users and included in save/share */}
            <div className="text-center mt-2 mb-6">
              <p className="text-xs text-stone-200/90/40 tracking-widest">
                www.getthereceipts.com
              </p>
            </div>
      </motion.div>

      {/* SEPARATE SAVE/SHARE BOX - Completely outside the immunity card */}
      {isPremium && (
        <div className="w-full max-w-2xl mx-auto mt-12 mb-4">
          <div 
            className="flex flex-col gap-4 justify-center items-center p-6 backdrop-blur rounded-3xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
              border: '2px solid rgba(20, 184, 166, 0.4)',
              boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
            }}
          >
            {/* Urgency Message - Centered Above Both Buttons */}
            <div className="text-center mb-4">
              <p className="text-xs text-teal-400/90 font-medium animate-pulse">
                😱 Your friends need to see this
              </p>
            </div>
            
            {/* Save/Share Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={handleSaveImmunity}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  border: '1px solid rgba(20, 184, 166, 0.6)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Download className="h-4 w-4" />
                Save Immunity
              </button>
              
              <motion.button 
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.3)',
                    '0 0 30px rgba(212, 175, 55, 0.5)', 
                    '0 0 20px rgba(212, 175, 55, 0.3)'
                  ]
                }}
                onClick={handleShareTrophy}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-2 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.9)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Zap className="h-4 w-4" />
                🔗 Share Trophy
              </motion.button>
            </div>
          </div>
          
        </div>
      )}

      {/* Share Instructions Modal */}
      <ShareInstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        platform={instructionsPlatform}
      />
    </div>
  );
});

ImmunityTraining.displayName = 'ImmunityTraining';

export default ImmunityTraining;