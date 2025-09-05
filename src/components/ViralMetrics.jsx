
import React from 'react';
import { motion } from 'framer-motion';
import useSound from '@/hooks/useSound';

const Metric = ({ label, value, icon, colorClass, barColorClass }) => {
  const [playTick] = useSound('/sounds/tick.mp3', { volume: 0.2, sprite: { tick: [0, 100] } });

  const handleAnimation = (definition) => {
    if (definition.value > 0) {
      playTick({ id: 'tick' });
    }
  };

  console.log(`Metric ${label} received value:`, value, 'type:', typeof value);

  return (
    <motion.div 
      className="space-y-2"
      onAnimationStart={handleAnimation}
    >
      <div className="flex justify-between text-sm">
        <span className="text-white/90">{label}</span>
        <span className={`font-bold ${colorClass}`}>{value}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <motion.div 
          className={`${barColorClass} h-1 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

const ViralMetrics = ({ metrics }) => {
  console.log('ViralMetrics component received metrics:', metrics);
  console.log('Metrics type:', typeof metrics);
  console.log('Metrics keys:', metrics ? Object.keys(metrics) : 'null');

  if (!metrics) {
    console.log('ViralMetrics: No metrics provided, returning null');
    return null;
  }
  
  const { interest, manipulation, availability } = metrics;
  
  console.log('Raw values from metrics:', { interest, manipulation, availability });
  console.log('Raw value types:', { 
    interest: typeof interest, 
    manipulation: typeof manipulation, 
    availability: typeof availability 
  });
  
  // Ensure we have valid numbers - no fallbacks
  const safeInterest = Number(interest);
  const safeManipulation = Number(manipulation);
  const safeAvailability = Number(availability);
  
  console.log('Parsed values:', { safeInterest, safeManipulation, safeAvailability });
  console.log('Parsed value types:', { 
    safeInterest: typeof safeInterest, 
    safeManipulation: typeof safeManipulation, 
    safeAvailability: typeof safeAvailability 
  });

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.3 } }
      }}
    >
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Metric 
          label="Interest" 
          value={safeInterest} 
          icon="💖" 
          colorClass="text-pink-400" 
          barColorClass="bg-pink-500"
        />
      </motion.div>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Metric 
          label="Availability" 
          value={safeAvailability} 
          icon="🗓️" 
          colorClass="text-green-400" 
          barColorClass="bg-green-500"
        />
      </motion.div>
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Metric 
          label="Manipulation" 
          value={safeManipulation} 
          icon="🚩" 
          colorClass="text-red-400" 
          barColorClass="bg-red-500"
        />
      </motion.div>
    </motion.div>
  );
};

export default ViralMetrics;
