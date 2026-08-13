import { NextResponse } from "next/server";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { ExerciseType } from "@/lib/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const lessonExercises = await db
      .select()
      .from(exercises)
      .where(eq(exercises.lessonId, id))
      .orderBy(asc(exercises.order));

    // Map DB rows to the frontend interface, parsing JSON fields where necessary
    const mappedExercises = lessonExercises.map(ex => ({
      id: ex.id,
      type: ex.type as ExerciseType,
      prompt: ex.prompt,
      options: ex.options ? (ex.options as string[]) : undefined,
      correctAnswer: ex.correctAnswer,
      pairs: ex.pairs ? (ex.pairs as { left: string; right: string }[]) : undefined,
      audioUrl: ex.audioUrl || undefined,
      imageUrl: ex.imageUrl || undefined,
    }));

    // Simulate small network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ exercises: mappedExercises });
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
