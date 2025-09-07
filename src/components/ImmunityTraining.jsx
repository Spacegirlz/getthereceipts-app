import React, { memo, useMemo } from 'react';
import { Shield, AlertTriangle, Zap, Eye, LogOut, Crown, CheckCircle, Calendar, Target, TrendingUp, Clock, Mic, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast';

const ImmunityTraining = memo(({ immunityData, archetypeName = "The Gaslighter" }) => {
  const { toast } = useToast();
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ ImmunityTraining received:', immunityData);
      console.log('🛡️ Type:', typeof immunityData, 'Keys:', immunityData ? Object.keys(immunityData) : 'none');
    }
  }, [immunityData]);

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

  const handleShareTrophy = async () => {
    try {
      const element = document.querySelector('[data-immunity-component]');
      const shareText = `🛡️ Just completed my SAGE Immunity Training! Now I'm protected against ${archetypeName} tactics. Get your own protection at getthereceipts.com #GetTheReceipts #ImmunityTraining #SageSays`;
      
      if (element && navigator.share) {
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
          
          if (blob) {
            const file = new File([blob], `sages-immunity-${Date.now()}.png`, { type: 'image/png' });
            try {
              await navigator.share({
                title: 'SAGE Immunity Training Complete',
                text: shareText,
                url: 'https://getthereceipts.com',
                files: [file]
              });
            } catch (shareError) {
              // Fallback to text-only share
              await navigator.share({
                title: 'SAGE Immunity Training Complete',
                text: shareText,
                url: 'https://getthereceipts.com'
              });
            }
          }
        } catch (error) {
          copyToClipboard(shareText);
        }
      } else {
        copyToClipboard(shareText);
      }
    } catch (error) {
      console.log('Error in share function:', error);
      const shareText = `🛡️ Just completed my SAGE Immunity Training! Now I'm protected against ${archetypeName} tactics. Get your own protection at getthereceipts.com #GetTheReceipts #ImmunityTraining #SageSays`;
      copyToClipboard(shareText);
    }
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
  
  if (!immunityData || typeof immunityData !== 'object') {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-400/20 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-4">
          <span className="text-2xl">🏗️</span>
        </div>
        <h3 className="text-emerald-300 font-bold text-lg mb-2">Your Immunity Training is Being Crafted</h3>
        <p className="text-stone-300 text-xl leading-relaxed">Sage is preparing your personalized protection strategies. This premium feature will be available soon.</p>
      </div>
    );
  }

  // Extract new schema data with fallbacks
  const {
    redFlagDrills,
    patternBreakers,
    immunityShield,
    earlyWarnings,
    exitStrategy,
    riskLevel = 'medium',
    whatGoodLooksLike = [],
    menuOfMoves = [],
    twoWeekExperiment = {},
    selfCheck = [],
    safetyNote
  } = immunityData;

  // Dynamic flags from immunity data or risk level fallback
  const getFlagsForRiskLevel = (level, immunityFlags) => {
    // If immunity data provides flags, use those
    if (immunityFlags && Array.isArray(immunityFlags) && immunityFlags.length > 0) {
      return immunityFlags;
    }
    
    // Fallback to risk level patterns only if no immunity data
    if (level === 'high') {
      return [
        { type: 'red', text: 'Pattern override detected' },
        { type: 'red', text: 'Deflection activated' },
        { type: 'red', text: 'Confusion protocol engaged' }
      ];
    } else if (level === 'low') {
      return [
        { type: 'green', text: 'Consistent behavior' },
        { type: 'green', text: 'Clear communication' },
        { type: 'green', text: 'Reliable follow-through' }
      ];
    } else {
      return [
        { type: 'red', text: 'Mixed signals detected' },
        { type: 'green', text: 'Some positive signs' },
        { type: 'red', text: 'Clarity needed' }
      ];
    }
  };

  // Get dynamic archetype header based on risk level
  const getArchetypeHeader = (level, archetype) => {
    let baseArchetype = archetype.replace(/^The /, '').replace(/ [🎭🎮👻💣🏃🍞🥶💎🔮⚡]+$/, '');
    
    // Special handling for healthy archetypes
    if (baseArchetype.includes('Champion') || baseArchetype.includes('Keeper')) {
      baseArchetype = baseArchetype.replace(/Green Flag |Champion|Keeper/g, '').trim();
      if (!baseArchetype) baseArchetype = 'Partner';
    }
    
    if (level === 'high') {
      // Red flags - warning message
      return `Never Date Another ${baseArchetype}`;
    } else if (level === 'low') {
      // Green flags - celebration message  
      return `You Found a Keeper`;
    } else {
      // Medium/mixed - neutral observation
      return `Understanding Your ${baseArchetype}`;
    }
  };

  // Get dynamic tea play script from immunity data or minimal fallback
  const getTeaPlayForRiskLevel = (level, immunityScript) => {
    // Prioritize immunity data script
    if (immunityScript && Array.isArray(immunityScript) && immunityScript.length > 0) {
      return immunityScript;
    }
    
    // Minimal fallback only if no immunity data available
    return null; // Return null to hide section entirely if no dynamic content
  };

  // Helper to ensure array format
  const ensureArray = (data, fallback) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return [data];
    return fallback;
  };

  // Generate dynamic immunity training based on actual archetype analysis
  const generateDynamicImmunity = (archetype, riskLevel) => {
    const archetypeClean = archetype?.replace(/^The /, '').replace(/ [🎭🎮👻💣🏃🍞🥶💎🔮⚡😤]+$/, '') || 'Unknown Pattern';
    
    // Archetype-specific immunity strategies
    const archetypeStrategies = {
      'Future Faker': {
        patternLoop: ["Promise", "Delay", "Excuse", "Repeat"],
        decoder: `The Future Faker operates on hope. They dangle possibilities like "next week" or "soon" but never deliver concrete plans. They've mastered making you feel like you're always one step away from something real.`,
        healthySigns: [
          "When they actually need something from you",
          "Brief moments of seemingly genuine interest", 
          "Occasional follow-through on tiny things"
        ],
        sketchySigns: [
          "Big plans never materialize into calendar events",
          "Time-sensitive requests from them get immediate attention",
          "Your time is always negotiable, theirs never is"
        ],
        immunityTest: "Say: 'Let's lock in Saturday at 7pm. If that doesn't work, no worries - we can try again in a few weeks when you're less busy.' Watch them suddenly become available.",
        realTalk: [
          "Future Fakers aren't confused about time - they're clear about priorities.",
          "You're not on their calendar because you're on their back burner.",
          "Every reschedule is them saying 'you'll wait, right?'",
          "The 'next time' that never comes? That's the whole relationship."
        ],
        blessing: "Someone who wants to see you makes it happen. Someone who doesn't makes excuses. The math is that simple, bestie."
      },
      'Gaslighter': {
        patternLoop: ["Confuse", "Deny", "Blame", "Reset"],
        decoder: `The Gaslighter weaponizes your memory against you. They rewrite history in real time, making you question your own experiences. Your clarity becomes their biggest threat.`,
        healthySigns: [
          "Rare moments when they admit fault",
          "Times when they seem genuinely confused (not manipulative)",
          "Brief periods of consistent behavior"
        ],
        sketchySigns: [
          "Stories shift when you ask for specifics",
          "Your memory is always the problem",
          "They remember details that benefit them perfectly"
        ],
        immunityTest: "Keep voice memos of important conversations. When they deny saying something, play it back. Watch them either admit it or attack your 'obsession' with proof.",
        realTalk: [
          "Gaslighters don't forget - they reframe.",
          "Your sanity isn't up for debate, bestie.",
          "If you need receipts for basic respect, that's the red flag.",
          "Stop apologizing for having a functioning memory."
        ],
        blessing: "Trust your gut, document the patterns, and remember: confusion isn't chemistry - it's control."
      },
      'Breadcrumber': {
        patternLoop: ["Crumb", "Silence", "Mini-Panic", "Repeat"],
        decoder: `The Breadcrumber gives just enough attention to keep you interested, never enough to feel secure. They've perfected the art of minimum viable effort.`,
        healthySigns: [
          "Responds quickly when they want something",
          "Brief bursts of consistent communication",
          "Occasional genuine moments of connection"
        ],
        sketchySigns: [
          "Days of silence followed by 'hey stranger'",
          "Never initiates meaningful conversations",
          "Always leaves you wanting more (by design)"
        ],
        immunityTest: "Stop reaching out first for one week. Count how many times they initiate contact. That number is their actual interest level.",
        realTalk: [
          "Breadcrumbers aren't busy - they're strategic.",
          "Mixed signals aren't confusion - they're intentional.",
          "You're not hard to love - you're being love-bombed and withdrawn from.",
          "Consistency isn't asking for too much - it's the bare minimum."
        ],
        blessing: "You deserve someone who's excited to talk to you, not someone who treats your attention like a subscription service."
      },
      'Ghoster': {
        patternLoop: ["Connect", "Vanish", "Reappear", "Excuse"],
        decoder: `The Ghoster treats your connection like a light switch - on when convenient, off without warning. They've mastered the art of selective availability.`,
        healthySigns: [
          "When they reappear, they seem genuinely apologetic",
          "Brief periods of consistent presence",
          "Moments when they seem actually present"
        ],
        sketchySigns: [
          "Disappears during important conversations",
          "Always has elaborate excuses for vanishing",
          "Active on social media while 'too busy' for you"
        ],
        immunityTest: "Next time they reappear, say: 'I need consistency to feel safe. Are you able to provide that?' Their response tells you everything.",
        realTalk: [
          "Ghosters don't forget to text back - they choose not to.",
          "Being 'bad at texting' isn't a personality trait - it's a choice.",
          "You're not asking for too much - you're asking the wrong person.",
          "Availability isn't about being busy - it's about priorities."
        ],
        blessing: "Someone who wants to be in your life shows up consistently. Ghost them back by choosing yourself."
      },
      'Hot & Cold': {
        patternLoop: ["Chase", "Distance", "Panic", "Reset"],
        decoder: `The Hot & Cold type keeps you in emotional whiplash. One day you're their everything, the next you barely exist. They've weaponized inconsistency.`,
        healthySigns: [
          "During 'hot' phases, they seem genuinely invested",
          "Occasionally acknowledges their pattern",
          "Brief moments of emotional stability"
        ],
        sketchySigns: [
          "Temperature changes happen without explanation",
          "You're always guessing where you stand",
          "Their energy dictates your entire mood"
        ],
        immunityTest: "Stop matching their energy. Stay consistent regardless of their temperature. Watch them either stabilize or show their true colors.",
        realTalk: [
          "Hot and cold isn't mysterious - it's exhausting.",
          "You're not a thermostat - stop adjusting to their temperature.",
          "Emotional whiplash isn't chemistry - it's trauma bonding.",
          "Your peace shouldn't depend on their mood."
        ],
        blessing: "You deserve someone whose love feels like a steady fire, not a flickering flame in the wind."
      }
    };
    
    // Get strategy or create dynamic one
    const strategy = archetypeStrategies[archetypeClean] || {
      patternLoop: ["Hook", "Test", "Push", "Reset"],
      decoder: `${archetypeClean} patterns exploit your positive qualities. They target people who value genuine connection and turn it against them.`,
      healthySigns: [],
      sketchySigns: [], 
      immunityTest: null,
      realTalk: null,
      blessing: `${archetypeClean} patterns can't fool someone who knows their worth. Trust your instincts and protect your energy.`
    };
    
    return strategy;
  };
  
  // Determine risk level based on archetype
  const actualRiskLevel = archetypeName?.includes('Healthy Partner') || 
                         archetypeName?.includes('Green Flag') ||
                         archetypeName?.toLowerCase().includes('healthy') 
                         ? 'low' : riskLevel;
  
  // Get dynamic immunity content
  const immunity = generateDynamicImmunity(archetypeName, actualRiskLevel);
  
  // Dynamic data with powerful archetype-specific content
  const displayData = {
    patternLoop: ensureArray(immunityData?.patternLoop, immunity.patternLoop),
    flags: ensureArray(immunityData?.flags, getFlagsForRiskLevel(actualRiskLevel, immunityData?.flags)),
    whyItHooks: immunityData?.whyItHooks || immunity.decoder,
    healthySigns: ensureArray(immunityData?.healthySigns, 
      whatGoodLooksLike.length > 0 ? whatGoodLooksLike : immunity.healthySigns
    ),
    sketchySigns: ensureArray(immunityData?.sketchySigns, 
      typeof earlyWarnings === 'string' ? [earlyWarnings] : 
      earlyWarnings?.length > 0 ? earlyWarnings : immunity.sketchySigns
    ),
    houseRules: ensureArray(immunityData?.houseRules, 
      menuOfMoves.length > 0 ? menuOfMoves : []
    ),
    immunityTest: immunityData?.immunityTest || twoWeekExperiment?.description || immunity.immunityTest,
    archetypeDecoder: immunityData?.archetypeDecoder || patternBreakers?.[0] || immunity.decoder,
    teaPlayScript: immunityData?.teaPlayScript || immunityData?.realTalk || immunity.realTalk || getTeaPlayForRiskLevel(actualRiskLevel, immunityData?.menuOfMoves),
    sagesSeal: immunityData?.sagesSeal || immunityShield || immunity.blessing
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400 border-green-500/30 bg-green-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
      case 'high': return 'text-red-400 border-red-500/30 bg-red-900/20';
      default: return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
    }
  };

  return (
    <div className="relative overflow-hidden max-w-none mx-auto">
      
      {/* Main Immunity Card */}
      <motion.div 
        data-immunity-component
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-12 mb-8 premium-card relative"
        style={{
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
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

        {/* Immunity Training Header - Premium Gold Signature */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="p-6 py-8 rounded-xl border border-white/8 relative overflow-hidden" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(245, 230, 211, 0.03) 100%)',
              borderColor: 'rgba(88, 28, 135, 0.5)',
              boxShadow: '0 0 30px rgba(88, 28, 135, 0.25), 0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
            {/* Journey Badge */}
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                color: '#1a1a1a'
              }}>
              ③
            </div>
            
            <div className="inline-flex items-center gap-4 mb-2">
              <span className="text-3xl opacity-80">🛡️</span>
              <h2 className="text-3xl md:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                SAGE'S IMMUNITY TRAINING
              </h2>
            </div>
            <h3 className="text-sm font-bold tracking-wider text-amber-300 opacity-90 mb-2">
              {getArchetypeHeader(actualRiskLevel, archetypeName)}
            </h3>
            <div className="text-xs text-white/60 mt-1">
              Premium personalized protection strategies 🏆
            </div>
          </div>
        </motion.div>

        {/* Pattern Recognition */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📊</span>
            <h4 className="text-teal-400 font-bold text-sm tracking-wide">PATTERN RECOGNITION</h4>
          </div>
          
          <div className={`rounded-xl p-8 border border-white/8 space-y-4 ${
            actualRiskLevel === 'low' 
              ? 'bg-gradient-to-r from-green-900/10 to-emerald-900/10' 
              : 'bg-gradient-to-r from-purple-900/10 to-red-900/10'
          }`} style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div className="text-center space-y-2">
              {/* TEMPLATE EXAMPLES FOR AI - These are example formats for AI to follow */}
              <div className="text-stone-300 text-lg font-normal leading-relaxed">
                Pattern detected: {actualRiskLevel === 'low' ? 'Healthy relationship cycle' : 'Classic manipulation cycle'}
              </div>
              <div className={`text-sm ${actualRiskLevel === 'low' ? 'text-green-300' : 'text-purple-300'}`}>
                Success rate: {actualRiskLevel === 'low' ? '95% sustainable long-term' : '94% will repeat this pattern'}
              </div>
              <div className="text-teal-300 text-sm">
                {/* EXAMPLES ONLY - In production, AI should generate dynamic content based on actual analysis */}
                Your {actualRiskLevel === 'low' ? 'strength' : 'vulnerability'}: {
                  actualRiskLevel === 'high' ? 'Emotional availability' : 
                  actualRiskLevel === 'low' ? 'Clear boundary setting' : 
                  'Mixed signal confusion'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Pattern Loop */}
        <div className="mb-8">
          <h4 className="text-teal-400 font-bold text-sm mb-6 tracking-wide text-center">PATTERN LOOP</h4>
          <div className="bg-white/3 rounded-xl p-8 border border-white/8">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {displayData.patternLoop.map((step, index) => (
                <div key={step} className="contents">
                  <div className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm border border-purple-500/30 whitespace-nowrap">
                    {step}
                  </div>
                  {index < displayData.patternLoop.length - 1 && (
                    <span className="text-purple-300 text-lg">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Dynamic Flags */}
        <div className="mb-8">
          <h4 className="text-teal-400 font-bold text-sm mb-4 text-center">FLAGS</h4>
          <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div className="flex flex-wrap gap-2 justify-center">
              {displayData.flags.map((flag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-1 rounded-full text-xs border bg-white/5 transition-all ${
                    flag.type === 'red' 
                      ? 'text-red-300 border-red-500/20' 
                      : 'text-green-300 border-green-500/20'
                  }`}
                >
                  {flag.type === 'red' ? '🚩' : '🟢'} {flag.text}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Archetype Decoder - Only show if we have dynamic content */}
        {displayData.archetypeDecoder && (
          <div className="mb-6">
            <h4 className="text-teal-400 font-bold text-sm mb-2">🧬 ARCHETYPE DECODER</h4>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-stone-300 text-lg leading-relaxed">
                {displayData.archetypeDecoder}
              </p>
            </div>
          </div>
        )}

        {/* Healthy Signs | Sketchy Signs - 2+2 */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-green-400 font-bold text-sm mb-2">✅ HEALTHY SIGNS</h4>
            {displayData.healthySigns.map((sign, index) => (
              <div key={index} className="bg-green-900/20 rounded-lg p-2 mb-2 border border-green-500/20">
                <p className="text-green-300 text-sm">{sign}</p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-red-400 font-bold text-sm mb-2">⚠️ SKETCHY SIGNS</h4>
            {displayData.sketchySigns.map((sign, index) => (
              <div key={index} className="bg-red-900/20 rounded-lg p-2 mb-2 border border-red-500/20">
                <p className="text-red-300 text-sm">{sign}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Real Talk - Only show if we have actual content */}
        {displayData.teaPlayScript && displayData.teaPlayScript.length > 0 && (
          <div className="mb-8">
            <h4 className="text-teal-400 font-bold text-sm mb-4">💬 REAL TALK</h4>
            <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="space-y-3">
                {displayData.teaPlayScript.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-teal-400 text-sm mt-1">•</span>
                  <p className="text-stone-300 text-lg leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Immunity Test - Only show if we have dynamic content */}
        {displayData.immunityTest && (
          <div className="mb-6">
            <h4 className="text-purple-400 font-bold text-sm mb-2">🧪 IMMUNITY TEST</h4>
            <div className="rounded-lg p-4 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <p className="text-stone-300 text-lg leading-relaxed">{displayData.immunityTest}</p>
            </div>
          </div>
        )}

        {/* Sage's Blessing - Premium Gold Treatment */}
        <div className="p-6 border relative overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
        }}>
          <div className="text-center mb-4">
            <Crown className="w-8 h-8 mx-auto mb-2" style={{ color: '#D4AF37' }} />
            <h4 className="font-bold text-lg tracking-wide" 
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              SAGE'S BLESSING
            </h4>
          </div>
          <p className="gradient-text text-xl font-medium mb-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            "{immunityData?.sageBlessing || displayData.sagesSeal}"
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleSaveBadge}
              className="flex-1 bg-white/10 hover:bg-white/20 text-stone-300 font-normal py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.6)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <LogOut className="w-4 h-4" />
              Save Badge
            </button>
            <button 
              onClick={handleShareTrophy}
              className="flex-1 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                border: '1px solid rgba(212, 175, 55, 0.9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Zap className="w-4 h-4" />
              Share Trophy
            </button>
          </div>
          
          <p className="text-center text-white/60 text-xs mt-4">Blessed by Sage 🔮</p>
        </div>

        {/* Watermark */}
        <div className="text-center mt-6">
          <p className="text-white/40 text-xs">getthereceipts.com</p>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-white/40 text-xs">Entertainment purposes only • Not licensed relationship advice • You know your truth</p>
        </div>
      </motion.div>
    </div>
  );
};

});

ImmunityTraining.displayName = 'ImmunityTraining';

export default ImmunityTraining;