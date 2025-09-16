import React, { useState, useRef, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Lock, Share2, Zap, Eye, Clock, Play, Download, Volume2, VolumeX, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
// import { voiceService } from '@/lib/voiceService';

const DeepDive = memo(({ deepDive, analysisData, isPremium = true }) => {
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔥 DEEP DIVE V4 - SHORT, SAVAGE, SUBSTANTIAL:', { deepDive, analysisData, isPremium });
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

  // Smart color system - Consistent teal with valence icon
  const getValenceStyle = (valence) => {
    // Keep teal accent consistent for branding
    // Show valence through icon only
    return {
      accent: 'text-teal-400', // Always teal for consistency
      icon: valence === 'red' ? '🚨' : valence === 'green' ? '✨' : '⚡'
    };
  };

  const style = getValenceStyle(valence);

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

  return (
    <div className="relative w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto px-4 sm:px-0 pb-8 sm:pb-12 md:pb-16">
      {/* The Tea V4 Main Container - 9:16 Format */}
      <motion.div 
        data-deepdive-component
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 sm:p-6 md:p-8 lg:p-10 mb-4 sm:mb-6 md:mb-8 relative hover:scale-[1.01] transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, #1a1a3e 0%, #14142e 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '2px solid rgba(20, 184, 166, 0.4)',
          boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
        }}
      >

        {/* The Tea Header - Premium Gold Signature */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="p-6 py-8 rounded-xl border border-white/8 relative overflow-hidden" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
            }}>
            
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl opacity-80">🫖</span>
              <h2 className="gradient-text text-3xl md:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                SAGE'S TEA
              </h2>
            </div>
            <div className="text-xs font-bold tracking-wider text-amber-300 opacity-90 mb-4">
              TRUTH • SERVED • FRESH
            </div>
            
          </div>
        </motion.div>

        {/* 1. THE VERDICT - Separate Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Eye className={`w-4 h-4 ${style.accent}`} />
            <h3 className={`${style.accent} font-bold text-sm tracking-wide`}>THE VERDICT</h3>
          </div>
          
          <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
            <div className="text-center">
              <div className={`text-lg font-bold ${style.accent} mb-1`}>
                {deepDive.verdict?.act || analysisData?.verdict || 'Analysis Complete'}
              </div>
              <div className="text-stone-200 text-base italic mb-4 leading-relaxed">
                "{deepDive.verdict?.subtext || 'Sage has analyzed the situation'}"
              </div>
            </div>
          </div>
        </motion.section>

        {/* 2. RECEIPT AUTOPSY - 2x2 Grid */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap className={`w-4 h-4 ${style.accent}`} />
            <h3 className={`${style.accent} font-bold text-sm tracking-wide`}>RECEIPT AUTOPSY</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-0 rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            {/* Get 4 receipts for the grid */}
            {(deepDive.receipts?.slice(0, 4) || []).map((receipt, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`p-4 relative ${
                  index === 0 ? 'border-r border-b' : 
                  index === 1 ? 'border-b' : 
                  index === 2 ? 'border-r' : ''
                }`}
                style={{ 
                  borderColor: 'rgba(49, 224, 194, 0.2)' // Translucent blue/teal borders
                }}
              >
                {/* Lock icon for premium receipts (index 2 and 3) */}
                {showPaywall && index >= 2 && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                    <Lock className="w-5 h-5 text-white/60" />
                  </div>
                )}
                
                <div className={`${showPaywall && index >= 2 ? 'opacity-30' : ''}`}>
                  <div className="text-stone-200 text-sm mb-2 font-normal italic leading-relaxed">
                    "{receipt.quote}"
                  </div>
                  <div className="text-xs mb-1">
                    <span className={`text-teal-400 font-bold`}>
                      {receipt.pattern}
                    </span>
                  </div>
                  <div className="text-stone-200/80 text-sm leading-relaxed">
                    Cost: {receipt.cost}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Premium Sections - Blurred if not premium */}
        {showPaywall && (
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 rounded-xl flex items-center justify-center">
              <div className="text-center p-6">
                <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="text-stone-200 font-bold text-lg mb-2">Unlock Full Tea</h4>
                <p className="text-stone-200 text-base mb-4 leading-relaxed">Get The Physics, The Playbook, and complete pattern analysis</p>
                <button className="viral-button text-stone-200 font-normal py-2 px-6 rounded-full transition-all duration-300">
                  Unlock Premium
                </button>
              </div>
            </div>
            
            {/* Blurred Premium Content Preview */}
            <div className="filter blur-lg opacity-50">
              {/* 3. THE PHYSICS */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-6">
                  <Play className={`w-4 h-4 ${style.accent}`} />
                  <h3 className={`${style.accent} font-bold text-sm tracking-wide`}>THE PHYSICS</h3>
                </div>
                <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-semibold text-teal-400">What you bring:</span> <span className="text-stone-200 text-base">Pattern recognition</span></div>
                    <div><span className="font-semibold text-teal-400">What they exploit:</span> <span className="text-stone-200 text-base">Your willingness to understand</span></div>
                    <div><span className="font-semibold text-teal-400">The result:</span> <span className="text-stone-200 text-base">Endless confusion cycles</span></div>
                  </div>
                </div>
              </div>

              {/* 4. THE PLAYBOOK */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className={`w-4 h-4 ${style.accent}`} />
                  <h3 className={`${style.accent} font-bold text-sm tracking-wide`}>THE PLAYBOOK</h3>
                </div>
                <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                    <p className="text-stone-200/60 text-sm">Premium content - Upgrade to see the full playbook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Sections - Full visibility for premium users */}
        {!showPaywall && (
          <>
            {/* 3. THE PHYSICS */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Play className={`w-4 h-4 ${style.accent}`} />
                <h3 className={`${style.accent} font-bold text-sm tracking-wide`}>THE PHYSICS</h3>
              </div>
              
              <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                <div className="space-y-2 text-sm">
                  <div className="leading-relaxed">
                    <span className="font-semibold text-teal-400">What you bring:</span>{' '}
                    <span className="text-stone-200 text-base">{deepDive.physics?.you_bring || ''}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-semibold text-teal-400">What they exploit:</span>{' '}
                    <span className="text-stone-200 text-base">{deepDive.physics?.they_exploit || ''}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-semibold text-teal-400">The result:</span>{' '}
                    <span className="text-stone-200 text-base">{deepDive.physics?.result || ''}</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 4. THE PLAYBOOK */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock className={`w-4 h-4 ${style.accent}`} />
                <h3 className={`${style.accent} font-bold text-sm tracking-wide`}>THE PLAYBOOK</h3>
              </div>
              
              <div className="rounded-xl p-6 border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                <div className="space-y-2 text-sm">
                  <div className="leading-relaxed">
                    <span className="font-semibold text-teal-400">Next 48hrs:</span>{' '}
                    <span className="text-stone-200 text-base">{deepDive.playbook?.next_48h || ''}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-semibold text-teal-400">Next week:</span>{' '}
                    <span className="text-stone-200 text-base">{deepDive.playbook?.next_week || ''}</span>
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-semibold text-teal-400">Your Move:</span>
                    <div className="mt-2 space-y-1">
                      {(deepDive.playbook?.your_move || '').split('. ').filter(action => action.trim()).map((action, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-teal-400 text-sm mt-1">•</span>
                          <span className="text-stone-200 text-base">{action.trim().replace(/\.$/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        )}

        {/* 5. SAGE'S SEAL - Always Visible with Lock Watermark */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative mt-12"
        >
          
          <div className="p-8 border relative overflow-hidden z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            borderColor: 'rgba(212, 175, 55, 0.5)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div className="text-center mb-4">
            <span className="text-2xl mb-2 block">🔮</span>
            <h4 className="gradient-text font-bold text-lg tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              SAGE'S SEAL
            </h4>
          </div>
          
          <div className="text-center mb-3">
            <p className="gradient-text text-xl font-medium mb-2"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              "{deepDive.sages_seal || analysisData?.deepDive?.sages_seal || analysisData?.sages_seal || getFallbackSeal()}"
            </p>
            {(deepDive.share_text || getFallbackSeal()) && (
              <p className="text-stone-200 text-lg italic leading-relaxed">
                {deepDive.share_text || analysisData?.deepDive?.share_text || analysisData?.share_text || ""}
              </p>
            )}
          </div>

          
          <p className="text-center text-white/60 text-xs mt-4">Sealed with Sage's Wisdom 🔮</p>
          </div>
        </motion.section>

        {/* WATERMARK - Final element in Sage's Tea */}
        <div className="text-center mt-4 mb-6">
          <p className="text-xs text-stone-200/90/40 tracking-widest">
            www.getthereceipts.com
          </p>
        </div>

      </motion.div>

      {/* SEPARATE SAVE/SHARE BOX - Completely outside the tea card */}
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
            onClick={handleSaveTea}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Download className="h-4 w-4" />
            Save Tea
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
            onClick={handleShareTea}
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
            <Share2 className="h-4 w-4" />
            Share The Tea
          </motion.button>
        </div>
        
        {/* Sage's Disclaimer */}
        <div className="mt-4 sm:mt-6 text-center px-4 sm:px-0">
          <p className="text-xs sm:text-sm text-stone-400/70 leading-relaxed max-w-sm sm:max-w-md mx-auto">
            <span className="text-amber-300/80">🔮</span> Look, we're really good at reading the room and serving up insights, but we're not your therapist, not licensed professionals, and for the love of all that's holy, don't take life changing advice from an AI with opinions and sass. For entertainment only. Think of us as your witty friends with someone else's lived experience. This service is intended for users 13+ only (under 18 requires parental consent).
          </p>
        </div>
      </div>
    </div>
  );
});

DeepDive.displayName = 'DeepDive';

export default DeepDive;