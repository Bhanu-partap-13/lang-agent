"use client";

import React, { useState } from "react";
import type { Exercise } from "@/lib/types";

interface TypeAnswerExerciseProps {
  exercise: Exercise;
  onComplete: (answer: string) => void;
  disabled: boolean;
}

export function TypeAnswerExercise({ exercise, onComplete, disabled }: TypeAnswerExerciseProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full max-w-2xl mx-auto px-4 mt-8 pb-32">
      <h1 className="text-white text-3xl font-extrabold mb-8 text-center w-full">
        {exercise.prompt}
      </h1>

      <div className="w-full">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder="Type in Hindi..."
          autoFocus
          className="w-full bg-[#202F36] border-2 border-[#37464F] rounded-xl p-4 text-white font-bold text-xl focus:border-[#84D8FF] focus:outline-none transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter" && answer.trim() && !disabled) {
              onComplete(answer.trim());
            }
          }}
        />
      </div>

      {!disabled && (
        <div className="fixed bottom-0 left-0 w-full bg-[#131F24] border-t-2 border-[#37464F] p-6 flex justify-between items-center z-40">
          <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
            <button
              className="px-8 py-3 rounded-xl font-bold text-white uppercase tracking-wide border-2 border-[#37464F] hover:bg-[#202F36] transition-colors"
              onClick={() => setAnswer("")}
            >
              SKIP
            </button>
            <button
              onClick={() => answer.trim() && onComplete(answer.trim())}
              disabled={!answer.trim()}
              className={`px-12 py-3 rounded-xl font-bold text-white uppercase tracking-wide border-b-4 transition-all ${
                answer.trim()
                  ? "bg-[#58CC02] border-[#58A700] hover:bg-[#46A302] active:border-b-0 active:translate-y-1"
                  : "bg-[#37464F] border-[#37464F] text-[#52565D] cursor-not-allowed"
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
