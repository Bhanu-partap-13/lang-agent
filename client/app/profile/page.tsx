"use client";

import React from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/lib/hooks/useUserStats";


export default function ProfilePage() {
  const { data: profile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
        <Sidebar />
        <div className="flex-1 lg:pl-[280px] flex items-center justify-center text-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#1CB0F6]"></div>
            <p className="text-[#AFAFAF] font-bold text-sm tracking-wide">LOADING PROFILE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
        <Sidebar />
        <div className="flex-1 lg:pl-[280px] flex items-center justify-center text-white">
          <div className="text-center p-6 bg-[#182830] border-2 border-[#202F36] rounded-3xl max-w-sm">
            <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Profile</h2>
            <p className="text-[#AFAFAF] text-sm mb-4">Could not retrieve user data from the backend.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#1CB0F6] text-white font-extrabold rounded-2xl border-b-4 border-[#1899D6] active:border-b-0 uppercase text-xs tracking-wider"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { username, joinedAt, stats, achievements } = profile;
  const joinDateStr = new Date(joinedAt * 1000).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[280px] flex flex-col items-center min-h-screen text-white select-none">
        <div className="w-full max-w-4xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-start justify-between gap-8">
          
          {/* Central Section: User Profile & Achievements */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Profile Header Card */}
            <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden shadow-xl">
              {/* Profile Avatar with colorful ring */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-[#FF9600] to-[#FFC800] p-1 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#131F24] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 48 48" className="w-16 h-16 md:w-20 md:h-20 text-[#AFAFAF]">
                      <circle cx="24" cy="18" r="9" fill="currentColor" />
                      <path d="M10 42c0-10 28-10 28 0" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                {/* Floating active crown decoration */}
                <div className="absolute -top-3 -right-2 bg-[#FFD700] text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-black shadow-md flex items-center gap-1">
                  👑 GOLD
                </div>
              </div>

              {/* User Bio Details */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {username}
                </h1>
                <p className="text-[#AFAFAF] text-sm font-semibold flex items-center justify-center md:justify-start gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#AFAFAF] fill-current">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
                  </svg>
                  Joined {joinDateStr}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <span className="bg-[#202F36] text-white px-3.5 py-1.5 rounded-xl border border-[#283842] text-xs font-bold uppercase tracking-wider">
                    🇺🇸 English Course
                  </span>
                  <span className="bg-[#1CB0F6]/10 text-[#1CB0F6] px-3.5 py-1.5 rounded-xl border border-[#1CB0F6]/20 text-xs font-bold uppercase tracking-wider">
                    Lv. 5 Learner
                  </span>
                </div>
              </div>

              {/* Sparkle background details */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
            </div>

            {/* Statistics Section */}
            <div>
              <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight flex items-center gap-2">
                Statistics
              </h2>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total XP Card */}
                <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-5 shadow-lg flex items-center space-x-4 hover:border-[#FFC800] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFC800]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FFC800] fill-current">
                      <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{stats.totalXp}</div>
                    <div className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider">Total XP</div>
                  </div>
                </div>

                {/* Current Streak Card */}
                <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-5 shadow-lg flex items-center space-x-4 hover:border-[#FF9600] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF9600]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF9600] fill-current animate-pulse">
                      <path d="M17.66 11.57c-.77-.77-1.9-1.16-3.03-1.16-.4 0-.8.05-1.19.16-.48.13-.93-.13-1.07-.61-.13-.48.13-.97.61-1.07 1.29-.35 2.65-.08 3.68.79.77.65 1.15 1.63 1.15 2.61s-.38 1.96-1.15 2.61c-.34.29-.82.41-1.26.29-.44-.12-.76-.47-.83-.92-.12-.7-.52-1.32-1.13-1.74-.53-.36-1.17-.53-1.81-.53s-1.28.17-1.81.53c-.61.42-1.01 1.04-1.13 1.74-.07.45-.39.8-.83.92-.44.12-.92 0-1.26-.29C6.38 14.2 6 13.22 6 12.24s.38-1.96 1.15-2.61c.42-.36.63-.88.54-1.42-.09-.54-.5-.97-1.04-1.06C5.55 7.02 4.41 7.3 3.64 8.07c-1.54 1.54-2.3 3.56-2.3 5.58s.77 4.04 2.3 5.58c1.54 1.54 3.56 2.3 5.58 2.3s4.04-.77 5.58-2.3c1.54-1.54 2.3-3.56 2.3-5.58s-.76-4.04-2.3-5.58z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{stats.currentStreak} Days</div>
                    <div className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider">Current Streak</div>
                  </div>
                </div>

                {/* Longest Streak Card */}
                <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-5 shadow-lg flex items-center space-x-4 hover:border-[#1CB0F6] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#1CB0F6] fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{stats.longestStreak} Days</div>
                    <div className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider">Longest Streak</div>
                  </div>
                </div>

                {/* Gems Card */}
                <div className="bg-[#182830] border-2 border-[#202F36] rounded-3xl p-5 shadow-lg flex items-center space-x-4 hover:border-[#FF4B4B] transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF4B4B]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF4B4B] fill-current">
                      <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{stats.gems}</div>
                    <div className="text-[#AFAFAF] text-xs font-bold uppercase tracking-wider">Total Gems</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div>
              <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight">
                Achievements
              </h2>
              
              <div className="space-y-3">
                {achievements.map((ach) => {
                  // Calculate progress for progress bar if locked
                  let progressPercent = 0;
                  let progressText = "";
                  
                  if (ach.code === "streak_3") {
                    progressPercent = Math.min(100, Math.round((stats.longestStreak / 3) * 100));
                    progressText = `${stats.longestStreak} / 3 days`;
                  } else if (ach.code === "streak_7") {
                    progressPercent = Math.min(100, Math.round((stats.longestStreak / 7) * 100));
                    progressText = `${stats.longestStreak} / 7 days`;
                  } else if (ach.code === "xp_100") {
                    progressPercent = Math.min(100, Math.round((stats.totalXp / 100) * 100));
                    progressText = `${stats.totalXp} / 100 XP`;
                  } else if (ach.code === "xp_500") {
                    progressPercent = Math.min(100, Math.round((stats.totalXp / 500) * 100));
                    progressText = `${stats.totalXp} / 500 XP`;
                  }

                  return (
                    <div
                      key={ach.id}
                      className={`bg-[#182830] border-2 rounded-3xl p-5 flex items-center space-x-5 transition-all shadow-md ${
                        ach.isUnlocked 
                          ? "border-[#202F36] hover:border-[#58CC02]" 
                          : "border-[#202F36] border-dashed opacity-75"
                      }`}
                    >
                      {/* Achievement Badge Icon wrapper */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden ${
                        ach.isUnlocked 
                          ? "bg-gradient-to-b from-[#7cfa19]/20 to-[#58cc02]/30 border-2 border-[#58CC02]" 
                          : "bg-zinc-800/50 border-2 border-zinc-700 filter grayscale"
                      }`}>
                        
                        {/* Inline SVGs for different achievements */}
                        {ach.code.includes("streak") ? (
                          <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FF9600] fill-current animate-pulse">
                            <path d="M17.66 11c-.11-.19-.24-.37-.39-.54-.42-.48-1.01-.84-1.63-.98-.4-.09-.81-.13-1.2-.13-.39 0-.78.04-1.16.13-.33.08-.66.21-.96.38-.48.27-.88.66-1.17 1.13-.26.42-.42.9-.47 1.4-.04.4-.02.81.07 1.2.08.34.22.66.4.96.27.46.64.84 1.09 1.12.51.32 1.1.5 1.7.5s1.19-.18 1.7-.5c.45-.28.82-.66 1.09-1.12.18-.3.32-.62.4-.96.09-.39.11-.8.07-1.2-.05-.5-.21-.98-.47-1.4zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.5.51-.57 1.11-.57 2.61h-2c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#FFC800] fill-current">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}

                        {/* Lock overlay icon */}
                        {!ach.isUnlocked && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Achievement Details */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-extrabold text-base tracking-wide ${ach.isUnlocked ? "text-white" : "text-[#AFAFAF]"}`}>
                            {ach.title}
                          </h3>
                          {ach.isUnlocked && (
                            <span className="text-[#58CC02] text-xs font-black uppercase tracking-wider flex items-center gap-1 bg-[#58CC02]/10 px-2 py-0.5 rounded-lg border border-[#58CC02]/20">
                              ✓ UNLOCKED
                            </span>
                          )}
                        </div>
                        <p className="text-[#AFAFAF] text-xs font-semibold leading-relaxed">
                          {ach.description}
                        </p>

                        {/* Progress Bar for locked items */}
                        {!ach.isUnlocked && (
                          <div className="pt-2">
                            <div className="flex justify-between text-[10px] text-[#AFAFAF] font-bold mb-1">
                              <span>PROGRESS</span>
                              <span>{progressText}</span>
                            </div>
                            <div className="w-full bg-[#202F36] h-3.5 rounded-full overflow-hidden border border-[#283842] relative">
                              <div
                                className="bg-[#1CB0F6] h-full rounded-full transition-all duration-500 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] border-r border-[#1CB0F6]"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Floating Panel: Info Card */}
          <div className="w-full lg:w-80 bg-[#182830] border-2 border-[#202F36] rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between self-start">
            <div className="space-y-4">
              <span className="text-[#52565D] font-black text-[11px] uppercase tracking-wider block">
                LEARNER TROPHY ROOM
              </span>

              <h2 className="text-white font-black text-lg leading-tight">
                Unlock badges and show off your streak!
              </h2>

              <p className="text-[#AFAFAF] text-xs font-semibold leading-relaxed">
                Unlock badges by practicing regularly, hitting higher XP thresholds, and maintaining long streaks. Compete to lock in legendary status!
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
