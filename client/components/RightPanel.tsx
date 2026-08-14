"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStats } from "@/lib/hooks/useUserStats";

export default function RightPanel({ onOpenChest }: { onOpenChest?: () => void }) {
  const { stats, daily, refetch } = useUserStats();
  const [activePopover, setActivePopover] = useState<"flag" | "streak" | "gems" | "hearts" | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [heartsCount, setHeartsCount] = useState<number>(stats?.hearts ?? 5);
  const [secondsLeft, setSecondsLeft] = useState<number>(stats?.secondsUntilNextHeart || 240); // 4 minutes

  useEffect(() => {
    const t = setTimeout(() => {
      if (stats?.hearts !== undefined) {
        setHeartsCount(stats.hearts);
      }
      if (stats?.secondsUntilNextHeart !== undefined) {
        setSecondsLeft(stats.secondsUntilNextHeart);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [stats?.hearts, stats?.secondsUntilNextHeart]);

  // Real-time 4-minute (240s) heart regeneration timer with visibilitychange event sync
  useEffect(() => {
    if (heartsCount >= 5) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setHeartsCount((h) => Math.min(5, h + 1));
          refetch?.(); // Sync new regenerated heart with PostgreSQL database
          return 240; // Reset 4 minutes for next heart
        }
        return prev - 1;
      });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch?.();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [heartsCount, refetch]);

  const formatHeartTime = (totalSec: number) => {
    if (heartsCount >= 5) return "FULL";
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (m > 0) return `${m} minutes ${s}s`;
    return `${s} seconds`;
  };

  const handleMouseEnter = (popover: "flag" | "streak" | "gems" | "hearts") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActivePopover(popover);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActivePopover(null);
    }, 150);
  };

  const todayXp = daily?.todayXp ?? 0;
  const targetXp = 100;
  const progressPercent = Math.min(100, Math.round((todayXp / targetXp) * 100));
  const isChestReady = todayXp >= 100 && !daily?.chestClaimed;

  return (
    <div className="fixed top-0 lg:right-12 xl:right-24 h-screen w-[420px] flex flex-col p-6 hidden lg:flex bg-[#131F24] z-30" ref={panelRef}>
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between mb-8 px-2 relative z-50">
        {/* Flag Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter("flag")}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`p-2 rounded-xl transition-colors cursor-pointer ${
            activePopover === "flag" ? "bg-[#202F36]" : "hover:bg-[#202F36]"
          }`}>
            <svg viewBox="0 0 64 64" className="w-8 h-8 rounded-md border-2 border-[#37464F]">
              <rect width="64" height="21.3" fill="#FF9933" />
              <rect y="21.3" width="64" height="21.3" fill="#FFFFFF" />
              <rect y="42.6" width="64" height="21.3" fill="#138808" />
              <circle cx="32" cy="32" r="8" fill="none" stroke="#000080" strokeWidth="2" />
              <circle cx="32" cy="32" r="2" fill="#000080" />
            </svg>
          </div>

          {/* Flag Popover */}
          <AnimatePresence>
            {activePopover === "flag" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => handleMouseEnter("flag")}
                onMouseLeave={handleMouseLeave}
                className="absolute left-0 top-full mt-3 w-72 bg-[#131F24] border-2 border-[#202F36] rounded-2xl p-4 shadow-2xl z-50"
              >
                <div className="absolute -top-2 left-5 w-4 h-4 bg-[#131F24] border-t-2 border-l-2 border-[#202F36] rotate-45"></div>
                <h3 className="text-[#AFAFAF] font-bold text-xs tracking-wider uppercase mb-3">My Courses</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#202F36] border-2 border-[#1CB0F6]">
                    <span className="text-2xl">🇮🇳</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">Hindi</p>
                      <p className="text-[#AFAFAF] text-xs font-semibold">Section 1, Unit 1</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1CB0F6]"></span>
                  </div>

                  <div className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-[#202F36] transition-colors cursor-pointer opacity-70">
                    <span className="text-2xl">🇪🇸</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">Spanish</p>
                      <p className="text-[#AFAFAF] text-xs font-semibold">Section 1, Unit 3</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 py-2.5 rounded-xl border-2 border-[#37464F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#202F36] transition-colors flex items-center justify-center space-x-2">
                  <span>+</span>
                  <span>Add Course</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Streak Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter("streak")}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`flex items-center space-x-2 p-2 rounded-xl transition-colors cursor-pointer ${
            activePopover === "streak" ? "bg-[#202F36]" : "hover:bg-[#202F36]"
          }`}>
            <Image src="/day-streak.svg" alt="Streak" width={24} height={24} className="w-6 h-6" />
            <span className={`font-bold text-[15px] ${stats?.currentStreak ? "text-[#FF9600]" : "text-[#52565D]"}`}>
              {stats?.currentStreak ?? 0}
            </span>
          </div>

          {/* Streak Popover (Matching Image 1) */}
          <AnimatePresence>
            {activePopover === "streak" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => handleMouseEnter("streak")}
                onMouseLeave={handleMouseLeave}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[380px] bg-[#131F24] border-2 border-[#202F36] rounded-3xl p-6 shadow-2xl z-50 flex flex-col space-y-5"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#131F24] border-t-2 border-l-2 border-[#202F36] rotate-45"></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-extrabold text-2xl mb-1">{stats?.currentStreak ?? 0} day streak</h3>
                    <p className="text-[#AFAFAF] text-sm font-semibold max-w-[230px] leading-relaxed">
                      {(stats?.currentStreak ?? 0) > 0 ? "Great job! Keep learning every day!" : "Do a lesson today to start a new streak!"}
                    </p>
                  </div>
                  <Image src="/day-streak.svg" alt="Streak" width={64} height={64} className={`w-16 h-16 ${(stats?.currentStreak ?? 0) > 0 ? "" : "grayscale opacity-40"}`} />
                </div>

                <div className="bg-[#182830] border-2 border-[#202F36] rounded-2xl p-4">
                  <div className="flex justify-between items-center px-1 mb-2.5">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                      <span key={idx} className={`font-extrabold text-sm ${idx === 4 ? "text-[#FFC800]" : "text-[#AFAFAF]"}`}>
                        {day}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${i === 4 && (stats?.currentStreak ?? 0) > 0 ? "bg-[#FF9600]" : "bg-[#37464F]"}`}></div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FF5E00] rounded-2xl p-5 text-white relative overflow-hidden flex flex-col">
                  <div className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center">
                    <Image src="/day-streak.svg" alt="Streak" width={40} height={40} className="w-10 h-10" />
                  </div>
                  <h4 className="font-extrabold text-base mb-0.5 ml-12">Friend Streaks</h4>
                  <p className="text-white/95 text-sm font-semibold mb-4 ml-12">0 active Friend Streaks</p>
                  <button className="w-full bg-white text-[#FF5E00] font-black text-sm uppercase py-3.5 rounded-2xl border-b-4 border-[#E54800] hover:brightness-105 active:border-b-0 active:translate-y-1 transition-all text-center shadow-lg cursor-pointer">
                    VIEW LIST
                  </button>
                </div>

                <div className="bg-[#182830] border-2 border-[#202F36] rounded-2xl p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#202F36] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#37464F]">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-base text-white mb-0.5">Streak Society</h5>
                    <p className="text-[#AFAFAF] text-xs font-semibold leading-relaxed">
                      Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                    </p>
                  </div>
                </div>

                <button className="w-full bg-[#1CB0F6] border-b-4 border-[#1483B8] text-white font-black text-sm uppercase py-3.5 rounded-2xl hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all text-center shadow-lg cursor-pointer">
                  VIEW MORE
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gems Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter("gems")}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`flex items-center space-x-2 p-2 rounded-xl transition-colors cursor-pointer ${
            activePopover === "gems" ? "bg-[#202F36]" : "hover:bg-[#202F36]"
          }`}>
            <Image src="/gem.svg" alt="Gems" width={24} height={24} className="w-6 h-6" />
            <span className="font-bold text-[#1CB0F6] text-[15px]">{stats?.gems ?? 500}</span>
          </div>

          {/* Gems Popover */}
          <AnimatePresence>
            {activePopover === "gems" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => handleMouseEnter("gems")}
                onMouseLeave={handleMouseLeave}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-80 bg-[#131F24] border-2 border-[#202F36] rounded-2xl p-5 shadow-2xl z-50 flex items-center space-x-4"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#131F24] border-t-2 border-l-2 border-[#202F36] rotate-45"></div>

                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="15" y="45" width="70" height="40" rx="6" fill="#D98A00" />
                    <rect x="15" y="45" width="70" height="10" fill="#F4B000" />
                    <rect x="42" y="55" width="16" height="20" rx="2" fill="#A84400" />
                    <circle cx="50" cy="62" r="3" fill="#FFF" />
                    <path d="M30 40 L45 25 L60 40 Z" fill="#1CB0F6" />
                    <path d="M45 25 L60 40 L45 45 Z" fill="#1483B8" />
                    <path d="M50 42 L65 28 L80 42 Z" fill="#1CB0F6" />
                    <path d="M20 42 L35 30 L50 42 Z" fill="#00CD9C" />
                    <circle cx="45" cy="30" r="2" fill="#FFF" />
                    <circle cx="65" cy="35" r="2" fill="#FFF" />
                    <path d="M12 40 L50 15 L88 40 Z" fill="#F4B000" />
                    <path d="M15 40 L50 18 L85 40 Z" fill="#D98A00" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-white font-extrabold text-xl mb-0.5">Gems</h3>
                  <p className="text-[#AFAFAF] text-sm font-semibold mb-3">You have {stats?.gems ?? 500} gems</p>
                  <Link
                    href="/shop"
                    className="font-extrabold text-[#1CB0F6] uppercase text-xs tracking-wider hover:underline"
                  >
                    GO TO SHOP
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hearts Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter("hearts")}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`flex items-center space-x-2 p-2 rounded-xl transition-colors cursor-pointer ${
            activePopover === "hearts" ? "bg-[#202F36]" : "hover:bg-[#202F36]"
          }`}>
            <Image src="/hearts.svg" alt="Hearts" width={24} height={24} className="w-6 h-6" />
            <span className="font-bold text-[#FF4B4B] text-[15px]">{heartsCount}</span>
          </div>

          {/* Hearts Popover (Matching Image 1) */}
          <AnimatePresence>
            {activePopover === "hearts" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => handleMouseEnter("hearts")}
                onMouseLeave={handleMouseLeave}
                className="absolute right-0 top-full mt-3 w-[380px] bg-[#131F24] border-2 border-[#202F36] rounded-3xl p-6 shadow-2xl z-50 flex flex-col items-center"
              >
                <div className="absolute -top-2 right-6 w-4 h-4 bg-[#131F24] border-t-2 border-l-2 border-[#202F36] rotate-45"></div>

                <h3 className="text-white font-extrabold text-2xl mb-4">Hearts</h3>

                {/* 5 Hearts Row */}
                <div className="flex justify-center items-center space-x-3 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const isFilled = idx < heartsCount;
                    const isRefilling = idx === heartsCount && heartsCount < 5;
                    return (
                      <div key={idx} className="relative flex items-center justify-center">
                        <Image 
                          src="/hearts.svg" 
                          alt="Heart" 
                          width={36} 
                          height={36} 
                          className={`w-9 h-9 ${
                            isFilled 
                              ? "drop-shadow-md" 
                              : isRefilling 
                                ? "opacity-50" 
                                : "grayscale opacity-30"
                          }`} 
                        />
                        {isRefilling && (
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-white animate-ping"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-white font-extrabold text-base mb-1 text-center">
                  Next heart in <span className="text-[#FF4B4B] font-extrabold">{formatHeartTime(secondsLeft)}</span>
                </p>
                <p className="text-[#AFAFAF] text-sm font-semibold mb-6 text-center">
                  {heartsCount >= 5 ? "Your hearts are full!" : "You still have hearts left! Keep on learning"}
                </p>

                <div className="w-full flex flex-col space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#182830] border-2 border-[#202F36] hover:bg-[#202F36] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#A05CFF] to-[#FF79CA] flex items-center justify-center text-white shadow-md">
                        <span className="text-base font-black">∞</span>
                      </div>
                      <span className="font-black text-sm text-white uppercase tracking-wider">UNLIMITED HEARTS</span>
                    </div>
                    <span className="font-black text-xs text-[#FF79CA] uppercase tracking-wider">FREE TRIAL</span>
                  </button>

                  <button 
                    onClick={() => {
                      setHeartsCount(5);
                      setSecondsLeft(14400);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#182830] border-2 border-[#202F36] hover:bg-[#202F36] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3.5">
                      <Image src="/hearts.svg" alt="Heart" width={28} height={28} className="w-7 h-7" />
                      <span className="font-black text-sm text-white uppercase tracking-wider">REFILL HEARTS</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Image src="/gem.svg" alt="Gem" width={18} height={18} className="w-4.5 h-4.5" />
                      <span className="font-black text-sm text-[#1CB0F6]">350</span>
                    </div>
                  </button>

                  <button className="w-full flex items-center space-x-3.5 p-4 rounded-2xl bg-[#182830] border-2 border-[#202F36] hover:bg-[#202F36] transition-colors cursor-pointer">
                    <Image src="/hearts.svg" alt="Heart" width={28} height={28} className="w-7 h-7" />
                    <span className="font-black text-sm text-white uppercase tracking-wider">PRACTICE TO EARN HEARTS</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col space-y-6 overflow-y-auto pr-2 pb-10 custom-scrollbar">
        
        {/* Super Widget (Matching Image 1) */}
        <div className="rounded-2xl border-2 border-[#202F36] p-5 pb-6 relative overflow-hidden flex flex-col bg-[#131F24]">
          {/* Super Logo */}
          <div className="w-20 mb-3 z-10">
            <Image
              src="/super.svg"
              alt="Super"
              width={76}
              height={26}
              className="w-auto h-6"
            />
          </div>
          
          <h2 className="text-white font-extrabold text-lg mb-1 z-10 w-[65%]">Try Super for free</h2>
          <p className="text-[#AFAFAF] text-xs font-semibold mb-4 z-10 leading-relaxed w-[68%]">
            No ads, personalized practice, and unlimited Legendary!
          </p>

          <button className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-[#4A47FF] to-[#3B38EE] border-b-4 border-[#2421A9] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all z-10 uppercase tracking-wider text-xs text-center shadow-lg cursor-pointer">
            TRY 1 WEEK FREE
          </button>

          {/* Super Owl Graphic */}
          <div className="absolute top-3 right-1 w-24 h-24 z-10">
            <Image
              src="/super owl.svg"
              alt="Super Owl"
              width={90}
              height={90}
              priority
              className="drop-shadow-xl"
            />
          </div>
        </div>

        {/* Bronze League Leaderboards Widget (Enlarged) */}
        <div className="rounded-3xl border-2 border-[#37464F] p-6 flex flex-col bg-[#131F24]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white font-extrabold text-xl">Bronze League</h2>
            <Link href="/leaderboards" className="text-[#1CB0F6] font-extrabold text-xs uppercase tracking-wider hover:brightness-125">
              VIEW LEAGUE
            </Link>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-[#202F36] flex-shrink-0">
              <Image
                src="/unlock-leaderboard.svg"
                alt="Bronze League"
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
            <p className="text-[#AFAFAF] text-sm font-semibold leading-relaxed flex-1">
              Complete a lesson to join this week&apos;s leaderboard and compete against other learners
            </p>
          </div>
        </div>

        {/* Daily Quests Widget (Enlarged & Dynamic) */}
        <div className="rounded-3xl border-2 border-[#37464F] p-6 flex flex-col bg-[#131F24]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-extrabold text-xl">Daily Quests</h2>
            <Link href="/quests" className="text-[#1CB0F6] font-extrabold text-xs uppercase tracking-wider hover:brightness-125">
              VIEW ALL
            </Link>
          </div>
          
          <div className="flex items-center space-x-5 mb-2">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <Image
                src="/daily-quest-yellow.svg"
                alt="Daily Quest"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-extrabold text-base">Earn 100 XP</p>
                <span className="text-[#AFAFAF] font-extrabold text-xs">
                  {todayXp} / 100 XP
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-5 rounded-full bg-[#37464F] relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#FFC800] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                  <div
                    className="absolute top-1 left-2 h-1 rounded-full bg-white opacity-20 transition-all duration-500"
                    style={{ width: `${Math.max(0, progressPercent - 5)}%` }}
                  ></div>
                </div>
                
                {/* Chest Icon Trigger */}
                <div
                  onClick={() => isChestReady && onOpenChest?.()}
                  className={`relative ${
                    isChestReady
                      ? "cursor-pointer animate-bounce hover:scale-115 transition-transform"
                      : daily?.chestClaimed
                      ? "opacity-40 grayscale"
                      : "opacity-75"
                  }`}
                  title={
                    daily?.chestClaimed
                      ? "Chest already claimed today"
                      : isChestReady
                      ? "Claim your 100 XP reward!"
                      : `Earn ${100 - todayXp} more XP to open`
                  }
                >
                  <Image
                    src="/daily-quest-treasure.svg"
                    alt="Chest"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  {isChestReady && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#58CC02] rounded-full border-2 border-[#131F24] animate-ping" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
