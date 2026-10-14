import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { Bookmark, Award, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookmarks = await db.getBookmarks(user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Account Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, target exams, and review saved questions
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Profile Information
        </h2>
        <ProfileEditor profile={user} />
      </div>

      {/* Bookmarks Section */}
      <div id="bookmarks" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <Bookmark className="w-5 h-5 mr-2 text-amber-500 fill-amber-500" />
            Saved Questions & Bookmarks ({bookmarks.length})
          </h2>
          <span className="text-xs text-slate-400">
            Available anytime for offline revision
          </span>
        </div>

        {bookmarks.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No saved questions yet. Click the bookmark icon on any test result screen to save questions here!
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                  {bm.question?.source_reference || "Competitive Exam Question"}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {bm.question?.question_text}
                </h3>
                {bm.question?.explanation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl leading-relaxed">
                    💡 {bm.question?.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
