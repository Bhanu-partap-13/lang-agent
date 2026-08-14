"use client";

import React, { useState } from "react";
import type { Exercise } from "@/lib/types";

interface FillBlankExerciseProps {
  exercise: Exercise;
  onComplete: (answer: string) => void;
  disabled: boolean;
}

export function FillBlankExercise({ exercise, onComplete, disabled }: FillBlankExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Split prompt on blank underscores
  const promptParts = exercise.prompt.split("_____");
  const hasBlanks = promptParts.length > 1;

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full max-w-xl mx-auto px-4 mt-6 pb-32 select-none">
      
      {/* Title Header */}
      <h1 className="text-white text-3xl font-black mb-6 text-left w-full tracking-tight">
        Fill in the blank
      </h1>

      {/* Question prompt sentence with blank line */}
      <div className="w-full flex items-center flex-wrap gap-2 text-white text-xl font-bold mb-10 leading-relaxed">
        {hasBlanks ? (
          <>
            <span>{promptParts[0]}</span>
            <span className={`inline-block min-w-[90px] text-center border-b-2 px-3 py-0.5 transition-colors ${
              selected ? "border-[#1CB0F6] text-[#1CB0F6] font-extrabold" : "border-[#4C5B64] text-transparent"
            }`}>
              {selected || "______"}
            </span>
            <span>{promptParts[1]}</span>
          </>
        ) : (
          <span>{exercise.prompt}</span>
        )}
      </div>

      {/* Numbered Option Cards Matching Screenshot (1, 2, 3) */}
      <div className="flex flex-col space-y-3 w-full">
        {exercise.options?.map((opt, i) => {
          const isSelected = selected === opt;

          return (
            <button
              key={i}
              onClick={() => !disabled && setSelected(opt)}
              disabled={disabled}
              className={`w-full px-5 py-4 rounded-2xl border-2 font-bold text-lg flex items-center justify-between transition-all cursor-pointer relative ${
                isSelected
                  ? "border-[#1CB0F6] bg-[#143444] text-[#1CB0F6] shadow-[0_0_15px_rgba(28,176,246,0.2)]"
                  : disabled
                    ? "border-[#202F36] bg-[#182830]/40 text-[#52565D] opacity-50 cursor-not-allowed"
                    : "border-[#202F36] bg-[#182830]/60 text-white hover:bg-[#202F36] hover:border-[#37464F]"
              }`}
            >
              {/* Left Numbered Badge [1] [2] [3] */}
              <div
                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center font-extrabold text-xs transition-colors ${
                  isSelected
                    ? "border-[#1CB0F6] text-[#1CB0F6] bg-[#1CB0F6]/10"
                    : "border-[#37464F] text-[#52565D] bg-transparent"
                }`}
              >
                {i + 1}
              </div>

              {/* Option Text in Center */}
              <div className="flex-1 text-center font-extrabold text-base">
                {opt}
              </div>

              {/* Spacer for symmetrical centering */}
              <div className="w-8" />
            </button>
          );
        })}
      </div>

      {/* Bottom Sticky Action Footer */}
      {!disabled && (
        <div className="fixed bottom-0 left-0 w-full bg-[#131F24] border-t-2 border-[#202F36] p-6 z-40">
          <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
            <button
              className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-[#AFAFAF] hover:text-white border-2 border-[#37464F] hover:bg-[#202F36] transition-colors cursor-pointer"
              onClick={() => onComplete("__SKIPPED__")}
            >
              SKIP
            </button>
            <button
              onClick={() => selected && onComplete(selected)}
              disabled={!selected}
              className={`px-12 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-b-4 transition-all ${
                selected
                  ? "bg-[#58CC02] border-[#46A302] text-white hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-lg cursor-pointer"
                  : "bg-[#37464F] border-[#202F36] text-[#52565D] cursor-not-allowed"
              }`}
            >
              CHECK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

