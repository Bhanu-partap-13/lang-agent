"use client";

import React, { useState } from "react";
import { X, Heart } from "lucide-react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import { QuitModal } from "@/components/modals/QuitModal";
import { OutOfHeartsModal } from "@/components/modals/OutOfHeartsModal";
import { LessonComplete } from "@/components/LessonComplete";
import type { Exercise, FeedbackStatus } from "@/lib/types";

const MAX_HEARTS = 5;
const XP_REWARD = 10;

interface LessonPlayerProps {
  exercises: Exercise[];
}

/**
 * LessonPlayer — the core game-loop orchestrator.
 *
 * Responsibilities:
 *   1. Tracks current question index & progress bar width
 *   2. Evaluates answers and drives the feedbackStatus state machine
 *   3. Manages the hearts (lives) system
 *   4. Renders the appropriate sub-view via composition, NOT inline JSX
 *
 * Strict XP rule: XP is only awarded when the last question is passed.
 * Quitting mid-lesson returns to /learn with 0 XP (handled by QuitModal).
 */
export function LessonPlayer({ exercises }: LessonPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [isFinished, setIsFinished] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isOutOfHeartsModalOpen, setIsOutOfHeartsModalOpen] = useState(false);

  // Feedback banner state: controls the slide-up green/red panel
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("none");
  const [shakeHearts, setShakeHearts] = useState(false);

  const currentExercise = exercises[currentIndex];

  // Progress: how far through the exercise array the user has advanced
  const progressPercent = (currentIndex / exercises.length) * 100;

  // ── Answer evaluation ──────────────────────────────────────────────────
  const evaluateAnswer = (answer: string) => {
    const { correctAnswer } = currentExercise;
    const isCorrect = Array.isArray(correctAnswer)
      ? correctAnswer.includes(answer)
      : answer === correctAnswer;

    if (isCorrect) {
      setFeedbackStatus("correct");
    } else {
      setFeedbackStatus("incorrect");
      // Trigger the shake animation on the hearts display
      setShakeHearts(true);
      setTimeout(() => setShakeHearts(false), 500);
    }
  };

  // ── Continue button (inside feedback banner) ───────────────────────────
  const handleContinue = () => {
    if (feedbackStatus === "incorrect") {
      const remaining = Math.max(0, hearts - 1);
      setHearts(remaining);

      if (remaining === 0) {
        setIsOutOfHeartsModalOpen(true);
        setFeedbackStatus("none");
        return;
      }
    }

    setFeedbackStatus("none");

    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Last question passed — award XP and show celebration
      setIsFinished(true);
    }
  };

  // ── Early-exit render paths ────────────────────────────────────────────

  if (isFinished) {
    return <LessonComplete hearts={hearts} xpAwarded={XP_REWARD} />;
  }

  // ── Main lesson view ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col relative overflow-hidden">

      {/* ── Global Header ──────────────────────────────────────── */}
      <header className="w-full max-w-4xl mx-auto p-4 md:p-8 flex items-center space-x-4">
        {/* Quit button — opens confirmation modal, does NOT navigate directly */}
        <button
          onClick={() => setIsQuitModalOpen(true)}
          className="text-[#52565D] hover:text-white transition-colors"
          aria-label="Quit lesson"
        >
          <X className="w-8 h-8" strokeWidth={2.5} />
        </button>

        {/* Progress track */}
        <div
          className="flex-1 h-4 bg-[#37464F] rounded-full overflow-hidden relative"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Subtle shine overlay */}
          <div className="absolute top-1 left-2 h-1 rounded-full bg-white opacity-20 w-[calc(100%-16px)]" />
        </div>

        {/* Hearts counter — shakes red on wrong answer */}
        <div
          className={`flex items-center space-x-2 text-[#FF4B4B] font-bold text-xl transition-transform ${
            shakeHearts ? "animate-bounce" : ""
          }`}
        >
          <Heart className="w-8 h-8 fill-current" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* ── Active Exercise ─────────────────────────────────────── */}
      {currentExercise && (
        <MultipleChoiceExercise
          key={currentIndex}       // re-mounts component, clearing local selection state
          exercise={currentExercise}
          onComplete={evaluateAnswer}
          disabled={feedbackStatus !== "none"}
        />
      )}

      {/* ── Feedback Footer Banner (Dark Mode matching screenshot) ───────────────────── */}
      {feedbackStatus !== "none" && (
        <div
          className={`fixed bottom-0 left-0 w-full p-6 flex justify-between items-center z-50 transition-all border-t-2 border-[#202F36] ${
            feedbackStatus === "correct" ? "bg-[#182F23]" : "bg-[#28181A]"
          }`}
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

            {/* Left: 3D Circle Icon + Message + Actions */}
            <div className="flex items-start space-x-5">
              {/* Circle Icon */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                feedbackStatus === "correct" ? "bg-[#58CC02]" : "bg-[#FF4B4B]"
              }`}>
                {feedbackStatus === "correct" ? (
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col">
                <h2
                  className={`font-extrabold text-xl mb-0.5 ${
                    feedbackStatus === "correct" ? "text-[#58CC02]" : "text-[#FF4B4B]"
                  }`}
                >
                  {feedbackStatus === "correct" ? "You are correct!" : "Correct solution:"}
                </h2>

                {feedbackStatus === "incorrect" && (
                  <p className="text-[#FF4B4B] text-base font-semibold mb-3">
                    {Array.isArray(currentExercise.correctAnswer)
                      ? currentExercise.correctAnswer.join(" ")
                      : currentExercise.correctAnswer}
                  </p>
                )}

                {/* LIKE / DISLIKE / REPORT Action Row */}
                <div className="flex items-center space-x-4 mt-1">
                  <button className={`flex items-center space-x-1.5 text-xs font-extrabold tracking-wider uppercase transition-colors hover:brightness-125 ${
                    feedbackStatus === "correct" ? "text-[#58CC02]" : "text-[#FF4B4B]"
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    <span>LIKE</span>
                  </button>

                  <button className={`flex items-center space-x-1.5 text-xs font-extrabold tracking-wider uppercase transition-colors hover:brightness-125 ${
                    feedbackStatus === "correct" ? "text-[#58CC02]" : "text-[#FF4B4B]"
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                    </svg>
                    <span>DISLIKE</span>
                  </button>

                  <button className={`flex items-center space-x-1.5 text-xs font-extrabold tracking-wider uppercase transition-colors hover:brightness-125 ${
                    feedbackStatus === "correct" ? "text-[#58CC02]" : "text-[#FF4B4B]"
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                    </svg>
                    <span>REPORT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: 3D CONTINUE button */}
            <button
              onClick={handleContinue}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-extrabold text-sm text-white uppercase tracking-wider border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                feedbackStatus === "correct"
                  ? "bg-[#58CC02] border-[#46A302] hover:bg-[#46A302]"
                  : "bg-[#FF4B4B] border-[#EA2B2B] hover:bg-[#EA2B2B]"
              }`}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────── */}
      {isQuitModalOpen && (
        <QuitModal onStay={() => setIsQuitModalOpen(false)} />
      )}

      {isOutOfHeartsModalOpen && (
        <OutOfHeartsModal
          onRefill={() => {
            setHearts(MAX_HEARTS);
            setIsOutOfHeartsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
