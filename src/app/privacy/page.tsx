import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          At QuizMaster, we respect and safeguard your privacy. This policy outlines how we collect, store, and protect your information.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Information Collection</h3>
        <p>
          We collect your mobile phone number for secure OTP authentication, display name, and examination preferences. Private phone numbers are never revealed publicly on leaderboards.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Data Persistence & Security</h3>
        <p>
          Examination attempts, submitted answers, scores, and bookmarks are permanently stored in encrypted database tables with strict Row Level Security (RLS) policies.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Third-Party Integrations</h3>
        <p>
          We integrate standard SMS gateways (e.g. Twilio, MSG91, Fast2SMS) strictly to deliver verification OTPs. We never sell or distribute student data.
        </p>
      </div>
    </div>
  );
}
