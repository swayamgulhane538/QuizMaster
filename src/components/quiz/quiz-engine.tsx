"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Send,
  Loader2,
  Save,
  Check,
} from "lucide-react";
import { Quiz, Question, QuizAttempt } from "@/types/database";

interface AnswerState {
  question_id: string;
  selected_option_id?: string;
  is_marked_for_review: boolean;
}

interface QuizEngineProps {
  quiz: Quiz;
  questions: Question[];
  initialAttempt: QuizAttempt;
}

export function QuizEngine({ quiz, questions, initialAttempt }: QuizEngineProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(quiz.duration_minutes * 60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restore in-progress attempt state
  useEffect(() => {
    const elapsedSeconds = Math.floor((Date.now() - new Date(initialAttempt.started_at).getTime()) / 1000);
    const totalAllowed = quiz.duration_minutes * 60;
    const remaining = Math.max(0, totalAllowed - elapsedSeconds);
    setTimeLeftSeconds(remaining);

    // Populate existing answers if any
    const map: Record<string, AnswerState> = {};
    if (initialAttempt.answers) {
      initialAttempt.answers.forEach((ans) => {
        map[ans.question_id] = {
          question_id: ans.question_id,
          selected_option_id: ans.selected_option_id,
          is_marked_for_review: ans.is_marked_for_review,
        };
      });
    }
    setAnswers(map);
  }, [initialAttempt, quiz]);

  // Timer countdown
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleFinalSubmit(true); // auto submit on expiry
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeftSeconds]);

  // Autosave answers to server
  const triggerAutosave = async (newAnswers: Record<string, AnswerState>) => {
    setSaveStatus("saving");
    try {
      const payload = Object.values(newAnswers);
      await fetch("/api/quiz/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: initialAttempt.id,
          answers: payload,
        }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("idle");
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id] || {
    question_id: currentQuestion?.id,
    selected_option_id: undefined,
    is_marked_for_review: false,
  };

  const handleSelectOption = (optId: string) => {
    const updated: Record<string, AnswerState> = {
      ...answers,
      [currentQuestion.id]: {
        ...currentAnswer,
        selected_option_id: optId,
      },
    };
    setAnswers(updated);
    triggerAutosave(updated);
  };

  const handleClearOption = () => {
    const updated: Record<string, AnswerState> = {
      ...answers,
      [currentQuestion.id]: {
        ...currentAnswer,
        selected_option_id: undefined,
      },
    };
    setAnswers(updated);
    triggerAutosave(updated);
  };

  const handleToggleReview = () => {
    const updated: Record<string, AnswerState> = {
      ...answers,
      [currentQuestion.id]: {
        ...currentAnswer,
        is_marked_for_review: !currentAnswer.is_marked_for_review,
      },
    };
    setAnswers(updated);
    triggerAutosave(updated);
  };

  const handleFinalSubmit = async (auto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setConfirmModalOpen(false);

    try {
      const timeTaken = quiz.duration_minutes * 60 - Math.max(0, timeLeftSeconds);
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: initialAttempt.id,
          timeTakenSeconds: timeTaken,
          answers: Object.values(answers),
        }),
      });

      const data = await res.json();
      if (data.success && data.attempt) {
        router.push(`/quiz/${quiz.id}/result/${data.attempt.id}`);
      } else {
        alert("Failed to submit test. Please try again.");
        setIsSubmitting(false);
      }
    } catch {
      alert("Network error submitting quiz");
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Palette status calculator
  const answeredCount = Object.values(answers).filter((a) => a.selected_option_id).length;
  const markedCount = Object.values(answers).filter((a) => a.is_marked_for_review).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      
      {/* Top Test Navigation Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {quiz.category?.name || "Exam Simulator"}
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {quiz.title}
          </h2>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Autosave Status */}
          <div className="hidden sm:flex items-center text-xs font-semibold text-slate-400">
            {saveStatus === "saving" && (
              <span className="flex items-center text-indigo-500">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center text-emerald-500">
                <Check className="w-3 h-3 mr-1" /> Saved
              </span>
            )}
            {saveStatus === "idle" && (
              <span className="flex items-center">
                <Save className="w-3 h-3 mr-1" /> Autosave On
              </span>
            )}
          </div>

          {/* Timer Display */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-extrabold shadow-sm ${
            timeLeftSeconds < 120
              ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse border border-red-300 dark:border-red-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => setConfirmModalOpen(true)}
            disabled={isSubmitting}
            className="px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all flex items-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Test
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Examination View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Question Area */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div>
            {/* Question Top Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{currentQuestion.marks} Mark
                </span>
                <span className="font-semibold text-red-500">
                  -{currentQuestion.negative_marks} Neg
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="py-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                {currentQuestion.question_text}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options?.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = currentAnswer.selected_option_id === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center space-x-3.5 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="leading-relaxed">{opt.option_text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center ${
                  currentAnswer.is_marked_for_review
                    ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                    : "border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                }`}
              >
                <Flag className="w-3.5 h-3.5 mr-1.5" />
                {currentAnswer.is_marked_for_review ? "Marked for Review" : "Mark for Review"}
              </button>

              {currentAnswer.selected_option_id && (
                <button
                  onClick={handleClearOption}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>

              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center shadow-md shadow-indigo-600/20"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette & Test Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4">
              Question Palette
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-5">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                Answered ({answeredCount})
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 mr-2" />
                Unanswered ({unansweredCount})
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                Marked Review ({markedCount})
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full border-2 border-indigo-500 mr-2" />
                Current Active
              </span>
            </div>

            {/* Number Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurrent = idx === currentIndex;
                const isAnswered = ans && ans.selected_option_id;
                const isMarked = ans && ans.is_marked_for_review;

                let badgeClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

                if (isAnswered && isMarked) {
                  badgeClass = "bg-purple-600 text-white font-bold";
                } else if (isAnswered) {
                  badgeClass = "bg-emerald-500 text-white font-bold";
                } else if (isMarked) {
                  badgeClass = "bg-amber-500 text-white font-bold";
                }

                if (isCurrent) {
                  badgeClass += " ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs transition-all flex items-center justify-center ${badgeClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Submit Card */}
          <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs">
            <h5 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
              Examination Instructions
            </h5>
            <p className="text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
              Answers are securely saved on every selection. Server-calculated scoring will compute correct answers and apply negative marking upon submission.
            </p>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Submit Examination?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Review your attempt summary before final submission:
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center mb-6 text-xs">
              <div>
                <span className="block font-black text-lg text-emerald-600 dark:text-emerald-400">
                  {answeredCount}
                </span>
                <span className="text-slate-400 font-semibold">Answered</span>
              </div>
              <div>
                <span className="block font-black text-lg text-slate-500">
                  {unansweredCount}
                </span>
                <span className="text-slate-400 font-semibold">Unanswered</span>
              </div>
              <div>
                <span className="block font-black text-lg text-amber-500">
                  {markedCount}
                </span>
                <span className="text-slate-400 font-semibold">Review</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="w-1/2 py-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                className="w-1/2 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
