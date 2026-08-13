"use client";

import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface LessonCompleteProps {
  hearts: number;
  xpAwarded?: number;
}

/**
 * LessonComplete — celebration screen shown after the last question is answered.
 *
 * Fires a canvas-confetti burst on mount and displays the session stats.
 * XP is displayed here; in production, the actual DB write happens via a
 * POST /api/lessons/[id]/complete route (to be wired up with the backend).
 */
export function LessonComplete({ hearts, xpAwarded = 10 }: LessonCompleteProps) {
  const router = useRouter();

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#58CC02", "#1CB0F6", "#FFC800", "#FF4B4B", "#CE82FF"],
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-[#FFC800] text-5xl font-extrabold mb-8 drop-shadow-lg">
        Lesson Complete!
      </h1>

      <div className="flex space-x-6 mb-12">
        {/* XP earned this session */}
        <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-6 w-40 flex flex-col items-center">
          <h3 className="text-white font-bold mb-2">Total XP</h3>
          <div className="bg-[#FFC800] text-[#A84400] font-black text-2xl px-4 py-2 rounded-xl border-b-4 border-[#D98A00]">
            +{xpAwarded}
          </div>
        </div>

        {/* Hearts remaining */}
        <div className="bg-[#202F36] border-2 border-[#37464F] rounded-2xl p-6 w-40 flex flex-col items-center">
          <h3 className="text-white font-bold mb-2">Hearts</h3>
          <div className="flex items-center space-x-2 text-[#FF4B4B] font-black text-2xl">
            <Heart className="w-8 h-8 fill-current" />
            <span>{hearts}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/learn")}
        className="w-full max-w-sm py-4 rounded-xl font-bold text-white uppercase tracking-wide border-b-4 bg-[#58CC02] border-[#58A700] hover:bg-[#46A302] active:border-b-0 active:translate-y-1 transition-all"
      >
        CONTINUE TO HOME
      </button>
    </div>
  );
}
