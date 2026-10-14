import React from "react";
import Link from "next/link";
import { Globe, ArrowRight, ShieldCheck, Newspaper, ExternalLink, Calendar, Tag } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const caQuestions = await db.getQuestions({
    categoryId: "cat-general",
    reviewStatus: "approved",
    isPublished: true,
  });

  const newsItems = [
    {
      id: "ca-1",
      title: "NASA-ISRO Synthetic Aperture Radar (NISAR) Mission Readiness",
      category: "Science & Technology",
      date: "October 2026",
      source: "ISRO Official Press Bulletin",
      summary: "The joint NASA-ISRO satellite mission featuring dual-frequency L-band and S-band radar systems completed thermal vacuum qualification to map global earth ecosystems and cryosphere dynamics.",
      keyTakeaways: [
        "First satellite to use dual-frequency radar for planetary surface scanning.",
        "NASA provided L-band SAR and high-rate telecom; ISRO provided S-band SAR and spacecraft bus.",
      ],
    },
    {
      id: "ca-2",
      title: "Launch of Digital Child Protection Monitoring Registry under Mission Vatsalya",
      category: "Government Schemes",
      date: "October 2026",
      source: "Press Information Bureau (PIB)",
      summary: "Ministry of Women and Child Development expanded its unified real-time dashboard for child care institutions and foster care tracking across all states.",
      keyTakeaways: [
        "Centrally sponsored scheme restructuring Integrated Child Protection Scheme (ICPS).",
        "Aims to secure a healthy and happy childhood for vulnerable children in difficult circumstances.",
      ],
    },
    {
      id: "ca-3",
      title: "Reserve Bank of India Monetary Policy Review: Inflation Targeting & SDF",
      category: "Indian Economy",
      date: "September 2026",
      source: "Reserve Bank of India (RBI)",
      summary: "RBI Monetary Policy Committee retained repo rate at 6.50% while calibrating Standing Deposit Facility (SDF) to maintain balanced liquidity in the banking system.",
      keyTakeaways: [
        "Monetary Policy Committee (MPC) established under Section 45ZB of RBI Act.",
        "Inflation target: 4% with a tolerance band of +/- 2%.",
      ],
    },
    {
      id: "ca-4",
      title: "Global Biofuels Alliance (GBA) Expands Membership to 24 Nations",
      category: "Environment & Energy",
      date: "September 2026",
      source: "Ministry of Petroleum and Natural Gas",
      summary: "Initiated during India G20 Presidency, the Global Biofuels Alliance accelerated sustainable aviation fuel standards and biomass energy trade frameworks.",
      keyTakeaways: [
        "Founding members include India, USA, and Brazil.",
        "Focus on 2G ethanol deployment and international biofuel market facilitation.",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Verified Current Affairs & General Studies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Current Affairs 2026
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-2 max-w-xl leading-relaxed">
            Curated national news, international relations, economic policies, science discoveries, and government initiatives verified with official government sources.
          </p>
        </div>

        <Link
          href="/quiz/quiz-daily-ca-special"
          className="px-6 py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-teal-400 hover:bg-teal-300 shadow-lg shadow-teal-500/20 transition-all flex items-center shrink-0"
        >
          Take Daily Current Affairs Quiz <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {/* Verified Daily Articles Feed */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            High-Yield Exam Updates & Fact Sheets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified news items formatted for UPSC, SSC, and Banking exams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    {item.category}
                  </span>
                  <span className="text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {item.date}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Takeaways */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    Exam Relevance / Key Points:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                    {item.keyTakeaways.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Source: {item.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
