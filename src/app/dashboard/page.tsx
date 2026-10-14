import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Target,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PerformanceCharts } from "@/components/analytics/performance-charts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const attempts = await db.getUserAttempts(user.id);
  const categories = await db.getCategories();

  const totalAttempts = attempts.length;
  let avgScore = 0;
  let highestScore = 0;
  let passedCount = 0;

  if (totalAttempts > 0) {
    const sum = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
    avgScore = Math.round(sum / totalAttempts);
    highestScore = Math.max(...attempts.map((a) => a.percentage));
    passedCount = attempts.filter((a) => a.passed).length;
  }

  // Format chart data
  const scoreHistory = [...attempts].reverse().slice(-10).map((a) => ({
    date: new Date(a.completed_at || a.created_at).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
    score: a.score,
    percentage: a.percentage,
    title: a.quiz?.title || "Mock Test",
  }));

  // Group accuracy by category
  const categoryAccuracy = categories.map((cat) => {
    const catAttempts = attempts.filter((a) => a.quiz?.category_id === cat.id);
    let acc = 0;
    if (catAttempts.length > 0) {
      const avg = catAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / catAttempts.length;
      acc = Math.round(avg);
    }
    return {
      name: cat.name.split(" ")[0],
      accuracy: acc,
    };
  }).filter((c) => c.accuracy > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* User Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
            ) : (
              user.display_name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                {user.display_name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Aspirant
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              Target: {user.target_exams.join(", ") || "UPSC & Competitive Exams"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-xs text-indigo-200 flex items-center justify-center font-semibold">
              <Flame className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" /> Study Streak
            </span>
            <span className="text-lg font-black text-amber-300">{user.streak_days} Days</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-xs text-indigo-200 flex items-center justify-center font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Total XP
            </span>
            <span className="text-lg font-black text-emerald-300">{user.total_xp}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Completed Mock Tests
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {totalAttempts}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {passedCount} passed passing mark
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Average Score
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {avgScore}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Calculated across all attempts
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Highest Score
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {highestScore}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Personal all-time best record
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Qualifying Rate
          </div>
          <div className="text-3xl font-black text-amber-500">
            {totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Success consistency index
          </p>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <PerformanceCharts
        scoreHistory={scoreHistory}
        categoryAccuracy={categoryAccuracy}
      />

      {/* Recent Attempts History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Examination Attempt History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review answers, explanations, and score breakdowns permanently saved in PostgreSQL
            </p>
          </div>

          <Link
            href="/exams"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
          >
            Practice New Test <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
            You have not attempted any mock examinations yet.
            <div className="mt-3">
              <Link
                href="/exams"
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Exam Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {attempts.map((att) => (
              <div
                key={att.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-2 rounded-xl transition-colors"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {att.quiz?.title || "Mock Test"}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>
                      {new Date(att.completed_at || att.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>⏱️ {Math.floor(att.time_taken_seconds / 60)}m {att.time_taken_seconds % 60}s</span>
                    <span className={`font-semibold ${att.passed ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {att.passed ? "Passed" : "Did not qualify"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-black text-base text-slate-900 dark:text-white">
                      {att.score} / {att.total_marks}
                    </span>
                    <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {att.percentage}%
                    </span>
                  </div>

                  <Link
                    href={`/quiz/${att.quiz_id}/result/${att.id}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    View Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
