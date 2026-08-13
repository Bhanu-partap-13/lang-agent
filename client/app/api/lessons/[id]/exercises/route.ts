import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Mock a small array of exercises for the dynamic lesson flow
  const mockExercises = [
    {
      id: "ex_1",
      type: "multiple_choice",
      prompt: "Which of these is 'the coffee'?",
      options: ["el café", "el té", "el pan", "la leche"],
      correctAnswer: "el café",
    },
    {
      id: "ex_2",
      type: "word_bank",
      prompt: "Write this in Spanish: 'the bread'",
      options: ["el", "la", "pan", "café", "té"],
      correctAnswer: ["el", "pan"],
    },
    {
      id: "ex_3",
      type: "multiple_choice",
      prompt: "Which of these is 'the tea'?",
      options: ["el té", "el café", "el agua", "el pan"],
      correctAnswer: "el té",
    },
  ];

  // Simulate network delay to make it realistic
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({ exercises: mockExercises });
}
