import React, { memo, useMemo } from 'react';
import { Shield, AlertTriangle, Zap, Eye, LogOut, Crown, CheckCircle, Calendar, Target, TrendingUp, Clock, Mic, Activity, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast';

const ImmunityTraining = memo(({ immunityData, archetypeName = "The Gaslighter", isCrisisSituation = false, isPremium = false }) => {
  const { toast } = useToast();
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ ImmunityTraining received:', immunityData);
      console.log('🛡️ Type:', typeof immunityData, 'Keys:', immunityData ? Object.keys(immunityData) : 'none');
      console.log('🆘 Crisis situation:', isCrisisSituation);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6">
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
        <p className="text-stone-300/90 text-xl leading-relaxed">Sage is preparing your personalized protection strategies. This premium feature will be available soon.</p>
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
        whatTheyWant: "To keep you interested and available without committing to anything concrete. They want the emotional connection and attention without the responsibility of follow-through.",
        keyCharacteristics: [
          "Makes vague promises about future plans",
          "Always has excuses when it's time to commit",
          "Keeps you hopeful but never follows through"
        ],
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
        whatTheyWant: "Control through confusion. They want you to doubt yourself so completely that you become dependent on their version of reality.",
        keyCharacteristics: [
          "Rewrites history to fit their narrative",
          "Makes you question your own memory", 
          "Denies things they clearly said or did"
        ],
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
        whatTheyWant: "Maximum attention and availability from you with minimal effort on their part. They want to keep you on the hook as a backup option.",
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
    archetypeDecoder: immunityData?.archetypeDecoder || patternBreakers?.[0], // Specific to user's situation
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
    <div className="relative w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto px-4 sm:px-0 pb-8 sm:pb-12 md:pb-16">
      
      {/* Main Immunity Card - Mobile-optimized with max-width constraints */}
      <motion.div 
        data-immunity-component
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 sm:p-6 md:p-8 lg:p-10 mb-4 sm:mb-6 md:mb-8 relative"
        style={{
          background: 'linear-gradient(180deg, #1a1a3e 0%, #14142e 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '2px solid rgba(20, 184, 166, 0.4)',
          boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
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
          <div className="p-4 sm:p-6 py-6 sm:py-8 rounded-xl relative overflow-hidden" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
            }}>
            
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-2">
              <span className="text-2xl sm:text-3xl opacity-80">🛡️</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                SAGE'S IMMUNITY TRAINING
              </h2>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium tracking-wide sm:tracking-wider text-amber-300 opacity-75 mb-2 mt-2 sm:mt-4 text-center leading-relaxed">
              {getArchetypeHeader(actualRiskLevel, archetypeName)}
            </h3>
            <div className="text-xs sm:text-sm text-white/60 mt-1 text-center whitespace-nowrap">
              Premium personalized protection strategies 🏆
            </div>
          </div>
        </motion.div>

        {/* The Archetype Breakdown */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl border border-slate-600/30 overflow-hidden relative backdrop-blur-sm"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(8, 145, 178, 0.08) 0%, transparent 50%)'
            }}>
            <div className="px-4 py-3 bg-cyan-500/5 border-b border-cyan-500/10">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🎭</span>
                <h4 className="text-cyan-400 font-bold text-sm sm:text-base tracking-wide uppercase">
                  The {archetypeName?.replace(/^The /, '') || 'Archetype'} Profile
                </h4>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6">
              <div className="space-y-4">
                {/* Core Traits */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                    <span className="text-sm">🛡️</span>
                    Key Characteristics:
                  </div>
                  <ul className="space-y-3 sm:space-y-2">
                    {(() => {
                      // Safely get array data with proper fallbacks
                      const characteristics = immunity.keyCharacteristics || 
                                           immunityData?.keyCharacteristics || 
                                           immunityData?.characteristics || 
                                           immunityData?.redFlagDrills || 
                                           immunityData?.earlyWarnings || 
                                           immunityData?.sketchySigns ||
                                           immunityData?.healthySigns ||
                                           [];
                      
                      // Ensure it's an array
                      const safeArray = Array.isArray(characteristics) ? characteristics : [];
                      
                      if (safeArray.length > 0) {
                        return safeArray.slice(0, 3).map((trait, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-cyan-400 text-sm mt-0.5 flex-shrink-0">•</span>
                            <span className="text-gray-200 text-sm leading-snug sm:leading-relaxed break-words">{trait}</span>
                          </li>
                        ));
                      } else {
                        return (
                          <li className="flex items-start gap-3">
                            <span className="text-cyan-400 text-sm mt-0.5 flex-shrink-0">•</span>
                            <span className="text-gray-200 text-sm leading-snug sm:leading-relaxed break-words">
                              {isCrisisSituation ? "Immediate safety intervention required" : "Loading personalized analysis..."}
                            </span>
                          </li>
                        );
                      }
                    })()}
                  </ul>
                </div>
                
                {/* How They Operate */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                    How They Operate:
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {immunityData?.whyItHooks || immunityData?.howTheyOperate || immunity.decoder || 
                      <span className="italic">Loading archetype profile...</span>
                    }
                  </p>
                </div>
                
                {/* Their Goal */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                    What They Want:
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {immunityData?.patternDetected || immunityData?.theirGoal || immunityData?.whatTheyWant || immunityData?.goal || immunity.whatTheyWant ||
                      <span className="italic">Loading archetype motivations...</span>
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Archetype Decoder - Your Specific Situation */}
        {(immunityData?.archetypeDecoder || displayData.archetypeDecoder) && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl border border-teal-500/20 overflow-hidden">
              <div className="px-4 py-3 bg-teal-500/5 border-b border-teal-500/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🧬</span>
                  <h4 className="text-teal-400 font-bold text-sm sm:text-base tracking-wide uppercase">Archetype Decoder</h4>
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {immunityData?.archetypeDecoder || displayData.archetypeDecoder}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pattern Recognition - Your Specific Situation */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl border border-slate-600/30 overflow-hidden relative backdrop-blur-sm"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(8, 145, 178, 0.08) 0%, transparent 50%)'
            }}>
            <div className="px-4 py-3 bg-cyan-500/5 border-b border-cyan-500/10">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">📊</span>
                <h4 className="text-cyan-400 font-bold text-sm sm:text-base tracking-wide uppercase">Pattern Recognition</h4>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6">
              <div className="space-y-4">
                {/* Pattern Detected */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                    Pattern Detected:
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {immunityData?.patternDetected || immunityData?.patternDescription || 
                      <span className="italic">Analyzing pattern from your conversation...</span>
                    }
                  </p>
                </div>
                
                {/* Success Rate */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                    Success Rate:
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {immunityData?.successRate || immunityData?.repeatLikelihood || 
                      <span className="italic">Calculating pattern likelihood...</span>
                    }
                  </p>
                </div>
                
                {/* Your Vulnerability */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                    Your Vulnerability:
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {immunityData?.userVulnerability || immunityData?.whyItHooks || displayData.whyItHooks || 
                      <span className="italic">Analyzing your specific vulnerabilities...</span>
                    }
                  </p>
                </div>
                
                {/* Risk Level Badge */}
                <div className="pt-2">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                    actualRiskLevel === 'low' 
                      ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                      : 'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}>
                    {actualRiskLevel === 'low' ? '🟢 Low Risk Pattern' : '🔴 High Risk Pattern'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pattern Loop */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 overflow-hidden">
            <div className="px-4 py-3 bg-purple-500/5 border-b border-purple-500/10">
              <h4 className="text-purple-400 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                <span>🔄</span> Pattern Loop
              </h4>
            </div>
            <div className="p-3 sm:p-4">
              {/* Mobile: Horizontal scroll */}
              <div className="sm:hidden">
                <div className="overflow-x-auto pb-2" style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  <div className="flex items-center gap-3 min-w-max px-2">
                    {Array.isArray(displayData.patternLoop) ? displayData.patternLoop.map((step, index) => (
                      <React.Fragment key={step}>
                        <div className="bg-purple-900/30 text-purple-300 px-3 py-2 rounded-lg text-xs font-medium text-center border border-purple-500/20 flex-shrink-0 min-w-[80px] hover:bg-purple-800/40 transition-all duration-200">
                          {step}
                        </div>
                        {index < displayData.patternLoop.length - 1 && (
                          <span className="text-purple-400 text-base flex-shrink-0 animate-pulse">→</span>
                        )}
                      </React.Fragment>
                    )) : (
                      <div className="bg-purple-900/30 text-purple-300 px-3 py-2 rounded-lg text-xs font-medium text-center border border-purple-500/20 flex-shrink-0 min-w-[80px]">
                        Pattern Loading...
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-purple-400 text-xs opacity-70 animate-pulse">
                    {actualRiskLevel === 'low' ? '↻ Healthy Cycle' : '↻ Endless Loop'}
                  </span>
                  <p className="text-purple-300/60 text-[10px] mt-1">← Swipe to explore the cycle →</p>
                </div>
              </div>
              
              {/* Desktop: Flex wrap */}
              <div className="hidden sm:block">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {Array.isArray(displayData.patternLoop) ? displayData.patternLoop.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="bg-purple-900/30 text-purple-300 px-2 py-1.5 rounded-lg text-xs font-medium text-center border border-purple-500/20 flex-shrink-0 hover:scale-105 hover:bg-purple-800/40 transition-all duration-300 cursor-default">
                        {step}
                      </div>
                      {index < displayData.patternLoop.length - 1 && (
                        <span className="text-purple-400 text-sm sm:text-base flex-shrink-0 hover:scale-110 transition-transform duration-200">→</span>
                      )}
                    </React.Fragment>
                  )) : (
                    <div className="bg-purple-900/30 text-purple-300 px-2 py-1.5 rounded-lg text-xs font-medium text-center border border-purple-500/20 flex-shrink-0">
                      Pattern Loading...
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-center mt-3">
                  <span className="text-purple-400 text-xs opacity-70 hover:opacity-100 transition-opacity duration-300 animate-pulse">
                    {actualRiskLevel === 'low' ? '↻ Healthy Cycle' : '↻ Endless Loop'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Immunity Test - Your Next Move */}
        {displayData.immunityTest && (
          <div className="mb-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-2xl border border-cyan-400/30 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer">
              <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 border-b border-cyan-400/20">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg animate-pulse">💬</span>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase"
                    style={{
                      background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                    Your Next Move
                  </h4>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 md:p-6">
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed text-center font-medium" 
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.6'
                  }}>
                  {displayData.immunityTest}
                </p>
              </div>
              
              {/* Interactive glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  boxShadow: 'inset 0 0 20px rgba(6, 182, 212, 0.1)'
                }}>
              </div>
            </div>
          </div>
        )}

        {/* See Both Sides - Enhanced Design */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-2xl border border-slate-600/30 overflow-hidden backdrop-blur-sm shadow-lg">
            {/* Main Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-700/20 to-slate-800/20 border-b border-slate-600/30">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">⚖️</span>
                <h4 className="text-slate-200 font-bold text-sm sm:text-base tracking-wide uppercase">See Both Sides</h4>
              </div>
            </div>
            
            {/* Tab-style Headers */}
            <div className="grid grid-cols-2">
              <div className="px-4 py-3 bg-gradient-to-br from-emerald-500/15 to-green-500/10 border-r border-slate-600/30 relative">
                <div className="absolute inset-0 bg-emerald-400/5"></div>
                <h5 className="text-emerald-400 font-bold text-xs sm:text-sm text-center relative z-10">🟢 What's Normal</h5>
              </div>
              <div className="px-4 py-3 bg-gradient-to-br from-rose-500/15 to-pink-500/10 relative">
                <div className="absolute inset-0 bg-rose-400/5"></div>
                <h5 className="text-rose-400 font-bold text-xs sm:text-sm text-center relative z-10">🚩 Red Flags</h5>
              </div>
            </div>
            
            {/* Content - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-600/20">
              {/* Healthy Signs */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                <ul className="space-y-3">
                  {Array.isArray(displayData.healthySigns) ? displayData.healthySigns.slice(0, 3).map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-emerald-200 text-sm leading-relaxed">{sign}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-emerald-200 text-sm leading-relaxed">No healthy signs detected</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Red Flags */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
                <ul className="space-y-3">
                  {Array.isArray(displayData.sketchySigns) ? displayData.sketchySigns.slice(0, 3).map((sign, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className="text-rose-200 text-sm leading-relaxed">{sign}</span>
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


        {/* Premium Paywall - Show tease for free users */}
        {!isPremium && !isCrisisSituation ? (
          <div className="mb-8">
            {/* Premium Tease */}
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-3xl p-6 sm:p-8 border border-amber-400/30 relative overflow-hidden backdrop-blur-sm shadow-lg">
              {/* Unlock Icon */}
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/40">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-300 mb-3">Get The Full Immunity Training</h3>
                <p className="text-amber-200/90 text-lg leading-relaxed max-w-md mx-auto">
                  Unlock Sage's Real Talk, personalized protection strategies, and your custom blessing.
                </p>
              </div>
              
              {/* Premium Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔮</span>
                    <h4 className="text-amber-300 font-semibold">Sage's Real Talk</h4>
                  </div>
                  <p className="text-amber-200/70 text-sm">Get brutally honest insights about your specific situation</p>
                </div>
                <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">👑</span>
                    <h4 className="text-amber-300 font-semibold">Personal Blessing</h4>
                  </div>
                  <p className="text-amber-200/70 text-sm">Receive your custom protection mantra from Sage</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  ⚡ Go Premium
                  <Crown className="w-5 h-5" />
                </button>
                <p className="text-amber-200/60 text-sm mt-3">Unlimited receipts • Full immunity training • Premium analysis</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sage's Real Talk - Speech Bubble Style */}
            {displayData.teaPlayScript && displayData.teaPlayScript.length > 0 && (
          <div className="mb-6 sm:mb-8">
            {/* Speech Bubble Container */}
            <div className="relative">
              {/* Sage Icon - Top Left */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center border border-purple-400/30 backdrop-blur-sm">
                  <span className="text-sm">🔮</span>
                </div>
              </div>
              
              {/* Speech Bubble */}
              <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/15 rounded-3xl p-5 sm:p-6 border border-purple-400/30 relative shadow-lg backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.12) 100%)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(167, 139, 250, 0.2)'
                }}>
                
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-purple-300 font-bold text-sm sm:text-base tracking-wide">Sage's Real Talk</h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="space-y-3 sm:space-y-4">
                  {Array.isArray(displayData.teaPlayScript) ? displayData.teaPlayScript.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-purple-300 text-sm mt-1 flex-shrink-0">→</span>
                    <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed break-words font-medium" 
                      style={{ 
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        lineHeight: '1.6'
                      }}>
                      {step}
                    </p>
                  </motion.div>
                )) : (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-purple-300 text-sm mt-1 flex-shrink-0">→</span>
                    <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed break-words font-medium">
                      Sage's wisdom is being prepared...
                    </p>
                  </motion.div>
                )}
                </div>
                
                {/* Quote Attribution */}
                <div className="text-right mt-4 pt-3 border-t border-purple-400/20">
                  <p className="text-purple-300/70 text-xs italic">— Sage</p>
                </div>
              </div>
              
              {/* Speech Bubble Tail */}
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-gradient-to-br from-purple-500/10 to-violet-500/15 border-l border-b border-purple-400/30 transform rotate-45"></div>
            </div>
            
            {/* Action Button */}
            <div className="text-center mt-6">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-purple-100 border border-purple-400/40 hover:border-purple-400/60 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <span className="text-xs">💾</span>
                Save This Wisdom
              </button>
            </div>
          </div>
        )}


        {/* Sage's Blessing - Premium Gold Treatment */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto p-6 sm:p-8 relative overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15), 0 0 40px rgba(212, 175, 55, 0.08)'
          }}>
            <div className="text-center mb-6 sm:mb-8">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4" style={{ color: '#D4AF37' }} />
              <h4 className="font-bold text-base sm:text-lg md:text-xl tracking-wide" 
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                SAGE'S BLESSING
              </h4>
            </div>
            
            <div className="px-4 sm:px-6 mb-8">
              <p className="gradient-text text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-center leading-relaxed"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.6'
                }}>
                "{immunityData?.sageBlessing || displayData.sagesSeal}"
              </p>
            </div>
            
            {/* Save Button */}
            <div className="text-center mb-6">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 hover:from-yellow-600/30 hover:to-yellow-500/30 border border-yellow-500/40 hover:border-yellow-400/60 rounded-full text-yellow-200 hover:text-yellow-100 font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 230, 211, 0.1) 100%)',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.2)'
                }}>
                <span className="text-sm">💾</span>
                Save This Blessing
              </button>
            </div>
            
            <p className="text-center text-white/60 text-xs">Blessed by Sage 🔮</p>
          </div>
        </div>

            {/* WATERMARK - Final element in Sage's Immunity Training */}
            <div className="text-center mt-4 mb-6">
              <p className="text-xs text-stone-200/90/40 tracking-widest">
                www.getthereceipts.com
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* SEPARATE SAVE/SHARE BOX - Completely outside the immunity card */}
      <div className="w-full max-w-2xl mx-auto mt-12 mb-4">
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center p-6 backdrop-blur rounded-3xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
            border: '2px solid rgba(20, 184, 166, 0.4)',
            boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
          }}
        >
          <button 
            onClick={handleSaveBadge}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <LogOut className="h-4 w-4" />
            Save Badge
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
            Share Trophy
          </motion.button>
        </div>
        
        {/* Sage's Disclaimer */}
        <div className="mt-4 sm:mt-6 text-center px-4 sm:px-0">
          <p className="text-xs sm:text-sm text-stone-400/70 leading-relaxed max-w-sm sm:max-w-md mx-auto">
            <span className="text-amber-300/80">🔮</span> Look, we're really good at reading the room and serving up insights, but we're not your therapist, not licensed professionals, and for the love of all that's holy, don't take life changing advice from an AI with opinions and sass. For entertainment only. Think of us as your witty friends with someone else's lived experience. This service is intended for users 18+ only.
          </p>
        </div>
      </div>

    </div>
  );
});

ImmunityTraining.displayName = 'ImmunityTraining';

export default ImmunityTraining;