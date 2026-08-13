"use client";

import React from "react";

const nodes = [
  { id: 1, type: "star", status: "active", offset: 0 },
  { id: 2, type: "star", status: "locked", offset: -40 },
  { id: 3, type: "dumbbell", status: "locked", offset: -80 },
  { id: 4, type: "chest", status: "locked", offset: -40 },
  { id: 5, type: "star", status: "locked", offset: 0 },
  { id: 6, type: "trophy", status: "locked", offset: 0 },
];

export default function LearningPath() {
  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto pt-6 pb-24 relative min-h-screen">
      
      {/* Unit Header */}
      <div className="w-[calc(100%+60px)] -ml-[60px] rounded-2xl p-6 mb-12 flex justify-between items-center relative z-10" style={{ backgroundColor: "#58CC02" }}>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-white/90 font-bold text-sm tracking-wide mb-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
            </svg>
            <span>SECTION 1, UNIT 1</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Form basic sentences</h1>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all hover:bg-white/10 active:border-b-0 active:translate-y-0.5 border-b-4" style={{ borderColor: "#46A302", backgroundColor: "transparent" }}>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <rect width="14" height="20" x="4" y="2" rx="2" />
            <path d="M8 6h6" />
            <path d="M8 10h8" />
            <path d="M8 14h6" />
          </svg>
          <span className="text-white font-bold text-sm tracking-wide">GUIDEBOOK</span>
        </button>
      </div>

      {/* Path Nodes */}
      <div className="flex flex-col items-center space-y-8 w-full relative">
        {nodes.map((node, index) => {
          const isActive = node.status === "active";
          
          return (
            <div 
              key={node.id} 
              className="relative flex justify-center w-full"
              style={{ transform: `translateX(${node.offset}px)` }}
            >
              {isActive && (
                <div className="absolute -top-12 animate-bounce">
                  <div className="bg-[#131F24] border-2 border-[#52565D] text-[#58CC02] font-bold text-sm px-4 py-2 rounded-xl relative">
                    START
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#131F24] border-b-2 border-r-2 border-[#52565D] rotate-45"></div>
                  </div>
                </div>
              )}

              {/* Node Button */}
              <button 
                className={`w-[70px] h-[70px] rounded-full flex items-center justify-center relative transition-transform ${
                  isActive 
                    ? "bg-[#58CC02] hover:scale-105 active:scale-95 z-20" 
                    : "bg-[#202F36] opacity-70 z-10"
                }`}
                style={{ 
                  boxShadow: isActive ? "0 8px 0 #46A302" : "0 8px 0 #131F24",
                }}
              >
                {/* Outer Ring for active node */}
                {isActive && (
                  <div className="absolute -inset-4 rounded-full border-[6px] border-[#37464F] border-b-0 border-r-0 -rotate-45 opacity-50 z-[-1]"></div>
                )}
                {isActive && (
                  <div className="absolute -inset-4 rounded-full border-[6px] border-[#37464F] opacity-20 z-[-2]"></div>
                )}

                {/* Icons inside nodes */}
                {node.type === "star" && (
                  <svg viewBox="0 0 24 24" className={`w-8 h-8 ${isActive ? "text-white" : "text-[#52565D]"}`}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
                  </svg>
                )}

                {node.type === "dumbbell" && (
                  <svg viewBox="0 0 24 24" className={`w-8 h-8 ${isActive ? "text-white" : "text-[#52565D]"}`}>
                    <path d="M20 10V7h-4v3H8V7H4v3H2v4h2v3h4v-3h8v3h4v-3h2v-4h-2z" fill="currentColor"/>
                  </svg>
                )}

                {node.type === "chest" && (
                  <svg viewBox="0 0 24 24" className={`w-8 h-8 ${isActive ? "text-white" : "text-[#52565D]"}`}>
                    <path d="M20 8h-3V6c0-1.1-.9-2-2-2H9C7.9 4 7 4.9 7 6v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4v-8h4v2h8v-2h4v8z" fill="currentColor"/>
                  </svg>
                )}

                {node.type === "trophy" && (
                  <svg viewBox="0 0 24 24" className={`w-8 h-8 ${isActive ? "text-white" : "text-[#52565D]"}`}>
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.015 5.015 0 0012 15c1.9 0 3.58-1.09 4.39-2.68 2.21-.19 4-1.95 4-4.14V7c0-1.1-.9-2-2-2zM7 19v-2h10v2c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
          );
        })}

        {/* Mascot (Placeholder Owl) */}
        <div className="absolute top-[30%] right-[10%] w-24 h-24 drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer z-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="60" rx="35" ry="30" fill="#58CC02" />
            <path d="M 15 60 Q 5 40 25 30" stroke="#58CC02" strokeWidth="15" strokeLinecap="round" />
            <path d="M 85 60 Q 95 40 75 30" stroke="#58CC02" strokeWidth="15" strokeLinecap="round" />
            <ellipse cx="50" cy="40" rx="40" ry="35" fill="#58CC02" />
            
            {/* Eyes */}
            <circle cx="35" cy="35" r="12" fill="#FFF" />
            <circle cx="65" cy="35" r="12" fill="#FFF" />
            <circle cx="35" cy="35" r="4" fill="#000" />
            <circle cx="65" cy="35" r="4" fill="#000" />
            
            {/* Beak */}
            <path d="M 45 45 L 55 45 L 50 52 Z" fill="#F4B000" />
            
            {/* Feet */}
            <ellipse cx="40" cy="90" rx="8" ry="4" fill="#F4B000" />
            <ellipse cx="60" cy="90" rx="8" ry="4" fill="#F4B000" />
            
            {/* Belly */}
            <ellipse cx="50" cy="65" rx="20" ry="15" fill="#46A302" opacity="0.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
