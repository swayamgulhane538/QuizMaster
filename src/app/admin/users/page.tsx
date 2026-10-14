import React from "react";
import { db } from "@/lib/db";
import { Users, Shield, Flame, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const profiles = await db.getAllProfiles();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Registered Aspirants & Roles ({profiles.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inspect registered mobile accounts, role authorizations, and participation records
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {profiles.map((p) => (
            <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img src={p.avatar_url} alt={p.display_name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center">
                    {p.display_name}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.role === "admin"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {p.role}
                    </span>
                  </h3>
                  <p className="text-slate-400 mt-0.5">
                    Mobile: {p.mobile} • Target: {p.target_exams.join(", ") || "General"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-right">
                <div>
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400 block">
                    {p.total_xp} XP
                  </span>
                  <span className="text-slate-400 flex items-center justify-end">
                    <Flame className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                    {p.streak_days} Day Streak
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
