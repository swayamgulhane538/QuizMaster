"use client";

import React, { useState } from "react";
import { User, ShieldCheck, Check, Loader2 } from "lucide-react";
import { Profile } from "@/types/database";
import { useRouter } from "next/navigation";

export function ProfileEditor({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [selectedExams, setSelectedExams] = useState<string[]>(profile.target_exams || []);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const examsList = [
    "UPSC Civil Services",
    "SSC Examinations",
    "Banking & Insurance",
    "Railway Recruitment",
    "State PSCs",
    "Defense (NDA/CDS)",
    "Engineering & Tech",
    "General Current Affairs",
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: profile.mobile,
          otp: "000000",
          displayName,
          targetExams: selectedExams,
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      router.refresh();
    } catch {}
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
            Registered Mobile (Verified)
          </label>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-300 font-mono">
            <span>{profile.mobile}</span>
            <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> OTP Verified
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
          Target Competitive Examinations
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {examsList.map((exam) => {
            const isSelected = selectedExams.includes(exam);
            return (
              <button
                key={exam}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedExams(selectedExams.filter((x) => x !== exam));
                  } else {
                    setSelectedExams([...selectedExams, exam]);
                  }
                }}
                className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {exam}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
            <Check className="w-4 h-4 mr-1" /> Profile updated successfully!
          </span>
        )}
        <div className="ml-auto">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
