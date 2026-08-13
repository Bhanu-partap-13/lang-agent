"use client";

import React from "react";

interface UnitHeaderProps {
  title: string;
  description: string;
  backgroundColor: string;
}

export function UnitHeader({ title, description, backgroundColor }: UnitHeaderProps) {
  return (
    <div 
      className="w-[calc(100%+60px)] -ml-[30px] lg:-ml-[60px] rounded-2xl p-6 mb-8 flex justify-between items-center relative z-20 sticky top-6 shadow-sm" 
      style={{ backgroundColor }}
    >
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 text-white/90 font-bold text-sm tracking-wide mb-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
          </svg>
          <span>{description}</span>
        </div>
        <h1 className="text-white text-2xl font-extrabold tracking-tight">{title}</h1>
      </div>
      
      <button 
        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all hover:bg-white/10 active:border-b-0 active:translate-y-0.5 border-b-4" 
        style={{ borderColor: "rgba(0,0,0,0.2)", backgroundColor: "transparent" }}
      >
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
        <span className="text-white font-bold text-sm tracking-wide hidden sm:inline">GUIDEBOOK</span>
      </button>
    </div>
  );
}
