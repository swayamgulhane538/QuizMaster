import React from "react";
import { db } from "@/lib/db";
import { CsvImporter } from "@/components/admin/csv-importer";
import { ApprovalQueue } from "@/components/admin/approval-queue";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const [categories, pending] = await Promise.all([
    db.getCategories(),
    db.getQuestions({ reviewStatus: "pending" }),
  ]);

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Question Bank Management & Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Approve AI generated practice questions and bulk import questions via CSV
        </p>
      </div>

      {/* CSV Bulk Importer */}
      <CsvImporter categories={categories} />

      {/* AI Question Approvals Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            AI Generated Questions Awaiting Approval ({pending.length})
          </h2>
          <span className="text-xs text-slate-400">
            Unpublished until approved
          </span>
        </div>

        <ApprovalQueue initialQuestions={pending} />
      </div>

    </div>
  );
}
