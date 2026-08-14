/**
 * Shared type definitions for the lesson/exercise system.
 * Used across LessonPlayer, exercise components, and the API route.
 */

export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "word_bank"
  | "fill_blank"
  | "match_pairs"
  | "type_answer";

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  pairs?: { left: string; right: string }[];
  audioUrl?: string;
  imageUrl?: string;
}

export type FeedbackStatus = "none" | "correct" | "incorrect";

export type NodeStatus = "active" | "locked" | "completed";

export type NodeType = "star" | "dumbbell" | "chest" | "trophy" | "podcast";
