import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Award, BookOpen, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ExamCategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await db.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [subjects, quizzes] = await Promise.all([
    db.getSubjects(category.id),
    db.getQuizzes({ categoryId: category.id, publishedOnly: true }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <div>
        <Link
          href="/exams"
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Exams
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            Official Exam Track
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Syllabus & Core Subjects
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {sub.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quizzes List */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Available Mock Tests & PYQs
        </h2>

        {quizzes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
            No mock tests currently published for this category. Stay tuned for automatic daily updates!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {quiz.subject?.name || "General Test"}
                    </span>
                    <span className="font-bold capitalize text-slate-500">
                      Difficulty: {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>⏱️ {quiz.duration_minutes} Mins</span>
                    <span>📝 {quiz.questions_count || 5} Questions</span>
                    <span>🎯 {quiz.total_marks} Marks</span>
                    <span>⚠️ -{quiz.negative_marking_per_wrong} Negative</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center"
                  >
                    Start Examination <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
