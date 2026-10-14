"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { maskPhoneNumber } from "@/lib/auth/phone-utils";

interface OtpModalProps {
  phone: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: any) => void;
  onChangeNumber: () => void;
  initialDevOtp?: string;
}

export function OtpModal({
  phone,
  isOpen,
  onClose,
  onSuccess,
  onChangeNumber,
  initialDevOtp,
}: OtpModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUserStep, setIsNewUserStep] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedExams, setSelectedExams] = useState<string[]>(["UPSC Civil Services"]);
  const [devOtp, setDevOtp] = useState<string | undefined>(initialDevOtp);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialDevOtp) {
      setDevOtp(initialDevOtp);
    }
  }, [initialDevOtp]);

  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleDigitChange = (index: number, val: string) => {
    setError(null);
    const cleaned = val.replace(/[^0-9]/g, "");

    // Handle single digit
    if (cleaned.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      setDigits(newDigits);

      if (cleaned && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (pasted.length >= 6) {
      const newDigits = pasted.slice(0, 6).split("");
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend OTP");
      } else {
        setCountdown(60);
        setDigits(["", "", "", "", "", ""]);
        if (data.devOtp) setDevOtp(data.devOtp);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Network error resending OTP");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = digits.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          otp: otpCode,
          displayName,
          targetExams: selectedExams,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code");
        setLoading(false);
        return;
      }

      if (data.isNewUser && !isNewUserStep) {
        setIsNewUserStep(true);
        setLoading(false);
        return;
      }

      onSuccess(data.profile);
    } catch {
      setError("Network error verifying OTP");
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!displayName.trim()) {
      setError("Please enter your display name");
      return;
    }
    await handleVerify();
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={isNewUserStep ? () => setIsNewUserStep(false) : onChangeNumber}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            {isNewUserStep ? "Back" : "Change Number"}
          </button>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Secure Verification
          </span>
        </div>

        {!isNewUserStep ? (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Number</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                We sent a 6-digit verification code to
              </p>
              <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100 tracking-wide">
                {maskPhoneNumber(phone)}
              </div>
            </div>

            {/* Test Mode Banner */}
            {devOtp && (
              <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
                    Auto-Detected Test OTP:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDigits(devOtp.split(""));
                      inputRefs.current[5]?.focus();
                    }}
                    className="underline font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80"
                  >
                    Auto-Fill ({devOtp})
                  </button>
                </div>
              </div>
            )}

            {/* OTP Digits Input */}
            <div className="flex justify-between gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-sm focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-medium text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || digits.join("").length !== 6}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying OTP...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>

            {/* Resend Countdown */}
            <div className="mt-6 text-center">
              {countdown > 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Resend OTP in <span className="font-semibold text-slate-700 dark:text-slate-300">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${resending ? "animate-spin" : ""}`} />
                  Resend OTP Code
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Profile completion for new student */
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Your Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tell us about your examination preparation goals
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Target Examinations
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
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
                        className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {exam}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-medium text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleCompleteRegistration}
              disabled={loading || !displayName.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Save Profile & Enter Platform"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
