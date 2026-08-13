"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_TIPS = [
  "Loading your daily brain workout...",
  "Duo is warming up his wings...",
  "15 minutes of practice can teach you a language!",
  "Studying Spanish is more fun than doomscrolling!",
  "Getting your personalized exercises ready...",
];

export function LessonLoader() {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Fill the progress bar linearly over 2.5 s
    const startTime = Date.now();
    const duration = 2500;
    let rafId: number;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);

      if (p < 100) {
        rafId = requestAnimationFrame(animateProgress);
      }
    };

    rafId = requestAnimationFrame(animateProgress);

    // Rotate tips every 1.2 s
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 1200);

    return () => {
      cancelAnimationFrame(rafId);   // prevent updates after unmount
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#131F24] z-50 flex flex-col items-center justify-center p-6">
      {/* Animated Owl */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        className="w-32 h-32 mb-12 relative"
      >
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
          {/* Owl Body */}
          <ellipse cx="50" cy="60" rx="35" ry="30" fill="#58CC02" />
          <path d="M 15 60 Q 5 40 25 30" stroke="#58CC02" strokeWidth="15" strokeLinecap="round" />
          <path d="M 85 60 Q 95 40 75 30" stroke="#58CC02" strokeWidth="15" strokeLinecap="round" />
          <ellipse cx="50" cy="40" rx="40" ry="35" fill="#58CC02" />
          
          {/* Eyes (Happy) */}
          <path d="M 28 35 Q 35 30 42 35" stroke="#FFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 58 35 Q 65 30 72 35" stroke="#FFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          
          {/* Beak */}
          <path d="M 45 45 L 55 45 L 50 52 Z" fill="#F4B000" />
          
          {/* Feet */}
          <ellipse cx="40" cy="90" rx="8" ry="4" fill="#F4B000" />
          <ellipse cx="60" cy="90" rx="8" ry="4" fill="#F4B000" />
          
          {/* Belly */}
          <ellipse cx="50" cy="65" rx="20" ry="15" fill="#46A302" opacity="0.3" />
        </svg>

        {/* Music Notes */}
        <motion.div 
          animate={{ opacity: [0, 1, 0], y: [0, -10], x: [0, 10] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          className="absolute -top-4 -right-4 text-[#1CB0F6]"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </motion.div>
      </motion.div>

      <div className="w-full max-w-[400px]">
        {/* Progress Bar */}
        <div className="h-4 w-full bg-[#202F36] rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-[#58CC02] rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Cycling Tips */}
        <div className="h-12 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[#AFAFAF] text-center font-bold absolute w-full"
            >
              {LOADING_TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
