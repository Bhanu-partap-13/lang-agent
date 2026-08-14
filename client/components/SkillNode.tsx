"use client";

import React from "react";
import { SkillPopover } from "./SkillPopover";

interface SkillNodeProps {
  id: number;
  type: "star" | "dumbbell" | "chest" | "trophy" | string;
  status: "active" | "locked" | "completed";
  offset: number;
  color?: string; // used for active/completed states
  isTooltipOpen?: boolean;
  onToggleTooltip?: () => void;
  unitTitle?: string;
  hasMascot?: boolean;
  mascotSide?: "left" | "right";
  lessonId?: string;
}

export function SkillNode({ id, type, status, offset, color = "#58CC02", isTooltipOpen = false, onToggleTooltip, unitTitle, hasMascot = false, mascotSide = "right", lessonId }: SkillNodeProps) {
  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  return (
    <div 
      className="relative flex justify-center w-full"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {/* Bouncing START badge (disappears when popover is open) */}
      {isActive && !isTooltipOpen && (
        <div className="absolute -top-16 animate-bounce z-30 pointer-events-none">
          <div className="bg-[#131F24] border-2 border-[#52565D] text-white font-extrabold text-xs px-4 py-2 rounded-2xl relative shadow-2xl tracking-wider">
            <span style={{ color }}>START</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#131F24] border-b-2 border-r-2 border-[#52565D] rotate-45"></div>
          </div>
        </div>
      )}

      {/* Single Interactive Mascot Bird standing ONLY at 3rd level curve apex */}
      {hasMascot && (
        <div className={`absolute -top-2 w-24 h-24 hover:scale-110 transition-transform cursor-pointer z-20 flex flex-col items-center ${
          mascotSide === "left" ? "right-[125px]" : "left-[125px]"
        }`}>
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
            {/* 3D Oval Base */}
            <ellipse cx="50" cy="106" rx="42" ry="12" fill="#202F36" />
            <ellipse cx="50" cy="103" rx="42" ry="12" fill="#37464F" />

            {/* Raised Arms / Wings */}
            <path d="M 15 50 Q 0 25 22 18" stroke="#58CC02" strokeWidth="14" strokeLinecap="round" />
            <path d="M 85 50 Q 100 25 78 18" stroke="#58CC02" strokeWidth="15" strokeLinecap="round" />

            {/* Body */}
            <ellipse cx="50" cy="62" rx="36" ry="32" fill="#58CC02" />
            <ellipse cx="50" cy="42" rx="40" ry="36" fill="#58CC02" />
            
            {/* Eyes */}
            <circle cx="35" cy="36" r="13" fill="#FFF" />
            <circle cx="65" cy="36" r="13" fill="#FFF" />
            <circle cx="35" cy="36" r="4.5" fill="#000" />
            <circle cx="65" cy="36" r="4.5" fill="#000" />
            <circle cx="37" cy="34" r="1.5" fill="#FFF" />
            <circle cx="67" cy="34" r="1.5" fill="#FFF" />
            
            {/* Beak & Mouth */}
            <path d="M 44 46 L 56 46 L 50 56 Z" fill="#FF9600" />
            <path d="M 46 51 L 54 51 L 50 58 Z" fill="#E54800" />
            
            {/* Feet */}
            <ellipse cx="38" cy="94" rx="9" ry="4" fill="#FF9600" />
            <ellipse cx="62" cy="94" rx="9" ry="4" fill="#FF9600" />
            
            {/* Belly Texture */}
            <ellipse cx="50" cy="68" rx="20" ry="14" fill="#46A302" opacity="0.35" />
          </svg>
        </div>
      )}

      {/* Node Button & Popover Wrapper (Guarantees 100% Dead-Center Alignment) */}
      <div className="relative flex flex-col items-center">
        {isActive ? (
          /* Outer 3D Ring with Gloss & Bevel for Active Node */
          <div className="w-[96px] h-[96px] min-w-[96px] min-h-[96px] aspect-square shrink-0 rounded-full bg-[#182830] shadow-[0_10px_0_#0e171c] border-4 border-[#283842] flex items-center justify-center relative z-20">
            <button 
              className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] aspect-square shrink-0 rounded-full bg-[#58CC02] shadow-[0_8px_0_#46A302] border-t-4 border-[#85E035] flex items-center justify-center relative hover:brightness-110 active:translate-y-2 active:shadow-[0_2px_0_#46A302] transition-all cursor-pointer overflow-hidden"
              onClick={() => onToggleTooltip?.()}
            >
              {/* 3D Top-Half Gloss Specular Arc */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />

              {/* 3D Star Icon with Drop Shadow */}
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-white filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] relative z-10">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        ) : type === "chest" ? (
          /* 3D Slate Treasure Chest Graphic */
          <div 
            className="relative w-[88px] h-[72px] flex items-center justify-center filter drop-shadow-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer z-10 my-2"
            onClick={() => !isLocked && onToggleTooltip?.()}
          >
            <svg viewBox="0 0 90 75" className="w-full h-full">
              {/* 3D Oval Base */}
              <ellipse cx="45" cy="67" rx="40" ry="9" fill="#182830" />
              {/* Chest Body */}
              <rect x="8" y="20" width="74" height="44" rx="7" fill="#37464F" />
              <rect x="8" y="20" width="74" height="14" fill="#4C5B64" />
              {/* Vertical Metal Bands */}
              <rect x="22" y="20" width="12" height="44" fill="#4C5B64" />
              <rect x="56" y="20" width="12" height="44" fill="#4C5B64" />
              {/* Horizontal Lock Band */}
              <rect x="8" y="38" width="74" height="10" fill="#202F36" opacity="0.75" />
              {/* Center Lock Plate */}
              <rect x="37" y="34" width="16" height="18" rx="4" fill="#52565D" />
              {/* Keyhole */}
              <circle cx="45" cy="41" r="3" fill="#131F24" />
              <polygon points="43.5,41 46.5,41 47,48 43,48" fill="#131F24" />
            </svg>
          </div>
        ) : isCompleted ? (
          /* 3D Gold / Yellow Completed Cylinder Node with Crown Tick (✔️) */
          <button 
            className="w-[76px] h-[76px] min-w-[76px] min-h-[76px] aspect-square shrink-0 rounded-full bg-[#FFC800] shadow-[0_9px_0_#CC8000] border-t-4 border-[#FFE066] flex items-center justify-center relative transition-all hover:brightness-110 active:translate-y-2 active:shadow-[0_2px_0_#CC8000] cursor-pointer z-10 overflow-visible"
            onClick={() => onToggleTooltip?.()}
          >
            {/* Top-Half Gloss Specular Arc */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-full pointer-events-none" />

            {/* Prominent Crown Tick Checkmark SVG in center */}
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#854D0E] filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] relative z-10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>

            {/* 3D Golden Crown badge on top-right */}
            <div className="absolute -top-3 -right-2 bg-[#FFD700] shadow-[0_3px_0_#B8860B] rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#131F24] z-30">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-[#854D0E] filter drop-shadow-sm" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
              </svg>
            </div>
          </button>
        ) : (
          /* 3D Cylindrical Button for Locked Nodes */
          <button 
            className="w-[76px] h-[76px] min-w-[76px] min-h-[76px] aspect-square shrink-0 rounded-full bg-[#37464F] shadow-[0_8px_0_#202F36] border-t-4 border-[#4C5B64] flex items-center justify-center relative transition-transform opacity-75 cursor-not-allowed z-10 overflow-hidden"
            onClick={() => !isLocked && onToggleTooltip?.()}
          >
            {/* 3D Specular Top Arc */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-full pointer-events-none" />

            {/* 3D Icons inside locked nodes */}
            {type === "star" && (
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#52565D] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
              </svg>
            )}

            {type === "dumbbell" && (
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#52565D] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                <path d="M20 10V7h-4v3H8V7H4v3H2v4h2v3h4v-3h8v3h4v-3h2v-4h-2z" fill="currentColor"/>
              </svg>
            )}

            {type === "podcast" && (
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#52565D] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                <path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" fill="currentColor"/>
              </svg>
            )}

            {type === "trophy" && (
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#52565D] filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.015 5.015 0 0012 15c1.9 0 3.58-1.09 4.39-2.68 2.21-.19 4-1.95 4-4.14V7c0-1.1-.9-2-2-2zM7 19v-2h10v2c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2z" fill="currentColor"/>
              </svg>
            )}
          </button>
        )}

        {/* Popover Centered 100% Dead-Center Underneath Node Circle */}
        <SkillPopover 
          id={id}
          lessonId={lessonId}
          isOpen={isTooltipOpen}
          onClose={() => onToggleTooltip?.()}
          title={unitTitle || "Skill"}
          lessonText="Lesson 1 of 4"
          color={color}
        />
      </div>
    </div>
  );
}
