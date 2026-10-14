import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Share2,
  ChevronRight,
  HelpCircle,
  Flame,
} from "lucide-react";
import { db } from "@/lib/db";
import { BookmarkButton } from "@/components/quiz/bookmark-button";

export const dynamic = "force-dynamic";

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = await params;
  const attempt = await db.getQuizAttempt(attemptId);

  if (!attempt || !attempt.quiz) {
    notFound();
  }

  const quiz = attempt.quiz;
  // Get all questions WITH correct answers and explanations for comprehensive review
  const questions = await db.getQuestions({ quizId: quiz.id });
  const submittedAnswers = attempt.answers || [];

  const correctCount = submittedAnswers.filter((a) => a.is_correct).length;
  const answeredCount = submittedAnswers.filter((a) => a.selected_option_id).length;
  const incorrectCount = answeredCount - correctCount;
  const unansweredCount = questions.length - answeredCount;

  const minutes = Math.floor(attempt.time_taken_seconds / 60);
  const seconds = attempt.time_taken_seconds % 60;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Examination Results</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {quiz.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Completed on {new Date(attempt.completed_at || attempt.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                attempt.passed
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {attempt.passed ? "Qualified / Passed" : "Needs Improvement"}
            </span>
            <span className="text-xs text-slate-400 mt-1 font-semibold">
              Passing Mark: {quiz.passing_percentage}%
            </span>
          </div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center">
            <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {attempt.score}
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Marks Scored / {attempt.total_marks}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {attempt.percentage}%
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Percentage
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Accuracy
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {minutes}m {seconds}s
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
              Time Taken
            </span>
          </div>
        </div>

        {/* Detailed counts */}
        <div className="grid grid-cols-4 gap-2 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">{questions.length}</span>
            <span className="text-slate-400">Total Qs</span>
          </div>
          <div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{correctCount}</span>
            <span className="text-slate-400">Correct</span>
          </div>
          <div>
            <span className="font-bold text-red-500 block">{incorrectCount}</span>
            <span className="text-slate-400">Incorrect</span>
          </div>
          <div>
            <span className="font-bold text-slate-500 block">{unansweredCount}</span>
            <span className="text-slate-400">Unanswered</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/quiz/${quiz.id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Re-attempt Mock Test
          </Link>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center"
            >
              Go to Analytics Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Question by Question Comprehensive Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Detailed Question Breakdown & Explanations
        </h2>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAns = submittedAnswers.find((sa) => sa.question_id === q.id);
            const isAnswered = !!userAns?.selected_option_id;
            const isCorrect = userAns?.is_correct;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-500">
                      Question {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400 capitalize">
                      {q.difficulty}
                    </span>
                    {q.source_reference && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600 dark:text-indigo-400">
                        {q.source_reference}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {isCorrect ? (
                      <span className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> +{q.marks} Marks
                      </span>
                    ) : isAnswered ? (
                      <span className="flex items-center font-bold text-red-500">
                        <XCircle className="w-4 h-4 mr-1" /> -{q.negative_marks} Neg
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-400">
                        Unattempted (0 Marks)
                      </span>
                    )}
                    <BookmarkButton questionId={q.id} />
                  </div>
                </div>

                {/* Question Statement */}
                <h3 className="py-5 font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
                  {q.question_text}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {q.options?.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const wasChosen = userAns?.selected_option_id === opt.id;
                    const isTheCorrectOne = opt.is_correct;

                    let optStyle = "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300";

                    if (isTheCorrectOne) {
                      optStyle = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/30";
                    } else if (wasChosen && !isTheCorrectOne) {
                      optStyle = "border-red-500 bg-red-50/80 dark:bg-red-950/50 text-red-900 dark:text-red-200 font-bold ring-1 ring-red-500/30";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {letter}
                          </span>
                          <span>{opt.option_text}</span>
                        </div>
                        {isTheCorrectOne && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center ml-2">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Correct Answer
                          </span>
                        )}
                        {wasChosen && !isTheCorrectOne && (
                          <span className="text-xs font-bold text-red-500 flex items-center ml-2">
                            <XCircle className="w-4 h-4 mr-1" /> Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {q.explanation && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      💡 Conceptual Explanation:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
