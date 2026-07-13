import React from 'react';
import { m, AnimatePresence } from "framer-motion";

interface PulseRingProps {
  active: boolean;
  color?: string;
}

export const PulseRing = ({ active, color = "rgba(79, 70, 229, 0.4)" }: PulseRingProps) => (
  <AnimatePresence>
    {active && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.4, 1.6], 
            opacity: [0.6, 0.3, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeOut" 
          }}
          className="absolute w-full h-full rounded-full border"
          style={{ borderColor: color }}
        />
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1.4], 
            opacity: [0.4, 0.2, 0] 
          }}
          transition={{ 
            duration: 2, 
            delay: 0.5,
            repeat: Infinity,
            ease: "easeOut" 
          }}
          className="absolute w-full h-full rounded-full border"
          style={{ borderColor: color }}
        />
      </div>
    )}
  </AnimatePresence>
);
