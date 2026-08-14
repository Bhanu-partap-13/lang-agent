"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface StreakIgniteModalProps {
  isOpen: boolean;
  streakCount: number;
  onClose: () => void;
}

export function StreakIgniteModal({ isOpen, streakCount, onClose }: StreakIgniteModalProps) {
  const router = useRouter();
  const [animationStage, setAnimationStage] = useState<"flaming" | "details">("flaming");

  // Get current and next 4 days of week abbreviations
  const daysOfWeek = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
  const today = new Date();
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return {
      day: i === 0 ? daysOfWeek[d.getDay()].charAt(0) : daysOfWeek[d.getDay()],
      isToday: i === 0,
    };
  });

  useEffect(() => {
    if (isOpen) {
      const initTimer = setTimeout(() => setAnimationStage("flaming"), 0);
      const timer = setTimeout(() => {
        setAnimationStage("details");
      }, 1400);
      return () => { clearTimeout(initTimer); clearTimeout(timer); };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#131F24] flex flex-col justify-between items-center select-none overflow-hidden"
      >
        {/* Top spacer */}
        <div className="w-full h-12" />

        {/* Central Flaming Fire & Streak Counter Hero Area */}
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-lg px-4 text-center">
          
          {/* Animated Realistic Flaming Fire */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-4">
            {/* Outer Glow Halo */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1.05, 1.2, 1],
                opacity: [0.35, 0.65, 0.4, 0.7, 0.35],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute w-48 h-48 rounded-full bg-gradient-to-t from-[#FF4B4B] via-[#FF9600] to-[#FFC800] blur-3xl pointer-events-none"
            />

            {/* Flying Spark particle */}
            <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -70, opacity: [0, 1, 0], scale: [0.5, 1.2, 0.2], x: [0, 8, -4] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
              className="absolute top-2 left-1/2 w-2 h-4 rounded-full bg-[#FFC800] rotate-45 shadow-[0_0_10px_#FFC800]"
            />

            {/* 3D Flame SVG Graphics */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 30 }}
              animate={{ scale: [0.95, 1.05, 0.98, 1.03, 0.95], opacity: 1, y: 0 }}
              transition={{
                scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                opacity: { duration: 0.4 },
                y: { duration: 0.5, type: "spring" }
              }}
              className="relative z-10 w-36 h-36 flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(255,150,0,0.5)]"
            >
              <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
                {/* Outer Flame (Orange) */}
                <path
                  d="M50 0 C55 25 75 35 85 55 C98 75 92 100 70 115 C50 128 25 120 12 100 C-2 78 8 50 28 35 C32 45 40 45 42 35 C45 22 42 12 50 0 Z"
                  fill="#FF9600"
                />
                {/* Inner Flame Core (Yellow Glowing) */}
                <path
                  d="M50 45 C58 60 70 70 70 85 C70 102 58 112 48 112 C36 112 28 100 30 85 C32 72 42 60 50 45 Z"
                  fill="#FFC800"
                />
                {/* Center Hot White Flame Spark */}
                <ellipse cx="49" cy="92" rx="10" ry="14" fill="#FFE885" opacity="0.9" />
              </svg>
            </motion.div>
          </div>

          {/* Large Dynamic Streak Number matching screenshot */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 350, damping: 20 }}
            className="flex flex-col items-center"
          >
            <span className="text-[#FF9600] text-7xl font-black tracking-tight leading-none drop-shadow-md">
              {streakCount}
            </span>

            {/* Stage 2 details: "day streak" + 5-day calendar card */}
            <AnimatePresence>
              {animationStage === "details" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center w-full mt-2"
                >
                  <h2 className="text-[#FF9600] text-2xl font-black tracking-wide mb-6">
                    day streak
                  </h2>

                  {/* 5-Day Streak Calendar Progress Indicator Card matching screenshot */}
                  <div className="w-full max-w-xs bg-[#182830] border-2 border-[#202F36] rounded-2xl p-5 shadow-2xl">
                    {/* Day letters header */}
                    <div className="flex justify-between items-center px-2 mb-3 text-xs font-black text-[#AFAFAF]">
                      {weekDays.map((w, idx) => (
                        <span key={idx} className={`w-8 text-center ${w.isToday ? "text-[#FFC800]" : ""}`}>
                          {w.day}
                        </span>
                      ))}
                    </div>

                    {/* Day circles row */}
                    <div className="flex justify-between items-center px-2 mb-4">
                      {weekDays.map((w, idx) => (
                        <div
                          key={idx}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            w.isToday
                              ? "bg-[#FF9600] text-white shadow-lg border-2 border-[#FFC800] scale-110"
                              : "bg-[#283842] text-transparent"
                          }`}
                        >
                          {w.isToday && (
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#131F24]" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Reset Warning Disclaimer */}
                    <p className="text-[#AFAFAF] text-xs font-bold leading-relaxed text-center px-1">
                      But your streak will reset if you don&apos;t practice tomorrow. Watch out!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Action Footer Bar matching Image 1 & 2 */}
        <div className="w-full bg-[#131F24] border-t-2 border-[#202F36] p-6 z-40">
          <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
            {/* Left REVIEW LESSON button */}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#AFAFAF] hover:text-white border-2 border-[#37464F] hover:bg-[#202F36] transition-colors cursor-pointer"
            >
              REVIEW LESSON
            </button>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  onClose();
                  router.push("/lesson/lesson_1");
                }}
                className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#1CB0F6] border-b-4 border-[#1899D6] text-white hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer"
              >
                PRACTICE AGAIN
              </button>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#1CB0F6] border-b-4 border-[#1899D6] text-white hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-md cursor-pointer"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

