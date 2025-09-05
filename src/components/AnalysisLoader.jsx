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
    <div className="flex flex-col items-center justify-center p-8 text-white h-[360px]">
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
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
          className="text-lg font-medium text-gray-300 text-glow"
        >
          {analysisSteps[currentStep]}
        </motion.p>
      </div>
      <div className="mt-8 text-5xl animate-bounce">
        ☕️
      </div>
    </div>
  );
};

export default AnalysisLoader;