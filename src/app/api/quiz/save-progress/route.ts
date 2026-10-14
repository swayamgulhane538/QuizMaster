import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { attemptId, answers } = body;

    if (!attemptId || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const saved = await db.saveAttemptProgress(attemptId, answers);
    return NextResponse.json({ success: saved });
  } catch (err: any) {
    console.error("save-progress error:", err);
    return NextResponse.json({ error: "Failed to autosave progress" }, { status: 500 });
  }
}
