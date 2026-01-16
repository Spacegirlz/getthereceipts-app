import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, Share2, Download, Shield } from 'lucide-react';
import sageDarkCircle from '@/assets/sage-dark-circle.png';
import { useSocialExport } from '@/hooks/useSocialExport';

/**
 * SwipableStoryArc - 7-card Instagram Stories-style narrative experience
 * 
 * UX/Design Principles Applied:
 * - Whitespace and breathing room
 * - Clear visual hierarchy
 * - Scannable content
 * - Mobile-first (9:16 aspect ratio)
 * 
 * Gen Z Principles Applied:
 * - Visual-first communication
 * - Shareable moments
 * - Authentic, conversational tone
 * - Quick, scannable content
 * - Sparkly/magic interactions
 */
const SwipableStoryArc = ({ deepDive, immunityData, analysisData }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [endRevealed, setEndRevealed] = useState(false);
  const [activeCycleStep, setActiveCycleStep] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [card1ReceiptRevealed, setCard1ReceiptRevealed] = useState(false);
  const [card2Perspective, setCard2Perspective] = useState(null); // 'you' | 'them' | 'both'
  const [card3StepsRevealed, setCard3StepsRevealed] = useState(new Set());
  const [card4PredictionRevealed, setCard4PredictionRevealed] = useState(false);
  const [card5PowerUnlocked, setCard5PowerUnlocked] = useState(false);
  const { captureById } = useSocialExport();

  // Data validation & fallbacks (same pattern as DeepDive/Immunity)
  if (!deepDive || typeof deepDive !== 'object') {
    return (
      <div className="w-full max-w-md mx-auto aspect-[9/16] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
            <span className="text-2xl">🔮</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Sage is finishing the read</h3>
          <p className="text-stone-200 text-base leading-relaxed">Try again in a moment for your complete story.</p>
        </div>
      </div>
    );
  }

  // Safe data extraction with defaults
  const safeDeepDive = {
    verdict: deepDive.verdict || { act: '', subtext: '' },
    receipts: deepDive.receipts || [],
    physics: deepDive.physics || { you_bring: '', they_exploit: '', result: '' },
    playbook: deepDive.playbook || { next_48h: '', next_week: '', your_move: [] },
    sages_seal: deepDive.sages_seal || ''
  };

  const safeImmunity = {
    patternDNA: immunityData?.patternDNA || '',
    patternLoop: immunityData?.patternLoop || [],
    greenFlags: immunityData?.greenFlags || [],
    thisMessFlags: immunityData?.thisMessFlags || [],
    immunityTraining: immunityData?.immunityTraining || [],
    immunityTest: immunityData?.immunityTest || '',
    sageBlessing: immunityData?.sageBlessing || ''
  };

  // Get tone config based on confidence remark
  const getToneConfig = (confidenceRemark) => {
    if (!confidenceRemark) return { gradient: 'from-purple-400 to-blue-500', icon: '💡' };
    
    const remark = confidenceRemark.toLowerCase();
    if (remark.includes('actually decent') || remark.includes('healthy')) {
      return { gradient: 'from-emerald-400 to-teal-500', icon: '✅' };
    }
    if (remark.includes('toxic')) {
      return { gradient: 'from-red-400 to-orange-500', icon: '🚩' };
    }
    return { gradient: 'from-purple-400 to-blue-500', icon: '💡' };
  };

  const tone = getToneConfig(analysisData?.confidenceRemark);

  // Helper to get gradient colors from accent string
  const getGradientColors = (accent) => {
    const colorMap = {
      'cyan-400': 'rgb(34, 211, 238)',
      'blue-400': 'rgb(96, 165, 250)',
      'indigo-500': 'rgb(99, 102, 241)',
      'purple-400': 'rgb(192, 132, 252)',
      'pink-400': 'rgb(244, 114, 182)',
      'rose-500': 'rgb(244, 63, 94)',
      'teal-400': 'rgb(45, 212, 191)',
      'amber-400': 'rgb(251, 191, 36)',
      'orange-400': 'rgb(251, 146, 60)',
      'red-400': 'rgb(248, 113, 113)',
      'violet-400': 'rgb(167, 139, 250)',
      'fuchsia-500': 'rgb(217, 70, 239)',
    };
    
    const parts = accent.split(' ');
    return {
      from: colorMap[parts[1]] || 'rgb(139, 92, 246)',
      to: colorMap[parts[parts.length - 1]] || 'rgb(59, 130, 246)'
    };
  };

  // Sage's voice intros for each card (personality-driven)
  const sageIntros = {
    card1: "Okay bestie, let's look at what we're working with here...",
    card2: "Here's the energy between y'all...",
    card3: "You've seen this movie before, haven't you?",
    card4: "Sage is calling it now...",
    card5: "Here's what YOU do about this:"
  };

  // Build 5 cards (optimized for Gen Z attention span + Story Arc structure + Sage personality)
  const cards = useMemo(() => {
    const cardList = [];

    // Card 1: THE VERDICT 💥 (ACT 1: THE REVELATION - Instant clarity + Sage intro + receipt)
    const firstReceipt = safeDeepDive.receipts?.[0];
    cardList.push({
      index: 0,
      badge: "THE VERDICT",
      icon: "💥",
      accent: "from-amber-400 via-orange-400 to-red-500",
      headline: safeDeepDive.verdict.act || analysisData?.archetype || "The Pattern",
      summary: safeDeepDive.verdict.subtext || '',
      sageIntro: sageIntros.card1,
      receipt: firstReceipt ? {
        quote: firstReceipt.quote,
        bestieLook: firstReceipt.bestie_look,
        callingIt: firstReceipt.calling_it
      } : null,
      body: [
        analysisData?.archetype ? `They're a ${analysisData.archetype}` : ''
      ].filter(Boolean),
      footer: "But how did we get here?",
      curiosityHook: "Swipe → to see the energy that created this",
      chips: (analysisData?.greenFlagChips || analysisData?.redFlagChips || []).slice(0, 4),
      isVerdict: true,
      storyArc: "ACT 1: THE REVELATION"
    });

    // Card 2: THE DYNAMIC ⚡ (ACT 2: THE FORCES - Energy that created the pattern)
    cardList.push({
      index: 1,
      badge: "THE DYNAMIC",
      icon: "⚡",
      accent: "from-purple-400 via-pink-400 to-rose-500",
      headline: "Here's the energy that created this",
      summary: safeDeepDive.physics.you_bring || '',
      sageIntro: sageIntros.card2,
      body: [
        safeDeepDive.physics.they_exploit ? `They exploit: ${safeDeepDive.physics.they_exploit}` : '',
        safeDeepDive.physics.result ? `Result: ${safeDeepDive.physics.result}` : ''
      ].filter(Boolean),
      footer: analysisData?.confidenceRemark || '',
      curiosityHook: "Swipe → to see how this pattern repeats",
      interactive: 'tap-to-reveal',
      storyArc: "ACT 2: THE FORCES",
      // Visual equation data
      hasVisualEquation: !!(safeDeepDive.physics.you_bring && safeDeepDive.physics.they_exploit && safeDeepDive.physics.result),
      equationData: {
        leftBox: safeDeepDive.physics.they_exploit || '',
        rightBox: safeDeepDive.physics.you_bring || '',
        result: safeDeepDive.physics.result || ''
      }
    });

    // Card 3: THE PATTERN 🔄 (ACT 3: THE CYCLE - The repeating loop, interactive exploration)
    cardList.push({
      index: 2,
      badge: "THE PATTERN",
      icon: "🔄",
      accent: "from-violet-400 via-purple-500 to-fuchsia-500",
      headline: safeImmunity.patternDNA || "This is how the pattern repeats:",
      summary: safeImmunity.patternDNA ? "Tap each step to see it play out" : '',
      sageIntro: sageIntros.card3,
      body: safeImmunity.patternLoop.length > 0 ? safeImmunity.patternLoop.slice(0, 4) : ['Pattern analysis in progress'],
      footer: "Tap to explore each step",
      curiosityHook: "Swipe → to see what happens next",
      flags: safeImmunity.thisMessFlags.length > 0 ? safeImmunity.thisMessFlags : safeImmunity.greenFlags,
      interactive: 'tap-cycle-steps',
      immunityTraining: safeImmunity.immunityTraining,
      storyArc: "ACT 3: THE CYCLE",
      // Pattern DNA visual equation
      hasPatternEquation: !!safeImmunity.patternDNA,
      patternEquation: safeImmunity.patternDNA
    });

    // Card 4: WHAT'S NEXT 🔮 (ACT 4: THE PREDICTION - What the pattern will do)
    cardList.push({
      index: 3,
      badge: "WHAT'S NEXT",
      icon: "🔮",
      accent: "from-indigo-400 via-blue-500 to-cyan-500",
      headline: "Here's what happens next",
      summary: safeDeepDive.playbook.next_48h || '',
      sageIntro: sageIntros.card4,
      body: [
        safeDeepDive.playbook.next_week || '',
        safeImmunity.immunityTest || ''
      ].filter(Boolean),
      footer: "Watch for these signs",
      curiosityHook: "Swipe → to unlock your power",
      storyArc: "ACT 4: THE PREDICTION",
      // Immunity test as prominent feature
      immunityTest: safeImmunity.immunityTest,
      next48h: safeDeepDive.playbook.next_48h,
      nextWeek: safeDeepDive.playbook.next_week
    });

    // Card 5: YOUR POWER 👑 (ACT 5: THE RESOLUTION - Your power + end reveal)
    const yourMoves = Array.isArray(safeDeepDive.playbook.your_move) 
      ? safeDeepDive.playbook.your_move 
      : (safeDeepDive.playbook.your_move ? String(safeDeepDive.playbook.your_move).split('.').filter(Boolean) : []);
    
    cardList.push({
      index: 4,
      badge: "YOUR POWER",
      icon: "👑",
      accent: "from-rose-400 via-pink-500 to-purple-500",
      headline: "Here's what you do",
      summary: yourMoves[0] || 'Take action',
      sageIntro: sageIntros.card5,
      body: yourMoves.length > 1 ? yourMoves.slice(1) : [],
      footer: safeDeepDive.sages_seal || '',
      blessing: safeImmunity.sageBlessing || '',
      curiosityHook: "Tap → to see your personalized insight",
      interactive: 'end-reveal',
      storyArc: "ACT 5: THE RESOLUTION",
      // Immunity training rules as prominent feature
      immunityTraining: safeImmunity.immunityTraining,
      allYourMoves: yourMoves
    });

    return cardList;
  }, [safeDeepDive, safeImmunity, analysisData]);

  // CRITICAL: Correct swipe sizing (prevents width bug)
  const TOTAL_CARDS = cards.length; // 5 cards
  const CARD_WIDTH_PERCENT = 100 / TOTAL_CARDS; // 20% for 5 cards
  const TRACK_WIDTH_PERCENT = TOTAL_CARDS * 100; // 500% for 5 cards

  const goToNext = () => {
    if (currentCard < TOTAL_CARDS - 1) {
      // Special transition animation
      setCurrentCard(currentCard + 1);
      // Enhanced haptic feedback for story progression
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10]);
      }
    } else if (currentCard === TOTAL_CARDS - 1) {
      // Show completion screen after last card
      setShowCompletion(true);
      // Celebration haptic
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50, 100, 50]);
      }
    }
  };

  const goToPrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  // Visual Equation Component (Boxes with Arc Arrow)
  const VisualEquation = ({ leftBox, rightBox, result, arcColor = 'from-cyan-400 to-purple-400' }) => {
    return (
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 rounded-xl p-4 text-center backdrop-blur-sm"
          >
            <div className="text-xs text-purple-300/80 mb-2 font-semibold uppercase tracking-wide">THEY</div>
            <div className="text-sm text-white font-medium leading-tight">{leftBox}</div>
          </motion.div>

          {/* Arc Arrow */}
          <div className="relative flex-shrink-0 w-16 h-16">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M 10 50 Q 50 10, 90 50"
                stroke={`url(#arcGradient)`}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                  <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                </linearGradient>
              </defs>
              {/* Arrow head */}
              <motion.polygon
                points="85,45 95,50 85,55"
                fill="rgb(168, 85, 247)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"
            >
              +
            </motion.div>
          </div>

          {/* Right Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/40 rounded-xl p-4 text-center backdrop-blur-sm"
          >
            <div className="text-xs text-cyan-300/80 mb-2 font-semibold uppercase tracking-wide">YOU</div>
            <div className="text-sm text-white font-medium leading-tight">{rightBox}</div>
          </motion.div>
        </div>

        {/* Result Box (Below) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border-2 border-cyan-400/40 rounded-xl p-4 text-center backdrop-blur-sm relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-xs font-bold">=</span>
            </motion.div>
          </div>
          <div className="text-xs text-cyan-300/90 mb-2 font-semibold uppercase tracking-wide mt-2">THE RESULT</div>
          <div className="text-base text-white font-semibold leading-tight" style={{
            lineHeight: '1.5',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
          }}>{result}</div>
        </motion.div>
      </div>
    );
  };

  // Enhanced Sparkle Burst Component (for special moments)
  const SparkleBurst = ({ delay = 0, intensity = 'normal', color = 'cyan' }) => {
    const count = intensity === 'explosion' ? 24 : intensity === 'burst' ? 16 : 12;
    const size = intensity === 'explosion' ? 'text-3xl' : intensity === 'burst' ? 'text-2xl' : 'text-xl';
    const distance = intensity === 'explosion' ? 80 : intensity === 'burst' ? 60 : 50;
    
    const colorClasses = {
      cyan: 'text-cyan-400',
      purple: 'text-purple-400',
      gold: 'text-cyan-400', // Changed from yellow (brown on black)
      pink: 'text-pink-400',
      emerald: 'text-emerald-400'
    };

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {[...Array(count)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.5, 1.2, 0],
              x: Math.cos((i * 360 / count) * Math.PI / 180) * distance,
              y: Math.sin((i * 360 / count) * Math.PI / 180) * distance,
              rotate: [0, 360],
            }}
            transition={{
              delay: delay + (i * 0.03),
              duration: intensity === 'explosion' ? 1.2 : 0.9,
              ease: "easeOut"
            }}
            className={`absolute ${size} ${colorClasses[color] || colorClasses.cyan}`}
            style={{
              left: '50%',
              top: '50%',
              filter: 'drop-shadow(0 0 8px currentColor)'
            }}
          >
            ✨
          </motion.span>
        ))}
      </div>
    );
  };

  // Floating Sparkles Background (like landing page)
  const FloatingSparkles = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg text-cyan-400/30"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [null, (Math.random() - 0.5) * 100],
              x: [null, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    );
  };

  // Render individual card
  const renderCard = (card, index) => {
    const isRevealed = revealed[index] || false;
    const isCycleCard = card.interactive === 'tap-cycle-steps';
    const activeStep = activeCycleStep[index] ?? null;

    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(15, 15, 15, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)`,
          minHeight: '100%'
        }}
      >
        {/* Glassmorphism Background (landing page style) */}
        <div 
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, ${getGradientColors(card.accent).from}15, ${getGradientColors(card.accent).to}10)`
          }}
        />
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${getGradientColors(card.accent).from}, ${getGradientColors(card.accent).to})`
          }}
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Sparkles Background */}
        <FloatingSparkles />

        {/* Fixed ACT Header (locked at top - prevents overlap) */}
        {card.storyArc && (
          <div className="absolute top-12 sm:top-14 left-0 right-0 z-20 flex justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-2.5 sm:px-3 py-1 bg-black/50 backdrop-blur-xl border border-white/30 rounded-full shadow-lg"
            >
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-white/90 uppercase">
                {card.storyArc}
              </span>
            </motion.div>
          </div>
        )}

        {/* Card content - STANDARD SPACING (restored to original) */}
        <motion.div 
          className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-3 sm:space-y-4 pt-16 sm:pt-20 px-4 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

          {/* Sage's Avatar + Intro */}
          {card.sageIntro && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-full blur-lg animate-pulse" />
                <img 
                  src={sageDarkCircle} 
                  alt="Sage" 
                  className="relative w-12 h-12 rounded-full border-2 border-cyan-400/50"
                  style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
                />
              </div>
              <p className="text-sm text-cyan-300/90 font-medium italic text-left">
                {card.sageIntro}
              </p>
            </motion.div>
          )}

          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <motion.span 
              className="text-2xl sm:text-3xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              {card.icon}
            </motion.span>
            <span className="text-xs font-black tracking-widest text-white/70 uppercase">
              {card.badge}
            </span>
          </div>

          {/* Headline */}
          <motion.h2 
            className="text-2xl sm:text-3xl font-black leading-tight max-w-md mx-auto px-2"
            style={{ 
              color: '#fff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
              letterSpacing: '-0.01em',
              lineHeight: '1.2'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {card.headline}
          </motion.h2>

          {/* Summary */}
          {card.summary && (
            <p 
              className="text-sm sm:text-base leading-relaxed max-w-md mx-auto px-2"
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: '1.6',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
                fontWeight: 500
              }}
            >
              {card.summary}
            </p>
          )}

          {/* Metrics/Meters (Card 1 - Verdict) - COMPACT HORIZONTAL ROW (saves 60% space) */}
          {index === 0 && analysisData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full mt-3"
            >
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {/* Into You % */}
                {analysisData.actuallyIntoYou !== undefined && (
                  <div className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-1.5 sm:p-2">
                    <div className="text-[9px] sm:text-[10px] text-cyan-300/80 font-bold uppercase tracking-wide mb-1 text-center leading-tight">
                      Into You
                    </div>
                    <div className="text-sm sm:text-base font-black text-cyan-400 text-center mb-1">
                      {Math.round(analysisData.actuallyIntoYou)}%
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisData.actuallyIntoYou}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </div>
                )}

                {/* Wasting Time % */}
                {analysisData.wastingTime !== undefined && (
                  <div className="bg-white/8 backdrop-blur-xl border border-orange-400/30 rounded-lg p-1.5 sm:p-2">
                    <div className="text-[9px] sm:text-[10px] text-orange-300/80 font-bold uppercase tracking-wide mb-1 text-center leading-tight">
                      Wasting
                    </div>
                    <div className="text-sm sm:text-base font-black text-orange-400 text-center mb-1">
                      {Math.round(analysisData.wastingTime)}%
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <motion.div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisData.wastingTime}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                )}

                {/* Red Flags Count */}
                {analysisData.redFlags !== undefined && (
                  <div className="bg-white/8 backdrop-blur-xl border border-rose-400/30 rounded-lg p-1.5 sm:p-2">
                    <div className="text-[9px] sm:text-[10px] text-rose-300/80 font-bold uppercase tracking-wide mb-1 text-center leading-tight">
                      Red Flags
                    </div>
                    <div className="text-base sm:text-lg font-black text-rose-400 text-center mb-0.5">
                      {analysisData.redFlags}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-white/60 text-center leading-tight">
                      {analysisData.redFlags <= 2 ? 'Low' : analysisData.redFlags <= 4 ? 'Mod' : 'High'}
                    </div>
                  </div>
                )}

                {/* Confidence Score */}
                {analysisData.confidenceScore !== undefined && (
                  <div className="bg-white/8 backdrop-blur-xl border border-purple-400/30 rounded-lg p-1.5 sm:p-2">
                    <div className="text-[9px] sm:text-[10px] text-purple-300/80 font-bold uppercase tracking-wide mb-1 text-center leading-tight">
                      Confidence
                    </div>
                    <div className="text-sm sm:text-base font-black text-purple-400 text-center mb-1">
                      {Math.round(analysisData.confidenceScore)}%
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisData.confidenceScore}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Visual Equation for Card 2 (Physics) */}
          {index === 1 && card.hasVisualEquation && card.equationData && (
            <VisualEquation
              leftBox={card.equationData.leftBox}
              rightBox={card.equationData.rightBox}
              result={card.equationData.result}
              arcColor="from-purple-400 to-pink-400"
            />
          )}

          {/* Visual Equation for Card 3 (Pattern DNA) */}
          {index === 2 && card.hasPatternEquation && card.patternEquation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-md mx-auto my-6"
            >
              <div className="bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 border-2 border-purple-400/40 rounded-xl p-6 text-center backdrop-blur-sm relative">
                    <div className="text-xs sm:text-sm text-purple-300/90 mb-3 font-black uppercase tracking-widest">THE EQUATION</div>
                    <div className="text-base sm:text-lg text-white font-black leading-tight" style={{
                      textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
                      lineHeight: '1.4'
                    }}>{card.patternEquation}</div>
              </div>
            </motion.div>
          )}

          {/* Body content - STANDARDIZED TYPOGRAPHY */}
          {card.body && card.body.length > 0 && index !== 2 && (
            <div className="space-y-3 w-full max-w-md mx-auto px-2">
              {card.body.map((item, i) => (
                <p 
                  key={i} 
                  className="text-sm sm:text-base leading-relaxed"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.65',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
                    fontWeight: 400
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
          )}

          {/* SPECIAL MOMENT: Card 1 - Tap to Reveal Receipt (Sparkle Explosion) */}
          {index === 0 && card.receipt && card.receipt.quote && (
            <div className="w-full mt-3 mb-3">
              {!card1ReceiptRevealed ? (
                <motion.button
                  onClick={() => {
                    setCard1ReceiptRevealed(true);
                    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
                  }}
                  className="w-full relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-cyan-400/40 rounded-xl py-2.5 px-4 relative overflow-hidden"
                  >
                    {/* Pulsing glow - CYAN/PURPLE (no brown!) */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 to-purple-400/15"
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="text-xl sm:text-2xl"
                      >
                        💥
                      </motion.div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-cyan-300/90 uppercase tracking-wide">
                          👆 Tap to reveal
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <SparkleBurst delay={0} intensity="explosion" color="cyan" />
                  
                  {/* Message Bubble (Glassmorphism) */}
                  <div className="bg-white/8 backdrop-blur-xl border border-white/20 rounded-2xl rounded-tl-sm p-4 shadow-xl shadow-cyan-500/10">
                    <div className="text-xs sm:text-sm text-cyan-400/90 mb-2 uppercase tracking-wide font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Their message:
                    </div>
                    <p className="text-white/95 text-sm sm:text-base leading-relaxed italic" style={{
                      lineHeight: '1.65',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                    }}>
                      "{card.receipt.quote}"
                    </p>
                  </div>
                  
                  {/* Sage's Analysis (Enhanced) */}
                  {card.receipt.bestieLook && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <motion.img 
                          src={sageDarkCircle} 
                          alt="Sage" 
                          className="w-6 h-6 rounded-full border-2 border-cyan-400/60"
                          animate={{ 
                            boxShadow: [
                              '0 0 10px rgba(34, 211, 238, 0.4)',
                              '0 0 20px rgba(34, 211, 238, 0.6)',
                              '0 0 10px rgba(34, 211, 238, 0.4)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs sm:text-sm text-cyan-300 font-bold">Sage sees:</span>
                      </div>
                      <p className="text-sm sm:text-base text-white/95 leading-relaxed text-left" style={{
                        lineHeight: '1.65',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                      }}>
                        {card.receipt.bestieLook}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Special: Card 1 - Verdict with chips - COMPACT (show max 3-4) */}
          {index === 0 && card.isVerdict && card.chips && card.chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mt-3 max-w-md">
              {card.chips.slice(0, 4).map((chip, i) => (
                <span 
                  key={i}
                  className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/30 text-white/90"
                  style={{
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {chip.length > 15 ? `${chip.substring(0, 15)}...` : chip}
                </span>
              ))}
            </div>
          )}

          {/* SPECIAL MOMENT: Card 2 - Choose Your Perspective */}
          {index === 1 && card.hasVisualEquation && card.equationData && (
            <div className="w-full mt-6 space-y-4">
              {!card2Perspective ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-sm sm:text-base text-purple-300/90 font-bold mb-4 text-center">
                    👆 Choose your perspective:
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { key: 'them', label: 'THEY', emoji: '👤', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/40' },
                      { key: 'you', label: 'YOU', emoji: '💫', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/40' },
                      { key: 'both', label: 'BOTH', emoji: '⚡', color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-400/40' }
                    ].map((option) => (
                      <motion.button
                        key={option.key}
                        onClick={() => {
                          setCard2Perspective(option.key);
                          if ('vibrate' in navigator) navigator.vibrate(15);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 sm:p-4 rounded-xl border-2 ${option.border} bg-gradient-to-br ${option.color} backdrop-blur-sm cursor-pointer`}
                      >
                        <div className="text-xl sm:text-2xl mb-1">{option.emoji}</div>
                        <div className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                          {option.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                  className="relative"
                >
                  <SparkleBurst delay={0} intensity="burst" color="purple" />
                  <VisualEquation
                    leftBox={card.equationData.leftBox}
                    rightBox={card.equationData.rightBox}
                    result={card.equationData.result}
                    arcColor="from-purple-400 to-pink-400"
                  />
                  
                  {/* Sage's Take (Tap to reveal) */}
                  {card.footer && (
                    <motion.div
                      onClick={() => {
                        setRevealed({ ...revealed, [index]: !isRevealed });
                        if ('vibrate' in navigator) navigator.vibrate(20);
                      }}
                      className="mt-4 cursor-pointer relative"
                    >
                      {!isRevealed ? (
                        <motion.div
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-sm sm:text-base text-purple-300/90 font-semibold flex items-center justify-center gap-2 p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-400/30"
                        >
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          Tap for Sage's take
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 sm:p-5 rounded-xl bg-purple-500/20 backdrop-blur-xl border border-purple-400/40"
                        >
                          <SparkleBurst delay={0} intensity="normal" color="purple" />
                          <p className="text-sm sm:text-base text-white/95 leading-relaxed relative z-10" style={{
                            lineHeight: '1.65',
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                          }}>
                            {card.footer}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}


          {/* SPECIAL MOMENT: Card 4 - Crystal Ball Prediction */}
          {index === 3 && (
            <div className="w-full mt-6 space-y-4">
              {!card4PredictionRevealed ? (
                <motion.button
                  onClick={() => {
                    setCard4PredictionRevealed(true);
                    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
                  }}
                  className="w-full relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="bg-gradient-to-br from-indigo-500/30 via-blue-500/30 to-cyan-500/30 backdrop-blur-xl border-2 border-indigo-400/50 rounded-2xl p-8 relative overflow-hidden"
                  >
                    {/* Crystal ball glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-blue-400/20 to-cyan-400/20"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl"
                      >
                        🔮
                      </motion.div>
                      <div className="text-center">
                        <p className="text-sm sm:text-base font-bold text-indigo-300/90 mb-1 uppercase tracking-wide">
                          👆 Tap to see Sage's prediction
                        </p>
                        <p className="text-xs sm:text-sm text-white/70 italic">
                          What happens next...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                  className="relative space-y-4"
                >
                  <SparkleBurst delay={0} intensity="burst" color="cyan" />
                  
                  {card.next48h && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-white/8 backdrop-blur-xl border border-indigo-400/40 rounded-xl shadow-lg shadow-indigo-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <motion.span 
                          className="text-lg"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          📅
                        </motion.span>
                        <span className="text-xs sm:text-sm font-bold text-indigo-300 uppercase tracking-wide">Next 48 Hours</span>
                      </div>
                      <p className="text-sm sm:text-base text-white/95 leading-relaxed text-left" style={{
                        lineHeight: '1.65',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                      }}>{card.next48h}</p>
                    </motion.div>
                  )}
                  {card.nextWeek && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-white/8 backdrop-blur-xl border border-blue-400/40 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <motion.span 
                          className="text-lg"
                          animate={{ rotate: [0, -360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          📆
                        </motion.span>
                        <span className="text-xs sm:text-sm font-bold text-blue-300 uppercase tracking-wide">Next Week</span>
                      </div>
                      <p className="text-sm sm:text-base text-white/95 leading-relaxed text-left" style={{
                        lineHeight: '1.65',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                      }}>{card.nextWeek}</p>
                    </motion.div>
                  )}
                  {card.immunityTest && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="p-5 bg-gradient-to-br from-cyan-500/30 via-blue-500/30 to-purple-500/30 backdrop-blur-xl border-2 border-cyan-400/50 relative overflow-hidden shadow-xl shadow-cyan-500/30"
                    >
                      <motion.div
                        className="absolute top-2 right-2 text-3xl opacity-30"
                        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        🧪
                      </motion.div>
                      <div className="flex items-center gap-2 mb-3 relative z-10">
                        <span className="text-xl">🧪</span>
                        <span className="text-sm sm:text-base font-bold text-cyan-300 uppercase tracking-wide">Try This Test</span>
                      </div>
                      <p className="text-sm sm:text-base text-white/95 leading-relaxed text-left relative z-10 font-medium">
                        {card.immunityTest}
                      </p>
                      <motion.p 
                        className="text-xs sm:text-sm text-cyan-300/90 mt-3 italic relative z-10 flex items-center gap-1 font-semibold"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span>📸</span>
                        Screenshot this - you'll need it when you're proven right.
                      </motion.p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* SPECIAL MOMENT: Card 3 - Enhanced Pattern with Circular Flow */}
          {isCycleCard && (
            <div className="w-full mt-6 space-y-4">
              {/* Pattern DNA Equation (Enhanced) */}
              {card.hasPatternEquation && card.patternEquation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative"
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(167, 139, 250, 0.3)',
                        '0 0 40px rgba(167, 139, 250, 0.5)',
                        '0 0 20px rgba(167, 139, 250, 0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-gradient-to-br from-violet-500/30 via-purple-500/30 to-fuchsia-500/30 backdrop-blur-xl border-2 border-purple-400/50 rounded-xl p-5 text-center relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute top-2 right-2 text-2xl opacity-30"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      🔄
                    </motion.div>
                    <div className="text-xs sm:text-sm text-purple-300/90 mb-3 font-black uppercase tracking-widest relative z-10">
                      THE EQUATION
                    </div>
                    <motion.div 
                      className="text-base sm:text-lg text-white font-black leading-tight relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{
                        textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
                        lineHeight: '1.4'
                      }}
                    >
                      {card.patternEquation}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              <p className="text-xs sm:text-sm text-purple-300/80 text-center mb-4 font-bold">
                👆 Tap each step to see it play out
              </p>

              {/* Circular Flow Pattern */}
              <div className="relative flex items-center justify-center py-4">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {card.body.slice(0, 4).map((step, i) => {
                    const isRevealed = card3StepsRevealed.has(i);
                    return (
                      <React.Fragment key={i}>
                        <motion.button
                          onClick={() => {
                            const newRevealed = new Set(card3StepsRevealed);
                            if (isRevealed) {
                              newRevealed.delete(i);
                              setActiveCycleStep({
                                ...activeCycleStep,
                                [index]: null
                              });
                            } else {
                              newRevealed.add(i);
                              setActiveCycleStep({
                                ...activeCycleStep,
                                [index]: i
                              });
                            }
                            setCard3StepsRevealed(newRevealed);
                            if ('vibrate' in navigator) navigator.vibrate(15);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-xl min-w-[100px] sm:min-w-[120px] ${
                            isRevealed
                              ? 'border-cyan-400 bg-cyan-400/20 scale-105 shadow-lg shadow-cyan-500/30'
                              : 'border-white/20 bg-white/5'
                          }`}
                        >
                          {/* Number badge */}
                          <div className={`absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-black ${
                            isRevealed
                              ? 'bg-cyan-400 text-white'
                              : 'bg-white/20 text-white/60'
                          }`}>
                            {i + 1}
                          </div>
                          {isRevealed && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute top-1 right-1 text-sm sm:text-base"
                            >
                              ✨
                            </motion.div>
                          )}
                          <div className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                            isRevealed ? 'text-white' : 'text-white/70'
                          }`} style={{
                            textShadow: isRevealed ? '0 1px 3px rgba(0, 0, 0, 0.4)' : 'none'
                          }}>
                            {step.length > 25 ? `${step.substring(0, 25)}...` : step}
                          </div>
                        </motion.button>
                        {/* Arrow connector (except last) */}
                        {i < 3 && (
                          <motion.span 
                            className={`text-xl ${
                              card3StepsRevealed.has(i) ? 'text-cyan-400/80' : 'text-white/20'
                            }`}
                            animate={card3StepsRevealed.has(i) ? { opacity: [0.6, 1, 0.6] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Immunity Training Reveal */}
              {activeStep !== null && card.immunityTraining && card.immunityTraining[activeStep] && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring" }}
                  className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 backdrop-blur-xl border border-purple-400/40 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute top-2 right-2 text-xl opacity-30"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    🛡️
                  </motion.div>
                  <div className="text-xs sm:text-sm text-purple-300/90 mb-2 font-bold relative z-10 uppercase tracking-wide">If this happens:</div>
                  <div className="text-sm sm:text-base text-white/95 leading-relaxed relative z-10" style={{
                    lineHeight: '1.65',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                  }}>
                    {card.immunityTraining[activeStep]}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Special: Card 5 - Your Moves as Actionable Checklist */}
          {index === 4 && card.allYourMoves && card.allYourMoves.length > 0 && (
            <div className="w-full mt-6 space-y-3 sm:space-y-4">
              <div className="text-xs sm:text-sm text-white/80 mb-3 uppercase tracking-wide font-bold">💪 Your Move:</div>
              {card.allYourMoves.map((move, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-400/20 backdrop-blur-sm"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-purple-400/30 to-cyan-400/30 border border-purple-400/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs sm:text-sm font-black text-white">{i + 1}</span>
                  </div>
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed flex-1 text-left" style={{
                    lineHeight: '1.65',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                  }}>{move}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Immunity Training Rules (Card 5) */}
          {index === 4 && card.immunityTraining && card.immunityTraining.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full mt-6"
            >
              <div className="text-xs sm:text-sm text-white/80 mb-3 uppercase tracking-wide flex items-center gap-2 font-bold">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span>🛡️ Immunity Rules:</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {card.immunityTraining.slice(0, 3).map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (i * 0.1) }}
                    className="p-3 sm:p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-400/20 text-left backdrop-blur-sm"
                  >
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed" style={{
                      lineHeight: '1.65',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                    }}>{rule}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sage's Seal (Card 5) */}
          {index === 4 && card.footer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 p-5 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border-2 border-cyan-400/40 relative overflow-hidden shadow-xl shadow-cyan-500/20"
            >
              <div className="absolute top-2 right-2 text-2xl opacity-20">👑</div>
              <div className="relative z-10">
                <div className="text-xs text-cyan-300/90 mb-2 font-bold uppercase tracking-widest">👑 Sage's Seal</div>
                <p className="text-base sm:text-lg text-white font-semibold leading-relaxed italic" style={{
                  background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  "{card.footer}"
                </p>
              </div>
            </motion.div>
          )}

          {/* SPECIAL MOMENT: Card 5 - Unlock Your Power */}
          {index === 4 && card.interactive === 'end-reveal' && (
            <div className="mt-6 w-full space-y-4">
              {!card5PowerUnlocked ? (
                <motion.button
                  onClick={() => {
                    setCard5PowerUnlocked(true);
                    if ('vibrate' in navigator) navigator.vibrate([50, 100, 50, 100, 50]);
                  }}
                  className="w-full py-5 px-6 rounded-xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-rose-500/30 backdrop-blur-xl border-2 border-purple-400/50 text-white/90 font-bold relative overflow-hidden shadow-xl shadow-purple-500/30"
                  animate={{ 
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.03, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                      <span className="text-sm sm:text-base font-semibold">{card.curiosityHook}</span>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <SparkleBurst delay={0} intensity="explosion" color="cyan" />
                  
                  {!endRevealed ? (
                    <motion.button
                      onClick={() => {
                        setEndRevealed(true);
                        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
                      }}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-br from-purple-500/30 via-cyan-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-400/50 text-white/90 font-medium relative overflow-hidden shadow-lg"
                      animate={{ 
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <span className="text-sm sm:text-base font-semibold">✨ Tap for your final insight</span>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring" }}
                      className="relative"
                    >
                      <SparkleBurst delay={0} intensity="burst" color="purple" />
                      <div className="space-y-4 mt-4 p-6 rounded-xl bg-gradient-to-br from-purple-500/30 via-cyan-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-400/50 shadow-xl relative overflow-hidden">
                        <motion.div
                          className="absolute top-2 right-2 text-3xl opacity-30"
                          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          ✨
                        </motion.div>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-sm sm:text-base text-cyan-300 font-bold relative z-10"
                          style={{
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                          }}
                        >
                          ✨ 82% of people in this pattern said this changed everything
                        </motion.p>
                        {card.blessing && (
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-sm sm:text-base text-white/95 leading-relaxed relative z-10"
                            style={{
                              lineHeight: '1.65',
                              textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                            }}
                          >
                            {card.blessing}
                          </motion.p>
                        )}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="pt-4 border-t border-white/20 relative z-10"
                        >
                          <p className="text-xs sm:text-sm text-white/80 italic">
                            Swipe → to complete your story
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Curiosity Hook (replaces footer for story flow) - STANDARDIZED */}
          {card.curiosityHook && index < TOTAL_CARDS - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ 
                delay: 1,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mt-6 sm:mt-8 flex items-center gap-2 text-xs sm:text-sm text-cyan-300/90 font-semibold"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{card.curiosityHook}</span>
            </motion.div>
          )}

          {/* Footer (only for last card or special cases) - STANDARDIZED */}
          {card.footer && index !== 1 && !card.curiosityHook && (
            <p className="text-xs sm:text-sm text-white/70 italic mt-4 sm:mt-5" style={{
              lineHeight: '1.6',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
            }}>
              {card.footer}
            </p>
          )}
        </motion.div>

        {/* Mobile Swipe Arrows (bottom of card - positioned relative to card container) */}
        {/* Left Arrow - Bottom Left */}
        {index > 0 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="md:hidden absolute bottom-4 left-4 z-30 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 hover:bg-black/70 transition-all shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
          </motion.button>
        )}

        {/* Right Arrow - Bottom Right */}
        {index < TOTAL_CARDS - 1 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="md:hidden absolute bottom-4 right-4 z-30 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 hover:bg-black/70 transition-all shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative w-full max-w-md mx-auto"
      style={{
        aspectRatio: '9/16',
        maxHeight: '90vh'
      }}
    >
      {/* Styled Number Progress Indicator (replaces dots) */}
      <div className="absolute top-4 left-0 right-0 z-30 flex justify-center gap-3 px-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className={`relative flex items-center justify-center transition-all ${
              i === currentCard 
                ? 'scale-110' 
                : i < currentCard
                ? 'opacity-60'
                : 'opacity-40'
            }`}
            animate={{
              scale: i === currentCard ? [1, 1.15, 1] : 1
            }}
            transition={{ 
              duration: 0.3,
              scale: { duration: 2, repeat: Infinity, repeatDelay: 1 }
            }}
          >
            {/* Number Badge */}
            <div className={`relative w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
              i === currentCard
                ? 'bg-gradient-to-br from-cyan-400 to-purple-400 text-white shadow-lg shadow-cyan-400/50 border-2 border-cyan-300/50'
                : i < currentCard
                ? 'bg-gradient-to-br from-cyan-400/60 to-purple-400/60 text-white/90 border-2 border-cyan-400/30'
                : 'bg-white/10 text-white/50 border-2 border-white/20'
            }`}>
              {i + 1}
              {i === currentCard && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            {/* Connector line (except last) */}
            {i < cards.length - 1 && (
              <div className={`absolute left-full w-6 h-0.5 ${
                i < currentCard
                  ? 'bg-gradient-to-r from-cyan-400/60 to-purple-400/60'
                  : 'bg-white/20'
              }`} style={{ marginLeft: '4px' }} />
            )}
          </motion.div>
        ))}
      </div>


      {/* Swipable track container */}
      <div 
        className="relative w-full h-full overflow-hidden rounded-2xl"
        style={{ 
          touchAction: 'pan-x',
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Track (700% width, contains all cards) */}
        <motion.div
          className="flex h-full"
          style={{ width: `${TRACK_WIDTH_PERCENT}%` }}
          animate={{ x: `-${currentCard * CARD_WIDTH_PERCENT}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ 
            left: `-${(TOTAL_CARDS - 1) * CARD_WIDTH_PERCENT}%`,
            right: 0 
          }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={(e, info) => {
            const threshold = 50;
            const velocity = info.velocity.x;
            
            // Use velocity for better swipe detection
            if (velocity > 500 || info.offset.x > threshold) {
              if (currentCard > 0) goToPrevious();
            } else if (velocity < -500 || info.offset.x < -threshold) {
              if (currentCard < TOTAL_CARDS - 1) goToNext();
            }
          }}
        >
          {/* Each card (14.2857% of track = 100% of viewport) */}
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full"
              style={{ width: `${CARD_WIDTH_PERCENT}%` }}
            >
              {renderCard(card, index)}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows (desktop only) */}
      <div className="hidden md:flex absolute inset-y-0 left-0 right-0 pointer-events-none z-10">
        {currentCard > 0 && !showCompletion && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {currentCard < TOTAL_CARDS - 1 && !showCompletion && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Completion Screen with Shareable Summary */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md text-center space-y-6"
            >
              {/* Completion Message */}
              <div className="space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl font-black text-white mb-2">
                  You've unlocked the complete story
                </h2>
                <p className="text-lg text-white/70">
                  Share your insights with friends
                </p>
              </div>

              {/* Shareable Summary Card (Hidden, for export) */}
              <div id="story-arc-summary-card" className="hidden">
                <StoryArcSummaryCard 
                  deepDive={safeDeepDive}
                  immunityData={safeImmunity}
                  analysisData={analysisData}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => captureById('story-arc-summary-card', 'Sage-Story-Arc', true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  Share Story
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => captureById('story-arc-summary-card', 'Sage-Story-Arc', false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl"
                >
                  <Download className="w-5 h-5" />
                  Save
                </motion.button>
              </div>

              {/* Back to cards */}
              <button
                onClick={() => {
                  setShowCompletion(false);
                  setCurrentCard(0);
                }}
                className="text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                ← Back to story
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Shareable Summary Card Component (Truth Receipt format)
const StoryArcSummaryCard = ({ deepDive, immunityData, analysisData }) => {
  return (
    <div 
      className="w-[1080px] h-[1920px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col items-center justify-center p-12 text-white relative overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
      
      {/* Sage Logo */}
      <div className="relative z-10 mb-8">
        <img 
          src={sageDarkCircle} 
          alt="Sage" 
          className="w-32 h-32 rounded-full border-4 border-cyan-400/50"
          style={{ boxShadow: '0 0 40px rgba(34, 211, 238, 0.4)' }}
        />
      </div>

      {/* Title */}
      <h1 className="text-6xl font-black mb-4 text-center relative z-10">
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          THE COMPLETE STORY
        </span>
      </h1>

      {/* Verdict */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-4xl font-bold mb-3 text-white">
          {deepDive.verdict?.act || analysisData?.archetype || 'The Pattern'}
        </h2>
        <p className="text-2xl text-white/80 leading-relaxed max-w-2xl">
          {deepDive.verdict?.subtext || ''}
        </p>
      </div>

      {/* Key Insights */}
      <div className="w-full max-w-3xl space-y-4 mb-8 relative z-10">
        {deepDive.physics?.you_bring && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xl text-white/90">
              <span className="font-bold text-cyan-400">You bring:</span> {deepDive.physics.you_bring}
            </p>
          </div>
        )}
        {deepDive.physics?.they_exploit && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xl text-white/90">
              <span className="font-bold text-purple-400">They exploit:</span> {deepDive.physics.they_exploit}
            </p>
          </div>
        )}
        {immunityData?.patternDNA && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xl text-white/90">
              <span className="font-bold text-pink-400">Pattern:</span> {immunityData.patternDNA}
            </p>
          </div>
        )}
      </div>

      {/* Action Plan */}
      {Array.isArray(deepDive.playbook?.your_move) && deepDive.playbook.your_move.length > 0 && (
        <div className="w-full max-w-3xl mb-8 relative z-10">
          <h3 className="text-3xl font-bold mb-4 text-center text-cyan-400">YOUR POWER</h3>
          <div className="space-y-3">
            {deepDive.playbook.your_move.map((action, i) => (
              <div key={i} className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl p-4 border border-purple-400/30">
                <p className="text-xl text-white/90">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sage's Seal */}
      {deepDive.sages_seal && (
        <div className="text-center mt-8 relative z-10">
          <p className="text-2xl text-white/60 italic">{deepDive.sages_seal}</p>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-lg text-white/40">getthereceipts.com</p>
      </div>
    </div>
  );
};

export default SwipableStoryArc;

