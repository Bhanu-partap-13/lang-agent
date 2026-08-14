"use client";

import React, { useState, useEffect } from "react";
import type { Exercise } from "@/lib/types";

interface TranslateExerciseProps {
  exercise: Exercise;
  onComplete: (answer: string[]) => void;
  disabled: boolean;
}

export function TranslateExercise({ exercise, onComplete, disabled }: TranslateExerciseProps) {
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    if (exercise.options) {
      const t = setTimeout(() => setAvailableWords([...exercise.options!].sort(() => Math.random() - 0.5)), 0);
      return () => clearTimeout(t);
    }
  }, [exercise]);

  const handleSelect = (word: string, index: number) => {
    if (disabled) return;
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    setSelectedWords([...selectedWords, word]);
  };

  const handleDeselect = (word: string, index: number) => {
    if (disabled) return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full max-w-2xl mx-auto px-4 mt-8 pb-32">
      <h1 className="text-white text-3xl font-extrabold mb-8 text-center w-full">{exercise.prompt}</h1>
      <div className="w-full min-h-[80px] p-4 border-b-2 border-t-2 border-[#37464F] mb-8 flex flex-wrap gap-2 items-center">
        {selectedWords.map((word, i) => (
          <button key={`selected-${i}`} onClick={() => handleDeselect(word, i)} disabled={disabled} className="px-4 py-2 bg-[#1CB0F6] text-white rounded-xl font-bold border-b-4 border-[#1899D6] hover:bg-[#149BDB] active:translate-y-1 active:border-b-0 transition-all">{word}</button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {availableWords.map((word, i) => (
          <button key={`available-${i}`} onClick={() => handleSelect(word, i)} disabled={disabled} className="px-4 py-2 bg-transparent text-white border-2 border-[#37464F] rounded-xl font-bold border-b-4 hover:bg-[#202F36] active:translate-y-1 active:border-b-0 transition-all">{word}</button>
        ))}
      </div>
      {!disabled && (
        <div className="fixed bottom-0 left-0 w-full bg-[#131F24] border-t-2 border-[#37464F] p-6 flex justify-between items-center z-40">
          <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
            <button className="px-8 py-3 rounded-xl font-bold text-white uppercase tracking-wide border-2 border-[#37464F] hover:bg-[#202F36] transition-colors" onClick={() => { setAvailableWords([...availableWords, ...selectedWords]); setSelectedWords([]); }}>CLEAR</button>
            <button onClick={() => selectedWords.length > 0 && onComplete(selectedWords)} disabled={selectedWords.length === 0} className={`px-12 py-3 rounded-xl font-bold text-white uppercase tracking-wide border-b-4 transition-all ${selectedWords.length > 0 ? "bg-[#58CC02] border-[#58A700] hover:bg-[#46A302] active:border-b-0 active:translate-y-1" : "bg-[#37464F] border-[#37464F] text-[#52565D] cursor-not-allowed"}`}>CHECK</button>
          </div>
        </div>
      )}
    </div>
  );
}
