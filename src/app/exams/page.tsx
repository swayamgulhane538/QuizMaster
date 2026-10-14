import React from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, Clock, Award, Shield, Cpu, Landmark, Briefcase, Building2, TrainTrack, Globe } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const [categories, quizzes] = await Promise.all([
    db.getCategories(),
    db.getQuizzes({ publishedOnly: true }),
  ]);

  const categoryIcons: Record<string, React.ReactNode> = {
    "upsc-civil-services": <Landmark className="w-6 h-6 text-indigo-500" />,
    "ssc-exams": <Briefcase className="w-6 h-6 text-amber-500" />,
    "banking-insurance": <Building2 className="w-6 h-6 text-emerald-500" />,
    "railways-rrb": <TrainTrack className="w-6 h-6 text-blue-500" />,
    "defense-nda-cds": <Shield className="w-6 h-6 text-rose-500" />,
    "engineering-tech": <Cpu className="w-6 h-6 text-purple-500" />,
    "general-current-affairs": <Globe className="w-6 h-6 text-teal-500" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          Comprehensive Exam Preparation
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Examination Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Select your target examination to access official previous year question banks, subject-wise speed drills, and full-length timed mock tests.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-5">
                {categoryIcons[cat.slug] || <BookOpen className="w-6 h-6 text-indigo-500" />}
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {cat.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {cat.description}
              </p>

              <div className="mt-6 flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  {cat.subjects_count || 1} Subjects
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {cat.quizzes_count || 1} Tests Available
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                href={`/exams/${cat.slug}`}
                className="w-full py-3 px-4 rounded-xl text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center"
              >
                View Syllabus & Tests <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Available Tests Section */}
      <div className="pt-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
          All Published Mock Examinations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {quiz.category?.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 capitalize text-slate-600 dark:text-slate-300">
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {quiz.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">
                  ⏱️ {quiz.duration_minutes}m • {quiz.questions_count || 5} Qs
                </span>
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                >
                  Start Quiz <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
