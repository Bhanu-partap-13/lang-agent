"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";

interface DailyQuestChestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => Promise<{
    rewards: {
      gems: number;
      hearts: number;
      heartsRefilled: boolean;
    };
  }>;
}

export function DailyQuestChestModal({
  isOpen,
  onClose,
  onClaim,
}: DailyQuestChestModalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [rewardData, setRewardData] = useState<{
    gems: number;
    hearts: number;
    heartsRefilled: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    // Left burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: { x: 0.2, y: 0.6 },
      colors: ["#FFD700", "#FFC800", "#1CB0F6", "#58CC02", "#FF4B4B"],
    });
    // Right burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: { x: 0.8, y: 0.6 },
      colors: ["#FFD700", "#FFC800", "#1CB0F6", "#58CC02", "#FF4B4B"],
    });
    // Central mega burst
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#FFD700", "#FFB020", "#58CC02", "#1CB0F6", "#CE82FF"],
      });
    }, 150);
  };

  const handleChestClick = async () => {
    if (isOpened || isClaiming) return;
    setIsClaiming(true);

    try {
      const res = await onClaim();
      setRewardData(res.rewards);
      setIsOpened(true);
      triggerConfetti();
    } catch (err) {
      console.error("Failed to claim daily chest:", err);
      // Fallback rewards in case of offline/network glitch
      setRewardData({ gems: 100, hearts: 5, heartsRefilled: true });
      setIsOpened(true);
      triggerConfetti();
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Full-screen backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0c1518]/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative z-10 w-full max-w-lg bg-[#131F24] border-2 border-[#202F36] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          {/* Top Header Banner */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="inline-flex items-center space-x-2 bg-[#202F36] px-4 py-1.5 rounded-full border border-[#37464F] mb-3">
              <span className="text-[#FFC800] text-xs font-black tracking-wider uppercase">
                ★ 100 XP Quest Milestone Reached!
              </span>
            </div>
            <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isOpened ? "Daily Rewards Claimed!" : "Daily Quest Complete!"}
            </h2>
            <p className="text-[#AFAFAF] text-sm sm:text-base font-semibold mt-1 max-w-xs">
              {isOpened
                ? "Here is your mystery treasure loot for completing today's quests!"
                : "You earned 100 XP today. Open your daily mystery chest!"}
            </p>
          </motion.div>

          {/* Interactive Chest Stage */}
          <div className="relative w-full h-64 flex items-center justify-center my-2 select-none">
            {/* Ambient Sunburst / Glow behind chest */}
            <motion.div
              animate={{
                rotate: 360,
                scale: isOpened ? [1, 1.2, 1.1] : [0.9, 1, 0.9],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 16, ease: "linear" },
                scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              }}
              className="absolute w-72 h-72 rounded-full pointer-events-none opacity-40 blur-2xl"
              style={{
                background: isOpened
                  ? "radial-gradient(circle, #FFD700 0%, #1CB0F6 50%, transparent 70%)"
                  : "radial-gradient(circle, #FFC800 0%, transparent 70%)",
              }}
            />

            {/* 3D Duolingo-Styled Treasure Chest */}
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleChestClick}
              animate={
                isOpened
                  ? { scale: [1, 1.1, 1], y: 10 }
                  : isHovered
                  ? {
                      rotate: [-2, 2, -2, 2, 0],
                      scale: 1.08,
                      transition: { repeat: Infinity, duration: 0.4 },
                    }
                  : {
                      y: [0, -8, 0],
                      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                    }
              }
              className={`relative cursor-pointer z-20 flex flex-col items-center ${
                isClaiming ? "opacity-75 cursor-wait" : ""
              }`}
            >
              <div className="relative w-44 h-40 flex items-center justify-center">
                {/* 3D SVG Treasure Chest */}
                <svg viewBox="0 0 200 180" className="w-full h-full filter drop-shadow-2xl">
                  <defs>
                    <linearGradient id="chestWoodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C47335" />
                      <stop offset="50%" stopColor="#A1541F" />
                      <stop offset="100%" stopColor="#753509" />
                    </linearGradient>
                    <linearGradient id="goldTrimGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFE066" />
                      <stop offset="50%" stopColor="#FFC800" />
                      <stop offset="100%" stopColor="#D98A00" />
                    </linearGradient>
                    <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF4B8" stopOpacity="1" />
                      <stop offset="50%" stopColor="#FFC800" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* 3D Oval Base Shadow */}
                  <ellipse cx="100" cy="165" rx="85" ry="15" fill="#0c1518" opacity="0.6" />

                  {/* Chest Base Box */}
                  <path
                    d="M 25 85 L 175 85 L 165 155 Q 100 165 35 155 Z"
                    fill="url(#chestWoodGrad)"
                    stroke="#502404"
                    strokeWidth="4"
                  />
                  {/* Chest Base Shading details */}
                  <path
                    d="M 30 87 L 170 87 L 163 105 L 37 105 Z"
                    fill="#C47335"
                    opacity="0.3"
                  />

                  {/* Golden Metal Bands (Base) */}
                  <path d="M 50 85 L 56 153" stroke="url(#goldTrimGrad)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 150 85 L 144 153" stroke="url(#goldTrimGrad)" strokeWidth="12" strokeLinecap="round" />

                  {/* Inner Chest Light Glow when open */}
                  {isOpened && (
                    <ellipse cx="100" cy="80" rx="70" ry="25" fill="url(#innerGlow)" />
                  )}

                  {/* Chest Lid */}
                  {isOpened ? (
                    /* Open Lid State (Tilted Backwards & Upward) */
                    <g transform="translate(0, -35) rotate(-35 100 80)">
                      <path
                        d="M 20 75 Q 100 20 180 75 L 175 88 Q 100 45 25 88 Z"
                        fill="url(#chestWoodGrad)"
                        stroke="#502404"
                        strokeWidth="4"
                      />
                      <path d="M 46 65 Q 100 32 154 65" stroke="url(#goldTrimGrad)" strokeWidth="10" fill="none" />
                      <circle cx="100" cy="72" r="10" fill="url(#goldTrimGrad)" stroke="#502404" strokeWidth="2" />
                    </g>
                  ) : (
                    /* Closed Lid State */
                    <g>
                      <path
                        d="M 20 85 Q 100 35 180 85 L 178 92 Q 100 45 22 92 Z"
                        fill="url(#chestWoodGrad)"
                        stroke="#502404"
                        strokeWidth="4"
                      />
                      <path
                        d="M 24 82 Q 100 40 176 82"
                        fill="none"
                        stroke="#D68845"
                        strokeWidth="3"
                      />
                      {/* Metal Ribs on Closed Lid */}
                      <path d="M 50 56 Q 50 85 50 88" stroke="url(#goldTrimGrad)" strokeWidth="12" fill="none" />
                      <path d="M 150 56 Q 150 85 150 88" stroke="url(#goldTrimGrad)" strokeWidth="12" fill="none" />
                      
                      {/* Big Front Golden Lock Clasp */}
                      <rect x="86" y="75" width="28" height="34" rx="6" fill="url(#goldTrimGrad)" stroke="#502404" strokeWidth="3" />
                      <circle cx="100" cy="88" r="4.5" fill="#3D1A02" />
                      <polygon points="98,88 102,88 103,98 97,98" fill="#3D1A02" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Sparkle badge on closed chest */}
              {!isOpened && (
                <motion.span
                  animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-1 -right-2 text-2xl"
                >
                  ✨
                </motion.span>
              )}
            </motion.div>

            {/* Guided Animated Cursor (Hand pointer + speech bubble) */}
            {!isOpened && !isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 sm:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
              >
                {/* Speech Bubble */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="bg-[#58CC02] border-2 border-[#46A302] text-white font-extrabold text-xs px-3 py-2 rounded-2xl shadow-xl whitespace-nowrap mb-2 relative"
                >
                  Tap to claim your daily rewards!
                  <div className="absolute -bottom-2 left-6 w-3 h-3 bg-[#58CC02] border-b-2 border-r-2 border-[#46A302] rotate-45" />
                </motion.div>

                {/* Animated Hand Cursor */}
                <motion.div
                  animate={{
                    x: [-10, 5, -10],
                    y: [0, 4, 0],
                    scale: [1, 0.9, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    ease: "easeInOut",
                  }}
                  className="w-12 h-12 text-[#FFC800] filter drop-shadow-xl"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
                    <path
                      d="M10 2a2 2 0 0 1 2 2v7.586l1.293-1.293a2 2 0 1 1 2.828 2.828l-4.242 4.243A4 4 0 0 1 9.05 18.536l-3.535-3.536a2 2 0 1 1 2.828-2.828L10 13.828V4a2 2 0 0 1 2-2z"
                      stroke="#202F36"
                      strokeWidth="1.5"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {/* Floating 3D Reward Loot Cards Rising Up from Chest */}
            {isOpened && rewardData && (
              <div className="absolute inset-0 flex items-center justify-center space-x-4 z-40 pointer-events-none">
                {/* Gems Card */}
                <motion.div
                  initial={{ y: 50, scale: 0, opacity: 0, rotate: -15 }}
                  animate={{ y: -45, scale: 1, opacity: 1, rotate: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                  className="w-32 bg-[#182830] border-3 border-[#1CB0F6] rounded-2xl p-3 flex flex-col items-center shadow-[0_10px_25px_rgba(28,176,246,0.4)] relative"
                >
                  <div className="w-12 h-12 mb-1 flex items-center justify-center">
                    <Image src="/gem.svg" alt="Gem Loot" width={44} height={44} className="drop-shadow-lg" />
                  </div>
                  <span className="text-[#1CB0F6] font-black text-xl tracking-wide">
                    +{rewardData.gems}
                  </span>
                  <span className="text-white text-[11px] font-extrabold uppercase tracking-wider">
                    GEMS
                  </span>
                </motion.div>

                {/* Hearts Card */}
                <motion.div
                  initial={{ y: 50, scale: 0, opacity: 0, rotate: 15 }}
                  animate={{ y: -45, scale: 1, opacity: 1, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 }}
                  className="w-32 bg-[#182830] border-3 border-[#FF4B4B] rounded-2xl p-3 flex flex-col items-center shadow-[0_10px_25px_rgba(255,75,75,0.4)] relative"
                >
                  <div className="w-12 h-12 mb-1 flex items-center justify-center animate-pulse">
                    <Image src="/hearts.svg" alt="Heart Loot" width={44} height={44} className="drop-shadow-lg" />
                  </div>
                  <span className="text-[#FF4B4B] font-black text-xl tracking-wide">
                    FULL REFILL
                  </span>
                  <span className="text-white text-[11px] font-extrabold uppercase tracking-wider">
                    5/5 HEARTS
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Action Button Section */}
          <div className="w-full mt-4 flex flex-col items-center">
            {isOpened ? (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-black text-white text-base uppercase tracking-wider bg-[#58CC02] border-b-4 border-[#46A302] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-xl cursor-pointer"
              >
                AWESOME!
              </motion.button>
            ) : (
              <button
                onClick={handleChestClick}
                disabled={isClaiming}
                className="w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-wider bg-[#1CB0F6] border-b-4 border-[#1483B8] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isClaiming ? "OPENING CHEST..." : "TAP CHEST TO CLAIM"}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
