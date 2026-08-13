import { NextResponse } from "next/server";
import { db } from "@/db";
import { userStats, userSkillProgress, lessons } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Hardcoded for the current seeded test user
  const userId = "seed_user_1";

  try {
    const { xpAwarded } = await request.json();

    // 1. Fetch the lesson to get the skillId
    const lessonResult = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
    if (!lessonResult || lessonResult.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    const skillId = lessonResult[0].skillId;

    // 2. Add XP to the user's stats
    await db.update(userStats)
      .set({
        totalXp: sql`${userStats.totalXp} + ${xpAwarded}`,
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
          xpEarned: sql`${userSkillProgress.xpEarned} + ${xpAwarded}`,
          lastPracticedAt: sql`(unixepoch())`
        })
        .where(and(eq(userSkillProgress.userId, userId), eq(userSkillProgress.skillId, skillId)));
    } else {
      await db.insert(userSkillProgress).values({
        userId,
        skillId,
        status: "completed",
        crowns: 1,
        xpEarned: xpAwarded,
      });
    }

    return NextResponse.json({ success: true, message: "Lesson completed successfully" });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
