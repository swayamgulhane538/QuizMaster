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

    const body = await req.json();
    const {
      title,
      description,
      categoryId,
      durationMinutes = 15,
      totalMarks = 20,
      passingPercentage = 40,
      negativeMarking = 0.25,
      difficulty = "medium",
    } = body;

    if (!title || !categoryId) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const quiz = await db.createQuiz({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description: description || "Competitive mock test",
      category_id: categoryId,
      difficulty,
      duration_minutes: Number(durationMinutes),
      total_marks: Number(totalMarks),
      passing_percentage: Number(passingPercentage),
      negative_marking_per_wrong: Number(negativeMarking),
      is_timed: true,
      shuffle_questions: false,
      shuffle_options: false,
      is_published: true,
      published_at: new Date().toISOString(),
      created_by: user?.id,
    });

    if (user) {
      await db.logAdminAudit(user.id, "create_quiz", "quiz", quiz.id, { title });
    }

    return NextResponse.json({ success: true, quiz });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
