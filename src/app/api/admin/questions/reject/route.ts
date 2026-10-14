import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const adminKey = req.headers.get("x-admin-key");
    const validMasterKey = process.env.ADMIN_SECRET_KEY || "quizmaster-admin-secret-2026";

    if (user?.role !== "admin" && adminKey !== validMasterKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { questionId } = await req.json();
    const ok = await db.updateQuestionStatus(questionId, "rejected", false);

    if (user) {
      await db.logAdminAudit(user.id, "reject_question", "question", questionId);
    }

    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
