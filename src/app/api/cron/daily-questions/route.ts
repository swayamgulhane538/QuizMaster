import { NextResponse } from "next/server";
import { QuestionGenerator } from "@/lib/ai/question-generator";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  return handleDailyCron(req);
}

export async function POST(req: Request) {
  return handleDailyCron(req);
}

async function handleDailyCron(req: Request) {
  const url = new URL(req.url);
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || url.searchParams.get("token");
  const expectedSecret = process.env.CRON_SECRET || "quizmaster-secure-cron-token-2026";

  if (token !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

  const job = await db.logJob("daily_question_import", "started");

  try {
    const categories = await db.getCategories();
    let totalImported = 0;
    let totalSkipped = 0;
    const summary: Record<string, any> = {};

    for (const cat of categories) {
      const result = await QuestionGenerator.generateQuestionsForCategory(cat.slug, 3, false);
      totalImported += result.imported;
      totalSkipped += result.skipped;
      summary[cat.slug] = result;
    }

    await db.logJob("daily_question_import", "success", totalImported, totalSkipped, summary);

    return NextResponse.json({
      success: true,
      message: `Daily question import completed successfully: ${totalImported} imported, ${totalSkipped} duplicates skipped.`,
      imported: totalImported,
      skipped: totalSkipped,
      details: summary,
    });
  } catch (err: any) {
    console.error("Cron job error:", err);
    await db.logJob("daily_question_import", "failed", 0, 0, {}, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
