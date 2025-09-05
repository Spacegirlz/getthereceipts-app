import React from 'react';
import { motion } from 'framer-motion';
import ViralMetrics from '@/components/ViralMetrics';
import { Sparkles, BarChart2, BrainCircuit } from 'lucide-react';

const ReceiptCardClaude2 = ({ results }) => {
  console.log('=== ReceiptCardClaude2 Debug ===');
  console.log('ReceiptCardClaude2 received results:', results);
  console.log('Results type:', typeof results);
  console.log('Results keys:', results ? Object.keys(results) : 'null');

  if (!results) {
    console.log('ReceiptCardClaude2: No results provided, returning null');
    return null;
  }

  const { archetype, realityCheck, hotTake, verdict, nextMove, metrics, confidenceScore, actions, tagline, interest, manipulation, availability } = results;
  
  console.log('Extracted values:', {
    archetype,
    realityCheck,
    hotTake,
    verdict,
    nextMove,
    metrics,
    confidenceScore,
    actions,
    tagline,
    interest,
    manipulation,
    availability
  });
  
  console.log('Metrics object:', metrics);
  console.log('Individual values:', { interest, manipulation, availability });
  console.log('Individual value types:', { 
    interest: typeof interest, 
    manipulation: typeof manipulation, 
    availability: typeof availability 
  });
  
  // Ensure metrics object exists with proper values - prioritize metrics object over individual props
  const safeMetrics = {
    interest: metrics?.interest || interest || 0,
    manipulation: metrics?.manipulation || manipulation || 0, 
    availability: metrics?.availability || availability || 0
  };
  
  console.log('Safe metrics to pass:', safeMetrics);
  console.log('Safe metrics types:', {
    interest: typeof safeMetrics.interest,
    manipulation: typeof safeMetrics.manipulation,
    availability: typeof safeMetrics.availability
  });
  console.log('=== End ReceiptCardClaude2 Debug ===');

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

  return (
    <motion.div
      id="receipt-card-shareable"
      className="w-full max-w-md mx-auto p-1 rounded-[28px] overflow-hidden transform-gpu"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))'
      }}
    >
      <div className={`relative bg-gray-900/80 backdrop-blur-xl rounded-[24px] p-6 text-white overflow-hidden shadow-2xl border border-white/10 shimmer-effect`}>
        <div className={`absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tr ${gradient} rounded-full opacity-20 blur-3xl`}></div>
        <div className={`absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-bl ${gradient} rounded-full opacity-20 blur-3xl`}></div>

        <div className="relative z-10">
          <div className="text-center mb-5">
            <h2 className="heading-font text-3xl font-black text-glow mb-1">
              {archetype}
            </h2>
            <p className="text-white/80 text-base italic max-w-xs mx-auto">
              {tagline || `${confidenceScore || 85}% confidence match`}
            </p>
          </div>

          <div className="mb-6">
            <ViralMetrics metrics={safeMetrics} />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="heading-font font-bold text-sm text-red-400/90 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-red-400" />
                SAVAGE TRUTH
              </h3>
              <p className="text-sm text-white/90 italic">"{verdict || realityCheck || 'Processing...'}"</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="heading-font font-bold text-sm text-green-400/90 mb-2 flex items-center">
                 <BarChart2 className="w-4 h-4 mr-2 text-green-400" />
                YOUR NEXT MOVE
              </h3>
              <p className="text-sm text-white/90">{nextMove || (actions && actions[0]) || 'Trust your instincts'}</p>
            </div>
          </div>
          
          <div className="text-center mt-6 flex justify-between items-center">
            <div className="flex items-center text-xs text-white/50 mono-font">
              <BrainCircuit className="w-3 h-3 mr-1.5" />
              AI Confidence: {confidenceScore || 85}%
            </div>
            <p className="mono-font text-xs text-white/50 tracking-widest">
              getthereceipts.com
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptCardClaude2;