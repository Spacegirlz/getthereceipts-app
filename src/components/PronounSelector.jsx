import React from 'react';
import { motion } from 'framer-motion';

const PronounSelector = ({ value, onChange, label }) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/60">{label} (optional)</p>
      <div className="flex gap-2 flex-wrap">
        {['she/her', 'he/him', 'they/them'].map(pronoun => (
          <motion.button
            key={pronoun}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(pronoun)}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-300 ${
              value === pronoun 
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300' 
                : 'bg-white/5 border border-white/10 text-white/70 hover:border-white/20 hover:text-white'
            }`}
          >
            {pronoun}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PronounSelector;
