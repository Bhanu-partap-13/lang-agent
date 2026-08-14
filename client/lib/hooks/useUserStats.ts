"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/config";

// ─── Shared Interfaces ──────────────────────────────────────────────────────

export interface UserStats {
  userId: string;
  username: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  maxHearts: number;
  gems: number;
  dailyGoalXp: number;
  secondsUntilNextHeart?: number;
  lastHeartLostAt?: string | Date | null;
  completedSkills?: string[];
}

export interface DailyActivity {
  date: string;
  todayXp: number;
  targetXp: number;
  chestClaimed: boolean;
  isEligibleForChest: boolean;
  lessonsCompleted: number;
}

export interface StatsResponse {
  success: boolean;
  stats: UserStats;
  daily: DailyActivity;
}

export interface ProfileStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  gems: number;
}

export interface ProfileAchievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string | null;
  unlockedAt: number | null;
  isUnlocked: boolean;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  joinedAt: number;
  stats: ProfileStats;
  achievements: ProfileAchievement[];
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useUserStats() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<StatsResponse>({
    queryKey: ["userStats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/user/stats`);
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const claimChestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/user/claim-chest`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || json.error || "Failed to claim chest");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });

  const simulateXpMutation = useMutation({
    mutationFn: async (xp: number = 100) => {
      const res = await fetch(`${API_BASE_URL}/user/simulate-xp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xp }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });

  const buyHeartsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/user/buy-hearts`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || json.error || "Failed to purchase hearts");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    stats: data?.stats,
    daily: data?.daily,
    isLoading,
    error,
    refetch,
    claimChest: claimChestMutation.mutateAsync,
    isClaiming: claimChestMutation.isPending,
    claimError: claimChestMutation.error,
    simulateXp: simulateXpMutation.mutateAsync,
    buyHearts: buyHeartsMutation.mutateAsync,
    isBuyingHearts: buyHeartsMutation.isPending,
    buyHeartsError: buyHeartsMutation.error,
  };
}

export function useUserProfile() {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/user/profile`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
  });
}
