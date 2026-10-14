import { describe, it, expect } from "vitest";

describe("Server-Side Scoring Engine Tests", () => {
  function calculateScore(
    questions: { id: string; marks: number; negative_marks: number; correct_option_id: string }[],
    answers: { question_id: string; selected_option_id?: string }[],
    passingPercentage: number,
    totalMarks: number
  ) {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    for (const q of questions) {
      const userAns = answers.find((a) => a.question_id === q.id);
      if (!userAns || !userAns.selected_option_id) {
        unansweredCount++;
        continue;
      }

      if (userAns.selected_option_id === q.correct_option_id) {
        score += q.marks;
        correctCount++;
      } else {
        score -= q.negative_marks;
        incorrectCount++;
      }
    }

    const finalScore = Math.max(0, Math.round(score * 100) / 100);
    const percentage = totalMarks > 0 ? Math.round((finalScore / totalMarks) * 10000) / 100 : 0;
    const passed = percentage >= passingPercentage;

    return { finalScore, percentage, passed, correctCount, incorrectCount, unansweredCount };
  }

  const sampleQuestions = [
    { id: "q1", marks: 2, negative_marks: 0.5, correct_option_id: "opt-1-b" },
    { id: "q2", marks: 2, negative_marks: 0.5, correct_option_id: "opt-2-c" },
    { id: "q3", marks: 2, negative_marks: 0.5, correct_option_id: "opt-3-a" },
    { id: "q4", marks: 2, negative_marks: 0.5, correct_option_id: "opt-4-d" },
    { id: "q5", marks: 2, negative_marks: 0.5, correct_option_id: "opt-5-a" },
  ];

  it("should calculate 100% score when all answers are correct", () => {
    const answers = [
      { question_id: "q1", selected_option_id: "opt-1-b" },
      { question_id: "q2", selected_option_id: "opt-2-c" },
      { question_id: "q3", selected_option_id: "opt-3-a" },
      { question_id: "q4", selected_option_id: "opt-4-d" },
      { question_id: "q5", selected_option_id: "opt-5-a" },
    ];

    const result = calculateScore(sampleQuestions, answers, 40, 10);
    expect(result.finalScore).toBe(10);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.correctCount).toBe(5);
    expect(result.incorrectCount).toBe(0);
    expect(result.unansweredCount).toBe(0);
  });

  it("should deduct negative marking for wrong answers and not penalize unattempted questions", () => {
    const answers = [
      { question_id: "q1", selected_option_id: "opt-1-b" }, // +2
      { question_id: "q2", selected_option_id: "opt-2-a" }, // -0.5 (wrong)
      { question_id: "q3", selected_option_id: "opt-3-b" }, // -0.5 (wrong)
      // q4 unattempted => 0
      // q5 unattempted => 0
    ];

    const result = calculateScore(sampleQuestions, answers, 40, 10);
    // Score = 2 - 0.5 - 0.5 = 1.00
    expect(result.finalScore).toBe(1);
    expect(result.percentage).toBe(10);
    expect(result.passed).toBe(false); // 10% < 40%
    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(2);
    expect(result.unansweredCount).toBe(2);
  });

  it("should never return negative final score (clamps to 0)", () => {
    const answers = [
      { question_id: "q1", selected_option_id: "opt-wrong" },
      { question_id: "q2", selected_option_id: "opt-wrong" },
      { question_id: "q3", selected_option_id: "opt-wrong" },
    ];

    const result = calculateScore(sampleQuestions, answers, 40, 10);
    expect(result.finalScore).toBe(0);
  });
});
