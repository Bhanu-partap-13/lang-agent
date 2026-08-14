"use client";

import React, { useState, useEffect, useRef } from "react";
import { Unit, type NodeData } from "./Unit";
import { useUserStats } from "@/lib/hooks/useUserStats";

const UNIT_COLORS = [
  "#58CC02", // Unit 1: Default Green
  "#CE82FF", // Unit 2: Purple
  "#00CD9C", // Unit 3: Teal
  "#58CC02", // Unit 4: Strong Green
  "#1CB0F6", // Unit 5: Sky Blue
];

export const getUnitColor = (index: number) => UNIT_COLORS[index % UNIT_COLORS.length];

// Base unit configuration
const BASE_UNITS = [
  {
    id: 1,
    title: "English Phonics & Basic Determinants",
    description: "SECTION 1, UNIT 1",
    lessons: ["lesson_1", "lesson_2", "lesson_3", "lesson_4", "lesson_1", "lesson_2"],
    skills: ["skill_1_1", "skill_1_1", "skill_1_2", "skill_1_2", "skill_1_1", "skill_1_2"],
    nodeCount: 6,
  },
  {
    id: 2,
    title: "Possessives & Demonstratives",
    description: "SECTION 1, UNIT 2",
    lessons: ["lesson_3", "lesson_4", "lesson_1", "lesson_2", "lesson_3", "lesson_4"],
    skills: ["skill_1_2", "skill_1_2", "skill_1_1", "skill_1_1", "skill_1_2", "skill_1_2"],
    nodeCount: 6,
  },
  {
    id: 3,
    title: "Quantifiers & Daily Vocabulary",
    description: "SECTION 1, UNIT 3",
    lessons: ["lesson_4", "lesson_1", "lesson_2", "lesson_3", "lesson_4", "lesson_1"],
    skills: ["skill_1_2", "skill_1_1", "skill_1_1", "skill_1_2", "skill_1_2", "skill_1_1"],
    nodeCount: 6,
  },
  {
    id: 4,
    title: "Order Food and Drink",
    description: "SECTION 1, UNIT 4",
    lessons: ["lesson_2", "lesson_3", "lesson_4", "lesson_1", "lesson_2", "lesson_3"],
    skills: ["skill_1_1", "skill_1_2", "skill_1_2", "skill_1_1", "skill_1_1", "skill_1_2"],
    nodeCount: 6,
  },
  {
    id: 5,
    title: "Conversations & Self Introductions",
    description: "SECTION 1, UNIT 5",
    lessons: ["lesson_1", "lesson_2", "lesson_3", "lesson_4", "lesson_1", "lesson_2"],
    skills: ["skill_1_1", "skill_1_1", "skill_1_2", "skill_1_2", "skill_1_1", "skill_1_2"],
    nodeCount: 6,
  },
];

