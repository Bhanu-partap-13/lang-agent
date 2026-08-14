"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * OutOfHeartsModal — shown when hearts reach 0.
 *
 * Options:
 *   • Refill Hearts — resets local heart count (mock; real app would spend gems)
 *   • Quit to Home — navigates back with 0 XP awarded
 */
interface OutOfHeartsModalProps {
  onRefill: () => void;
}

export function OutOfHeartsModal({ onRefill }: OutOfHeartsModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-[#131F24] border-2 border-[#37464F] rounded-3xl p-8 max-w-md w-full text-center">
        <Heart className="w-20 h-20 fill-[#FF4B4B] text-[#FF4B4B] mx-auto mb-6 opacity-80" />
        <h2 className="text-white text-3xl font-extrabold mb-4">No Hearts Left!</h2>
        <p className="text-[#AFAFAF] mb-8 font-bold">
          You&apos;ve run out of hearts. Refill to continue learning!
        </p>

        {/* Mock refill — in production this would spend gems */}
        <button
          onClick={onRefill}
          className="w-full bg-[#58CC02] border-b-4 border-[#58A700] hover:bg-[#46A302] text-white font-bold py-3 rounded-xl mb-4 active:border-b-0 active:translate-y-1 transition-all uppercase"
        >
          REFILL HEARTS
        </button>

        <button
          onClick={() => router.push("/learn")}
          className="w-full bg-transparent border-2 border-[#52565D] text-[#AFAFAF] hover:bg-[#202F36] font-bold py-3 rounded-xl active:translate-y-1 transition-all uppercase"
        >
          QUIT TO HOME
        </button>
      </div>
    </div>
  );
}
