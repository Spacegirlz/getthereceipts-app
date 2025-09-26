import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Luxe Input Field with Floating Label
export const LuxeInput = ({ label, value, onChange, type = "text", placeholder, className = "" }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg
                   backdrop-blur-md text-white placeholder-transparent
                   focus:border-yellow-400/50 focus:bg-white/8 transition-all duration-300
                   focus:outline-none focus:ring-0"
        placeholder={label}
      />
      <label className={`absolute left-4 transition-all duration-300 pointer-events-none
                        ${focused || value ? 
                          'text-xs -top-2 bg-black px-2 text-yellow-400' : 
                          'top-3 text-gray-400'}`}>
        {label}
      </label>
      {focused && (
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r 
                        from-transparent via-yellow-400 to-transparent" />
      )}
    </div>
  );
};

// Premium Button with Shimmer Effect
export const LuxeButton = ({ children, onClick, variant = "primary", disabled = false, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative overflow-hidden group ${className}`}
    >
      <div className={`px-8 py-4 rounded-xl font-medium transition-all duration-300
                      ${variant === 'primary' ? 
                        'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg' :
                        'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
        {children}
      </div>
      {/* Shimmer effect */}
      {!disabled && (
        <div className="absolute inset-0 -top-[100%] bg-gradient-to-b 
                        from-white/20 to-transparent opacity-0 
                        group-hover:top-[100%] group-hover:opacity-100 
                        transition-all duration-700 pointer-events-none" />
      )}
    </motion.button>
  );
};

// Luxe Tab Component
export const LuxeTab = ({ active, onClick, children, icon: Icon }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium hidden sm:inline">{children}</span>
    </motion.button>
  );
};

// Luxe Card Component
export const LuxeCard = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-8 shadow-luxe ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Luxe Loading State
export const LuxeLoader = () => (
  <div className="flex gap-1 justify-center">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-yellow-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
);
