import React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, logs, pending] = await Promise.all([
    db.getPlatformStats(),
    db.getScheduledJobLogs(),
    db.getQuestions({ reviewStatus: "pending" }),
  ]);

  return (
    <div className="space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Administrative Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time PostgreSQL telemetry, question approvals, and daily cron monitoring
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/daily-updates"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center"
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" /> Trigger Daily Update
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Registered Users
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalUsers}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Mobile verified aspirants</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Published Quizzes
          </span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {stats.totalQuizzes}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Across 8 exam tracks</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Question Bank
          </span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.totalQuestions}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Approved & published</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            AI Review Queue
          </span>
          <span className="text-3xl font-black text-amber-500">
            {pending.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Pending admin sign-off</p>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/questions"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Question Approvals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review automatically generated practice questions for accuracy and publish to students.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center">
            Review Queue ({pending.length}) →
          </span>
        </Link>

        <Link
          href="/admin/quizzes"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Create New Mock Test
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure exam duration, total marks, negative marking, and syllabus mapping.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center">
            Open Quiz Manager →
          </span>
        </Link>

        <Link
          href="/admin/daily-updates"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Daily Cron Job Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Inspect automatic import runs, check duplicate detection counters, and recover failed jobs.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center">
            View Job History →
          </span>
        </Link>
      </div>

      {/* Recent Scheduled Job History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
          Recent Scheduled Job Executions
        </h2>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No scheduled job runs recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {log.job_name}
                  </span>
                  <span className="text-slate-400">
                    {new Date(log.started_at).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{log.questions_imported} Imported
                  </span>
                  <span className="text-slate-400">
                    {log.questions_skipped} Duplicates Skipped
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      log.status === "success"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
