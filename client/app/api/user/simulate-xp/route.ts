import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats, dailyActivity } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Dev/Testing helper to increment daily XP for testing the 100 XP trigger
export async function POST(request: Request) {
  try {
    let userId = "seed_user_1";
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.id) userId = session.user.id;
    } catch {}

    const body = await request.json().catch(() => ({}));
    const xpToAdd = typeof body.xp === "number" ? body.xp : 100;
    const todayStr = new Date().toISOString().split("T")[0];

    // Update user stats
    await db.update(userStats)
      .set({
        totalXp: sql`${userStats.totalXp} + ${xpToAdd}`,
        lastActivityDate: todayStr,
        updatedAt: sql`(unixepoch())`
      })
      .where(eq(userStats.userId, userId));

    // Update daily activity
    const activityResult = await db.select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.date, todayStr)))
      .limit(1);

    if (activityResult.length > 0) {
      await db.update(dailyActivity)
        .set({
          xpEarned: sql`${dailyActivity.xpEarned} + ${xpToAdd}`,
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

    return NextResponse.json({ success: true, message: `Added ${xpToAdd} XP to today's activity.` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to simulate quest XP" }, { status: 500 });
  }
}
