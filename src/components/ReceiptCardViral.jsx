import React, { memo, useMemo, Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Download, Share2 } from 'lucide-react';
import TrendSticker from '@/components/TrendSticker';
// Standard Sage image for Truth Receipt
import sageStandardImage from '@/assets/sage-dark-circle.png';

const ReceiptCardViral = memo(({ results, onSaveReceipt, onScreenshot, isSharing, onShowInstructions }) => {
  
  if (!results) return null;


  // Extract data from results
  const { 
    archetype, 
    verdict, 
    realTea,
    yourMove,
    teaAndMovePlay,
    redFlagChips,
    prophecy,
    wastingTime,
    actuallyIntoYou,
    redFlags,
    confidenceScore,
    confidenceRemark,
    originalMessage,
    userQuestion
  } = results;

  // Always use compact density for Receipt on mobile
  const isCompact = true;
  const [showAllFlags, setShowAllFlags] = useState(false);

  // Extract user question from originalMessage
  const extractUserQuestion = (message) => {
    if (!message) return null;
    const questionMatch = message.match(/YOUR QUESTION:\s*(.+?)(?:\n|$)/i);
    return questionMatch ? questionMatch[1].trim() : null;
  };

  const parsedUserQuestion = results?.userQuestion || null;

  // Function to truncate question to approximately 33 words (3 lines)
  const truncateToThreeLines = (text, maxWords = 33) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Memoize debug output to prevent excessive logging
  const debugOutput = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('=== ReceiptCardViral Debug ===');
      console.log('Full results object:', results);
      console.log('DeepDive red_flag_tags:', results?.deepDive?.red_flag_tags);
      console.log('Results redFlagTags:', results?.redFlagTags);
      console.log('Results receipts patterns:', (results?.receipts || []).map(r => r?.pattern));
      console.log('Metrics values:', { wastingTime, actuallyIntoYou, redFlags });
      console.log('Content values:', { archetype, verdict, realTea, yourMove, prophecy });
      console.log('Confidence values:', { confidenceScore, confidenceRemark });
    }
    return null;
  }, [results, wastingTime, actuallyIntoYou, redFlags, archetype, verdict, realTea, yourMove, prophecy, confidenceScore, confidenceRemark]);

  // Get dynamic gradient based on archetype
  const getGradient = (archetypeTitle = '') => {
    let hash = 0;
    for (let i = 0; i < archetypeTitle.length; i++) {
      hash = ((hash << 5) - hash) + archetypeTitle.charCodeAt(i);
      hash |= 0;
    }

    const gradients = [
      "from-rose-500 to-pink-500",
      "from-fuchsia-500 to-purple-500", 
      "from-violet-500 to-indigo-500",
      "from-sky-500 to-cyan-500",
      "from-teal-500 to-emerald-500",
      "from-amber-500 to-yellow-500",
      "from-orange-500 to-red-500",
    ];
    
    const index = Math.abs(hash % gradients.length);
    return gradients[index];
  };

  const gradient = getGradient(archetype);
  
  // Extract emoji and text dynamically from AI response
  const extractEmojiAndText = (text) => {
    if (!text) return { text: '', emoji: '🔮' };
    
    // Find any emoji in the string
    const emojiMatch = text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '🔮';
    
    // Remove all emojis to get clean text
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
    
    return { text: cleanText, emoji };
  };
  
  const { text: archetypeTitle, emoji: archetypeEmoji } = extractEmojiAndText(archetype);
  // "Your Move" – exactly one script from next_move_script
  const nextMove = results?.deepDive?.next_move_script
    ? [results.deepDive.next_move_script]
    : (Array.isArray(yourMove) ? yourMove.filter(Boolean).slice(0, 2) : []);
  
  // Calculate roast level based on metrics
  const roastLevel = Math.max(wastingTime || 0, redFlags ? redFlags * 10 : 0, 100 - (actuallyIntoYou || 0));
  const isSavage = roastLevel > 70;

  // Context-aware flag generation - only as last resort fallback
  const getDynamicFlags = (flagCount, intoYou, wastingTimeLevel) => {
    
    // Determine flag type based on overall assessment
    const isPositive = flagCount <= 3 && intoYou >= 60;
    const isMixed = flagCount <= 6 && intoYou >= 30;
    
    // More specific, less generic flags based on metrics
    let flagsToShow, flagType;
    if (isPositive) {
      flagsToShow = [
        "Consistent responses", "Makes concrete plans", "Clear communication", 
        "Follow-through actions", "Shows genuine interest", "Respects timing"
      ];
      flagType = 'positive';
    } else if (isMixed) {
      flagsToShow = [
        `${wastingTimeLevel}% inconsistency`, "Unclear next steps", "Mixed energy levels",
        "Sometimes responsive", "Needs more clarity", "Pattern confusion"
      ];
      flagType = 'mixed';
    } else {
      // Create flags based on actual metrics
      const wasteFlag = wastingTimeLevel > 70 ? "Time wasting pattern" : "Delayed responses";
      const interestFlag = intoYou < 30 ? "Low interest signals" : "Confusing signals";
      flagsToShow = [
        wasteFlag, interestFlag, "Pattern inconsistency",
        "Communication gaps", "Unclear intentions"
      ];
      flagType = 'negative';
    }
    
    const numFlags = Math.min(Math.max(flagCount, 2), 6); // Show 2-6 flags
    return { 
      flags: flagsToShow.slice(0, numFlags),
      type: flagType
    };
  };

  // Dynamic flag system - determine health based on multiple factors
  const overallHealth = (actuallyIntoYou || 0) - (wastingTime || 0);
  const isHealthy = overallHealth >= 50 || (actuallyIntoYou || 0) >= 70 || (redFlags || 0) === 0; // More lenient health detection
  
  // GUARANTEED FLAGS SYSTEM - This will NEVER fail
  const getGuaranteedFlags = () => {
    // Default flags that ALWAYS exist
    const defaultGreenFlags = [
      "Clear communication", "Makes concrete plans", "Consistent responses", 
      "Shows genuine interest", "Respects boundaries", "Follow-through actions"
    ];
    
    const defaultRedFlags = [
      "Inconsistent communication", "Vague future plans", "Hot and cold behavior", 
      "Avoids commitment talk", "Last minute changes", "Limited availability"
    ];
    
    // Try to get flags from multiple sources
    let finalFlags = [];
    
    if (isHealthy) {
      // For healthy relationships - prioritize green flags
      finalFlags = results?.greenFlagChips?.filter(Boolean) || 
                   results?.redFlagChips?.filter(Boolean) ||
                   defaultGreenFlags.slice(0, 6);
    } else {
      // For unhealthy relationships - use red flags
      finalFlags = results?.redFlagChips?.filter(Boolean) || 
                   results?.deepDive?.red_flag_tags?.filter(Boolean) ||
                   results?.redFlagTags?.filter(Boolean) ||
                   (results?.receipts || []).map(r => r.pattern).filter(Boolean) ||
                   defaultRedFlags.slice(0, 6);
    }
    
    // ABSOLUTE GUARANTEE: If somehow still empty, use defaults
    if (!finalFlags || finalFlags.length === 0) {
      finalFlags = isHealthy ? defaultGreenFlags.slice(0, 6) : defaultRedFlags.slice(0, 6);
    }
    
    return finalFlags;
  };
  
  // Get guaranteed flags that will NEVER be empty
  const guaranteedFlags = getGuaranteedFlags();
  
  // Debug logging removed for production

  // Metrics for display  
  const metricsData = {
    wastingTime: wastingTime || 0,
    actuallyIntoYou: actuallyIntoYou || 0,
    redFlags: redFlags || 0
  };

  // Get archetype color based on red flag level
  const getArchetypeColor = () => {
    const flagCount = metricsData.redFlags;
    if (flagCount <= 3) return "text-green-400";   // Green for 0-3 flags (good)
    if (flagCount <= 6) return "text-orange-400";  // Orange for 4-6 flags (mixed)
    return "text-red-400";                         // Red for 7-10 flags (toxic)
  };

  const Metric = ({ label, value, icon, colorClass, compact = false }) => {
    const getProgressWidth = () => {
      if (label === 'RED FLAGS' || label === 'GREEN FLAGS') {
        return `${(value / 10) * 100}%`;
      }
      return `${value}%`;
    };

    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-2xl ${compact ? 'p-3' : 'p-4 sm:p-5'} border border-cyan-400/20 shadow-lg shadow-cyan-500/20`}>
        {/* Premium typography and spacing */}
        <div className={`${compact ? 'text-[10px] mb-2' : 'text-xs sm:text-sm mb-3'} uppercase tracking-wider text-white/80 font-semibold`}>
          {label}
        </div>
        <div className={`${compact ? 'text-xl' : 'text-3xl sm:text-4xl'} font-black ${colorClass} ${compact ? 'mb-2' : 'mb-4'} font-mono`}>
          {(label === 'RED FLAGS' || label === 'GREEN FLAGS') ? `${value}/10` : `${value}%`}
        </div>
        <div className="px-1.5">
          <div className={`w-full bg-white/25 rounded-full ${compact ? 'h-2' : 'h-3'} shadow-inner`}>
            <div 
              className={`${compact ? 'h-2' : 'h-3'} rounded-full shadow-lg ${
                colorClass.includes('red') ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                colorClass.includes('green') ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                colorClass.includes('orange') ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-teal-400 to-teal-500'
              }`}
              style={{ width: getProgressWidth() }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div
      id="receipt-card-shareable"
      className="w-full max-w-2xl mx-auto rounded-[24px]"
      style={{
        background: 'transparent'
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div 
        id="receipt-inner-container"
        className={`relative rounded-3xl ${isCompact ? 'p-4 sm:p-5 md:p-6' : 'p-6 sm:p-8 md:p-10'} text-stone-200/90 overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: '2px solid rgba(20, 184, 166, 0.5)',
          boxShadow: '0 12px 40px rgba(20, 184, 166, 0.2), 0 0 100px rgba(20, 184, 166, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
        {/* Connecting Visual Elements - Links to page background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gradients matching page theme - Enhanced glow */}
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
          
          {/* Corner accent lines - connecting to page gradients */}
          <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-cyan-400/30 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-purple-400/30 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-purple-400/20 via-transparent to-transparent"></div>
        </div>
        {/* Content wrapper - ensures content is above background elements */}
        <div className="relative z-10">
        {isSavage && (
          <div className="absolute top-4 right-4 z-20">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
              className="bg-red-600 text-stone-200/90 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg"
            >
              SAVAGE
            </motion.div>
          </div>
        )}
        

        <div className="relative z-10">
          {/* PREMIUM SAGE HEADER */}
          <div className="text-center mb-6 relative z-50">
            <div className="inline-flex items-center gap-3 bg-black/30 px-6 py-3 rounded-2xl border border-white/20 mb-4 relative z-50 shadow-lg">
              <img 
                src={sageStandardImage}
                alt="Sage's Truth Receipt" 
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
                SAGE'S RECEIPT
              </span>
            </div>
            {/* Density toggle removed: Receipt always uses Compact view */}
          </div>

          {/* PREMIUM ARCHETYPE */}
          {archetypeTitle && (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-3">
                <h2 className={`text-2xl sm:text-3xl font-black ${getArchetypeColor()} leading-tight`}
                style={{ textShadow: '0 3px 12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(20, 184, 166, 0.3)' }}>
                  {archetypeTitle}
                </h2>
                <div className="text-5xl animate-bounce">
                  {archetypeEmoji}
                </div>
              </div>
              {/* TREND STICKER - Hide for crisis situations */}
              {!archetypeTitle?.includes('Emergency Support') && !archetypeTitle?.includes('Crisis') && (
                <div className="flex justify-center mt-6 mb-8">
                  <div className="inline-flex">
                    <TrendSticker archetype={archetypeTitle} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PREMIUM METRICS GRID */}
          <motion.div 
            className={`grid grid-cols-3 ${isCompact ? 'gap-3 mb-5' : 'gap-4 sm:gap-6 mb-8'}`}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Metric compact={isCompact} label="WASTING TIME" value={metricsData.wastingTime} icon="⏰" colorClass="text-red-400" />
            </motion.div>
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Metric compact={isCompact} label="INTO YOU" value={metricsData.actuallyIntoYou} icon="💖" colorClass="text-green-400" />
            </motion.div>
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Metric 
                compact={isCompact}
                label={isHealthy ? "GREEN FLAGS" : "RED FLAGS"} 
                value={isHealthy ? (results?.greenFlagChips?.length || (metricsData.actuallyIntoYou / 10) || 0) : metricsData.redFlags} 
                icon={isHealthy ? "✓" : "🚩"} 
                colorClass={isHealthy ? "text-green-400" : "text-orange-400"} 
              />
            </motion.div>
          </motion.div>

          {/* PREMIUM DYNAMIC FLAGS */}
          <div className={isCompact ? 'mb-5' : 'mb-8'}>
            {isHealthy ? (
              <div className="flex flex-col items-center gap-2 relative">
                {/* Subtle background gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-green-500/5 rounded-2xl -z-10"></div>
                
                <h3 className="text-emerald-400 text-sm font-bold tracking-wider flex items-center gap-1.5 mb-1">
                  <span className="text-base">✓</span> GREEN FLAGS
                </h3>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                  {((isCompact && !showAllFlags) ? guaranteedFlags.slice(0,6) : guaranteedFlags).map((chip, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-white text-sm font-medium whitespace-nowrap bg-gradient-to-br from-emerald-500/20 to-teal-500/15 rounded-lg border border-emerald-400/40 shadow-md hover:border-emerald-400/60 hover:bg-gradient-to-br hover:from-emerald-500/25 hover:to-teal-500/20 transition-all duration-200"
                      style={{
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 153, 0.15)'
                      }}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
                {isCompact && guaranteedFlags.length > 6 && (
                  <button onClick={() => setShowAllFlags(v=>!v)} className="text-xs text-gray-300 hover:text-white underline mt-1 transition-colors">
                    {showAllFlags ? 'Show less' : `Show ${guaranteedFlags.length - 6} more`}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 relative">
                {/* Subtle background gradient for depth - avoiding maroon tones */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-fuchsia-500/5 rounded-2xl -z-10"></div>
                
                <h3 className="text-pink-400 text-sm font-bold tracking-wider flex items-center gap-1.5 mb-1">
                  <span className="text-base">🚩</span> RED FLAGS
                </h3>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                  {((isCompact && !showAllFlags) ? guaranteedFlags.slice(0,6) : guaranteedFlags).map((chip, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className="inline-flex items-center justify-center px-3 py-1.5 text-white text-sm font-medium whitespace-nowrap bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-fuchsia-500/15 rounded-lg border border-pink-400/40 shadow-md hover:border-pink-400/60 hover:bg-gradient-to-br hover:from-pink-500/25 hover:via-purple-500/20 hover:to-fuchsia-500/20 transition-all duration-200"
                      style={{
                        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.2), 0 0 0 1px rgba(236, 72, 153, 0.15)'
                      }}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
                {isCompact && guaranteedFlags.length > 6 && (
                  <button onClick={() => setShowAllFlags(v=>!v)} className="text-xs text-gray-300 hover:text-white underline mt-1 transition-colors">
                    {showAllFlags ? 'Show less' : `Show ${guaranteedFlags.length - 6} more`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* PREMIUM VERDICT */}
          {verdict && (
            <div className="bg-black/50 p-6 sm:p-8 rounded-2xl border border-white/20 mb-8 shadow-lg">
              <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-5"
                style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)' }}>THE BREAKDOWN</h3>
              <p className="text-gray-300 text-xl sm:text-2xl italic leading-relaxed tracking-wide">
                {verdict}
              </p>
            </div>
          )}

          {/* PREMIUM REAL TEA */}
          {(realTea || nextMove.length > 0) && (
            <div className="bg-black/50 p-6 sm:p-8 rounded-2xl border border-white/20 mb-8 shadow-lg">
              <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-5"
                style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)' }}>🫖 THE REAL TEA</h3>
              <div className="space-y-3 sm:space-y-2">
                {/* User's Question (if provided) */}
                {parsedUserQuestion && (
                  <div className="mb-6 pb-4 border-b border-white/20">
                    <p className="text-gray-400 text-base font-semibold mb-3">Your Question:</p>
                    <p className="text-gray-300 text-lg leading-relaxed italic tracking-wide">
                      "{truncateToThreeLines(parsedUserQuestion)}"
                    </p>
                  </div>
                )}
                
                {/* Main tea content - try realTea, then teaAndMovePlay, then nextMove */}
                {realTea ? (
                  <div className="text-gray-300 text-xl sm:text-2xl leading-relaxed tracking-wide">
                    {realTea}
                  </div>
                ) : teaAndMovePlay && Array.isArray(teaAndMovePlay) ? (
                  <div className="space-y-4">
                    {teaAndMovePlay.map((line, index) => (
                      <div key={index} className="text-gray-300 text-xl sm:text-2xl leading-relaxed tracking-wide">
                        {line}
                      </div>
                    ))}
                  </div>
                ) : nextMove.length > 0 ? (
                  <div className="space-y-3">
                    {nextMove.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-gray-300 text-xl sm:text-2xl leading-relaxed tracking-wide">• {item}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* PREMIUM SAGE'S PROPHECY */}
          {prophecy && (
            <div className="bg-black/50 p-6 sm:p-8 rounded-2xl border border-white/20 mb-8 shadow-lg">
              <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-5"
                style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)' }}>🔮 SAGE BETS...</h3>
              <p className="text-gray-300 text-xl sm:text-2xl italic leading-relaxed tracking-wide">
                {prophecy}
              </p>
            </div>
          )}
          
          {/* PREMIUM SAGE'S CONFIDENCE BAR */}
          <div className="bg-black/50 p-6 rounded-2xl border border-white/20 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg uppercase tracking-wider flex items-center">
                <Brain className="w-5 h-5 mr-3 text-teal-400" />
                SAGE'S DRAMA METER
              </h3>
              <span className="text-lg font-bold text-white">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 mb-5 shadow-inner">
              <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${confidenceScore}%` }}></div>
            </div>
            <div className="text-center">
              <span className="text-base font-semibold text-gray-300">{confidenceRemark}</span>
            </div>
          </div>
          
          
          {/* PREMIUM WATERMARK */}
          <div className="text-center mt-4 mb-8">
            <p className="text-sm text-stone-200/60 tracking-widest font-medium">
              www.getthereceipts.com
            </p>
          </div>
          </div>
        </div>
      </div>
      </motion.div>

      {/* PREMIUM SAVE/SHARE BOX */}
      <div className="w-full max-w-2xl mx-auto mt-16 mb-8">
        <div 
          className="flex flex-col gap-6 justify-center items-center p-8 backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
            border: '2px solid rgba(20, 184, 166, 0.5)',
            boxShadow: '0 12px 40px rgba(20, 184, 166, 0.2), 0 0 100px rgba(20, 184, 166, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
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
          <div className="relative z-10 w-full">
          {/* Urgency Message - Centered Above Both Buttons */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-300 font-medium animate-pulse">
              😱 Your friends need to see this
            </p>
          </div>
          
          {/* Save/Share Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button 
              onClick={onSaveReceipt}
              disabled={isSharing}
              className="flex items-center gap-3 bg-white/15 hover:bg-white/25 text-stone-200 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl disabled:opacity-50"
              style={{
                border: '2px solid rgba(212, 175, 55, 0.7)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Download className="h-4 w-4" />
              {isSharing ? 'Saving...' : 'Save Receipt'}
            </button>
            
            <motion.button 
              animate={{ 
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 24px rgba(212, 175, 55, 0.4)',
                  '0 0 36px rgba(212, 175, 55, 0.6)', 
                  '0 0 24px rgba(212, 175, 55, 0.4)'
                ]
              }}
              onClick={(e) => {
                console.log('🔗 Share Receipt button clicked!', { onScreenshot, isSharing });
                if (onScreenshot) {
                  onScreenshot(e);
                } else {
                  console.error('❌ onScreenshot function not provided!');
                }
              }}
              disabled={isSharing}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center gap-3 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                border: '2px solid rgba(212, 175, 55, 0.9)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Share2 className="h-4 w-4" />
              {isSharing ? 'Sharing...' : '🔗 Share Receipt'}
            </motion.button>
          </div>
          
          {/* Share Help Text */}
          <div className="text-center mt-2 space-y-1">
            <div>
              <span 
                className="text-xs text-gray-400 hover:text-cyan-400 underline cursor-pointer transition-colors"
                title="📱 Mobile: Tap Share → Choose Instagram/TikTok/Photos | 💻 Desktop: Downloads folder → Transfer to phone → Upload to Stories | 🎯 Pro tip: Save to Photos first, then share to Stories for best quality!"
                onClick={() => {
                  if (onShowInstructions) {
                    onShowInstructions();
                  } else {
                    // Fallback: show alert with instructions
                    alert(`📱 Mobile: Tap Share → Choose Instagram/TikTok/Photos\n\n💻 Desktop: Downloads folder → Transfer to phone → Upload to Stories\n\n🎯 Pro tip: Save to Photos first, then share to Stories for best quality!`);
                  }
                }}
              >
                How does sharing work? →
              </span>
            </div>
            </div>
          </div>
        </div>
        
        {/* Premium Footer Card - World-Class SaaS Design */}
        
      </div>

    </>
  );
});

ReceiptCardViral.displayName = 'ReceiptCardViral';

export default ReceiptCardViral;