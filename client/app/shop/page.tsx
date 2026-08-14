"use client";

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { useUserStats } from "@/lib/hooks/useUserStats";
import { motion, AnimatePresence } from "framer-motion";
import canvasConfetti from "canvas-confetti";

export default function ShopPage() {
  const { stats, buyHearts, isBuyingHearts, buyHeartsError } = useUserStats();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleBuyHearts = async () => {
    if (!stats) return;
    try {
      setSuccessMessage(null);
      const res = await buyHearts();
      if (res.success) {
        setSuccessMessage("Hearts fully refilled!");
        // Launch celebratory confetti!
        canvasConfetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FF4B4B", "#FFC800", "#58CC02", "#1CB0F6"],
        });
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };

  if (!stats) {
    return (
      <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
        <Sidebar />
        <div className="flex-1 lg:pl-[280px] flex items-center justify-center text-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1CB0F6]"></div>
            <p className="text-[#AFAFAF] font-bold text-sm tracking-wide">LOADING SHOP...</p>
          </div>
        </div>
      </div>
    );
  }

  const canBuyHearts = stats.hearts < stats.maxHearts && stats.gems >= 350;
  const isHeartsFull = stats.hearts >= stats.maxHearts;
  const notEnoughGems = stats.gems < 350;

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[280px] flex flex-col items-center min-h-screen text-white select-none">
        <div className="w-full max-w-4xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-start justify-between gap-8">
          
          {/* Central Section: Shop Items */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Shop Header & Gems Display Card */}
            <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Duo&apos;s Shop
                </h1>
                <p className="text-[#AFAFAF] text-sm font-semibold">
                  Spend your hard-earned gems on refills and boosters!
                </p>
              </div>

              {/* Prominent Gems Count Display */}
              <div className="bg-[#131F24] border-2 border-[#202F36] rounded-2xl px-6 py-4 flex items-center space-x-3 shadow-inner hover:scale-105 transition-transform cursor-default">
                {/* 3D-styled Gem Icon */}
                <div className="w-9 h-9 rounded-xl bg-[#00CDFF]/10 flex items-center justify-center flex-shrink-0 animate-bounce">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#00CDFF] fill-current">
                    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#00CDFF] text-2xl font-black">{stats.gems}</div>
                  <div className="text-[#AFAFAF] text-[10px] font-extrabold uppercase tracking-wider">YOUR GEMS</div>
                </div>
              </div>
            </div>

            {/* Success and Error Toasts */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#58CC02] text-black font-extrabold text-sm py-4 px-6 rounded-2xl border-b-4 border-[#3ca200] flex items-center justify-between shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    🎉 {successMessage}
                  </span>
                  <button onClick={() => setSuccessMessage(null)} className="text-black hover:opacity-80">✕</button>
                </motion.div>
              )}

              {buyHeartsError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#FF4B4B] text-white font-extrabold text-sm py-4 px-6 rounded-2xl border-b-4 border-[#ea2b2b] flex items-center justify-between shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    ⚠️ {buyHeartsError.message || "Failed to complete transaction"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-white mb-2 tracking-wide">Power-Ups & Refills</h2>

              {/* ITEM 1: Refill Hearts */}
              <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#FF4B4B]/50 transition-colors shadow-md">
                
                {/* Item Details */}
                <div className="flex items-center space-x-6 text-center md:text-left flex-col md:flex-row">
                  {/* Large Heart Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-[#FF4B4B]/10 flex items-center justify-center flex-shrink-0 shadow-inner relative group mb-4 md:mb-0">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#FF4B4B] fill-current animate-pulse group-hover:scale-110 transition-transform">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-white">Refill Hearts</h3>
                    <p className="text-[#AFAFAF] text-sm font-semibold max-w-sm leading-normal">
                      Get back to full learning strength! Instantly refills your hearts to maximum (5).
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1 text-xs font-bold uppercase tracking-wider text-[#AFAFAF]">
                      <span>CURRENT HEARTS:</span>
                      <span className="text-[#FF4B4B]">{stats.hearts} / {stats.maxHearts}</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Action Button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleBuyHearts}
                    disabled={isBuyingHearts || !canBuyHearts}
                    className={`w-full md:w-44 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider border-b-4 flex items-center justify-center gap-2 transition-all select-none cursor-pointer ${
                      isHeartsFull
                        ? "bg-[#202F36] text-[#52565D] border-transparent cursor-not-allowed border-b-0"
                        : notEnoughGems
                        ? "bg-[#182830] text-[#AFAFAF] border-2 border-[#202F36] border-b-0 cursor-not-allowed opacity-60"
                        : "bg-[#1CB0F6] text-white border-[#1899D6] hover:bg-[#2fc4ff] active:border-b-0 active:translate-y-1"
                    }`}
                  >
                    {isBuyingHearts ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                    ) : isHeartsFull ? (
                      "FULL HEARTS"
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                          <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                        </svg>
                        350 GEMS
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ITEM 2: Streak Freeze (MOCK ITEM) */}
              <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#FF9600]/50 transition-colors shadow-md opacity-90">
                <div className="flex items-center space-x-6 text-center md:text-left flex-col md:flex-row">
                  <div className="w-20 h-20 rounded-2xl bg-[#FF9600]/10 flex items-center justify-center flex-shrink-0 shadow-inner mb-4 md:mb-0">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#FF9600] fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h3 className="font-extrabold text-lg text-white">Streak Freeze</h3>
                      <span className="bg-[#FF9600]/10 text-[#FF9600] text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-[#FF9600]/20">
                        EQUIPPED
                      </span>
                    </div>
                    <p className="text-[#AFAFAF] text-sm font-semibold max-w-sm leading-normal">
                      Allows your streak to remain intact if you miss a day of practice. Up to 1 active freeze.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto">
                  <button
                    disabled
                    className="w-full md:w-44 py-3.5 px-6 bg-[#202F36] text-[#52565D] border-transparent rounded-2xl font-black text-sm uppercase tracking-wider cursor-not-allowed"
                  >
                    MAX EQUIPPED
                  </button>
                </div>
              </div>

              {/* ITEM 3: Double or Nothing (MOCK ITEM) */}
              <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#58CC02]/50 transition-colors shadow-md opacity-90">
                <div className="flex items-center space-x-6 text-center md:text-left flex-col md:flex-row">
                  <div className="w-20 h-20 rounded-2xl bg-[#58CC02]/10 flex items-center justify-center flex-shrink-0 shadow-inner mb-4 md:mb-0">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#58CC02] fill-current">
                      <polygon points="12,2 2,22 22,22" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-white">Double or Nothing</h3>
                    <p className="text-[#AFAFAF] text-sm font-semibold max-w-sm leading-normal">
                      Double your 50 gem wager by completing a 7 day learning streak.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto">
                  <button
                    disabled
                    className="w-full md:w-44 py-3.5 px-6 bg-[#182830] text-[#AFAFAF] border-2 border-[#202F36] rounded-2xl font-black text-sm uppercase tracking-wider cursor-not-allowed opacity-60 flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#AFAFAF] fill-current">
                      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                    </svg>
                    50 GEMS
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Floating Panel: Info Card */}
          <div className="w-full lg:w-80 bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between self-start">
            <div className="space-y-4">
              <span className="text-[#52565D] font-black text-[11px] uppercase tracking-wider block">
                GEM STORE HIGHLIGHT
              </span>

              <h2 className="text-white font-black text-lg leading-tight">
                Keep the learning going!
              </h2>

              <p className="text-[#AFAFAF] text-xs font-semibold leading-relaxed">
                Refill your hearts to get back to lessons without waiting. Or Wagering gems allows you to test your streak discipline and earn bonuses!
              </p>
            </div>

            <div className="flex justify-center mt-6">
              <div className="w-28 h-28 relative">
                <Image
                  src="/practice-mascot.svg"
                  alt="Duo Mascot"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
