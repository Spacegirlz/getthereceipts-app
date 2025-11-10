import React, { useState, useRef, memo, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Lock, Share2, Zap, Eye, Clock, Play, Download, Volume2, VolumeX, Pause, ChevronRight, Info, Crown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSocialExport } from '@/hooks/useSocialExport';
import { ShareInstructionsModal } from '@/components/ShareInstructionsModal';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import sageDarkCircle from '@/assets/sage-dark-circle.png';
import BlurredSection from './BlurredSection';
// import { voiceService } from '@/lib/voiceService';

const DeepDive = memo(({ deepDive, analysisData, originalMessage, context, isPremium = true }) => {
  
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔥 DEEP DIVE V4 - SHORT, SAVAGE, SUBSTANTIAL:', { deepDive, analysisData, originalMessage, context, isPremium });
    }
  }, [deepDive, analysisData, isPremium]);
  
  const { toast } = useToast();
  // Density toggle with persistence
  const [isCompact, setIsCompact] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('gtr_density') : null;
      return saved ? saved === 'compact' : true;
    } catch { return true; }
  });
  useEffect(() => {
    try { if (typeof window !== 'undefined') window.localStorage.setItem('gtr_density', isCompact ? 'compact' : 'standard'); } catch {}
  }, [isCompact]);
  const { captureById, showInstructions, setShowInstructions, instructionsPlatform } = useSocialExport();
  const [copiedText, setCopiedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAllAutopsy, setShowAllAutopsy] = useState(false);
  const [autopsyScrollPosition, setAutopsyScrollPosition] = useState(0);
  const speechRef = useRef(null);

  // Dynamic Metrics Calculator (now incorporates green flags)
  const calculateMetrics = (analysis) => {
    const {
      redFlags = 0,
      wastingTime = 0,
      actuallyIntoYou = 0,
      redFlagChips = [],
      greenFlagChips = []
    } = analysis;
    
    // Debug logging to verify data
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 DYNAMIC METRICS CALCULATOR:', {
        redFlags,
        wastingTime,
        actuallyIntoYou,
        redFlagChips,
        greenFlagChips,
        fullAnalysis: analysis
      });
    }
    
    // Incorporate green flags
    const g = Array.isArray(greenFlagChips) ? greenFlagChips.length : 0;
    const r = redFlags;
    const into = actuallyIntoYou;
    const waste = wastingTime;

    // Effective red flags reduced by greens
    const effectiveRed = Math.max(0, Math.min(10, r - 0.5 * g));

    // Risk Level (LOW: 0-3, MEDIUM: 4-7, HIGH: 8-10) using effectiveRed
    const risk = effectiveRed <= 3 
      ? { level: 'LOW', color: 'green', text: 'Manageable situation', width: '25%' }
      : effectiveRed <= 7
      ? { level: 'MEDIUM', color: 'orange', text: 'Proceed with awareness', width: '60%' }
      : { level: 'HIGH', color: 'red', text: 'Requires immediate attention', width: '85%' };
    
    // Compatibility: into + 3*g − 2*r (clamped)
    const compatScore = Math.max(0, Math.min(100, into + 3 * g - 2 * r));
    const compat = compatScore >= 70
      ? { score: compatScore, status: 'STRONG', text: 'Above optimal threshold', color: 'green', width: `${compatScore}%` }
      : compatScore >= 40
      ? { score: compatScore, status: 'MODERATE', text: 'Mixed signals present', color: 'yellow', width: `${compatScore}%` }
      : { score: compatScore, status: 'POOR', text: 'Below optimal threshold', color: 'red', width: `${compatScore}%` };
    
    // Communication
    const commFlags = ['vague', 'mixed signals', 'excuse', 'plan dodge', 'maybe'];
    const hasCommIssues = redFlagChips.some(chip => 
      commFlags.some(flag => chip.toLowerCase().includes(flag))
    );
    const greenEase = Math.min(g, 5); // cap boost
    const effectiveWaste = waste * (1 - 0.02 * greenEase); // up to 10% easing
    const issuePenalty = hasCommIssues ? 20 : 0;
    const commScore = Math.max(0, Math.min(100, 100 - effectiveWaste - issuePenalty + 2 * greenEase));
    const comm = commScore >= 70
      ? { score: commScore, quality: 'STRONG', text: 'Clear and consistent', color: 'green', width: `${commScore}%` }
      : commScore >= 40
      ? { score: commScore, quality: 'MIXED', text: 'Some clarity issues', color: 'yellow', width: `${commScore}%` }
      : { score: commScore, quality: 'POOR', text: 'Significant barriers detected', color: 'red', width: `${commScore}%` };
    
    const result = { risk, compat, comm };
    
    // Debug logging to verify calculations
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 CALCULATED METRICS:', {
        inputs: { g, r, into, waste, effectiveRed, compatScore, commScore },
        outputs: result
      });
    }
    
    return result;
  };

  const handleSharePlaybook = () => {
    // Use the new social export system for Playbook sharing - with share menu
    captureById('social-playbook-card', "Sage-Playbook", true);
  };

  const handleSaveTea = async () => {
    const element = document.querySelector('[data-deepdive-component]');
    const scroller = document.querySelector('[data-autopsy-horizontal]');
    if (!element) {
      toast({ title: "Error", description: "Could not find tea component to save.", variant: "destructive" });
      return;
    }

    // Temporarily neutralize mobile scroller negative margins that can shift capture
    const prevScrollerMargins = scroller ? { ml: scroller.style.marginLeft, mr: scroller.style.marginRight } : null;
    const prevElementMargins = { ml: element.style.marginLeft, mr: element.style.marginRight, m: element.style.margin };
    if (scroller) {
      scroller.style.marginLeft = '0';
      scroller.style.marginRight = '0';
    }
    // Left align the main container during capture
    element.style.marginLeft = '0';
    element.style.marginRight = '0';

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
          // Remove border styles but preserve gold borders
          if (node.style && !node.style.borderColor?.includes('yellow') && !node.style.borderColor?.includes('amber') && !node.style.borderColor?.includes('212, 175, 55')) {
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
      saveAs(blob, `Sage's Tea #${timestamp}.png`);
      toast({ title: "Tea saved!", description: "Your tea has been downloaded." });
    } catch (error) {
      console.error('Error saving tea:', error);
      toast({ title: "Error", description: "Could not save tea. Please try again.", variant: "destructive" });
    } finally {
      if (scroller && prevScrollerMargins) {
        scroller.style.marginLeft = prevScrollerMargins.ml;
        scroller.style.marginRight = prevScrollerMargins.mr;
      }
      // Restore element margins
      element.style.marginLeft = prevElementMargins.ml;
      element.style.marginRight = prevElementMargins.mr;
      if (prevElementMargins.m) element.style.margin = prevElementMargins.m;
    }
  };

  const handleSaveClean = () => {
    // Use the new social export system for Playbook - direct download only
    captureById('social-playbook-card', "Sage-Playbook", false);
  };

  // Generate 9:16 share images (hero | autopsy | actions)
  const handleSaveNineBySixteen = async () => {
    try {
      const mode = (window.prompt('Share Mode: hero | autopsy | actions', 'hero') || 'hero').toLowerCase();
      const container = document.createElement('div');
      container.style.width = '1080px';
      container.style.height = '1920px';
      container.style.background = 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)';
      container.style.border = '2px solid rgba(20, 184, 166, 0.4)';
      container.style.borderRadius = '32px';
      container.style.boxShadow = '0 8px 32px rgba(20,184,166,0.15), 0 0 80px rgba(20,184,166,0.05)';
      container.style.padding = '64px';
      container.style.color = 'white';
      container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      container.style.position = 'fixed';
      container.style.top = '-99999px';
      container.style.left = '-99999px';

      const title = safeDeepDive?.verdict?.act || analysisData?.verdict || "Sage's Playbook";
      const sub = safeDeepDive?.verdict?.subtext || '';
      const receiptsArr = Array.isArray(safeDeepDive?.receipts) ? safeDeepDive.receipts : [];
      const bestReceipt = receiptsArr[0] || { quote: '', pattern: '', cost: '' };
      const moves = (safeDeepDive?.playbook?.your_move || '').split('. ').filter(Boolean).slice(0, 3);
      const seal = safeDeepDive?.sages_seal || analysisData?.sages_seal || '';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.gap = '16px';
      header.style.marginBottom = '32px';
      header.innerHTML = `<div style="width:72px;height:72px;border-radius:50%;overflow:hidden;border:2px solid rgba(20,184,166,.4);box-shadow:0 0 20px rgba(20,184,166,.3);"><img src="${sageDarkCircle}" alt="Sage" style="width:100%;height:100%;object-fit:cover"/></div>
        <div style="font-weight:800;letter-spacing:.18em;color:#14B8A6">SAGE'S PLAYBOOK</div>`;
      container.appendChild(header);

      if (mode === 'hero') {
        const block = document.createElement('div');
        block.style.background = 'rgba(0,0,0,0.75)';
        block.style.border = '1px solid rgba(255,255,255,0.12)';
        block.style.borderRadius = '28px';
        block.style.padding = '48px';
        block.style.marginTop = '24px';
        block.innerHTML = `
          <div style="font-size:56px;font-weight:800;color:#D4AF37;line-height:1.1;margin-bottom:16px">${title}</div>
          <div style="height:4px;width:120px;background:linear-gradient(90deg,#399d96,rgba(57,157,150,0));border-radius:2px;margin-bottom:16px"></div>
          <div style="font-size:28px;color:rgba(255,255,255,.8);line-height:1.5">${sub}</div>
        `;
        container.appendChild(block);
      } else if (mode === 'autopsy') {
        const block = document.createElement('div');
        block.style.background = 'rgba(0,0,0,0.75)';
        block.style.border = '1px solid rgba(255,255,255,0.12)';
        block.style.borderRadius = '28px';
        block.style.padding = '48px';
        block.style.marginTop = '24px';
        block.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:10px;height:10px;border-radius:9999px;background:#D4AF37"></div>
            <div style="font-weight:800;letter-spacing:.18em;color:#399d96">SAGE'S RECEIPT AUTOPSY</div>
          </div>
          <div style="font-size:40px;color:#fff;font-weight:700;line-height:1.2;margin-bottom:16px">"${bestReceipt.quote || 'No quote available'}"</div>
          <div style="display:inline-block;padding:8px 14px;border-radius:9999px;border:1px solid rgba(212,175,55,.3);background:linear-gradient(90deg,rgba(212,175,55,.2),rgba(245,230,211,.2));color:#D4AF37;font-weight:700;margin-bottom:12px">${bestReceipt.pattern || 'Pattern'}</div>
          <div style="font-size:26px;color:rgba(255,255,255,.75)">${bestReceipt.cost || ''}</div>
        `;
        container.appendChild(block);
      } else {
        const block = document.createElement('div');
        block.style.background = 'rgba(0,0,0,0.8)';
        block.style.border = '1px solid rgba(255,255,255,0.12)';
        block.style.borderRadius = '28px';
        block.style.padding = '48px';
        block.style.marginTop = '24px';
        const movesHtml = moves.map(m => `<li style="margin-bottom:16px;display:flex;gap:10px;align-items:flex-start"><div style=\"width:18px;height:18px;border-radius:9999px;border:1px solid rgba(212,175,55,.3);background:linear-gradient(135deg,rgba(212,175,55,.2),rgba(245,230,211,.2));display:flex;align-items:center;justify-content:center\"><span style=\"color:#D4AF37;font-size:12px\">›</span></div><span style=\"font-size:28px;line-height:1.5;color:#fff\">${m}</span></li>`).join('');
        block.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:10px;height:10px;border-radius:9999px;background:#D4AF37"></div>
            <div style="font-weight:800;letter-spacing:.18em;color:#399d96">SAGE'S PLAYBOOK</div>
          </div>
          <ul style="list-style:none;padding:0;margin:0 0 28px 0">${movesHtml || '<li style=\"color:rgba(255,255,255,.6)\">No moves available</li>'}</ul>
          <div style="text-align:center;margin-top:12px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08)">
            <div style="font-weight:700;letter-spacing:.3em;color:#D4AF37;margin-bottom:12px">SAGE'S SEAL</div>
            <div style="font-size:40px;line-height:1.4;background:linear-gradient(135deg,#D4AF37,#F5E6D3,#D4AF37);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">"${seal || 'Trust your intuition.'}"</div>
          </div>
        `;
        container.appendChild(block);
      }

      document.body.appendChild(container);
      const blob = await domtoimage.toBlob(container, { quality: 1 });
      const timestamp = Date.now();
      saveAs(blob, `Sage-Share-${mode}-${timestamp}.png`);
      document.body.removeChild(container);
      toast({ title: 'Saved!', description: '9:16 image downloaded.' });
    } catch (err) {
      console.error('9:16 save error', err);
      toast({ title: 'Save failed', description: 'Could not generate the 9:16 image.', variant: 'destructive' });
    }
  };

  // Calculate valence based on analysis data if deepDive doesn't have it
  const calculateValence = () => {
    if (deepDive?.valence) return deepDive.valence;
    if (!analysisData) return 'yellow';
    
    const redFlagsScore = analysisData.redFlags || 0;
    const wastingTimePct = analysisData.wastingTime || 0;
    const intoYouPct = analysisData.actuallyIntoYou || 0;

    if (redFlagsScore >= 6 || (wastingTimePct >= 60 && intoYouPct <= 40)) {
      return 'red';
    } else if (redFlagsScore <= 2 && intoYouPct >= 60) {
      return 'green';
    } else {
      return 'yellow';
    }
  };

  const valence = calculateValence();
  // Debug logging removed for production

  // Add defensive programming for missing properties
  const safeDeepDive = {
    verdict: deepDive.verdict || {},
    receipts: deepDive.receipts || [],
    physics: deepDive.physics || {},
    playbook: deepDive.playbook || {},
    sages_seal: deepDive.sages_seal || '',
    tea_wisdom: deepDive.tea_wisdom || '',
    valence: deepDive.valence || 'yellow'
  };

  // PREMIUM COLOR SYSTEM - "Midnight Gold" Theme
  const theme = {
    // Sophisticated dark backgrounds
    bgPrimary: 'bg-gradient-to-br from-[#0F0F1E] to-[#1A1A2E]',
    bgCard: 'bg-white/[0.02]',
    bgCardHover: 'hover:bg-white/[0.04]',
    
    // Premium borders
    borderSubtle: 'border-white/[0.08]',
    borderAccent: 'border-[#D4AF37]/20',
    
    // Text hierarchy
    textPrimary: 'text-stone-200/95',
    textSecondary: 'text-stone-300/80',
    textMuted: 'text-stone-400/70',
    textAccent: 'text-[#D4AF37]',
    
    // Premium shadows
    shadowCard: 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
    shadowGold: 'shadow-[0_0_40px_rgba(212,175,55,0.1)]'
  };

  // Risk level styling - minimal color variation
  const getRiskStyling = (valence) => {
    if (valence === 'red') {
      return {
        badge: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: '⚠️',
        label: 'HIGH RISK PATTERN'
      };
    }
    if (valence === 'green') {
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: '✓',
        label: 'HEALTHY PATTERN'
      };
    }
    return {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: '→',
      label: 'MIXED SIGNALS'
    };
  };

  // Get archetype color based on red flag level - same logic as Sage's Receipt
  const getArchetypeColor = () => {
    const flagCount = analysisData?.redFlags || 0;
    if (flagCount <= 3) return "text-green-400";   // Green for 0-3 flags (good)
    if (flagCount <= 7) return "text-orange-400";  // Orange for 4-7 flags (mixed)
    return "text-red-400";                         // Red for 7-10 flags (toxic)
  };


  // Copy functionality
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Handle missing or invalid data with proper fallback
  if (!deepDive || typeof deepDive !== 'object') {
    return (
      <div className="meme-card rounded-2xl p-6 mb-3">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-4">
            <span className="text-2xl">🔮</span>
          </div>
          <h3 className="text-white font-bold text-base mb-2">Sage is finishing the read</h3>
          <p className="text-stone-200 text-xl leading-relaxed">Try again in a moment for your complete analysis.</p>
        </div>
      </div>
    );
  }

  // Paywall logic: Free = Verdict + First Receipt + Sage's Seal
  const showPaywall = !isPremium;

  // If Deep Dive data is missing, we should not show template content
  // Instead, return null or empty string to avoid templates
  const getFallbackReceipts = () => null;
  const getFallbackPhysics = () => null;
  const getFallbackPlaybook = () => null;
  const getFallbackSeal = () => "";

  // Voice note functionality with Sage's sassy voice (temporary fallback)
  const handleVoiceNote = () => {
    if (isPlaying && speechRef.current) {
      // Stop current speech
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Create the voice note script with Sage's personality
    // Handle data structure differences - analysisData.verdict is a string, deepDive.verdict is an object
    const verdict = deepDive.verdict?.act || analysisData?.verdict || '';
    const subtext = deepDive.verdict?.subtext || 'Direct and straightforward analysis';
    const seal = deepDive.sages_seal || analysisData?.deepDive?.sages_seal || analysisData?.sagesSeal?.content || getFallbackSeal();
    
    const voiceScript = `Hey bestie, Sage here with your reality check. You're in ${verdict}. ${subtext}. Here's the tea: ${seal}. You know what to do with this information. Trust your instincts, and remember your peace is premium.`;

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(voiceScript);
      
      // Configure voice settings for Sage's personality
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a female voice if available
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.gender === 'female'
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        toast({ title: "🔮 Sage is speaking", description: "Listen to your tea being spilled..." });
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        toast({ title: "Voice note failed", description: "Try again in a moment.", variant: "destructive" });
      };

      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      toast({ title: "Voice notes not supported", description: "Your browser doesn't support text-to-speech.", variant: "destructive" });
    }
  };

  // Mobile-specific styles
  const mobileStyles = {
    cardShadow: '0 10px 40px rgba(0,0,0,0.4)',
    tapHighlight: 'active:scale-[0.98] transition-transform',
    swipeHint: 'overflow-x-auto scrollbar-hide snap-x snap-mandatory'
  };

  // Speaker name extraction for autopsy cards
  const getSpeakerName = (quote) => {
    if (!quote) return 'SPEAKER';

    const contextData = context || {};
    const conversationLines = originalMessage?.split('\n') || [];
    

    // Try to find the speaker from the original conversation lines
    for (const line of conversationLines) {
      const trimmedLine = line.trim();
      // Match "Name (time): quote" or "Name: quote"
      const match = trimmedLine.match(/^([^:]+?)(?:\s*\(.*?\))?:\s*(.*)/i);
      if (match && match[2] && quote.includes(match[2].trim())) {
        const speakerName = match[1].trim();
        // Prioritize actual names over generic pronouns if context names are available
        if (contextData?.userName && speakerName.toLowerCase() === contextData.userName.toLowerCase()) {
          return contextData.userName.toUpperCase();
        }
        if (contextData?.otherName && speakerName.toLowerCase() === contextData.otherName.toLowerCase()) {
          return contextData.otherName.toUpperCase();
        }
        // If no context match, but it's a valid name, use it
        const nonNames = ['you', 'i', 'we', 'they', 'he', 'she', 'it', 'this', 'that', 'because', 'respect', 'a', 'an', 'the', 'and', 'or', 'but', 'so', 'if', 'when', 'where', 'why', 'how', 'what', 'who', 'which', 'whose', 'whom', 'just', 'like', 'really', 'actually', 'basically', 'literally'];
        if (!nonNames.includes(speakerName.toLowerCase()) && speakerName.length > 1) {
          return speakerName.toUpperCase();
        }
      }
    }

    // Fallback to context names based on first/second-person indicators
    if (contextData?.userName && contextData?.otherName) {
      const firstPersonPatterns = /\b(I|me|my|mine)\b/i;
      if (firstPersonPatterns.test(quote)) {
        return contextData.userName.toUpperCase();
      }
      const secondPersonPatterns = /\b(you|your|yours)\b/i;
      if (secondPersonPatterns.test(quote)) {
        return contextData.otherName.toUpperCase();
      }
    }

    // Final fallback if no name can be determined
    return 'SPEAKER';
  };

  // Receipt Priority System - Dynamic Content-Based Analysis
  const getReceiptPriority = (receipt, index) => {
    const quote = receipt.quote?.toLowerCase() || '';
    const bestieLook = receipt.bestie_look?.toLowerCase() || '';
    const callingIt = receipt.calling_it?.toLowerCase() || '';
    const vibeCheck = receipt.vibe_check?.toLowerCase() || '';
    const currentValence = valence;

    // Combine all text for analysis
    const allText = `${quote} ${bestieLook} ${callingIt} ${vibeCheck}`;

    // Smoking Gun indicators (most damning evidence)
    const smokingGunKeywords = [
      'never', 'always', 'promise', 'guarantee', 'definitely', 'absolutely',
      'lying', 'fake', 'pretend', 'acting', 'manipulating', 'gaslighting',
      'cheating', 'secret', 'hidden', 'behind your back', 'other person',
      'break up', 'leave', 'done', 'over', 'finished', 'end', 'blocked',
      'ghosted', 'ignored', 'lied', 'deceived', 'betrayed', 'caught',
      'evidence', 'proof', 'admitted', 'confessed', 'exposed'
    ];

    // Red Flag indicators (concerning behavior)
    const redFlagKeywords = [
      'maybe', 'probably', 'might', 'could', 'possibly', 'perhaps',
      'busy', 'tired', 'stressed', 'complicated', 'difficult',
      'need space', 'time to think', 'not sure', 'confused',
      'mixed signals', 'mixed feelings', 'complicated', 'drama',
      'toxic', 'manipulative', 'controlling', 'jealous', 'possessive',
      'guilt trip', 'emotional blackmail', 'silent treatment'
    ];

    // Green Flag indicators (positive behavior)
    const greenFlagKeywords = [
      'love', 'care', 'miss', 'appreciate', 'respect', 'support',
      'honest', 'open', 'clear', 'direct', 'consistent', 'reliable',
      'sorry', 'apologize', 'understand', 'listen', 'compromise',
      'healthy', 'mature', 'kind', 'thoughtful', 'considerate',
      'future', 'together', 'commitment', 'exclusive', 'serious'
    ];

    // Pattern indicators (recurring behavior)
    const patternKeywords = [
      'pattern', 'always does', 'keeps doing', 'repeatedly', 'consistently',
      'every time', 'typical', 'usual', 'habit', 'routine', 'cycle',
      'history', 'track record', 'tendency', 'inclination', 'behavior',
      'way of', 'manner', 'style', 'approach', 'method'
    ];

    // Calculate scores for each category
    const smokingGunScore = smokingGunKeywords.reduce((score, keyword) => 
      score + (allText.includes(keyword) ? 1 : 0), 0);
    
    const redFlagScore = redFlagKeywords.reduce((score, keyword) => 
      score + (allText.includes(keyword) ? 1 : 0), 0);
    
    const greenFlagScore = greenFlagKeywords.reduce((score, keyword) => 
      score + (allText.includes(keyword) ? 1 : 0), 0);
    
    const patternScore = patternKeywords.reduce((score, keyword) => 
      score + (allText.includes(keyword) ? 1 : 0), 0);

    // Determine the highest scoring category
    const scores = {
      'smoking-gun': smokingGunScore,
      'red-flag': redFlagScore,
      'green-flag': greenFlagScore,
      'pattern': patternScore
    };

    const maxScore = Math.max(...Object.values(scores));
    const dominantCategory = Object.keys(scores).find(key => scores[key] === maxScore);

    // If no clear winner, use fallback logic based on valence and position
    if (maxScore === 0) {
      if (index === 0) {
        return {
          level: 'smoking-gun',
          badge: '🔥',
          label: 'SMOKING GUN',
          size: 'large',
          borderColor: 'border-[#14B8A6]',
          borderWidth: '2px',
          bgGradient: 'from-[#14B8A6]/5 to-transparent',
          glowColor: 'shadow-[#14B8A6]/20',
          badgeGradient: 'from-[#14B8A6] to-[#2DD4BF]',
          severityColor: '#14B8A6',
          severityOpacity: '1.0'
        };
      } else if (index === 1) {
        const isGreen = currentValence === 'green';
        return {
          level: isGreen ? 'green-flag' : 'red-flag',
          badge: isGreen ? '✓' : '⚠️',
          label: isGreen ? 'GREEN FLAG' : 'RED FLAG',
          size: 'large',
          borderColor: isGreen ? 'border-emerald-500/60' : 'border-red-500/60',
          borderWidth: '1px',
          bgGradient: isGreen ? 'from-emerald-500/3 to-transparent' : 'from-red-500/3 to-transparent',
          glowColor: isGreen ? 'shadow-emerald-500/10' : 'shadow-red-500/10',
          badgeGradient: isGreen ? 'from-emerald-500/80 to-emerald-400/60' : 'from-red-500/80 to-red-400/60',
          severityColor: isGreen ? '#10B981' : '#EF4444',
          severityOpacity: '0.7'
        };
      } else {
        return {
          level: 'pattern',
          badge: '📍',
          label: 'PATTERN',
          size: 'large',
          borderColor: 'border-[#14B8A6]/40',
          borderWidth: '1px',
          bgGradient: 'from-[#14B8A6]/2 to-transparent',
          glowColor: 'shadow-[#14B8A6]/5',
          badgeGradient: 'from-[#14B8A6]/60 to-[#2DD4BF]/40',
          severityColor: '#14B8A6',
          severityOpacity: '0.4'
        };
      }
    }

    // Return based on dominant category
    switch (dominantCategory) {
      case 'smoking-gun':
        return {
          level: 'smoking-gun',
          badge: '🔥',
          label: 'SMOKING GUN',
          size: 'large',
          borderColor: 'border-[#14B8A6]',
          borderWidth: '2px',
          bgGradient: 'from-[#14B8A6]/5 to-transparent',
          glowColor: 'shadow-[#14B8A6]/20',
          badgeGradient: 'from-[#14B8A6] to-[#2DD4BF]',
          severityColor: '#14B8A6',
          severityOpacity: '1.0'
        };
      
      case 'red-flag':
        return {
          level: 'red-flag',
          badge: '⚠️',
          label: 'RED FLAG',
          size: 'large',
          borderColor: 'border-red-500/60',
          borderWidth: '1px',
          bgGradient: 'from-red-500/3 to-transparent',
          glowColor: 'shadow-red-500/10',
          badgeGradient: 'from-red-500/80 to-red-400/60',
          severityColor: '#EF4444',
          severityOpacity: '0.7'
        };
      
      case 'green-flag':
        return {
          level: 'green-flag',
          badge: '✓',
          label: 'GREEN FLAG',
          size: 'large',
          borderColor: 'border-emerald-500/60',
          borderWidth: '1px',
          bgGradient: 'from-emerald-500/3 to-transparent',
          glowColor: 'shadow-emerald-500/10',
          badgeGradient: 'from-emerald-500/80 to-emerald-400/60',
          severityColor: '#10B981',
          severityOpacity: '0.7'
        };
      
      case 'pattern':
      default:
        return {
          level: 'pattern',
          badge: '📍',
          label: 'PATTERN',
          size: 'large',
          borderColor: 'border-[#14B8A6]/40',
          borderWidth: '1px',
          bgGradient: 'from-[#14B8A6]/2 to-transparent',
          glowColor: 'shadow-[#14B8A6]/5',
          badgeGradient: 'from-[#14B8A6]/60 to-[#2DD4BF]/40',
          severityColor: '#14B8A6',
          severityOpacity: '0.4'
        };
    }
  };

  const risk = getRiskStyling(valence);

  return (
    <>
      {/* CSS for hiding scrollbar and preventing scroll interference */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .autopsy-carousel {
          touch-action: manipulation;
          overscroll-behavior: auto;
        }
        .autopsy-carousel * {
          touch-action: manipulation;
        }
      `}</style>
      
      {/* Main Container - Separated like Truth Receipt */}
      <motion.div
        data-deepdive-component
        className="w-full max-w-2xl mx-auto space-y-6"
        style={{
          background: 'transparent'
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Container 1: Main Playbook Content */}
        <div 
          className={`relative rounded-3xl ${isCompact ? 'p-4 sm:p-5 md:p-6' : 'p-6 sm:p-8 md:p-10'} text-stone-200/90 overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
            border: '2px solid rgba(168, 85, 247, 0.7)',
            boxShadow: '0 12px 40px rgba(168, 85, 247, 0.2), 0 0 100px rgba(168, 85, 247, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
          {/* Connecting Visual Elements - Links to page background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Radial gradients matching page theme */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, rgba(0, 229, 255, 0.06) 40%, transparent 70%)',
                boxShadow: '0 0 60px rgba(0, 229, 255, 0.15)'
              }}
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.06) 40%, transparent 70%)',
                boxShadow: '0 0 60px rgba(168, 85, 247, 0.15)'
              }}
            ></div>
            
            {/* Subtle grid pattern for texture */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            ></div>
            
            {/* Corner accent lines */}
            <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-cyan-400/30 via-transparent to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-purple-400/30 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-purple-400/20 via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10">

            {/* Sage's Playbook Header - Horizontal Banner Style */}
            <div className={isCompact ? 'mb-1' : 'mb-2'}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* SAGE HEADER - Exact Match to Truth Receipts */}
        <div className="text-center mb-1 relative z-50">
          {/* Centered lock badge above header for locked view (match Immunity) */}
          {!isPremium && (
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center border border-yellow-400/30">
                <Lock className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          )}
          <div className="inline-flex items-center gap-3 bg-black/30 px-6 py-3 rounded-2xl border border-white/20 mb-4 relative z-50 shadow-lg">
            <img
              src={sageDarkCircle}
              alt="Sage's Playbook"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full border-2 border-teal-400/50 relative z-50"
              style={{
                filter: 'brightness(1.2) contrast(1.1)',
                boxShadow: '0 0 24px rgba(20, 184, 166, 0.4)'
              }}
            />
            <span className="text-lg sm:text-xl font-bold tracking-widest relative z-50"
              style={{
                color: '#14B8A6',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.6), 0 0 50px rgba(20, 184, 166, 0.5)'
              }}>
              SAGE'S PLAYBOOK
            </span>
          </div>
          {/* Locked label removed per request */}
                </div>
                
              </motion.div>
            </div>
            
          {/* Executive Summary Dashboard */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={isCompact ? 'mb-3' : 'mb-4'}
            >
              <div className="rounded-3xl">
                {/* Premium Strategic Assessment */}
                <div className={`rounded-2xl ${isCompact ? 'p-4 mb-4' : 'p-6 mb-6'} bg-black/40 border border-white/20 shadow-lg`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <h3 className={`text-2xl sm:text-3xl font-black ${getArchetypeColor()} leading-tight`}
                        style={{ textShadow: '0 3px 12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(20, 184, 166, 0.3)' }}>
                        {safeDeepDive.verdict?.act || analysisData?.verdict}
                      </h3>
                    </div>
                    <p className="text-stone-200/90 text-lg sm:text-xl leading-relaxed">
                      {safeDeepDive.verdict?.subtext}
                    </p>
                  </div>
                </div>
                
                {/* Hot Takes Badge - Humor Protection */}
                <div className="mt-2 mb-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs font-bold tracking-wider uppercase">HOT</span>
                    </div>
                    <div className="w-0.5 h-0.5 bg-white/40 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      <span className="text-orange-400 text-xs font-bold tracking-wider uppercase">TAKES</span>
                  </div>
                    <div className="w-0.5 h-0.5 bg-white/40 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                      <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase">SERVED</span>
                  </div>
                  </div>
                </div>
            </div>

            {/* Premium Metrics Dashboard */}
            <div className={`rounded-2xl ${isCompact ? 'p-6' : 'p-8'} border border-white/20 shadow-2xl bg-black/40 ${isCompact ? 'mt-4' : 'mt-6'}`} data-share-hide="true">

                {/* Premium Key Metrics Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#D4AF37] rounded-full shadow-lg"></div>
                    <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: '#14B8A6' }}>KEY METRICS</h3>
                  </div>
                  <div className="text-sm text-stone-400/70 font-mono">ANALYSIS DATA</div>
                </div>
                <div className={`grid grid-cols-3 ${isCompact ? 'gap-3 mb-4' : 'gap-4 mb-6'}`} data-share-hide="true">
                  {(() => {
                    // Ensure we have analysisData, fallback to empty object if not
                    const data = analysisData || {};
                    const metrics = calculateMetrics(data);
                    return (
                      <>
                        {/* Compact Risk Assessment */}
                        <div className="bg-black/40 rounded-xl p-4 border border-white/20 shadow-lg">
                          <div className={`${isCompact ? 'text-[11px] leading-none tracking-normal whitespace-nowrap' : 'text-xs tracking-wider'} uppercase text-white/80 ${isCompact ? 'mb-1' : 'mb-2'} font-semibold`} title="Risk">
                            RISK
                          </div>
                          <div className={`text-xl font-black mb-2 ${
                            metrics.risk.color === 'green' ? 'text-green-400' :
                            metrics.risk.color === 'orange' ? 'text-orange-400' : 'text-red-400'
                          }`}>
                            {metrics.risk.level}
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div className={`h-2 rounded-full ${
                              metrics.risk.color === 'green' ? 'bg-green-400' :
                              metrics.risk.color === 'orange' ? 'bg-orange-400' : 'bg-red-400'
                            }`} style={{ width: metrics.risk.width }}></div>
                          </div>
                          <div className="text-xs text-stone-300/70 leading-tight">
                            {metrics.risk.text}
                          </div>
                        </div>
                        
                        {/* Compact Compatibility Score */}
                        <div className="bg-black/40 rounded-xl p-4 border border-white/20 shadow-lg">
                          <div className={`${isCompact ? 'text-[11px] leading-none tracking-normal whitespace-nowrap' : 'text-xs tracking-wider'} uppercase text-white/80 ${isCompact ? 'mb-1' : 'mb-2'} font-semibold`} title="Compatibility (Fit)">
                            FIT
                          </div>
                          <div className={`text-xl font-black mb-2 ${
                            metrics.compat.color === 'green' ? 'text-green-400' :
                            metrics.compat.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {metrics.compat.score}%
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div className={`h-2 rounded-full ${
                              metrics.compat.color === 'green' ? 'bg-green-400' :
                              metrics.compat.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                            }`} style={{ width: metrics.compat.width }}></div>
                          </div>
                          <div className="text-xs text-stone-300/70 leading-tight">
                            {metrics.compat.text}
                          </div>
                        </div>

                        {/* Compact Communication Health */}
                        <div className="bg-black/40 rounded-xl p-4 border border-white/20 shadow-lg">
                          <div className={`${isCompact ? 'text-[11px] leading-none tracking-normal whitespace-nowrap' : 'text-xs tracking-wider'} uppercase text-white/80 ${isCompact ? 'mb-1' : 'mb-2'} font-semibold`} title="Communication (Comms)">
                            COMMS
                          </div>
                          <div className={`text-xl font-black mb-2 ${
                            metrics.comm.color === 'green' ? 'text-green-400' :
                            metrics.comm.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {metrics.comm.quality}
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div className={`h-2 rounded-full ${
                              metrics.comm.color === 'green' ? 'bg-green-400' :
                              metrics.comm.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                            }`} style={{ width: metrics.comm.width }}></div>
                          </div>
                          <div className="text-xs text-stone-300/70 leading-tight">
                            {metrics.comm.text}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                {/* Strategic Assessment moved above as headline */}
              </div>
            </motion.section>


            {/* Data Intelligence Report */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-3"
              data-autopsy-section
            >
              <div className="bg-black/40 rounded-xl p-3 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                    <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: '#14B8A6' }}>SAGE'S RECEIPT AUTOPSY</h3>
                  </div>
                  <div className="text-xs text-stone-400/70 font-mono">EVIDENCE COLLECTED</div>
                </div>
              
              {/* Mobile - Horizontal Scroll Autopsy with Navigation */}
              <div className="sm:hidden relative" data-autopsy-horizontal>
                {/* Navigation Arrows */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      const container = document.querySelector('[data-autopsy-scrollable]');
                      if (container) {
                        container.scrollBy({ left: -340, behavior: 'smooth' });
                      }
                    }}
                    disabled={autopsyScrollPosition <= 0}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                      autopsyScrollPosition <= 0 
                        ? 'bg-black/20 border-teal-400/10 text-teal-400/30 cursor-not-allowed' 
                        : 'bg-black/40 border-teal-400/30 text-teal-400 hover:bg-teal-400/10 hover:border-teal-400/50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="text-center">
                    <div className="text-teal-400/60 text-xs font-medium">AUTOPSY RECEIPTS</div>
                    <div className="text-white/40 text-xs">Tap arrows or swipe</div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const container = document.querySelector('[data-autopsy-scrollable]');
                      if (container) {
                        container.scrollBy({ left: 340, behavior: 'smooth' });
                      }
                    }}
                    disabled={autopsyScrollPosition >= 680} // Approximate max scroll for 3 items
                    className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                      autopsyScrollPosition >= 680 
                        ? 'bg-black/20 border-teal-400/10 text-teal-400/30 cursor-not-allowed' 
                        : 'bg-black/40 border-teal-400/30 text-teal-400 hover:bg-teal-400/10 hover:border-teal-400/50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div 
                  className="overflow-x-auto scrollbar-hide -mx-6 px-6 autopsy-carousel"
                  data-autopsy-scrollable
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'auto',
                    overscrollBehavior: 'auto'
                  }}
                  onScroll={(e) => {
                    setAutopsyScrollPosition(e.target.scrollLeft);
                  }}
                  onTouchStart={(e) => {
                    // Store initial touch position
                    const touch = e.touches[0];
                    e.currentTarget.touchStartX = touch.clientX;
                    e.currentTarget.touchStartY = touch.clientY;
                  }}
                  onTouchMove={(e) => {
                    // Allow natural scrolling - don't interfere with touch events
                    // The browser will handle horizontal vs vertical scrolling naturally
                  }}
                  onTouchEnd={(e) => {
                    // Clean up touch tracking
                    delete e.currentTarget.touchStartX;
                    delete e.currentTarget.touchStartY;
                  }}
                >
                  <div className="flex gap-4 pb-4">
                    {(safeDeepDive.receipts?.slice(0, 3) || []).map((receipt, i) => {
                      const priority = getReceiptPriority(receipt, i);
                      return (
                        <motion.div
                          key={i}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{ scale: 1.01 }}
                          className={`flex-shrink-0 w-[85vw] max-w-[340px] snap-center receipt-card relative rounded-xl p-5 border ${priority.borderColor} shadow-lg bg-black/40 backdrop-blur-sm cursor-pointer ${priority.glowColor}`}
                          data-autopsy-item
                          data-index={i}
                          onClick={() => copyToClipboard(receipt.quote)}
                        >


                          {/* Person Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">💬</span>
                            </div>
                            <span className="text-stone-300/80 text-xs font-semibold uppercase tracking-wide">
                              {getSpeakerName(receipt.quote)}
                            </span>
                          </div>

                          {/* Quote */}
                          <div className="text-stone-100 text-sm mb-4 font-medium italic leading-relaxed pr-6 text-center">
                            💬 "{receipt.quote}"
                          </div>

                          {/* Visual Divider */}
                          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent my-3"></div>

                          {/* Content sections with better spacing */}
                          <div className="space-y-4">
                            <div>
                              <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">The Tactic</div>
                              <div className="text-white text-sm leading-relaxed">{receipt.bestie_look}</div>
                            </div>

                            <div>
                              <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">Calling It</div>
                              <div className="text-white/90 text-sm leading-relaxed">{receipt.calling_it}</div>
                            </div>

                            <div>
                              <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">Vibe Check</div>
                              <div className="text-white/70 text-sm leading-relaxed italic">{receipt.vibe_check}</div>
                            </div>
                          </div>

                          <div className="flex justify-center gap-1.5 mt-4 pt-3 border-t border-white/5">
                            {[0,1,2].map(idx => (
                              <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-teal-400' : 'w-1.5 bg-white/20'}`} />
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {showPaywall && (
                  <div className="bg-gradient-to-br from-black/30 to-black/20 rounded-xl p-4 sm:p-6 border border-white/[0.08] flex items-center justify-center mt-3">
                    <Lock className="w-5 h-5 text-stone-400/60 mr-3" />
                    <span className="text-stone-400/70 text-xs sm:text-sm font-medium">Unlock more receipts</span>
                  </div>
                )}
              </div>
              
              {/* Desktop - Full Width First Card + Expandable View */}
              <div className="hidden sm:block">
                {/* First Card - Full Width */}
                {safeDeepDive.receipts?.[0] && (() => {
                  const receipt = safeDeepDive.receipts[0];
                  const priority = getReceiptPriority(receipt, 0);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className={`receipt-card relative rounded-xl p-4 bg-black/40 backdrop-blur-sm cursor-pointer group border-2 ${priority.borderColor} shadow-[0_0_40px_rgba(20,184,166,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-400/60 transition-all duration-300`}
                      data-autopsy-item
                      data-index={0}
                      onClick={() => copyToClipboard(receipt.quote)}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    
                    {/* Quote */}
                    <div className="relative text-white/95 text-lg mb-3 pb-3 font-medium italic leading-relaxed pr-8 border-b border-teal-400/20 text-center">
                      💬 "{receipt.quote}"
                    </div>
                    
                    {/* Content sections with better spacing */}
                    <div className="space-y-2">
                      <div>
                        <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">The Tactic</div>
                        <div className="text-white text-base leading-relaxed">{receipt.bestie_look}</div>
                      </div>

                      <div>
                        <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">Calling It</div>
                        <div className="text-white/90 text-sm leading-relaxed">{receipt.calling_it}</div>
                      </div>

                      <div>
                        <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">Vibe Check</div>
                        <div className="text-white/70 text-sm leading-relaxed italic">{receipt.vibe_check}</div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })()}

                {/* Expandable View for Additional Cards */}
                {safeDeepDive.receipts && safeDeepDive.receipts.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6"
                    data-share-hide="true"
                  >
                    <button
                      onClick={() => setShowAllAutopsy(!showAllAutopsy)}
                      className="w-full py-4 px-6 bg-gradient-to-r from-teal-500/10 to-teal-600/5 border border-teal-400/30 rounded-xl hover:border-teal-400/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-white font-medium">
                          {showAllAutopsy ? 'Hide Additional Evidence' : 'Click here to view more evidence'}
                        </span>
                        <motion.div
                          animate={{ rotate: showAllAutopsy ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="w-4 h-4 text-teal-400 rotate-90" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Additional Cards - Animated Expand/Collapse */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: showAllAutopsy ? 'auto' : 0,
                        opacity: showAllAutopsy ? 1 : 0
                      }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-6 mt-6">
                        {safeDeepDive.receipts.slice(1, showPaywall ? 3 : 3).map((receipt, i) => {
                          const actualIndex = i + 1;
                          const priority = getReceiptPriority(receipt, actualIndex);
                          return (
                            <motion.div
                              key={actualIndex}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + (i * 0.1) }}
                              whileHover={{ y: -4, scale: 1.02 }}
                              className={`receipt-card relative rounded-xl p-6 bg-black/40 backdrop-blur-sm cursor-pointer group border ${priority.borderColor} shadow-lg hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300`}
                              data-autopsy-item
                              data-index={actualIndex}
                              onClick={() => copyToClipboard(receipt.quote)}
                            >
                              {/* Hover glow */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              
                              {/* Quote */}
                              <div className="relative text-white/95 text-base mb-4 pb-4 font-medium italic leading-relaxed pr-8 border-b border-teal-400/20 text-center">
                                💬 "{receipt.quote}"
                              </div>
                              
                              {/* Content sections */}
                              <div className="space-y-3">
                                <div>
                                  <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">The Tactic</div>
                                  <div className="text-white text-sm leading-relaxed">{receipt.bestie_look}</div>
                                </div>

                                <div>
                                  <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">Calling It</div>
                                  <div className="text-white/90 text-sm leading-relaxed">{receipt.calling_it}</div>
                                </div>

                                <div>
                                  <div className="text-white text-xs uppercase tracking-wider mb-2 font-bold">Vibe Check</div>
                                  <div className="text-white/70 text-sm leading-relaxed italic">{receipt.vibe_check}</div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
              </div>
            </motion.section>

            {/* Locked Content Preview - Journey to Premium */}
            {showPaywall ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="mb-8"
              >
                {/* Blurred Content Preview */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-slate-600/30">
                  {/* Actual Content (Blurred) */}
                  <div className="p-8 sm:p-10 filter blur-sm pointer-events-none">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-4">
                        <span className="text-2xl">📖</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                        Sage's Complete Playbook
                      </h3>
                    </div>
                    
                    {/* Preview Content Blocks */}
                    <div className="space-y-6">
                      <div className="bg-black/40 rounded-2xl p-6 border border-white/20 shadow-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">🎯 Your Strategic Action Plan</h4>
                        <p className="text-gray-300 leading-relaxed">
                          Based on this conversation pattern, here's your personalized 3-step strategy to handle this situation like a pro...
                        </p>
                      </div>
                      
                      <div className="bg-black/40 rounded-2xl p-6 border border-white/20 shadow-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">⚡ Next 48 Hours</h4>
                        <p className="text-gray-300 leading-relaxed">
                          Immediate actions to take, specific phrases to use, and timing strategies that actually work...
                        </p>
                      </div>
                      
                      <div className="bg-black/40 rounded-2xl p-6 border border-white/20 shadow-lg">
                        <h4 className="text-lg font-semibold text-white mb-3">🛡️ Immunity Training</h4>
                        <p className="text-gray-300 leading-relaxed">
                          Break the cycle with these micro-lessons and field tests designed specifically for your situation...
                        </p>
                      </div>
                      {/* See Both Sides Locked Preview (headings only) */}
                      <div className="bg-black/40 rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="grid grid-cols-2">
                          <div className="px-3 py-2 bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-r border-white/10">
                            <h5 className="text-white font-bold text-xs sm:text-sm text-center">Healthy Version</h5>
                          </div>
                          <div className="px-3 py-2 bg-gradient-to-br from-rose-500/10 to-pink-500/5">
                            <h5 className="text-white font-bold text-xs sm:text-sm text-center">What You Got</h5>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-white/10 mt-2">
                          <div className="p-3 space-y-2">
                            <div className="h-3 rounded-md bg-white/15 blur-[1px]"></div>
                            <div className="h-3 rounded-md bg-white/15 blur-[1px] w-5/6"></div>
                            <div className="h-3 rounded-md bg-white/15 blur-[1px] w-4/6"></div>
                          </div>
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
                    <div className="text-center p-8">
                      {/* Lock Icon */}
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400/50 mb-6 shadow-lg shadow-yellow-500/30">
                        <span className="text-3xl">🔒</span>
                      </div>
                      
                      {/* Unlock Message */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                        Unlock Unlimited Receipts + Premium Features
                      </h3>
                      <p className="text-lg text-gray-300 leading-relaxed mb-6 max-w-md mx-auto">
                        Join 1,200+ users getting unlimited analysis, priority support & exclusive features
                      </p>
                      <ul className="text-sm text-gray-300/90 mb-6 space-y-2 max-w-md mx-auto">
                        <li>• Personalized 3-step action plan</li>
                        <li>• Exact wording for tricky moments</li>
                        <li>• Micro-lessons that break the cycle</li>
                        <li>• Unlimited receipt analysis</li>
                        <li>• Priority support & exclusive features</li>
                      </ul>
                      
                      {/* Unlock Button */}
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        ✨ Upgrade to Premium
                      </button>
                      <p className="text-sm text-gray-400 mt-3">
                        7-day money-back guarantee • Cancel anytime
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}

        {/* Premium Sections - Full visibility for premium users */}
        {!showPaywall && (
          <>
                {/* Strategic Analysis Framework */}
            {/* SAGE'S DYNAMICS removed per request */}

                {/* Implementation Roadmap */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-3"
                  data-playbook-section
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: '#14B8A6' }}>SAGE'S PLAYBOOK</h3>
                    </div>
                    <div className="text-xs text-stone-400/70 font-mono">STRATEGIC MOVES</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Next 48 Hours - Enhanced */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className=" rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bg-black/40"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-600/25 border border-teal-400/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-xl">⏰</span>
                        </div>
                        <div className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wide">NEXT 48 HOURS</div>
                      </div>
                      <p className="text-stone-200/90 text-base leading-relaxed font-medium">
                        {safeDeepDive.playbook?.next_48h}
                      </p>
                    </motion.div>

                    {/* Your Moves - Enhanced */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className=" rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bg-black/40"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-600/25 border border-teal-400/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-xl">🎯</span>
                        </div>
                        <div className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wide">YOUR MOVES</div>
                      </div>
                      <ul className="space-y-3">
                        {(safeDeepDive.playbook?.your_move?.split('. ') || [])
                          .filter(move => move.trim())
                          .slice(0, 3)
                          .map((move, i) => (
                            <motion.li 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + (i * 0.1) }}
                                className="flex items-start gap-3 group/item"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#14B8A6]/20 to-[#2DD4BF]/20 border border-[#14B8A6]/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                                  <ChevronRight className="w-3 h-3 text-[#14B8A6]" />
                                </div>
                                <span className="text-stone-200/90 text-base font-medium leading-relaxed">{move}</span>
                              </motion.li>
                            ))}
                        </ul>
                    </motion.div>
              </div>
            </motion.section>
          </>
        )}

            {/* Strategic Recommendation */}
        {/* Sage's Seal (Final Wisdom) - show for premium users only */}
        {!showPaywall && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-3"
              data-seal-section
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                  <h3 className="text-lg font-bold uppercase tracking-wider" style={{ color: '#14B8A6' }}>SAGE'S SEAL</h3>
                </div>
                <div className="text-xs text-stone-400/70 font-mono">FINAL WISDOM</div>
          </div>
          
              <div className="relative group">
                {/* Enhanced Gold glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-transparent rounded-xl blur-3xl group-hover:blur-2xl transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3]/6 to-transparent rounded-xl blur-xl group-hover:blur-lg transition-all duration-500" />
                
                <div className="relative bg-[#0b1220]/60 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/30 text-center shadow-2xl group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] transition-all duration-500">
                  {/* Enhanced Crown with Animation */}
                  <motion.div 
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"
                  >
                    👑
                  </motion.div>
                  
                  {/* Enhanced Header */}
                  <motion.h4 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase mb-2"
                  >
                    Sage's Seal
                  </motion.h4>
                  
                  {/* Enhanced Quote */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg font-medium leading-relaxed px-2 group-hover:scale-105 transition-transform duration-300"
              style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                    "{safeDeepDive.sages_seal || analysisData?.sages_seal}"
                  </motion.p>
                  
                  {/* Subtle Sparkle Effect */}
                  <div className="absolute top-4 right-4 text-[#D4AF37]/30 group-hover:text-[#D4AF37]/60 transition-colors duration-300">
                    ✨
                  </div>
                  <div className="absolute bottom-4 left-4 text-[#F5E6D3]/30 group-hover:text-[#F5E6D3]/60 transition-colors duration-300">
                    ✨
                  </div>
          </div>
          </div>
        </motion.section>
        )}

          </div>
        </div>

        {/* Container 2: Save & Share Section - Separated like Truth Receipt */}
        {isPremium && (
          <div 
            className="rounded-3xl p-8 mt-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '2px solid rgba(168, 85, 247, 0.7)',
              boxShadow: '0 12px 40px rgba(168, 85, 247, 0.2), 0 0 100px rgba(168, 85, 247, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            data-share-hide="true"
          >
            {/* Subtle connecting visual elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)'
                }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)'
                }}
              ></div>
            </div>
            <div className="relative z-10">
            {/* Urgency Message */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-300 font-medium animate-pulse flex items-center justify-center gap-2">
                <span className="text-lg">😱</span>
                Your friends need to see this
              </p>
            </div>
            
            {/* Save & Share Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button
                onClick={handleSaveClean}
                className="w-full sm:w-auto px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-stone-200/90 rounded-xl border border-white/[0.08] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save Playbook
              </button>
              
              <button
                onClick={() => {
                  // Haptic feedback for mobile
                  if (window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                  }
                  handleSharePlaybook();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5E6D3] text-black font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                🔗 Share Playbook
              </button>
            </div>
            
            {/* How does sharing work link */}
            <div className="text-center">
              <button 
                onClick={() => setShowInstructions(true)}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                How does sharing work? →
              </button>
            </div>
            </div>
          </div>
        )}
        

        {/* Website URL */}
        <div className="text-center">
          <p className="text-xs text-stone-200/40 tracking-widest">
            www.getthereceipts.com
          </p>
        </div>
      </motion.div>
      

      {/* Share Instructions Modal */}
      <ShareInstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        platform={instructionsPlatform}
      />
    </>
  );
});

DeepDive.displayName = 'DeepDive';

export default DeepDive;