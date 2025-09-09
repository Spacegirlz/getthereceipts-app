import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Download, Share2 } from 'lucide-react';
import TrendSticker from '@/components/TrendSticker';
// Standard Sage image for Truth Receipt
import sageStandardImage from '@/assets/sage-dark-circle.png';

const ReceiptCardViral = memo(({ results, onSaveReceipt, onScreenshot, isSharing }) => {
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

  // Extract user question from originalMessage
  const extractUserQuestion = (message) => {
    if (!message) return null;
    const questionMatch = message.match(/YOUR QUESTION:\s*(.+?)(?:\n|$)/i);
    return questionMatch ? questionMatch[1].trim() : null;
  };

  const parsedUserQuestion = userQuestion || extractUserQuestion(originalMessage);

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
    
    const numFlags = Math.min(Math.max(flagCount, 2), 4); // Show 2-4 flags
    return { 
      flags: flagsToShow.slice(0, numFlags),
      type: flagType
    };
  };

  // Dynamic flag system - determine health based on multiple factors
  const overallHealth = (actuallyIntoYou || 0) - (wastingTime || 0);
  const isHealthy = overallHealth >= 60 || (actuallyIntoYou || 0) >= 80; // High interest OR very high into you
  
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
                   defaultGreenFlags.slice(0, 4);
    } else {
      // For unhealthy relationships - use red flags
      finalFlags = results?.redFlagChips?.filter(Boolean) || 
                   results?.deepDive?.red_flag_tags?.filter(Boolean) ||
                   results?.redFlagTags?.filter(Boolean) ||
                   (results?.receipts || []).map(r => r.pattern).filter(Boolean) ||
                   defaultRedFlags.slice(0, 4);
    }
    
    // ABSOLUTE GUARANTEE: If somehow still empty, use defaults
    if (!finalFlags || finalFlags.length === 0) {
      finalFlags = isHealthy ? defaultGreenFlags.slice(0, 3) : defaultRedFlags.slice(0, 3);
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

  const Metric = ({ label, value, icon, colorClass }) => {
    const getProgressWidth = () => {
      if (label === 'RED FLAGS' || label === 'GREEN FLAGS') {
        return `${(value / 10) * 100}%`;
      }
      return `${value}%`;
    };

    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="text-xs uppercase tracking-wider text-white/60 mb-3">
          {label}
        </div>
        <div className={`text-2xl font-bold ${colorClass} mb-4`}>
          {(label === 'RED FLAGS' || label === 'GREEN FLAGS') ? `${value}/10` : `${value}%`}
        </div>
        <div className="relative">
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-700 ease-out ${
                colorClass.includes('red') ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                colorClass.includes('green') ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                colorClass.includes('orange') ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-gradient-to-r from-teal-500 to-teal-400'
              }`}
              style={{ 
                width: getProgressWidth(),
                boxShadow: `0 0 10px ${colorClass.includes('red') ? 'rgba(239, 68, 68, 0.3)' : 
                          colorClass.includes('green') ? 'rgba(34, 197, 94, 0.3)' : 
                          colorClass.includes('orange') ? 'rgba(249, 115, 22, 0.3)' : 'rgba(20, 184, 166, 0.3)'}`
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
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
        className={`relative rounded-[24px] p-3 sm:p-4 md:p-6 text-stone-200/90`}
        style={{
          background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          border: '2px solid rgba(20, 184, 166, 0.4)',
          boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
        }}>
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
          {/* SAGE HEADER */}
          <div className="text-center mb-1 relative z-50">
            <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10 mb-2 relative z-50">
              <img 
                src={sageStandardImage}
                alt="Sage's Truth Receipt" 
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
                SAGE'S TRUTH RECEIPT
              </span>
            </div>
          </div>

          {/* ARCHETYPE */}
          {archetypeTitle && (
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-4 mb-1">
                <h2 className={`text-xl sm:text-2xl font-black ${getArchetypeColor()} leading-tight`}
                style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 184, 166, 0.2)' }}>
                  {archetypeTitle}
                </h2>
                <div className="text-4xl animate-bounce">
                  {archetypeEmoji}
                </div>
              </div>
              {/* TREND STICKER */}
              <div className="flex justify-center mt-4 mb-8">
                <div className="inline-flex">
                  <TrendSticker archetype={archetypeTitle} />
                </div>
              </div>
            </div>
          )}

          {/* METRICS GRID - Enhanced Visual Design */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Metric label="WASTING TIME" value={metricsData.wastingTime} icon="⏰" colorClass="text-red-400" />
            </motion.div>
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Metric label="INTO YOU" value={metricsData.actuallyIntoYou} icon="💖" colorClass="text-green-400" />
            </motion.div>
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Metric 
                label={isHealthy ? "GREEN FLAGS" : "RED FLAGS"} 
                value={isHealthy ? (results?.greenFlagChips?.length || (metricsData.actuallyIntoYou / 10) || 0) : metricsData.redFlags} 
                icon={isHealthy ? "✅" : "🚩"} 
                colorClass={isHealthy ? "text-green-400" : "text-orange-400"} 
              />
            </motion.div>
          </motion.div>

          {/* DYNAMIC FLAGS */}
          <div className="mb-4">
            {isHealthy ? (
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-green-400 text-sm font-bold tracking-wider flex items-center gap-2">
                  <span>✅</span> GREEN FLAGS
                </h3>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {guaranteedFlags.map((chip, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className="inline-flex items-center justify-center px-3 py-2 bg-green-500/20 border border-green-400/40 rounded-full text-green-300 text-sm font-medium whitespace-nowrap backdrop-blur-sm"
                      style={{
                        boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
                      }}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <h3 className="text-red-400 text-sm font-bold tracking-wider flex items-center gap-2">
                  <span>🚩</span> RED FLAGS
                </h3>
                <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  {guaranteedFlags.map((chip, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className="inline-flex items-center justify-center px-3 py-2 bg-red-500/20 border border-red-400/40 rounded-full text-red-300 text-sm font-medium whitespace-nowrap backdrop-blur-sm"
                      style={{
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                      }}
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* THE VERDICT - Mobile Optimized */}
          {verdict && (
            <div className="bg-black/30 p-4 sm:p-4 rounded-xl border border-white/10 mb-4 sm:mb-3">
              <h3 className="text-teal-400 font-bold text-base sm:text-sm tracking-wide mb-3 sm:mb-3"
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>THE VERDICT</h3>
              <p className="text-stone-200/90 text-lg sm:text-xl italic leading-relaxed tracking-wide">
                {verdict}
              </p>
            </div>
          )}

          {/* COMBINED REAL TEA - Mobile Optimized */}
          {(realTea || nextMove.length > 0) && (
            <div className="bg-black/30 p-4 sm:p-4 rounded-xl border border-white/10 mb-4 sm:mb-3">
              <h3 className="text-teal-400 font-bold text-base sm:text-sm tracking-wide mb-3 sm:mb-3"
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>🫖 THE REAL TEA</h3>
              <div className="space-y-3 sm:space-y-2">
                {/* User's Question (if provided) */}
                {parsedUserQuestion && (
                  <div className="mb-4 sm:mb-3 pb-3 border-b border-white/10">
                    <p className="text-amber-300 text-sm font-medium mb-2 sm:mb-1">Your Question:</p>
                    <p className="text-stone-300 text-base leading-relaxed italic tracking-wide">
                      "{truncateToThreeLines(parsedUserQuestion)}"
                    </p>
                  </div>
                )}
                
                {/* Main tea content - try realTea, then teaAndMovePlay, then nextMove */}
                {realTea ? (
                  <div className="text-stone-200/90 text-lg sm:text-xl leading-relaxed tracking-wide">
                    {realTea}
                  </div>
                ) : teaAndMovePlay && Array.isArray(teaAndMovePlay) ? (
                  <div className="space-y-3 sm:space-y-2">
                    {teaAndMovePlay.map((line, index) => (
                      <div key={index} className="text-stone-200/90 text-lg sm:text-xl leading-relaxed tracking-wide">
                        {line}
                      </div>
                    ))}
                  </div>
                ) : nextMove.length > 0 ? (
                  <div className="space-y-2 sm:space-y-1">
                    {nextMove.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-stone-200/90 text-lg sm:text-xl leading-relaxed tracking-wide">• {item}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* SAGE'S PROPHECY */}
          {prophecy && (
            <div className="bg-black/30 p-4 rounded-xl border border-white/10 mb-3">
              <h3 className="text-teal-400 font-bold text-sm tracking-wide mb-3"
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>🔮 SAGE'S PROPHECY</h3>
              <p className="text-stone-200/90 text-xl leading-relaxed">
                {prophecy}
              </p>
            </div>
          )}
          
          {/* SAGE'S CONFIDENCE BAR */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-teal-400 font-bold text-sm tracking-wide flex items-center">
                <Brain className="w-4 h-4 mr-2 text-teal-400" />
                SAGE'S CONFIDENCE
              </h3>
              <span className="text-xs font-bold text-cyan-400">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div className="bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${confidenceScore}%` }}></div>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-cyan-300">{confidenceRemark}</span>
            </div>
          </div>
          
          {/* ACTION BUTTONS - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-4">
            <button 
              onClick={onSaveReceipt}
              disabled={isSharing}
              className="min-h-[48px] sm:min-h-[44px] flex-1 bg-white/10 hover:bg-white/20 active:scale-95 text-stone-200 font-medium py-3 sm:py-2 px-4 sm:px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
              style={{
                border: '1px solid rgba(20, 184, 166, 0.4)',
                boxShadow: '0 4px 12px rgba(20, 184, 166, 0.1)'
              }}
            >
              <Download className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="text-base sm:text-sm">{isSharing ? 'Saving...' : 'Save'}</span>
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
              onClick={onScreenshot}
              disabled={isSharing}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="min-h-[48px] sm:min-h-[44px] flex-1 text-white font-bold py-3 sm:py-2 px-4 sm:px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
              style={{
                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                border: '1px solid rgba(20, 184, 166, 0.8)',
                boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
              }}
            >
              <Share2 className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="text-base sm:text-sm">{isSharing ? 'Sharing...' : 'Share Receipt'}</span>
            </motion.button>
          </div>

          {/* WATERMARK */}
          <div className="text-center mt-4 mb-4">
            <p className="text-xs text-stone-200/90/40 tracking-widest">
              www.getthereceipts.com
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ReceiptCardViral.displayName = 'ReceiptCardViral';

export default ReceiptCardViral;