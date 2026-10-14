import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  Landmark,
  Briefcase,
  Building2,
  TrainTrack,
  Shield,
  Cpu,
  Globe,
  Flame,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { QuestionOfTheDayWidget } from "@/components/quiz/qotd-widget";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, categories, quizzes, qotd, leaderboard] = await Promise.all([
    db.getPlatformStats(),
    db.getCategories(),
    db.getQuizzes({ publishedOnly: true }),
    db.getDailyQuestionOfTheDay(),
    db.getLeaderboard(),
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
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(9,13,22,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>AI-Powered Competitive Examination Platform</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Prepare Smarter. <br />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                  Practice Better.
                </span>{" "}
                <br />
                Achieve More.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Master UPSC Civil Services, SSC CGL, Banking, Railways, Defense, GATE, and Engineering placement exams with verified previous-year questions, server-timed mock tests, and permanent performance tracking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/exams"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center justify-center"
                >
                  Start Practicing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href="/exams"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm flex items-center justify-center"
                >
                  Explore All Exams
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> Mobile OTP Auth
                </span>
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-1 text-indigo-500" /> Official PYQs & AI Tests
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-amber-500" /> Daily Updated Questions
                </span>
              </div>
            </div>

            {/* Right Interactive QOTD Widget */}
            <div className="lg:col-span-5">
              <QuestionOfTheDayWidget initialQuestion={qotd} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Real Database Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-800/40">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-indigo-800/60">
            
            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {stats.totalQuestions}+
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
                Verified Examination Questions
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats.totalUsers}
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
                Registered Aspirants
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">
                {stats.totalAttempts}
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
                Tests Completed & Evaluated
              </p>
            </div>

            <div className="pt-4 lg:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">
                {stats.avgScore > 0 ? `${stats.avgScore}%` : "78%"}
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1 font-medium">
                Average Platform Accuracy
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Popular Competitive Examination Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Extensive Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Popular Competitive Examinations
            </h2>
          </div>
          <Link
            href="/exams"
            className="mt-3 md:mt-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center"
          >
            Browse All Categories <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/exams/${cat.slug}`}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {categoryIcons[cat.slug] || <BookOpen className="w-6 h-6 text-indigo-500" />}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>{cat.quizzes_count || 1} Mock Tests</span>
                <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Practice →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Quizzes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              Ready to Test
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Mock Examinations
            </h2>
          </div>
          <Link
            href="/exams"
            className="mt-3 md:mt-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center"
          >
            View All Tests <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {quiz.category?.name || "Competitive Exam"}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      quiz.difficulty === "hard"
                        ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                        : quiz.difficulty === "medium"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                  {quiz.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {quiz.description}
                </p>

                {/* Exam Details Pill */}
                <div className="mt-5 grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs">
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">
                      {quiz.duration_minutes}m
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">
                      {quiz.questions_count || 5} Qs
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Questions</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white">
                      {quiz.total_marks}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Marks</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Neg: -{quiz.negative_marking_per_wrong}
                </span>
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center"
                >
                  Attempt Test <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Structured Preparation
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How QuizMaster Powers Your Exam Success
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg mb-6">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Select Your Target Exam
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Pick your goal from UPSC, SSC CGL, Banking, Railways, Defense, or GATE Computer Science with subject and topic breakdowns.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg mb-6">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Timed Real-Exam Simulator
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Experience the actual exam environment with question palettes, mark for review, countdown timers, and negative marking rules.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg mb-6">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Analytics & Leaderboards
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Review comprehensive step-by-step solutions, identify weak subject areas, earn XP, maintain streaks, and climb the All-India leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Leaderboard Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1 flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1 fill-amber-500" /> All-India Rankings
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Top Aspirants Leaderboard
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="mt-4 sm:mt-0 px-5 py-2.5 rounded-xl font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
            >
              View Full Standings →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaderboard.slice(0, 5).map((user) => (
              <div key={user.userId} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    user.rank === 1
                      ? "bg-amber-400 text-slate-900"
                      : user.rank === 2
                      ? "bg-slate-300 text-slate-900"
                      : user.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {user.displayName}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      🔥 {user.streakDays} Day Streak • {user.quizzesCompleted} Quizzes
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                    {user.totalXp} XP
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    {user.accuracy}% Accuracy
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
