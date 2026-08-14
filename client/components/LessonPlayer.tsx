"use client";

import React, { useState } from "react";
import { X, Heart, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import { TranslateExercise } from "@/components/exercises/TranslateExercise";
import { MatchPairsExercise } from "@/components/exercises/MatchPairsExercise";
import { FillBlankExercise } from "@/components/exercises/FillBlankExercise";
import { TypeAnswerExercise } from "@/components/exercises/TypeAnswerExercise";
import { QuitModal } from "@/components/modals/QuitModal";
import { OutOfHeartsModal } from "@/components/modals/OutOfHeartsModal";
import { LessonComplete } from "@/components/LessonComplete";

import { API_BASE_URL } from "@/lib/config";
import type { Exercise, FeedbackStatus } from "@/lib/types";

const MAX_HEARTS = 5;
const XP_REWARD = 10;

interface LessonPlayerProps {
  lessonId: string;
  exercises: Exercise[];
}

export function LessonPlayer({ lessonId, exercises }: LessonPlayerProps) {
  // Queue of remaining exercises (including initial ones and re-queued mistakes)
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>(exercises);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  // Total initial count to anchor the progress bar
  const [totalInitialCount] = useState(exercises.length);
  const [correctCount, setCorrectCount] = useState(0);

  // Track mistakes queue IDs to display "PREVIOUS MISTAKE" pill
  const [mistakeIds, setMistakeIds] = useState<Set<string>>(new Set());

  // Streak counter for "{number} in a row"
  const [streakCount, setStreakCount] = useState(0);

  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [isFinished, setIsFinished] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isOutOfHeartsModalOpen, setIsOutOfHeartsModalOpen] = useState(false);

  // Feedback banner state: controls the slide-up green/red panel
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("none");
  const [shakeHearts, setShakeHearts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentExercise = exerciseQueue[currentQueueIndex];
  const isPreviousMistake = currentExercise ? mistakeIds.has(currentExercise.id) : false;

  // Progress computation (percentage based on correctCount relative to total required)
  const progressPercent = Math.min(100, Math.round((correctCount / totalInitialCount) * 100));

  // ── Answer evaluation ──────────────────────────────────────────────────
  const evaluateAnswer = (answer: string | string[]) => {
    if (!currentExercise) return;

    if (answer === "__SKIPPED__") {
      handleSkip();
      return;
    }

    const { correctAnswer, type } = currentExercise;
    
    let isCorrect = false;

    if (type === "translate" || type === "word_bank") {
      isCorrect = Array.isArray(answer) && 
        answer.join(" ") === (correctAnswer as string[]).join(" ");
    } else if (type === "match_pairs") {
      isCorrect = answer === "all";
    } else if (type === "type_answer") {
      isCorrect = typeof answer === "string" && typeof correctAnswer === "string" &&
        answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    } else {
      // Multiple Choice & Fill Blank
      isCorrect = answer === correctAnswer;
    }

    if (isCorrect) {
      setStreakCount((prev) => prev + 1);
      setFeedbackStatus("correct");
    } else {
      setStreakCount(0);
      setFeedbackStatus("incorrect");
      setShakeHearts(true);
      setTimeout(() => setShakeHearts(false), 500);

      // Re-queue the missed question to mistakesQueue
      setMistakeIds((prev) => new Set(prev).add(currentExercise.id));
      setExerciseQueue((prev) => [...prev, currentExercise]);
    }
  };

  // ── Skip Handling ──────────────────────────────────────────────────────
  const handleSkip = () => {
    if (!currentExercise || feedbackStatus !== "none") return;
    setStreakCount(0);
    setFeedbackStatus("incorrect");
    setShakeHearts(true);
    setTimeout(() => setShakeHearts(false), 500);

    // Append skipped question to the review queue
    setMistakeIds((prev) => new Set(prev).add(currentExercise.id));
    setExerciseQueue((prev) => [...prev, currentExercise]);
  };

  // ── Continue button (inside feedback banner) ───────────────────────────
  const handleContinue = async () => {
    if (feedbackStatus === "incorrect") {
      const remaining = Math.max(0, hearts - 1);
      setHearts(remaining);

      if (remaining === 0) {
        setIsOutOfHeartsModalOpen(true);
        setFeedbackStatus("none");
        return;
      }
    } else if (feedbackStatus === "correct") {
      setCorrectCount((c) => Math.min(totalInitialCount, c + 1));
    }

    setFeedbackStatus("none");

    const nextIndex = currentQueueIndex + 1;
    if (nextIndex < exerciseQueue.length) {
      setCurrentQueueIndex(nextIndex);
    } else {
      // All exercises (including review mistakes) completed successfully!
      setIsSaving(true);
      try {
        await fetch(`${API_BASE_URL}/lessons/${lessonId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xpAwarded: XP_REWARD, heartsLost: MAX_HEARTS - hearts, mistakesCount: mistakeIds.size, scorePct: Math.round((totalInitialCount - mistakeIds.size) / totalInitialCount * 100) }),
        });
      } catch (err) {
        console.error("Failed to save progress", err);
      } finally {
        setIsSaving(false);
        setIsFinished(true);
      }
    }
  };

  // ── Early-exit render paths ────────────────────────────────────────────
  if (isFinished) {
    return <LessonComplete hearts={hearts} xpAwarded={XP_REWARD} />;
  }

  return (
    <div className="min-h-screen bg-[#131F24] flex flex-col relative overflow-hidden select-none">

      {/* ── Global Header with 3D Glass Shine Progress Bar & Streak Indicator ── */}
      <header className="w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col relative z-30">
        
        {/* Streak "4 IN A ROW" pill above progress bar */}
        <div className="h-6 flex items-center justify-center mb-1">
          <AnimatePresence>
            {streakCount >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="flex items-center space-x-1.5 text-[#58CC02] font-black text-xs uppercase tracking-widest"
              >
                <span>🔥</span>
                <span>4 IN A ROW</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-4 w-full">
          {/* Quit button */}
          <button
            onClick={() => setIsQuitModalOpen(true)}
            className="text-[#52565D] hover:text-white transition-colors cursor-pointer"
            aria-label="Quit lesson"
          >
            <X className="w-7 h-7" strokeWidth={2.5} />
          </button>

          {/* 3D Glass Shine Progress Bar with Leading Ring indicator */}
          <div className="flex-1 relative flex items-center">
            <div
              className="w-full h-4 bg-[#37464F] rounded-full overflow-hidden relative shadow-inner"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* Green Progress Fill with 3D Gloss shine */}
              <motion.div
                className="h-full bg-[#58CC02] rounded-full relative transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              >
                {/* 3D Light-White Gloss Shine on Top */}
                <div className="bg-white/30 h-1.5 w-full absolute top-0 left-0 rounded-full" />
              </motion.div>
            </div>

            {/* Glowing Leading Head / Ring circle matching screenshot */}
            {progressPercent > 0 && progressPercent < 100 && (
              <motion.div
                className="absolute -top-1 w-6 h-6 rounded-full border-3 border-[#58CC02] bg-[#131F24]/80 flex items-center justify-center pointer-events-none shadow-lg"
                style={{ left: `calc(${progressPercent}% - 12px)` }}
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="w-2 h-2 rounded-full bg-[#58CC02]" />
              </motion.div>
            )}
          </div>

          {/* Hearts counter — shakes red on wrong answer */}
          <div
            className={`flex items-center space-x-2 text-[#FF4B4B] font-extrabold text-lg transition-transform ${
              shakeHearts ? "animate-bounce" : ""
            }`}
          >
            <Heart className="w-7 h-7 fill-current" />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* ── Active Exercise Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Previous Mistake Pill Banner */}
        {isPreviousMistake && feedbackStatus === "none" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-[#FF9600] font-black text-xs uppercase tracking-wider mb-2 bg-[#2a1e17] px-3 py-1.5 rounded-xl border border-[#FF9600]/30 shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-[#FF9600]" strokeWidth={2.5} />
            <span>PREVIOUS MISTAKE</span>
          </motion.div>
        )}

        {currentExercise && (
          <React.Fragment key={`${currentExercise.id}-${currentQueueIndex}`}>
            {currentExercise.type === "multiple_choice" && (
              <MultipleChoiceExercise exercise={currentExercise} onComplete={evaluateAnswer} disabled={feedbackStatus !== "none"} />
            )}
            {(currentExercise.type === "translate" || currentExercise.type === "word_bank") && (
              <TranslateExercise exercise={currentExercise} onComplete={evaluateAnswer} disabled={feedbackStatus !== "none"} />
            )}
            {currentExercise.type === "match_pairs" && (
              <MatchPairsExercise 
                exercise={currentExercise} 
                onComplete={evaluateAnswer} 
                disabled={feedbackStatus !== "none"} 
                onMismatch={() => {
                  setStreakCount(0);
                  setShakeHearts(true);
                  setTimeout(() => setShakeHearts(false), 500);
                  const remaining = Math.max(0, hearts - 1);
                  setHearts(remaining);
                  if (remaining === 0) {
                    setIsOutOfHeartsModalOpen(true);
                  }
                }}
              />
            )}
            {currentExercise.type === "fill_blank" && (
              <FillBlankExercise exercise={currentExercise} onComplete={evaluateAnswer} disabled={feedbackStatus !== "none"} />
            )}
            {currentExercise.type === "type_answer" && (
              <TypeAnswerExercise exercise={currentExercise} onComplete={evaluateAnswer} disabled={feedbackStatus !== "none"} />
            )}
          </React.Fragment>
        )}
      </div>

      {/* ── Skip Trigger Button Bar (When feedback banner is not active) ── */}
      {feedbackStatus === "none" && (
        <div className="w-full max-w-4xl mx-auto px-6 pb-6 flex justify-start z-30">
          <button
            onClick={handleSkip}
            className="px-6 py-2.5 rounded-xl border-2 border-[#37464F] text-[#AFAFAF] hover:text-white hover:bg-[#202F36] font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            SKIP
          </button>
        </div>
      )}

      {/* ── Feedback Footer Banner (Dark Mode matching screenshots) ──── */}
      {feedbackStatus !== "none" && (
        <div
          className={`fixed bottom-0 left-0 w-full p-6 flex justify-between items-center z-50 transition-all border-t-2 border-[#202F36] ${
            feedbackStatus === "correct" ? "bg-[#182F23]" : "bg-[#28181A]"
          }`}
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

            {/* Left: 3D Circle Icon + Message */}
            <div className="flex items-start space-x-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
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

              <div className="flex flex-col">
                <h2
                  className={`font-extrabold text-2xl mb-0.5 ${
                    feedbackStatus === "correct" ? "text-[#58CC02]" : "text-[#FF4B4B]"
                  }`}
                >
                  {feedbackStatus === "correct" ? "Awesome!" : "Correct solution:"}
                </h2>

                {feedbackStatus === "incorrect" && currentExercise && (
                  <p className="text-[#FF4B4B] text-base font-semibold mb-2">
                    {Array.isArray(currentExercise.correctAnswer)
                      ? currentExercise.correctAnswer.join(" ")
                      : currentExercise.correctAnswer}
                  </p>
                )}

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

            {/* Right: 3D CONTINUE button */}
            <button
              onClick={handleContinue}
              disabled={isSaving}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-extrabold text-sm text-white uppercase tracking-wider border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-lg ${
                isSaving 
                  ? "bg-[#37464F] border-[#202F36] text-gray-400 cursor-not-allowed"
                  : feedbackStatus === "correct"
                    ? "bg-[#58CC02] border-[#46A302] hover:bg-[#46A302]"
                    : "bg-[#FF4B4B] border-[#EA2B2B] hover:bg-[#EA2B2B]"
              }`}
            >
              {isSaving ? "SAVING..." : "CONTINUE"}
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

