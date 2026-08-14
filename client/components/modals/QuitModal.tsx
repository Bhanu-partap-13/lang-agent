"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * QuitModal — shown when the user clicks the ✕ button mid-lesson.
 *
 * Strict XP rule: quitting routes back to /learn with 0 XP.
 * STAY simply closes the modal so the user can continue.
 */
interface QuitModalProps {
  onStay: () => void;
}

export function QuitModal({ onStay }: QuitModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-8 max-w-md w-full text-center">
        <h2 className="text-white text-2xl font-extrabold mb-4">
          Are you sure you want to quit?
        </h2>
        <p className="text-[#AFAFAF] mb-8 font-bold">
          You will lose all progress from this lesson.
        </p>

        {/* Primary: stay in the lesson */}
        <button
          onClick={onStay}
          className="w-full bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1498D5] text-white font-bold py-3 rounded-xl mb-4 active:border-b-0 active:translate-y-1 transition-all uppercase"
        >
          STAY
        </button>

        {/* Destructive: quit with 0 XP */}
        <button
          onClick={() => router.push("/learn")}
          className="w-full bg-transparent border-2 border-[#FF4B4B] text-[#FF4B4B] hover:bg-[#FF4B4B]/10 font-bold py-3 rounded-xl active:translate-y-1 transition-all uppercase"
        >
          QUIT
        </button>
      </div>
    </div>
  );
}
