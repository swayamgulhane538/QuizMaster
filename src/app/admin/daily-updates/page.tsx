import React from "react";
import { db } from "@/lib/db";
import { SchedulerTrigger } from "@/components/admin/scheduler-trigger";

export const dynamic = "force-dynamic";

export default async function AdminDailyUpdatesPage() {
  const [categories, logs] = await Promise.all([
    db.getCategories(),
    db.getScheduledJobLogs(),
  ]);

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Daily Question Scheduler & Automation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automated background jobs and on-demand question generation logs
        </p>
      </div>

      {/* Manual Trigger Component */}
      <SchedulerTrigger categories={categories} />

      {/* Execution Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            Job Run History & Audit Records ({logs.length})
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No job runs recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                    {log.job_name}
                  </span>
                  <span className="text-slate-400">
                    Timestamp: {new Date(log.started_at).toLocaleString("en-IN")}
                  </span>
                  {log.error_message && (
                    <p className="text-red-500 font-medium mt-1">
                      Error: {log.error_message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{log.questions_imported} Questions
                  </span>
                  <span className="text-slate-400 font-semibold">
                    {log.questions_skipped} Skipped (Dups)
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full font-black uppercase tracking-wider text-[10px] ${
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
