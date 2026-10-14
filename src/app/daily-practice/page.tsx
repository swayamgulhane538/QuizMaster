import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  Clock,
  BookOpen,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { QuestionOfTheDayWidget } from "@/components/quiz/qotd-widget";

export const dynamic = "force-dynamic";

export default async function DailyPracticePage() {
  const [user, qotd, quizzes, categories] = await Promise.all([
    getCurrentUser(),
    db.getDailyQuestionOfTheDay(),
    db.getQuizzes({ publishedOnly: true }),
    db.getCategories(),
  ]);

  const streakDays = user?.streak_days || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 mb-3">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Daily Practice Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Consistency Builds Rank
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
            Complete your daily questions to maintain your study streak, earn XP rewards, and keep your exam concepts sharp every single day.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {streakDays} Days
            </span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Active Study Streak
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: QOTD + Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive QOTD Widget */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Official Question of the Day
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Refreshes in 8h 22m
            </span>
          </div>

          <QuestionOfTheDayWidget initialQuestion={qotd} />
        </div>

        {/* Right: Daily Challenge & Streak Calendar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Today&apos;s High-Yield Mission
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                +100 Bonus XP
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Complete 1 Timed Mock Test
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Score at least 60% on any mock test from UPSC, SSC, or GATE CS today to earn the Daily Champion badge.
            </p>

            <Link
              href="/exams"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center"
            >
              Start Mission Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          {/* 7-Day Streak Heatmap Visualizer */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
              Weekly Practice Tracker
            </h4>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                const isActive = idx <= 4;
                return (
                  <div key={day} className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
                    <div
                      className={`h-9 rounded-xl flex items-center justify-center font-bold ${
                        isActive
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isActive ? "🔥" : "•"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Exam-Specific Daily Practice Quizzes */}
      <div className="space-y-6 pt-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Exam-Specific Daily Speed Drills
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Handpicked 10-minute quizzes calibrated to official exam patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 block">
                  {quiz.category?.name}
                </span>
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
                  Attempt Drill <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
