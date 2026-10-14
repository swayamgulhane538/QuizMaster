import { db } from "@/lib/db";
import { Question } from "@/types/database";

export interface GeneratedQuestionPayload {
  question_text: string;
  category_slug: string;
  subject_slug?: string;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  source_type: "ai_generated" | "current_affairs" | "curated";
  source_reference: string;
  options: {
    option_text: string;
    is_correct: boolean;
  }[];
}

// Compute string similarity using token Jaccard similarity to prevent duplicate questions
export function calculateTextSimilarity(textA: string, textB: string): number {
  const tokenize = (str: string) => {
    return new Set(
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );
  };

  const setA = tokenize(textA);
  const setB = tokenize(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export class QuestionGenerator {
  static async checkIsDuplicate(questionText: string, categoryId: string): Promise<boolean> {
    const existing = await db.getQuestions({ categoryId });
    for (const q of existing) {
      const sim = calculateTextSimilarity(questionText, q.question_text);
      if (sim >= 0.75) {
        return true;
      }
    }
    return false;
  }

  static async generateQuestionsForCategory(
    categorySlug: string,
    targetCount = 5,
    autoApprove = false
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const category = await db.getCategoryBySlug(categorySlug);
    if (!category) {
      throw new Error(`Category ${categorySlug} not found`);
    }

    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    let generatedItems: GeneratedQuestionPayload[] = [];

    // Check if GEMINI_API_KEY is available
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `You are a senior exam paper setter for competitive examination category "${category.name}".
Generate exactly ${targetCount} unique, high-yield multiple-choice practice questions following the latest official exam syllabus.
Output MUST be a valid JSON array of objects with the exact structure:
[
  {
    "question_text": "Detailed question prompt",
    "category_slug": "${categorySlug}",
    "difficulty": "medium",
    "explanation": "Detailed step-by-step conceptual explanation",
    "source_type": "ai_generated",
    "source_reference": "QuizMaster AI Practice Engine 2026",
    "options": [
      { "option_text": "Option A", "is_correct": false },
      { "option_text": "Option B", "is_correct": true },
      { "option_text": "Option C", "is_correct": false },
      { "option_text": "Option D", "is_correct": false }
    ]
  }
]
Rules:
- Exactly 4 options per question.
- Exactly 1 option marked with is_correct: true.
- Return ONLY the pure JSON array, without markdown backticks.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            generatedItems = JSON.parse(rawText);
          }
        }
      } catch (err: any) {
        errors.push(`Gemini API call failed: ${err.message}. Using high-yield curriculum bank.`);
      }
    }

    // High-yield syllabus questions fallback when key not configured or as fallback
    if (generatedItems.length === 0) {
      generatedItems = this.getFallbackQuestionsForCategory(categorySlug, targetCount);
    }

    // Validate, check duplicates, and insert
    for (const item of generatedItems) {
      if (!item.question_text || !item.options || item.options.length !== 4) {
        errors.push(`Invalid question schema for: ${item.question_text?.slice(0, 30)}`);
        skipped++;
        continue;
      }

      const hasCorrect = item.options.some((o) => o.is_correct);
      if (!hasCorrect) {
        errors.push(`No correct option marked for: ${item.question_text?.slice(0, 30)}`);
        skipped++;
        continue;
      }

      const isDup = await this.checkIsDuplicate(item.question_text, category.id);
      if (isDup) {
        skipped++;
        continue;
      }

      await db.createQuestion(
        {
          category_id: category.id,
          question_text: item.question_text,
          question_type: "single_choice",
          marks: 2.0,
          negative_marks: 0.5,
          explanation: item.explanation || "Detailed explanation for this standard exam question.",
          difficulty: item.difficulty || "medium",
          source_type: item.source_type || "ai_generated",
          source_reference: item.source_reference || "QuizMaster AI Practice Engine",
          review_status: autoApprove ? "approved" : "pending",
          is_published: autoApprove,
        },
        item.options.map((o, idx) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
          order_index: idx + 1,
        }))
      );

      imported++;
    }

    return { imported, skipped, errors };
  }

  private static getFallbackQuestionsForCategory(categorySlug: string, count: number): GeneratedQuestionPayload[] {
    const bank: Record<string, GeneratedQuestionPayload[]> = {
      "upsc-civil-services": [
        {
          question_text: "Which of the following constitutional amendments incorporated the 'Right to Education' as a Fundamental Right under Article 21A?",
          category_slug: "upsc-civil-services",
          difficulty: "easy",
          explanation: "The 86th Constitutional Amendment Act, 2002, inserted Article 21A into the Constitution of India to make free and compulsory education for children between the ages of 6 and 14 a Fundamental Right.",
          source_type: "ai_generated",
          source_reference: "QuizMaster AI Practice Bank",
          options: [
            { option_text: "73rd Amendment Act, 1992", is_correct: false },
            { option_text: "86th Amendment Act, 2002", is_correct: true },
            { option_text: "91st Amendment Act, 2003", is_correct: false },
            { option_text: "44th Amendment Act, 1978", is_correct: false },
          ],
        },
        {
          question_text: "With reference to the Indian economy, which of the following is the primary monetary policy tool used by the RBI to absorb surplus liquidity on an overnight basis without collateral?",
          category_slug: "upsc-civil-services",
          difficulty: "hard",
          explanation: "The Standing Deposit Facility (SDF), operationalized by the RBI in 2022 under amended Section 17 of the RBI Act, enables the central bank to absorb surplus liquidity without requiring government securities as collateral.",
          source_type: "ai_generated",
          source_reference: "QuizMaster AI Practice Bank",
          options: [
            { option_text: "Reverse Repo Rate (RRR)", is_correct: false },
            { option_text: "Standing Deposit Facility (SDF)", is_correct: true },
            { option_text: "Marginal Standing Facility (MSF)", is_correct: false },
            { option_text: "Cash Reserve Ratio (CRR)", is_correct: false },
          ],
        },
      ],
      "ssc-exams": [
        {
          question_text: "A sum of money at compound interest doubles itself in 4 years. In how many years will it amount to 8 times itself at the same rate?",
          category_slug: "ssc-exams",
          difficulty: "medium",
          explanation: "If P becomes 2P in 4 years, then it becomes 2^3 P = 8P in 4 * 3 = 12 years.",
          source_type: "ai_generated",
          source_reference: "SSC Quantitative Aptitude Practice",
          options: [
            { option_text: "8 years", is_correct: false },
            { option_text: "12 years", is_correct: true },
            { option_text: "16 years", is_correct: false },
            { option_text: "24 years", is_correct: false },
          ],
        },
      ],
      "engineering-tech": [
        {
          question_text: "In modern operating systems, which scheduling algorithm is provably optimal in minimizing the average waiting time for a given set of processes?",
          category_slug: "engineering-tech",
          difficulty: "medium",
          explanation: "Shortest Job First (SJF) scheduling is provably optimal because moving a short process before a long one decreases the waiting time of the short process more than it increases that of the long process.",
          source_type: "ai_generated",
          source_reference: "GATE Computer Science Operating Systems",
          options: [
            { option_text: "Round Robin (RR)", is_correct: false },
            { option_text: "Shortest Job First (SJF)", is_correct: true },
            { option_text: "First-Come First-Served (FCFS)", is_correct: false },
            { option_text: "Priority Scheduling", is_correct: false },
          ],
        },
      ],
    };

    const items = bank[categorySlug] || bank["upsc-civil-services"];
    return items.slice(0, count);
  }
}
