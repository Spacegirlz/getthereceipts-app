import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PronounSelector = ({ value, onChange, label }) => {
  const [showCustom, setShowCustom] = useState(false);
  
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCustom(true)}
          className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/70 hover:border-white/20 hover:text-white transition-all duration-300"
        >
          other
        </motion.button>
      </div>
      <AnimatePresence>
        {showCustom && (
          <motion.input
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            placeholder="Enter pronouns"
            className="w-full px-3 py-2 text-xs bg-white/5 rounded-lg border border-white/10 text-white placeholder-white/40 focus:border-yellow-400/50 focus:outline-none transition-all duration-300"
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PronounSelector;
