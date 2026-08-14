import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats, userSkillProgress, lessons, dailyActivity } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Hardcoded for the current seeded test user (or dynamic from auth in future)
  const userId = "seed_user_1";
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    const { xpAwarded } = await request.json();
    const xpToAdd = typeof xpAwarded === "number" ? xpAwarded : 10;

    // 1. Fetch the lesson to get the skillId
    const lessonResult = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
    if (!lessonResult || lessonResult.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    const skillId = lessonResult[0].skillId;

    // 2. Fetch current user stats to check streak continuity
    const userStatsResult = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    const currentUserStats = userStatsResult[0];

    const isFirstLessonOfDay = !currentUserStats?.lastActivityDate || currentUserStats.lastActivityDate !== todayStr;
    
    let newCurrentStreak = currentUserStats?.currentStreak || 0;
    if (isFirstLessonOfDay) {
      if (currentUserStats?.lastActivityDate) {
        const lastDate = new Date(currentUserStats.lastActivityDate);
        const todayDate = new Date(todayStr);
        const diffDays = Math.ceil(Math.abs(todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Exactly consecutive day: streak + 1
          newCurrentStreak = (currentUserStats.currentStreak || 0) + 1;
        } else {
          // Missed 1 or more days: reset to 1
          newCurrentStreak = 1;
        }
      } else {
        // First practice ever: start at 1
        newCurrentStreak = 1;
      }
    } else {
      newCurrentStreak = Math.max(1, currentUserStats?.currentStreak || 1);
    }

    const newLongestStreak = Math.max(currentUserStats?.longestStreak || 0, newCurrentStreak);

    // Update user stats with +XP and streak increment if first lesson of day
    await db.update(userStats)
      .set({
        totalXp: sql`${userStats.totalXp} + ${xpToAdd}`,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: todayStr,
        updatedAt: sql`(unixepoch())`
      })
      .where(eq(userStats.userId, userId));

    // 3. Update skill progress (set to completed or increment XP)
    const progressResult = await db.select()
      .from(userSkillProgress)
      .where(and(eq(userSkillProgress.userId, userId), eq(userSkillProgress.skillId, skillId)))
      .limit(1);

    if (progressResult.length > 0) {
      await db.update(userSkillProgress)
        .set({
          status: "completed",
          xpEarned: sql`${userSkillProgress.xpEarned} + ${xpToAdd}`,
          lastPracticedAt: sql`(unixepoch())`
        })
        .where(and(eq(userSkillProgress.userId, userId), eq(userSkillProgress.skillId, skillId)));
    } else {
      await db.insert(userSkillProgress).values({
        userId,
        skillId,
        status: "completed",
        crowns: 1,
        xpEarned: xpToAdd,
      });
    }

    // 4. Update or insert daily activity for today
    const activityResult = await db.select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.date, todayStr)))
      .limit(1);

    let todayXp = xpToAdd;
    let chestClaimed = false;

    if (activityResult.length > 0) {
      const current = activityResult[0];
      todayXp = current.xpEarned + xpToAdd;
      chestClaimed = current.chestClaimed;
      await db.update(dailyActivity)
        .set({
          xpEarned: sql`${dailyActivity.xpEarned} + ${xpToAdd}`,
          lessonsCompleted: sql`${dailyActivity.lessonsCompleted} + 1`
        })
        .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.date, todayStr)));
    } else {
      await db.insert(dailyActivity).values({
        userId,
        date: todayStr,
        xpEarned: xpToAdd,
        lessonsCompleted: 1,
        chestClaimed: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Lesson completed successfully",
      xpAwarded: xpToAdd,
      todayXp,
      chestClaimed,
      isFirstLessonOfDay,
      currentStreak: newCurrentStreak,
      canClaimChest: todayXp >= 100 && !chestClaimed
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
