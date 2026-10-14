"use client";

import React, { useState } from "react";
import { Clock, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { ExamCategory } from "@/types/database";
import { useRouter } from "next/navigation";

export function SchedulerTrigger({ categories }: { categories: ExamCategory[] }) {
  const router = useRouter();
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "upsc-civil-services");
  const [targetCount, setTargetCount] = useState("5");
  const [autoApprove, setAutoApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTrigger = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/daily-update/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug,
          targetCount: Number(targetCount),
          autoApprove,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: `Success: ${data.imported} questions generated (${data.skipped} duplicates skipped).`,
        });
        router.refresh();
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to trigger daily generation job",
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error triggering scheduler" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      <div>
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center">
          <Clock className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
          Trigger Manual Daily Update Pipeline
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Execute the AI generation and curriculum import pipeline immediately for any category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Target Examination
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Question Target Count
          </label>
          <select
            value={targetCount}
            onChange={(e) => setTargetCount(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          >
            <option value="3">3 Practice Questions</option>
            <option value="5">5 Practice Questions (Recommended)</option>
            <option value="10">10 Practice Questions</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pb-3">
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span>Auto-Approve & Publish</span>
          </label>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center font-bold ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          {statusMessage.text}
        </div>
      )}

      <button
        onClick={handleTrigger}
        disabled={loading}
        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all flex items-center shadow-md shadow-indigo-600/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating & Deduplicating Questions...
          </>
        ) : (
          "Run Generation Job Now"
        )}
      </button>
    </div>
  );
}
