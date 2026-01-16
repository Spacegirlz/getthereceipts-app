import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

/**
 * Color-Name Override Editor
 * 
 * Shows detected colors side by side with editable name fields.
 * Saves overrides to localStorage and validates unique names.
 */
const ColorNameOverrideEditor = ({ 
  detectedColors = [], 
  initialMappings = {},
  onSave,
  onCancel 
}) => {
  const [mappings, setMappings] = useState({});
  const [warning, setWarning] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize mappings from props or localStorage
  useEffect(() => {
    const stored = localStorage.getItem('colorNameOverrides');
    const storedMappings = stored ? JSON.parse(stored) : {};
    
    // Merge: stored > initialMappings > detected colors
    const initial = {};
    
    // Start with detected colors
    detectedColors.forEach(color => {
      initial[color] = initialMappings[color] || storedMappings[color] || '';
    });
    
    // Add any stored/initial mappings not in detected colors
    Object.entries({ ...storedMappings, ...initialMappings }).forEach(([color, name]) => {
      if (!initial[color]) {
        initial[color] = name;
      }
    });
    
    setMappings(initial);
  }, [detectedColors, initialMappings]);

  // Validate mappings
  const validateMappings = () => {
    const names = Object.values(mappings).filter(name => name && name.trim().length > 0);
    const uniqueNames = [...new Set(names)];
    
    if (names.length < 2) {
      setWarning('At least 2 names must be assigned');
      return false;
    }
    
    if (names.length !== uniqueNames.length) {
      setWarning('All names must be unique');
      return false;
    }
    
    setWarning('');
    return true;
  };

  // Handle name change
  const handleNameChange = (color, name) => {
    const newMappings = { ...mappings, [color]: name };
    setMappings(newMappings);
    setHasChanges(true);
    
    // Clear warning on change
    if (warning) {
      setTimeout(() => validateMappings(), 100);
    }
  };

  // Handle save
  const handleSave = () => {
    if (!validateMappings()) {
      return;
    }

    // Save to localStorage
    try {
      localStorage.setItem('colorNameOverrides', JSON.stringify(mappings));
      console.log('✅ Saved color-name overrides to localStorage:', mappings);
    } catch (error) {
      console.warn('⚠️ Failed to save to localStorage:', error);
    }

    // Call onSave callback with mappings
    if (onSave) {
      onSave(mappings);
    }
    
    setHasChanges(false);
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Get color display info
  const getColorDisplay = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', border: 'border-blue-400', label: 'Blue' },
      gray: { bg: 'bg-gray-500', border: 'border-gray-400', label: 'Gray' },
      grey: { bg: 'bg-gray-500', border: 'border-gray-400', label: 'Grey' },
      green: { bg: 'bg-green-500', border: 'border-green-400', label: 'Green' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-400', label: 'Purple' },
      white: { bg: 'bg-white', border: 'border-white', label: 'White' },
    };
    
    return colorMap[color.toLowerCase()] || { 
      bg: 'bg-gray-400', 
      border: 'border-gray-300', 
      label: color.charAt(0).toUpperCase() + color.slice(1) 
    };
  };

  // If no colors detected, show message
  if (!detectedColors || detectedColors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
      >
        <p className="text-sm text-yellow-300">
          No colors detected. Please manually enter names below.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>🎨</span>
          Color-Name Mapping
        </h3>
        {hasChanges && (
          <span className="text-xs text-cyan-400">Unsaved changes</span>
        )}
      </div>

      {/* Warning Banner */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-300 mb-1">Validation Error</p>
              <p className="text-xs text-red-200">{warning}</p>
            </div>
            <button
              onClick={() => setWarning('')}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color-Name Fields */}
      <div className="space-y-3 mb-4">
        {detectedColors.map((color, index) => {
          const colorInfo = getColorDisplay(color);
          const name = mappings[color] || '';
          
          return (
            <div key={color} className="flex items-center gap-3">
              {/* Color Indicator */}
              <div className="flex items-center gap-2 min-w-[80px]">
                <div className={`w-5 h-5 rounded-full ${colorInfo.bg} border-2 ${colorInfo.border}`} />
                <span className="text-xs text-white/80 font-medium">
                  {colorInfo.label}
                </span>
              </div>
              
              {/* Name Input */}
              <input
                type="text"
                placeholder={`Enter name for ${colorInfo.label}...`}
                value={name}
                onChange={(e) => handleNameChange(color, e.target.value)}
                className="flex-1 px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
              />
              
              {/* Validation Indicator */}
              {name && name.trim().length > 0 && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-cyan-400/20">
        <button
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-white/5 backdrop-blur-sm text-gray-300 border border-gray-400/20 hover:bg-white/10 hover:border-gray-400/40 active:scale-95"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!!warning || !hasChanges}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-500/20 disabled:hover:to-purple-500/20"
        >
          {warning ? 'Fix Errors' : 'Save Mapping'}
        </button>
      </div>

      {/* Info Text */}
      <p className="text-[10px] text-gray-400 mt-3 text-center">
        Mappings are saved to localStorage and will be used in analysis
      </p>
    </motion.div>
  );
};

export default ColorNameOverrideEditor;

