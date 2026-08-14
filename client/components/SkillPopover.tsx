"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SkillPopoverProps {
  id: number;
  lessonId?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lessonText: string;
  color: string;
}

export function SkillPopover({ id, lessonId, isOpen, onClose, title, lessonText, color }: SkillPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent outside click closing immediately
    const targetRoute = lessonId ? `/lesson/${lessonId}` : `/lesson/${id}`;
    router.push(targetRoute);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute z-50 w-64 rounded-2xl p-4 shadow-2xl"
          style={{ 
            backgroundColor: color,
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "14px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Triangle pointer tip pointing up directly to the bottom of the skill circle */}
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
            style={{ backgroundColor: color }}
          ></div>

          <div className="relative z-10 flex flex-col space-y-3">
            <div>
              <h2 className="text-white font-black text-lg leading-tight mb-1">{title}</h2>
              <p className="text-white/90 font-extrabold text-xs">{lessonText}</p>
            </div>

            <button 
              onClick={handleStart}
              className="w-full bg-white rounded-xl py-3 font-black text-xs uppercase tracking-wider border-b-4 hover:bg-gray-100 active:border-b-0 active:translate-y-1 transition-all text-center shadow-lg cursor-pointer"
              style={{ color, borderColor: "#dcdcdc" }}
            >
              START +10 XP
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
