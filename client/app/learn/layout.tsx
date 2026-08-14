"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import { DailyQuestChestModal } from "@/components/DailyQuestChestModal";
import { StreakIgniteModal } from "@/components/StreakIgniteModal";
import { useUserStats } from "@/lib/hooks/useUserStats";

function StreakIgniteListener({ onIgnite }: { onIgnite: () => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("streak_ignited") === "true") {
      onIgnite();
    }
  }, [searchParams, onIgnite]);

  return null;
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { stats, daily, claimChest } = useUserStats();
  const [isChestModalOpen, setIsChestModalOpen] = useState(false);
  const [hasDismissedChestToday, setHasDismissedChestToday] = useState(false);
  const [isStreakIgniteOpen, setIsStreakIgniteOpen] = useState(false);

  // Auto-trigger the celebratory chest modal as soon as 100 XP milestone is reached
  useEffect(() => {
    if (daily?.isEligibleForChest && !hasDismissedChestToday && !isStreakIgniteOpen) {
      const timer = setTimeout(() => setIsChestModalOpen(true), 0);
      return () => clearTimeout(timer);
    }
  }, [daily?.isEligibleForChest, hasDismissedChestToday, isStreakIgniteOpen]);

  const handleClaim = async () => {
    return await claimChest();
  };

  const handleCloseChest = () => {
    setIsChestModalOpen(false);
    setHasDismissedChestToday(true);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#131F24" }}>
      <Sidebar />
      <div className="flex-1 lg:pl-[300px] lg:pr-[450px] xl:pr-[550px] relative">
        <main className="w-full h-full flex flex-col pt-6">
          {children}
        </main>
      </div>
      <RightPanel onOpenChest={() => setIsChestModalOpen(true)} />

      {/* Suspense wrapper for Next.js searchParams prerender */}
      <Suspense fallback={null}>
        <StreakIgniteListener onIgnite={() => setIsStreakIgniteOpen(true)} />
      </Suspense>

      {/* First Lesson of the Day Streak Ignition Ceremony Modal */}
      <StreakIgniteModal
        isOpen={isStreakIgniteOpen}
        streakCount={Math.max(1, stats?.currentStreak ?? 1)}
        onClose={() => {
          setIsStreakIgniteOpen(false);
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", "/learn");
          }
        }}
      />

      {/* 100 XP Daily Quest Milestone Interactive Chest Celebration Modal */}
      <DailyQuestChestModal
        isOpen={isChestModalOpen}
        onClose={handleCloseChest}
        onClaim={handleClaim}
      />
    </div>
  );
}



