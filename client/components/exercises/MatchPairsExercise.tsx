"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/lib/types";

interface MatchPairsExerciseProps {
  exercise: Exercise;
  onComplete: (answer: string) => void;
  onMismatch?: () => void;
  disabled: boolean;
}

type PairItem = { id: string; text: string; side: "left" | "right"; originalPairId: string };

export function MatchPairsExercise({ exercise, onComplete, onMismatch, disabled }: MatchPairsExerciseProps) {
  const [leftItems, setLeftItems] = useState<PairItem[]>([]);
  const [rightItems, setRightItems] = useState<PairItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!exercise.pairs) return;
    
    const left: PairItem[] = [];
    const right: PairItem[] = [];
    
    exercise.pairs.forEach((p, i) => {
      const pairId = `pair-${i}`;
      left.push({ id: `l-${i}`, text: p.left, side: "left", originalPairId: pairId });
      right.push({ id: `r-${i}`, text: p.right, side: "right", originalPairId: pairId });
    });
    
    const timer = setTimeout(() => {
      setLeftItems(left.sort(() => Math.random() - 0.5));
      setRightItems(right.sort(() => Math.random() - 0.5));
      setMatchedPairs(new Set());
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [exercise]);

  // Handle matching logic in a separate effect that fires when selections change
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const l = leftItems.find(i => i.id === selectedLeft);
      const r = rightItems.find(i => i.id === selectedRight);
      
      if (l?.originalPairId === r?.originalPairId) {
        // We match! Update the matched pairs.
        setTimeout(() => {
          setMatchedPairs(prev => {
            const next = new Set(prev);
            next.add(l!.originalPairId);
            return next;
          });
        }, 0);
      } else {
        setTimeout(() => {
          setIsShaking(true);
          if (onMismatch) onMismatch();
        }, 0);
      }
      
      // Clear selections after a short delay
      const timer = setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setIsShaking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedLeft, selectedRight, leftItems, rightItems, onMismatch]);
  
  // Handle completion check in another effect
  useEffect(() => {
    if (exercise.pairs && matchedPairs.size > 0 && matchedPairs.size === exercise.pairs.length) {
      // Trigger completion on the next tick to avoid synchronous setState warnings
      const timer = setTimeout(() => {
        onComplete("all");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [matchedPairs, exercise, onComplete]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full max-w-2xl mx-auto px-4 mt-8 pb-32">
      <h1 className="text-white text-3xl font-extrabold mb-8 text-center w-full">{exercise.prompt}</h1>
      
      <motion.div 
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex justify-between w-full gap-8"
      >
        <div className="flex flex-col gap-4 w-1/2">
          {leftItems.map((item) => (
            <button
              key={item.id}
              disabled={disabled || matchedPairs.has(item.originalPairId)}
              onClick={() => setSelectedLeft(item.id)}
              className={`p-4 rounded-xl border-2 font-bold text-lg transition-all border-b-4 ${
                matchedPairs.has(item.originalPairId)
                  ? "bg-[#37464F] border-[#37464F] text-transparent opacity-0 cursor-default"
                  : selectedLeft === item.id
                    ? "border-[#84D8FF] bg-[#1CB0F6]/10 text-[#1CB0F6]"
                    : "border-[#37464F] bg-transparent text-white hover:bg-[#202F36] active:translate-y-1 active:border-b-2"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-1/2">
          {rightItems.map((item) => (
            <button
              key={item.id}
              disabled={disabled || matchedPairs.has(item.originalPairId)}
              onClick={() => setSelectedRight(item.id)}
              className={`p-4 rounded-xl border-2 font-bold text-lg transition-all border-b-4 ${
                matchedPairs.has(item.originalPairId)
                  ? "bg-[#37464F] border-[#37464F] text-transparent opacity-0 cursor-default"
                  : selectedRight === item.id
                    ? "border-[#84D8FF] bg-[#1CB0F6]/10 text-[#1CB0F6]"
                    : "border-[#37464F] bg-transparent text-white hover:bg-[#202F36] active:translate-y-1 active:border-b-2"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
