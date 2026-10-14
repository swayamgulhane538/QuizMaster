import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, timeTakenSeconds = 0, answers = [] } = body;

    if (!attemptId) {
      return NextResponse.json({ error: "attemptId is required" }, { status: 400 });
    }

    const completedAttempt = await db.submitQuizAttempt(attemptId, timeTakenSeconds, answers);

    return NextResponse.json({
      success: true,
      attempt: completedAttempt,
    });
  } catch (err: any) {
    console.error("quiz/submit error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit quiz" }, { status: 500 });
  }
}
