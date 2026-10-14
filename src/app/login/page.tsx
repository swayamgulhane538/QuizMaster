"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Phone, ArrowRight, Shield, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { OtpModal } from "@/components/auth/otp-modal";

const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)", flag: "🇮🇳" },
  { code: "+1", label: "United States (+1)", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom (+44)", flag: "🇬🇧" },
  { code: "+971", label: "UAE (+971)", flag: "🇦🇪" },
  { code: "+65", label: "Singapore (+65)", flag: "🇸🇬" },
  { code: "+61", label: "Australia (+61)", flag: "🇦🇺" },
];

export default function LoginPage() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [fullPhone, setFullPhone] = useState<string>("");
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      setError("Please enter your mobile number");
      return;
    }

    if (countryCode === "+91" && cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode, phone: cleanPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP code");
        setLoading(false);
        return;
      }

      setFullPhone(data.normalizedPhone);
      setDevOtp(data.devOtp);
      setOtpModalOpen(true);
    } catch {
      setError("Network error while connecting to authentication service");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (profile: any) => {
    setOtpModalOpen(false);
    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-900 dark:from-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
              QuizMaster
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 sm:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400" />

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
              <Phone className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Log in or register with your mobile number via OTP
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Mobile Number
              </label>
              
              <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent px-3 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-300 dark:border-slate-700 outline-none cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3.5 text-sm font-medium bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  maxLength={15}
                />
              </div>

              {countryCode === "+91" && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 pl-1">
                  Indian standard format (e.g. 98765 43210)
                </p>
              )}
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !phoneNumber.trim()}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Requesting SMS OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <span>Quick Test Access:</span>
              <button
                type="button"
                onClick={() => {
                  setPhoneNumber("9876543210");
                  setCountryCode("+91");
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                Use Admin Demo Number
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
              New mobile numbers automatically trigger student onboarding. Existing numbers restore test history & rankings.
            </p>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            By continuing, you agree to QuizMaster&apos;s{" "}
            <Link href="/terms" className="underline hover:text-indigo-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-indigo-600">
              Privacy Policy
            </Link>.
          </div>
        </div>
      </main>

      {/* Verification Modal */}
      <OtpModal
        phone={fullPhone}
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onChangeNumber={() => setOtpModalOpen(false)}
        initialDevOtp={devOtp}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-500">
        QuizMaster © 2026. AI-Powered Online Examination Platform.
      </footer>
    </div>
  );
}
