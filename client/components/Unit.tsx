"use client";

import React from "react";
import { SkillNode } from "./SkillNode";
import type { NodeStatus, NodeType } from "@/lib/types";

/** Shape of a single skill node on the learning path */
export interface NodeData {
  id: number;
  type: NodeType | string;
  status: NodeStatus;
  offset: number;
  hasMascot?: boolean;
  mascotSide?: "left" | "right";
  lessonId?: string;
}

interface UnitProps {
  id: number;
  title: string;
  description: string;
  color: string;
  nodes: NodeData[];
  nextUnitTitle?: string;
  /** ID of the currently open tooltip — managed by LearningPath (single source of truth) */
  activeTooltipId?: number | null;
  onTooltipToggle?: (id: number) => void;
}

export function Unit({ color, nodes, nextUnitTitle, activeTooltipId, onTooltipToggle }: UnitProps) {
  return (
    <section className="w-full relative mb-8 flex flex-col items-center">
      <div className="flex flex-col items-center space-y-8 w-full relative pt-4">
        {nodes.map((node) => (
          <SkillNode
            key={node.id}
            id={node.id}
            type={node.type}
            status={node.status}
            offset={node.offset}
            color={color}
            isTooltipOpen={activeTooltipId === node.id}
            onToggleTooltip={() => onTooltipToggle?.(node.id)}
            hasMascot={node.hasMascot}
            mascotSide={node.mascotSide as "left" | "right"}
            lessonId={node.lessonId}
          />
        ))}
      </div>

      {/* Horizontal Unit Divider Line with Next Unit Title */}
      {nextUnitTitle && (
        <div className="w-full flex items-center justify-center my-14 px-2">
          <div className="flex-1 h-[2px] bg-[#202F36]"></div>
          <span className="px-6 font-extrabold text-[#52565D] text-lg text-center tracking-wide">
            {nextUnitTitle}
          </span>
          <div className="flex-1 h-[2px] bg-[#202F36]"></div>
        </div>
      )}
    </section>
  );
}

