import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to bookmark questions" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId } = body;

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    const result = await db.toggleBookmark(user.id, questionId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}
