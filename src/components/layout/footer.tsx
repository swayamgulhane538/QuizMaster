import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Database, Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                QuizMaster
              </span>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              QuizMaster is a production-grade competitive examination preparation platform.
              Powered by permanent PostgreSQL database persistence, mobile OTP authentication,
              and daily updated official-pattern mock tests.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Database className="w-3 h-3 mr-1" />
                Persistent PostgreSQL
              </span>
              <span className="inline-flex items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Mobile OTP Verified
              </span>
            </div>
          </div>

          {/* Exam Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Competitive Exams
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/exams/upsc-civil-services" className="hover:text-indigo-600 dark:hover:text-indigo-400">UPSC Civil Services</Link></li>
              <li><Link href="/exams/ssc-exams" className="hover:text-indigo-600 dark:hover:text-indigo-400">SSC CGL & CHSL</Link></li>
              <li><Link href="/exams/banking-insurance" className="hover:text-indigo-600 dark:hover:text-indigo-400">Banking (IBPS / SBI PO)</Link></li>
              <li><Link href="/exams/railways-rrb" className="hover:text-indigo-600 dark:hover:text-indigo-400">Railways RRB NTPC</Link></li>
              <li><Link href="/exams/defense-nda-cds" className="hover:text-indigo-600 dark:hover:text-indigo-400">Defense (NDA & CDS)</Link></li>
              <li><Link href="/exams/engineering-tech" className="hover:text-indigo-600 dark:hover:text-indigo-400">GATE Computer Science</Link></li>
            </ul>
          </div>

          {/* Practice Sections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Practice & Prep
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/daily-practice" className="hover:text-indigo-600 dark:hover:text-indigo-400">Question of the Day</Link></li>
              <li><Link href="/current-affairs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Current Affairs 2026</Link></li>
              <li><Link href="/leaderboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">All-India Leaderboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Performance Analytics</Link></li>
              <li><Link href="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400">Saved Bookmarks</Link></li>
            </ul>
          </div>

          {/* Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400">Admin Control Panel</Link></li>
              <li><a href="mailto:support@quizmaster.edu" className="hover:text-indigo-600 dark:hover:text-indigo-400">support@quizmaster.edu</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 QuizMaster Online Examination Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Built for competitive examination aspirants with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
