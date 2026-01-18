
import React from 'react';
import { motion } from 'framer-motion';
import ViralMetrics from '@/components/ViralMetrics';
import { Sparkles, BarChart2, BrainCircuit } from 'lucide-react';

const ReceiptCard = ({ results }) => {
  if (!results) return null;

  const { archetype, realityCheck, hotTake, nextMove, metrics, confidenceScore } = results;

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
      <div className="rounded-[24px] p-6 text-white overflow-hidden relative border border-white/10" style={{ background: '#11162B', backdropFilter: 'blur(10px)' }}>
        {/* Journey Badge */}
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-20"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
            color: '#1a1a1a'
          }}>
          ①
        </div>
        <div className={`absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tr ${gradient} rounded-full opacity-10 blur-3xl`}></div>
        <div className={`absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-bl ${gradient} rounded-full opacity-10 blur-3xl`}></div>

        <div className="relative z-10">
          <div className="text-center mb-5">
            <h2 className="heading-font text-3xl font-black text-glow mb-1">
              {archetype}
            </h2>
            <p className="text-white/80 text-base italic max-w-xs mx-auto">
              "{hotTake}"
            </p>
          </div>

          <div className="mb-6">
            <ViralMetrics metrics={metrics} />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-white/8" style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(245, 230, 211, 0.03) 100%)',
              borderColor: 'rgba(212, 175, 55, 0.2)'
            }}>
              <h3 className="heading-font font-bold text-sm mb-2 flex items-center"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                <Sparkles className="w-4 h-4 mr-2" style={{ color: '#D4AF37' }} />
                SAGE'S RECEIPT
              </h3>
              <p className="text-sm text-white/90 italic">"{realityCheck}"</p>
            </div>

            <div className="p-4 rounded-xl border border-white/8" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <h3 className="heading-font font-bold text-sm text-green-400/90 mb-2 flex items-center">
                 <BarChart2 className="w-4 h-4 mr-2 text-green-400" />
                YOUR NEXT MOVE
              </h3>
              <p className="text-sm text-white/90">{nextMove}</p>
            </div>
          </div>
          
          <div className="text-center mt-6 flex justify-between items-center">
            <div className="flex items-center text-xs text-white/50 mono-font">
              <BrainCircuit className="w-3 h-3 mr-1.5" />
              AI Confidence: {confidenceScore}%
            </div>
            <p className="mono-font text-xs text-white/50 tracking-widest">
              www.getthereceipts.com
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiptCard;
