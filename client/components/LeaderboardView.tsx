"use client";

import React from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

export function LeaderboardView() {
  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: "#131F24" }}>
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[280px] flex flex-col items-center min-h-screen text-white select-none">
        
        <div className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-start justify-between gap-8">
          
          {/* Central Section: Unlock Leaderboards Hero + Placeholder Skeleton */}
          <div className="flex-1 flex flex-col items-center w-full max-w-xl mx-auto">
            
            {/* Top Shield Badges Hero Illustration (Bronze, Golden Feather, Silver) */}
            <div className="relative w-48 h-32 flex items-center justify-center mb-6">
              {/* Left Bronze Shield */}
              <div className="absolute left-2 w-16 h-20 bg-[#A85934] rounded-2xl rotate-[-12deg] shadow-lg border-t-2 border-[#D97D54] flex items-center justify-center opacity-90">
                <div className="w-8 h-10 border-2 border-[#D97D54]/50 rounded-xl"></div>
              </div>

              {/* Right Silver/Platinum Shield */}
              <div className="absolute right-2 w-16 h-20 bg-[#8FA7B3] rounded-2xl rotate-[12deg] shadow-lg border-t-2 border-[#C0D4DF] flex items-center justify-center opacity-90">
                <div className="w-8 h-10 border-2 border-[#C0D4DF]/50 rounded-xl"></div>
              </div>

              {/* Center Golden Feather Shield */}
              <div className="relative z-10 w-20 h-24 bg-[#FFC800] rounded-2xl shadow-2xl border-t-2 border-[#FFE885] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#854D0E] fill-current">
                  <path d="M21 3c-1.5 0-4 1-6 3-3 3-5 7-6 10-.5 1.5-.5 3-.5 3s1.5 0 3-.5c3-1 7-3 10-6 2-2 3-4.5 3-6 0-1.5-.5-3.5-3.5-3.5zm-5.5 8.5c-.8.8-2 1.5-3.5 2 .5-1.5 1.2-2.7 2-3.5.8-.8 1.5-1.2 2-1.5-.5.8-1 1.7-.5 3z" />
                </svg>
              </div>

              {/* Little floating sparkles */}
              <div className="absolute -top-1 left-12 w-2 h-2 rounded-sm bg-[#FFE885] rotate-45 animate-pulse"></div>
              <div className="absolute bottom-2 right-12 w-2 h-2 rounded-sm bg-[#FFE885] rotate-45 animate-pulse"></div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-center">
              Unlock Leaderboards!
            </h1>
            <p className="text-[#AFAFAF] text-sm md:text-base font-semibold mb-8 text-center">
              Complete 2 more lessons to start competing
            </p>

            {/* COMING SOON Button (Exact replacement of 'START A LESSON') */}
            <button
              disabled
              className="w-64 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-[#AFAFAF] bg-[#182830] border-2 border-[#202F36] shadow-md cursor-not-allowed opacity-80 mb-12 transition-all"
            >
              COMING SOON
            </button>

            {/* Standings Skeleton Rows matching Screenshot */}
            <div className="w-full space-y-4 max-w-lg">
              {[
                { dot: true, width: "w-16" },
                { dot: true, width: "w-28" },
                { dot: true, width: "w-20" },
                { dot: true, width: "w-32" },
                { dot: false, width: "w-24" },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-2 border-b border-[#182830]/60"
                >
                  {/* Left: Dot + Round Avatar Placeholder + Name Pill */}
                  <div className="flex items-center space-x-4">
                    {/* Small Dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#283842]" />

                    {/* Circular Avatar Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-[#283842]" />

                    {/* Name Pill Skeleton */}
                    <div className={`h-4 rounded-full bg-[#283842] ${row.width}`} />
                  </div>

                  {/* Right: XP Pill Skeleton */}
                  <div className="h-4 w-12 rounded-full bg-[#283842]" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Floating Card: WHAT ARE LEADERBOARDS? */}
          <div className="w-full lg:w-80 bg-[#131F24] border-2 border-[#202F36] rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-[#52565D] font-black text-[11px] uppercase tracking-wider block mb-2">
                WHAT ARE LEADERBOARDS?
              </span>

              <h2 className="text-white font-black text-lg leading-tight mb-3">
                Do lessons. Earn XP. Compete.
              </h2>

              <p className="text-[#AFAFAF] text-xs font-semibold leading-relaxed">
                Earn XP through lessons, then compete with players in a weekly leaderboard
              </p>
            </div>

            {/* Mascot with sweatband & dumbbells in bottom-right */}
            <div className="flex justify-end mt-4 relative">
              <div className="w-20 h-20 relative">
                <Image
                  src="/practice-mascot.svg"
                  alt="Duo Coach Mascot"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
