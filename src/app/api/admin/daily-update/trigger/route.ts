import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { QuestionGenerator } from "@/lib/ai/question-generator";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    // Allow if user is admin or if admin key header is supplied
    const authHeader = req.headers.get("x-admin-key");
    const adminKey = process.env.ADMIN_SECRET_KEY || "quizmaster-admin-secret-2026";

    if (user?.role !== "admin" && authHeader !== adminKey) {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { categorySlug = "upsc-civil-services", targetCount = 5, autoApprove = false } = body;

    const result = await QuestionGenerator.generateQuestionsForCategory(categorySlug, targetCount, autoApprove);

    await db.logJob(`manual_trigger_${categorySlug}`, "success", result.imported, result.skipped, result);

    if (user) {
      await db.logAdminAudit(user.id, "trigger_daily_update", "category", categorySlug, result);
    }

    return NextResponse.json({
      success: true,
      message: `Update triggered: ${result.imported} new questions generated, ${result.skipped} duplicates skipped.`,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to trigger daily update" }, { status: 500 });
  }
}
