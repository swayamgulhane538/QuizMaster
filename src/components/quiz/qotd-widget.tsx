"use client";

import React, { useState } from "react";
import { Question } from "@/types/database";
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export function QuestionOfTheDayWidget({ initialQuestion }: { initialQuestion: Question | null }) {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  if (!initialQuestion) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
        No Question of the Day available right now. Check back shortly!
      </div>
    );
  }

  const handleSelect = (optId: string) => {
    if (revealed) return;
    setSelectedOptId(optId);
    setRevealed(true);
  };

  const selectedOpt = initialQuestion.options?.find((o) => o.id === selectedOptId);
  const isCorrect = selectedOpt?.is_correct;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Question of the Day</span>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {initialQuestion.source_reference || "UPSC Prelims PYQ"}
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
        {initialQuestion.question_text}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {initialQuestion.options?.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOptId === opt.id;
          
          let btnClass = "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200";

          if (revealed) {
            if (opt.is_correct) {
              btnClass = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20";
            } else if (isSelected && !opt.is_correct) {
              btnClass = "border-red-500 bg-red-50/80 dark:bg-red-950/50 text-red-900 dark:text-red-200 ring-2 ring-red-500/20";
            } else {
              btnClass = "opacity-50 border-slate-200 dark:border-slate-800";
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={revealed}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${btnClass}`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {letter}
                </span>
                <span>{opt.option_text}</span>
              </div>
              {revealed && opt.is_correct && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
              )}
              {revealed && isSelected && !opt.is_correct && (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer & Explanation on Reveal */}
      {revealed && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-xs font-bold mb-1.5">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Correct Answer! +2.00 Marks
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 flex items-center">
                <XCircle className="w-4 h-4 mr-1" /> Incorrect. Correct option is marked in green.
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {initialQuestion.explanation}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Earn +50 XP on Daily Practice Hub
        </span>
        <Link
          href="/daily-practice"
          className="inline-flex items-center font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
        >
          Daily Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
