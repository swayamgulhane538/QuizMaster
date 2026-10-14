"use client";

import React, { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ExamCategory } from "@/types/database";
import { useRouter } from "next/navigation";

export function CsvImporter({ categories }: { categories: ExamCategory[] }) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const sampleCsv = `question_text,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty
"Which schedule of the Indian Constitution relates to official languages?","Seventh","Eighth","Ninth","Tenth","B","The Eighth Schedule lists the 22 official languages of India.","easy"
"What is the time complexity of QuickSort in the worst case?","O(n)","O(n log n)","O(n^2)","O(log n)","C","Worst case occurs when the chosen pivot is always the extreme element, leading to O(n^2).","medium"`;

  const handleImport = async () => {
    if (!csvText.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/questions/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText, categoryId }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ imported: data.imported, errors: data.errors || [] });
        if (data.imported > 0) {
          router.refresh();
        }
      } else {
        setResult({ imported: 0, errors: [data.error || "Import failed"] });
      }
    } catch {
      setResult({ imported: 0, errors: ["Network error during import"] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center">
            <Upload className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
            Bulk CSV Question Importer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Import batches of verified questions with answer keys and explanations
          </p>
        </div>

        <button
          onClick={() => setCsvText(sampleCsv)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Load Sample Format
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
          Select Target Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
          Paste CSV Content
        </label>
        <textarea
          rows={6}
          placeholder="question_text,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full font-mono text-xs p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white outline-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          Columns: question_text, option_a, option_b, option_c, option_d, correct_option (A/B/C/D), explanation, difficulty
        </p>
      </div>

      {result && (
        <div className={`p-4 rounded-xl text-xs space-y-1 ${
          result.imported > 0
            ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
        }`}>
          <div className="font-bold flex items-center">
            {result.imported > 0 ? (
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-1.5" />
            )}
            Successfully imported {result.imported} questions!
          </div>
          {result.errors.length > 0 && (
            <ul className="list-disc list-inside mt-2 text-[11px] text-red-600 dark:text-red-400">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={loading || !csvText.trim()}
        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Validating & Importing...
          </>
        ) : (
          "Process & Import Questions"
        )}
      </button>
    </div>
  );
}
