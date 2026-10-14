"use client";

import React, { useState } from "react";
import { Check, X, Sparkles, Loader2 } from "lucide-react";
import { Question } from "@/types/database";
import { useRouter } from "next/navigation";

export function ApprovalQueue({ initialQuestions }: { initialQuestions: Question[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Question[]>(initialQuestions);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/questions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((q) => q.id !== id));
        router.refresh();
      }
    } catch {}
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/questions/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((q) => q.id !== id));
        router.refresh();
      }
    } catch {}
    setActionLoading(null);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        All generated questions have been reviewed! Trigger a daily update to fetch more.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((q) => (
        <div
          key={q.id}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> AI Practice Generator
            </span>
            <span className="capitalize font-semibold text-slate-400">
              Difficulty: {q.difficulty}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
            {q.question_text}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {q.options?.map((opt, i) => (
              <div
                key={opt.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  opt.is_correct
                    ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span>{String.fromCharCode(65 + i)}. {opt.option_text}</span>
                {opt.is_correct && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Correct</span>}
              </div>
            ))}
          </div>

          {q.explanation && (
            <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl leading-relaxed">
              💡 {q.explanation}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              onClick={() => handleReject(q.id)}
              disabled={actionLoading === q.id}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Reject Question
            </button>
            <button
              onClick={() => handleApprove(q.id)}
              disabled={actionLoading === q.id}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center"
            >
              {actionLoading === q.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" /> Approve & Publish
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