export default function LearningPath() {
  const { stats } = useUserStats();
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(0);
  const unitRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll detection to update active sticky header smoothly as unit line passes bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // top offset trigger point

      unitRefs.current.forEach((el, index) => {
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveUnitIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const completedSkillSet = new Set(stats?.completedSkills || []);
  let foundActive = false;

  // Generate dynamic nodes with unlock progression
  const unitsWithDynamicNodes = BASE_UNITS.map((unit, unitIdx) => {
    const isEvenUnit = unit.id % 2 === 0;
    const offsets = isEvenUnit
      ? [0, 45, 85, 45, 0, -45]
      : [0, -45, -85, -45, 0, 45];

    const typeSequence = isEvenUnit
      ? ["star", "star", "chest", "podcast", "dumbbell", "trophy"]
      : ["star", "star", "dumbbell", "podcast", "star", "trophy"];

    const startId = unitIdx * 10 + 1;

    const nodes = Array.from({ length: unit.nodeCount }).map((_, i) => {
      const type = typeSequence[i % typeSequence.length];
      const skillId = unit.skills[i] || `skill_${unit.id}_${i + 1}`;
      const lessonId = unit.lessons[i] || `lesson_${i + 1}`;

      // A node is completed if its skill has been completed
      const isCompleted = completedSkillSet.has(skillId);

      let status: "completed" | "active" | "locked" = "locked";
      if (isCompleted) {
        status = "completed";
      } else if (!foundActive) {
        status = "active";
        foundActive = true;
      } else {
        status = "locked";
      }

      const hasMascot = i === 2; // 3rd level of the unit at curve apex
      const mascotSide = isEvenUnit ? "right" : "left";

      return {
        id: startId + i,
        type,
        status,
        offset: offsets[i % offsets.length],
        hasMascot,
        mascotSide,
        lessonId,
      };
    });

    return {
      ...unit,
      nodes,
    };
  });

  const activeUnit = unitsWithDynamicNodes[activeUnitIndex] || unitsWithDynamicNodes[0];
  const activeColor = getUnitColor(activeUnitIndex);

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto pt-4 pb-24 relative min-h-screen">
      {/* 100% Fixed Top Unit Header Bar (Pinned to top-0, never moves upward 1px) */}
      <div className="sticky top-0 z-40 w-full bg-[#131F24] pt-4 pb-4 mb-12">
        <div 
          className="w-full rounded-2xl p-5 shadow-2xl flex justify-between items-center transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: activeColor }}
        >
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-white/90 font-bold text-sm tracking-wide mb-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
              </svg>
              <span>{activeUnit.description}</span>
            </div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">{activeUnit.title}</h1>
          </div>

          <button 
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all hover:bg-white/10 active:border-b-0 active:translate-y-0.5 border-b-4"
            style={{ borderColor: "rgba(0,0,0,0.2)", backgroundColor: "transparent" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="14" height="20" x="4" y="2" rx="2" />
              <path d="M8 6h6M8 10h8M8 14h6" />
            </svg>
            <span className="text-white font-bold text-xs tracking-wide hidden sm:inline">GUIDEBOOK</span>
          </button>
        </div>
      </div>

      {/* Units List */}
      {unitsWithDynamicNodes.map((unit, index) => (
        <div 
          key={unit.id} 
          ref={(el) => { unitRefs.current[index] = el; }}
          className="w-full"
        >
          <Unit
            id={unit.id}
            title={unit.title}
            description={unit.description}
            color={getUnitColor(index)}
            nodes={unit.nodes as NodeData[]}
            nextUnitTitle={unitsWithDynamicNodes[index + 1]?.title}
            activeTooltipId={activeTooltipId}
            onTooltipToggle={(id) => setActiveTooltipId(activeTooltipId === id ? null : id)}
          />
        </div>
      ))}

      {/* End of Section 1: Locked Section 2 Card */}
      <div className="w-full rounded-3xl border-2 border-[#202F36] bg-[#182830] p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl mt-12 mb-16">
        <div className="flex items-center space-x-2 bg-[#202F36] px-3.5 py-1.5 rounded-xl mb-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#AFAFAF]" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span className="text-[#AFAFAF] font-black text-xs uppercase tracking-wider">SECTION 2</span>
        </div>

        <h2 className="text-white font-extrabold text-2xl mb-1.5">Section 2: Explorer</h2>
        <p className="text-[#AFAFAF] font-semibold text-sm mb-6 max-w-[320px]">
          Complete all units in Section 1 to unlock Section 2!
        </p>

        {/* Non-clickable JUMP HERE? button */}
        <button 
          disabled
          className="bg-[#202F36] border-2 border-[#37464F] text-[#52565D] font-extrabold text-xs uppercase tracking-wider py-3.5 px-8 rounded-2xl cursor-not-allowed opacity-60 pointer-events-none select-none"
        >
          JUMP HERE?
        </button>
      </div>

      {/* Floating Upward Arrow Scroll-To-Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 lg:right-[450px] xl:right-[550px] z-50 w-14 h-14 rounded-2xl bg-[#202F36] border-2 border-[#37464F] border-b-4 text-white flex items-center justify-center shadow-2xl hover:bg-[#2A3942] active:border-b-0 active:translate-y-1 transition-all cursor-pointer group"
        title="Scroll to top"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

