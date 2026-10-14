import React from "react";
import Link from "next/link";
import { Plus, BookOpen, Clock, Award, Shield } from "lucide-react";
import { db } from "@/lib/db";
import { CreateQuizModal } from "@/components/admin/create-quiz-modal";

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
  const [quizzes, categories] = await Promise.all([
    db.getQuizzes({ publishedOnly: false }),
    db.getCategories(),
  ]);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Quiz & Examination Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Author and configure mock tests, exam durations, and negative marking schemes
          </p>
        </div>

        <CreateQuizModal categories={categories} />
      </div>

      {/* Quizzes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            Configured Examinations ({quizzes.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1 text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {q.category?.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="capitalize font-semibold text-slate-500">
                    {q.difficulty}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {q.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>⏱️ {q.duration_minutes} Mins</span>
                  <span>🎯 {q.total_marks} Marks</span>
                  <span>⚠️ -{q.negative_marking_per_wrong} Negative</span>
                  <span>📝 {q.questions_count || 5} Questions</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Published
                </span>
                <Link
                  href={`/quiz/${q.id}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Preview Test
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
