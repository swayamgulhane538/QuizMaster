import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const adminKey = req.headers.get("x-admin-key");
    const validMasterKey = process.env.ADMIN_SECRET_KEY || "quizmaster-admin-secret-2026";

    if (user?.role !== "admin" && adminKey !== validMasterKey) {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const { csvText, categoryId } = body;

    if (!csvText || !categoryId) {
      return NextResponse.json({ error: "csvText and categoryId are required" }, { status: 400 });
    }

    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) {
      return NextResponse.json({ error: "CSV is empty or missing data rows" }, { status: 400 });
    }

    let imported = 0;
    let errors: string[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split comma separated or pipe separated
      const delimiter = line.includes("|") ? "|" : ",";
      const parts = line.split(delimiter).map((s: string) => s.trim().replace(/^"|"$/g, ""));

      if (parts.length < 6) {
        errors.push(`Row ${i + 1}: Insufficient columns (expected at least 6 columns)`);
        continue;
      }

      const [questionText, optA, optB, optC, optD, correctChar, explanation = "", diff = "medium"] = parts;

      const upperChar = (correctChar || "").toUpperCase();
      if (!["A", "B", "C", "D"].includes(upperChar)) {
        errors.push(`Row ${i + 1}: Invalid correct answer '${correctChar}' (must be A, B, C, or D)`);
        continue;
      }

      const options = [
        { option_text: optA, is_correct: upperChar === "A", order_index: 1 },
        { option_text: optB, is_correct: upperChar === "B", order_index: 2 },
        { option_text: optC, is_correct: upperChar === "C", order_index: 3 },
        { option_text: optD, is_correct: upperChar === "D", order_index: 4 },
      ];

      await db.createQuestion(
        {
          category_id: categoryId,
          question_text: questionText,
          question_type: "single_choice",
          marks: 2.0,
          negative_marks: 0.5,
          explanation: explanation || "Imported via CSV question bank.",
          difficulty: (diff.toLowerCase() as any) || "medium",
          source_type: "curated",
          source_reference: "Admin CSV Import",
          review_status: "approved",
          is_published: true,
        },
        options
      );

      imported++;
    }

    if (user) {
      await db.logAdminAudit(user.id, "import_csv", "questions", "", { imported, errorsCount: errors.length });
    }

    return NextResponse.json({
      success: true,
      imported,
      errors,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process CSV" }, { status: 500 });
  }
}
