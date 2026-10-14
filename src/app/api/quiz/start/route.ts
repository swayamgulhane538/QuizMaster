import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { quizId } = body;

    if (!quizId) {
      return NextResponse.json({ error: "quizId is required" }, { status: 400 });
    }

    const quiz = await db.getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Default to guest/demo user if not logged in
    const userId = user?.id || "guest-user-default";

    // Start or restore attempt
    const attempt = await db.startQuizAttempt(userId, quiz.id);

    // Get questions with correct answers HIDDEN for test security
    const questions = await db.getQuestions({
      quizId: quiz.id,
      hideCorrectAnswers: true,
      reviewStatus: "approved",
      isPublished: true,
    });

    return NextResponse.json({
      attempt,
      quiz,
      questions,
    });
  } catch (err: any) {
    console.error("quiz/start error:", err);
    return NextResponse.json({ error: err.message || "Failed to start quiz" }, { status: 500 });
  }
}
