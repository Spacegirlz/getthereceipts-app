import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const analysisSteps = [
  "Scanning for red flags 🚩...",
  "Detecting sarcasm levels...",
  "Gauging ghosting probability 👻...",
  "Consulting the situationship oracle...",
  "Serving the final receipt! 🧾",
];

const AnalysisLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % analysisSteps.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-white h-[360px] relative">
      {/* Animated background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/5 to-teal-500/10" 
          style={{
            animation: 'float 6s ease-in-out infinite'
          }}></div>
      </div>
      
      <div className="relative z-10 w-full">
        <div className="w-full bg-gray-700/50 rounded-full h-2.5 mb-4 overflow-hidden backdrop-blur-sm border border-gray-600/30">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
        </div>
        <div className="text-center h-10">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-medium text-gray-200 relative z-10"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            {analysisSteps[currentStep]}
          </motion.p>
        </div>
        <div className="mt-8 text-5xl animate-bounce relative z-10">
          ☕️
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;