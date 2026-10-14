import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          Welcome to QuizMaster. By accessing or using our platform, mobile number authentication, or mock examination services, you agree to be bound by these Terms of Service.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Use of the Platform</h3>
        <p>
          QuizMaster provides educational examination preparation tools, mock tests, and performance analytics for competitive examinations including UPSC, SSC, Banking, Railways, and GATE.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Account & Security</h3>
        <p>
          Users authenticate using mobile numbers and one-time passwords (OTP). You are responsible for maintaining the confidentiality of your credentials and account access.
        </p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Intellectual Property</h3>
        <p>
          All mock test questions, conceptual explanations, software algorithms, and analytics dashboards are protected by copyright and intellectual property laws.
        </p>
      </div>
    </div>
  );
}
