import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats, dailyActivity } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
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

    // 1. Fetch today's daily activity
    const activityResult = await db.select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.date, todayStr)))
      .limit(1);

    if (!activityResult || activityResult.length === 0) {
      return NextResponse.json(
        { error: "No activity found for today. Earn 100 XP to unlock the daily quest chest!" },
        { status: 400 }
      );
    }

    const activity = activityResult[0];

    // 2. Validate criteria: 100 XP milestone
    if (activity.xpEarned < 100) {
      return NextResponse.json(
        {
          error: `Milestone not reached. You have ${activity.xpEarned}/100 XP today.`,
          todayXp: activity.xpEarned,
          targetXp: 100
        },
        { status: 400 }
      );
    }

    // 3. Check idempotency: cannot reclaim already claimed chest
    if (activity.chestClaimed) {
      return NextResponse.json(
        { error: "Daily chest already claimed for today! Come back tomorrow." },
        { status: 409 }
      );
    }

    // 4. Determine loot rewards
    // Gems: randomly 50 or 100 gems
    const gemRewardOptions = [50, 100];
    const gemsAwarded = gemRewardOptions[Math.floor(Math.random() * gemRewardOptions.length)];

    // Hearts: Refill to 5 (or +1 extra heart up to max 5)
    const statsResult = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    const currentHearts = statsResult[0]?.hearts ?? 5;
    const maxHearts = statsResult[0]?.maxHearts ?? 5;
    
    // If hearts are less than max, refill to max. If already full, give max 5.
    const newHearts = maxHearts;
    const heartsAwarded = Math.max(1, maxHearts - currentHearts);

    // 5. Update user stats in DB (atomic)
    await db.update(userStats)
      .set({
        gems: sql`${userStats.gems} + ${gemsAwarded}`,
        hearts: newHearts,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(userStats.userId, userId));

    // 6. Mark chest as claimed in dailyActivity for today
    await db.update(dailyActivity)
      .set({
        chestClaimed: true,
      })
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.date, todayStr)));

    // Fetch updated user stats
    const updatedStats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

    return NextResponse.json({
      success: true,
      message: "Daily quest chest claimed successfully!",
      rewards: {
        gems: gemsAwarded,
        hearts: heartsAwarded,
        heartsRefilled: true,
      },
      updatedStats: updatedStats[0],
      daily: {
        date: todayStr,
        todayXp: activity.xpEarned,
        chestClaimed: true,
      }
    });
  } catch (error) {
    console.error("Error claiming daily quest chest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
