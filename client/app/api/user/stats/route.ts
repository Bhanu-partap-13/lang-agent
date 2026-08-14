import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats, dailyActivity, userProfile, userSkillProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    let userId = "seed_user_1";

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch {
      // fallback to seed_user_1
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Fetch user stats
    const statsResult = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    
    // Fetch user profile
    const profileResult = await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1);

    // Fetch user skill progress
    const progressResult = await db.select().from(userSkillProgress).where(eq(userSkillProgress.userId, userId));
    const completedSkills = progressResult
      .filter((p) => p.status === "completed")
      .map((p) => p.skillId);

    // Fetch today's activity
    const activityResult = await db.select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.date, todayStr)))
      .limit(1);

    const stats = statsResult[0] || {
      userId,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      hearts: 5,
      maxHearts: 5,
      gems: 500,
      dailyGoalXp: 20,
      lastHeartLostAt: new Date(),
    };

    // ── Streak Missed-Day Reset Logic ──
    // If user's lastActivityDate is older than yesterday, streak resets to 0
    let evaluatedStreak = stats.currentStreak;
    if (stats.lastActivityDate && stats.lastActivityDate !== todayStr) {
      const lastDate = new Date(stats.lastActivityDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Missed at least 1 whole day! Reset streak to 0
        evaluatedStreak = 0;
        await db.update(userStats)
          .set({ currentStreak: 0 })
          .where(eq(userStats.userId, userId));
      }
    }

    // ── Lazy 4-minute heart regeneration evaluation (1 heart every 240 seconds) ──
    const HEART_REGEN_INTERVAL_SECONDS = 240; // 4 minutes
    let currentHearts = stats.hearts;
    const maxHearts = stats.maxHearts ?? 5;
    let secondsUntilNextHeart = HEART_REGEN_INTERVAL_SECONDS;

    if (currentHearts < maxHearts) {
      const nowMs = Date.now();
      const lastLostMs = stats.lastHeartLostAt ? new Date(stats.lastHeartLostAt).getTime() : nowMs;
      const elapsedSeconds = Math.max(0, Math.floor((nowMs - lastLostMs) / 1000));
      const heartsToRegenerate = Math.floor(elapsedSeconds / HEART_REGEN_INTERVAL_SECONDS);

      if (heartsToRegenerate > 0) {
        currentHearts = Math.min(maxHearts, currentHearts + heartsToRegenerate);
        const remainingElapsed = elapsedSeconds % HEART_REGEN_INTERVAL_SECONDS;
        const newLastLostAt = new Date(nowMs - (remainingElapsed * 1000));

        // Update in DB asynchronously
        await db.update(userStats)
          .set({
            hearts: currentHearts,
            lastHeartLostAt: currentHearts >= maxHearts ? null : newLastLostAt,
          })
          .where(eq(userStats.userId, userId));

        secondsUntilNextHeart = currentHearts >= maxHearts ? 0 : HEART_REGEN_INTERVAL_SECONDS - remainingElapsed;
      } else {
        secondsUntilNextHeart = HEART_REGEN_INTERVAL_SECONDS - elapsedSeconds;
      }
    } else {
      secondsUntilNextHeart = 0;
    }

    const todayActivity = activityResult[0] || {
      userId,
      date: todayStr,
      xpEarned: 0,
      lessonsCompleted: 0,
      chestClaimed: false,
    };

    const todayXp = todayActivity.xpEarned;
    const chestClaimed = !!todayActivity.chestClaimed;
    const isEligibleForChest = todayXp >= 100 && !chestClaimed;

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        currentStreak: evaluatedStreak,
        hearts: currentHearts,
        secondsUntilNextHeart,
        username: profileResult[0]?.username || "Learner",
        completedSkills,
      },
      daily: {
        date: todayStr,
        todayXp,
        targetXp: 100,
        chestClaimed,
        isEligibleForChest,
        lessonsCompleted: todayActivity.lessonsCompleted,
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
