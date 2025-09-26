import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ColorMappingHelper = ({ onColorMapping }) => {
  const [mapping, setMapping] = useState({ blue: '', gray: '' });
  
  const commonMappings = [
    { colors: ['blue', 'gray'], label: 'iMessage' },
    { colors: ['green', 'white'], label: 'WhatsApp' },
    { colors: ['purple', 'gray'], label: 'Instagram' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30"
    >
      <p className="text-sm text-yellow-300 mb-3 flex items-center gap-2">
        <span>📸</span> I see chat bubbles! Quick - who's who?
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setMapping({ blue: 'Me', gray: 'Them' });
            onColorMapping('blue = Me, gray = Them');
          }}
          className="flex items-center justify-center gap-2 p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30"
        >
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <span className="text-sm">Blue = Me</span>
        </button>
        
        <button
          onClick={() => {
            setMapping({ gray: 'Me', blue: 'Them' });
            onColorMapping('gray = Me, blue = Them');
          }}
          className="flex items-center justify-center gap-2 p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg transition-colors border border-gray-500/30"
        >
          <div className="w-4 h-4 bg-gray-500 rounded" />
          <span className="text-sm">Gray = Me</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ColorMappingHelper;
