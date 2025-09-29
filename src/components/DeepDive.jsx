import React, { useState, useRef, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Lock, Share2, Zap, Eye, Clock, Play, Download, Volume2, VolumeX, Pause, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
// import { voiceService } from '@/lib/voiceService';

const DeepDive = memo(({ deepDive, analysisData, originalMessage, context, isPremium = true }) => {
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔥 DEEP DIVE V4 - SHORT, SAVAGE, SUBSTANTIAL:', { deepDive, analysisData, originalMessage, context, isPremium });
    }
  }, [deepDive, analysisData, isPremium]);
  
  const { toast } = useToast();
  const [copiedText, setCopiedText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef(null);

  const handleShareTea = async () => {
    try {
      const element = document.querySelector('[data-deepdive-component]');
      const shareText = `☕ Just got the REAL TEA from SAGE: "${deepDive?.tea_wisdom || analysisData?.deepDive?.sages_seal || analysisData?.sages_seal || 'The truth is always better than pretty lies.'}" Get your own tea at getthereceipts.com #GetTheReceipts #TeaSpilled #SageSays`;
      
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
          
          if (blob) {
            const file = new File([blob], `sages-tea-${Date.now()}.png`, { type: 'image/png' });
            try {
              await navigator.share({
                title: 'SAGE Spilled the Tea',
                text: shareText,
                url: 'https://getthereceipts.com',
                files: [file]
              });
            } catch (shareError) {
              // Fallback to text-only share
              await navigator.share({
                title: 'SAGE Spilled the Tea',
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
      const shareText = `☕ Just got the REAL TEA from SAGE: "${deepDive?.tea_wisdom || analysisData?.deepDive?.sages_seal || analysisData?.sages_seal || 'The truth is always better than pretty lies.'}" Get your own tea at getthereceipts.com #GetTheReceipts #TeaSpilled #SageSays`;
      copyToClipboard(shareText);
    }
  };

  const handleSaveTea = async () => {
    const element = document.querySelector('[data-deepdive-component]');
    if (!element) {
      toast({ title: "Error", description: "Could not find tea component to save.", variant: "destructive" });
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
    }
  };

  // Save current DeepDive view but hide certain sections (metrics, HOT TAKES badge, Dynamics)
  const handleSaveClean = async () => {
    const element = document.querySelector('[data-deepdive-component]');
    if (!element) {
      toast({ title: "Error", description: "Could not find component to save.", variant: "destructive" });
      return;
    }

    // Find all nodes marked to hide for share
    const nodesToHide = Array.from(element.querySelectorAll('[data-share-hide="true"]'));
    // Additionally hide autopsy items with index >= 2 to keep only two
    const extraAutopsyToHide = Array.from(element.querySelectorAll('[data-autopsy-item]'))
      .filter(n => (parseInt(n.getAttribute('data-index') || '0', 10)) >= 2);
    const allToHide = [...nodesToHide, ...extraAutopsyToHide];
    const previousDisplays = allToHide.map(n => n.style.display);

    // Easiest robust fix: temporarily flatten backgrounds/borders to remove banding/lines
    const styledNodes = [];
    const isGoldOrTeal = (val = '') => /#D4AF37|212,\s*175,\s*55|rgba\(20,\s*184,\s*166/i.test(val);
    const descendants = element.querySelectorAll('*');
    descendants.forEach(node => {
      const style = node.style || {};
      const prev = {
        background: style.background,
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor,
        boxShadow: style.boxShadow,
        border: style.border,
        borderTop: style.borderTop,
        borderRight: style.borderRight,
        borderBottom: style.borderBottom,
        borderLeft: style.borderLeft,
        outline: style.outline,
        backdropFilter: style.backdropFilter,
        filter: style.filter,
        opacity: style.opacity
      };
      styledNodes.push({ node, prev });

      // Remove shadows/filters that cause banding; preserve original backgrounds/gradients
      style.boxShadow = 'none';
      style.backdropFilter = 'none';
      style.filter = 'none';
      style.outline = 'none';

      // Remove non-gold borders that cause hairlines
      const borders = [style.border, style.borderTop, style.borderRight, style.borderBottom, style.borderLeft];
      const hasGold = borders.some(b => isGoldOrTeal(b));
      if (!hasGold) {
        style.border = 'none';
        style.borderTop = 'none';
        style.borderRight = 'none';
        style.borderBottom = 'none';
        style.borderLeft = 'none';
      }
    });
    try {
      allToHide.forEach(n => { n.style.display = 'none'; });
      const blob = await domtoimage.toBlob(element, {
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: { transform: 'scale(2)', transformOrigin: 'top left' },
        bgcolor: '#1a1a2e',
        quality: 1
      });
      const timestamp = Date.now();
      saveAs(blob, `Sage-DeepDive-Clean-${timestamp}.png`);
      toast({ title: "Saved!", description: "Clean share image downloaded." });
    } catch (err) {
      console.error('Clean save error', err);
      toast({ title: "Error", description: "Could not save clean share.", variant: "destructive" });
    } finally {
      // Restore displays
      allToHide.forEach((n, i) => { n.style.display = previousDisplays[i]; });
      // Restore styles (backgrounds were never changed to preserve original design)
      styledNodes.forEach(({ node, prev }) => {
        const style = node.style || {};
        style.background = prev.background;
        style.backgroundImage = prev.backgroundImage;
        style.backgroundColor = prev.backgroundColor;
        style.boxShadow = prev.boxShadow;
        style.border = prev.border;
        style.borderTop = prev.borderTop;
        style.borderRight = prev.borderRight;
        style.borderBottom = prev.borderBottom;
        style.borderLeft = prev.borderLeft;
        style.outline = prev.outline;
        style.backdropFilter = prev.backdropFilter;
        style.filter = prev.filter;
        style.opacity = prev.opacity;
      });
    }
  };

  // Generate 9:16 share images (hero | autopsy | actions)
  const handleSaveNineBySixteen = async () => {
    try {
      const mode = (window.prompt('Share Mode: hero | autopsy | actions', 'hero') || 'hero').toLowerCase();
      const container = document.createElement('div');
      container.style.width = '1080px';
      container.style.height = '1920px';
      container.style.background = 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)';
      container.style.border = '2px solid rgba(20, 184, 166, 0.4)';
      container.style.borderRadius = '32px';
      container.style.boxShadow = '0 8px 32px rgba(20,184,166,0.15), 0 0 80px rgba(20,184,166,0.05)';
      container.style.padding = '64px';
      container.style.color = 'white';
      container.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
      container.style.position = 'fixed';
      container.style.top = '-99999px';
      container.style.left = '-99999px';

      const title = safeDeepDive?.verdict?.act || analysisData?.verdict || "Sage's Deep Dive";
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
      header.innerHTML = `<div style="width:72px;height:72px;border-radius:50%;overflow:hidden;border:2px solid rgba(20,184,166,.4);box-shadow:0 0 20px rgba(20,184,166,.3);"><img src="/src/assets/sage-dark-circle.png" alt="Sage" style="width:100%;height:100%;object-fit:cover"/></div>
        <div style="font-weight:800;letter-spacing:.18em;color:#14B8A6">SAGE'S DEEP DIVE</div>`;
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
          <div style="font-size:40px;color:#fff;font-weight:700;line-height:1.2;margin-bottom:16px">“${bestReceipt.quote || 'No quote available'}”</div>
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
            <div style="font-size:40px;line-height:1.4;background:linear-gradient(135deg,#D4AF37,#F5E6D3,#D4AF37);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">“${seal || 'Trust your intuition.'}”</div>
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
    if (flagCount <= 6) return "text-orange-400";  // Orange for 4-6 flags (mixed)
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
          <h3 className="text-purple-300 font-bold text-base mb-2">Sage is finishing the read</h3>
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

  const risk = getRiskStyling(valence);

  return (
    <>
      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Main Container - Exact Copy from Sage's Receipt */}
      <motion.div
        data-deepdive-component
        className="w-full max-w-2xl mx-auto"
        style={{
          background: 'transparent'
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div 
          className="relative rounded-[24px] p-3 sm:p-4 md:p-6 text-stone-200/90"
          style={{
            background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
            backdropFilter: 'blur(20px) saturate(200%)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%)',
            border: '2px solid rgba(20, 184, 166, 0.4)',
            boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
          }}>
          <div className="relative z-10">

            {/* Sage's Deep Dive Header - Horizontal Banner Style */}
            <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* SAGE HEADER - Exact Match to Truth Receipts */}
        <div className="text-center mb-1 relative z-50">
          <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-stone-400/20 mb-2 relative z-50">
            <img
              src="/src/assets/sage-dark-circle.png"
              alt="Sage's Deep Dive"
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
              SAGE'S DEEP DIVE
            </span>
          </div>
        </div>
                
                {/* Hot Takes Badge - Humor Protection */}
                <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-sm font-bold tracking-wider uppercase">HOT</span>
                    </div>
                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                      <span className="text-orange-400 text-sm font-bold tracking-wider uppercase">TAKES</span>
                  </div>
                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                      <span className="text-yellow-400 text-sm font-bold tracking-wider uppercase">SERVED</span>
                  </div>
                  </div>
                </div>
                
              </motion.div>
            </div>
            
            {/* Executive Summary Dashboard */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="rounded-3xl p-6 border border-white/[0.12] shadow-2xl bg-black/50 backdrop-blur-sm">
                {/* Sage's Summary Header */}
                <div className="flex items-center justify-between mb-6" data-share-hide="true">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                    <h2 className="text-base sm:text-sm font-bold uppercase tracking-wider" style={{ color: '#399d96' }}>SAGE'S SUMMARY</h2>
                  </div>
                  <div className="text-xs text-stone-400/70 font-mono">HOT TAKE ANALYSIS</div>
                </div>
                {/* Strategic Assessment (Headline) */}
                <div className="rounded-2xl p-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#F5E6D3]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                        <span className="text-[#D4AF37] text-xl">🎯</span>
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-black ${getArchetypeColor()} leading-tight`}
                        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 184, 166, 0.2)' }}>
                        {safeDeepDive.verdict?.act || analysisData?.verdict}
                      </h3>
                    </div>
                    {/* Removed teal underline per request */}
                    <p className="text-stone-200/90 text-sm sm:text-base leading-relaxed">
                      {safeDeepDive.verdict?.subtext}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Dashboard - 1x3 horizontal layout */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2 mb-4 sm:mb-2" data-share-hide="true">
                  {/* Risk Assessment */}
                  <div className="bg-black/40 rounded-xl p-3 sm:p-4">
                    <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                      RISK LEVEL
                    </div>
                    <div className="text-sm font-bold text-red-400 mb-2">
                      HIGH
                    </div>
                    <div className="w-1/2 bg-white/20 rounded-full h-2 mb-1">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="text-xs text-stone-300/80">
                      Requires immediate attention
                    </div>
                  </div>
                  
                  {/* Compatibility Score */}
                  <div className="bg-black/40 rounded-xl p-3 sm:p-4">
                    <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                      COMPATIBILITY
                    </div>
                    <div className="text-sm font-bold text-amber-400 mb-2">
                      42%
                    </div>
                    <div className="w-1/2 bg-white/20 rounded-full h-2 mb-1">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="text-xs text-stone-300/80">
                      Below optimal threshold
                    </div>
                  </div>

                  {/* Communication Health */}
                  <div className="bg-black/40 rounded-xl p-3 sm:p-4">
                    <div className="text-xs uppercase tracking-wider text-white/70 mb-1">
                      COMMUNICATION
                    </div>
                    <div className="text-sm font-bold text-blue-400 mb-2">
                      POOR
                    </div>
                    <div className="w-1/2 bg-white/20 rounded-full h-2 mb-1">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="text-xs text-stone-300/80">
                      Significant barriers detected
                    </div>
                  </div>
                </div>
                
                {/* Strategic Assessment moved above as headline */}
              </div>
            </motion.section>


            {/* Data Intelligence Report */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="bg-black/45 backdrop-blur-sm rounded-3xl p-6 border border-white/[0.12] shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                    <h3 className="text-base sm:text-sm font-bold uppercase tracking-wider" style={{ color: '#399d96' }}>SAGE'S RECEIPT AUTOPSY</h3>
                  </div>
                  <div className="text-xs text-stone-400/70 font-mono">EVIDENCE COLLECTED</div>
              </div>
              
              {/* Mobile - 2x2 Grid Autopsy */}
              <div className="sm:hidden grid grid-cols-2 gap-3">
                {(safeDeepDive.receipts?.slice(0, 4) || []).map((receipt, i) => (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl p-4 sm:p-6 border border-white/[0.12] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-black/40 backdrop-blur-sm"
                    data-autopsy-item
                    data-index={i}
                    onClick={() => copyToClipboard(receipt.quote)}
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Copy Icon */}
                    <Copy className="absolute top-4 right-4 w-4 h-4 text-stone-400/50 group-hover:text-[#D4AF37] transition-colors duration-300" />
                    
                    {/* Quote - adjusted for mobile readability */}
                    <div className="text-stone-200/95 text-sm sm:text-lg mb-3 sm:mb-4 font-medium italic leading-relaxed pr-6 sm:pr-8">
                      "{receipt.quote}"
                    </div>
                    
                    {/* Pattern Badge - More colorful and prominent */}
                    <div className="inline-block px-2.5 py-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#F5E6D3]/20 text-[#D4AF37] rounded-full text-[11px] sm:text-sm font-semibold mb-2 sm:mb-3 border border-[#D4AF37]/30">
                      {receipt.pattern}
                    </div>
                    
                    {/* Cost - Better contrast */}
                    <div className="text-stone-300/80 text-xs sm:text-sm font-medium">
                      {receipt.cost}
                    </div>
                  </motion.div>
                ))}
                {showPaywall && (
                  <div className="bg-gradient-to-br from-black/30 to-black/20 rounded-2xl p-4 sm:p-6 border border-white/[0.08] flex items-center justify-center col-span-2">
                    <Lock className="w-5 h-5 text-stone-400/60 mr-3" />
                    <span className="text-stone-400/70 text-xs sm:text-sm font-medium">Unlock 2 more receipts</span>
                  </div>
                )}
              </div>
              
              {/* Desktop - Enhanced Grid */}
              <div className="hidden sm:grid sm:grid-cols-2 gap-6">
                {(safeDeepDive.receipts?.slice(0, showPaywall ? 2 : 4) || []).map((receipt, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="relative rounded-2xl p-6 border border-white/[0.12] shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    data-autopsy-item
                    data-index={i}
                    onClick={() => copyToClipboard(receipt.quote)}
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Copy Icon */}
                    <Copy className="absolute top-4 right-4 w-4 h-4 text-stone-400/40 group-hover:text-[#D4AF37] transition-colors duration-300" />
                    
                    {/* Quote - BIGGER and more prominent */}
                    <div className="text-stone-200/95 text-base mb-4 font-medium italic leading-relaxed pr-8">
                      "{receipt.quote}"
                    </div>
                    
                    {/* Pattern Badge - More colorful and prominent */}
                    <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#D4AF37]/20 to-[#F5E6D3]/20 text-[#D4AF37] rounded-full text-sm font-semibold mb-3 border border-[#D4AF37]/30">
                      {receipt.pattern}
                    </div>
                    
                    {/* Cost - Better contrast */}
                    <div className="text-stone-300/80 text-sm font-medium">
                      {receipt.cost}
                  </div>
                  </motion.div>
                ))}
                {showPaywall && [1,2].map(i => (
                  <div key={`locked-${i}`} className="bg-gradient-to-br from-black/30 to-black/20 rounded-2xl p-6 border border-white/[0.08] flex items-center justify-center">
                    <Lock className="w-5 h-5 text-stone-400/60" />
                  </div>
                ))}
                </div>
              </div>
            </motion.section>

            {/* Premium Content or Paywall */}
            {showPaywall ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-2xl p-8 border border-[#D4AF37]/20 text-center"
              >
                <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                <h4 className="text-xl font-light text-stone-200/90 mb-2">Unlock Complete Analysis</h4>
                <p className="text-stone-300/80 mb-6">Get the full dynamics, playbook, and Sage's wisdom</p>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5E6D3] text-black font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  Go Premium
                </button>
              </motion.div>
            ) : null}

        {/* Premium Sections - Full visibility for premium users */}
        {!showPaywall && (
          <>
                {/* Strategic Analysis Framework */}
            <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
              className="mb-6"
            >
                  <div className="flex items-center justify-between mb-6" data-share-hide="true">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      <h3 className="text-base sm:text-sm font-bold uppercase tracking-wider" style={{ color: '#399d96' }}>SAGE'S DYNAMICS</h3>
              </div>
                    <div className="text-xs text-stone-400/70 font-mono">RELATIONSHIP PHYSICS</div>
                  </div>
                  {/* Dynamics content (visible in normal view, hidden in Save Clean) */}
                  <div className="rounded-2xl p-6 border border-white/[0.12] shadow-lg hover:shadow-xl transition-all duration-300 bg-black/50 backdrop-blur-sm" data-share-hide="true">
                    <div className="space-y-6">
                      {[
                        { 
                          label: 'What you bring', 
                          value: safeDeepDive.physics?.you_bring,
                          icon: '💝',
                          color: 'from-emerald-500/20 to-emerald-400/10',
                          borderColor: 'border-emerald-500/30'
                        },
                        { 
                          label: 'What they exploit', 
                          value: safeDeepDive.physics?.they_exploit,
                          icon: '🎯',
                          color: 'from-red-500/20 to-red-400/10',
                          borderColor: 'border-red-500/30'
                        },
                        { 
                          label: 'The result', 
                          value: safeDeepDive.physics?.result,
                          icon: '⚡',
                          color: 'from-amber-500/20 to-amber-400/10',
                          borderColor: 'border-amber-500/30'
                        }
                      ].map((item, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          className="group"
                        >
                          <div className="flex gap-6 items-start">
                            {/* Enhanced Icon with Background */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <span className="text-2xl">{item.icon}</span>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                              <div className="text-[#D4AF37] text-sm font-semibold mb-2 uppercase tracking-wide">
                                {item.label}
                              </div>
                              <div className="text-stone-200/90 text-base leading-relaxed font-medium">
                                {item.value}
                              </div>
                            </div>
                        </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* Implementation Roadmap */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      <h3 className="text-base sm:text-sm font-bold uppercase tracking-wider" style={{ color: '#399d96' }}>SAGE'S PLAYBOOK</h3>
                    </div>
                    <div className="text-xs text-stone-400/70 font-mono">STRATEGIC MOVES</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Next 48 Hours - Enhanced */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className=" rounded-2xl p-6 border border-white/[0.12] shadow-lg hover:shadow-xl transition-all duration-300 group bg-black/40 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                      className=" rounded-2xl p-6 border border-white/[0.12] shadow-lg hover:shadow-xl transition-all duration-300 group bg-black/40 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-400/10 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#F5E6D3]/20 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                                <ChevronRight className="w-3 h-3 text-[#D4AF37]" />
                </div>
                              <span className="text-stone-200/90 text-sm font-medium leading-relaxed">{move}</span>
                            </motion.li>
                          ))}
                      </ul>
                    </motion.div>
              </div>
            </motion.section>
          </>
        )}

            {/* Strategic Recommendation */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                  <h3 className="text-base sm:text-sm font-bold uppercase tracking-wider" style={{ color: '#399d96' }}>SAGE'S SEAL</h3>
                </div>
                <div className="text-xs text-stone-400/70 font-mono">FINAL WISDOM</div>
          </div>
          
              <div className="relative group">
                {/* Enhanced Gold glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3]/10 to-transparent rounded-3xl blur-xl group-hover:blur-lg transition-all duration-500" />
                
                <div className="relative bg-black/45 backdrop-blur-sm rounded-3xl p-8 border border-[#D4AF37]/30 text-center shadow-2xl group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] transition-all duration-500">
                  {/* Enhanced Crown with Animation */}
                  <motion.div 
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300"
                  >
                    👑
                  </motion.div>
                  
                  {/* Enhanced Header */}
                  <motion.h4 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm font-semibold tracking-[0.3em] text-[#D4AF37] uppercase mb-6"
                  >
                    Sage's Seal
                  </motion.h4>
                  
                  {/* Enhanced Quote */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-2xl font-medium leading-relaxed px-4 group-hover:scale-105 transition-transform duration-300"
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

            {/* Actions - Premium Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 max-w-2xl mx-auto" data-share-hide="true">
          <button 
            onClick={handleSaveTea}
                className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-stone-200/90 rounded-xl border border-white/[0.08] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleSaveClean}
                className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-stone-200/90 rounded-xl border border-white/[0.08] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save Clean
              </button>
              <button
                onClick={handleSaveNineBySixteen}
                className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-stone-200/90 rounded-xl border border-white/[0.08] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save 9:16
          </button>
              <button
                onClick={() => {
                  // Haptic feedback for mobile
                  if (window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                  }
                  handleShareTea();
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5E6D3] text-black font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Tea
              </button>
        </div>
        
            {/* Footer - match Sage Receipt */}
            <div className="text-center mt-4 mb-2">
              <p className="text-xs text-stone-400/70 italic">
                For entertainment purposes - Sage calls it like she sees it
              </p>
            </div>
            <div className="text-center mt-2 mb-6">
              <p className="text-xs text-stone-200/90/40 tracking-widest">
                www.getthereceipts.com
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

DeepDive.displayName = 'DeepDive';

export default DeepDive;