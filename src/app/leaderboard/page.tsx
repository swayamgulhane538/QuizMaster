import React from "react";
import Link from "next/link";
import { Award, Flame, Sparkles, Trophy, Medal, ShieldCheck, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { INITIAL_ACHIEVEMENTS } from "@/lib/db/seed-data";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = await db.getCategories();
  const standings = await db.getLeaderboard(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Trophy className="w-3.5 h-3.5" />
          <span>All-India Aspirant Rankings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          QuizMaster Hall of Fame
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Rankings are calculated dynamically from validated exam scores, study streaks, and accuracy indices.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        <Link
          href="/leaderboard"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !category
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          All Examinations
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/leaderboard?category=${cat.id}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === cat.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat.name.split(" ")[0]}
          </Link>
        ))}
      </div>

      {/* Standings Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            Top Ranked Aspirants
          </h2>
          <span className="text-xs text-slate-400">
            Updated in real-time
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {standings.map((user) => (
            <div
              key={user.userId}
              className={`p-4 sm:p-5 flex items-center justify-between transition-colors ${
                user.rank <= 3
                  ? "bg-amber-50/20 dark:bg-amber-950/10"
                  : "hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                    user.rank === 1
                      ? "bg-amber-400 text-slate-950 ring-4 ring-amber-400/20"
                      : user.rank === 2
                      ? "bg-slate-300 text-slate-950 ring-4 ring-slate-300/20"
                      : user.rank === 3
                      ? "bg-amber-700 text-white ring-4 ring-amber-700/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {user.rank}
                </div>

                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center">
                    {user.displayName}
                    {user.rank === 1 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-600 dark:text-amber-400">
                        Top Ranker
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center">
                      <Flame className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" />
                      {user.streakDays} Day Streak
                    </span>
                    <span>•</span>
                    <span>{user.quizzesCompleted} Quizzes Attempted</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {user.totalXp} XP
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {user.accuracy}% Accuracy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification Achievements Gallery */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Platform Achievement Badges
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Unlock XP rewards and exclusive badges by completing mock milestones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start space-x-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {ach.title}
                  </h4>
                  <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                    +{ach.xp_reward} XP
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
