import { describe, it, expect } from "vitest";
import { calculateTextSimilarity } from "../../src/lib/ai/question-generator";

describe("Question Duplicate Detection Algorithm", () => {
  it("should identify exact matching questions as duplicates (1.0 similarity)", () => {
    const textA = "Which article of the Constitution of India relates to the Finance Commission?";
    const textB = "Which article of the Constitution of India relates to the Finance Commission?";
    const sim = calculateTextSimilarity(textA, textB);
    expect(sim).toBe(1.0);
  });

  it("should identify near-duplicate questions with minor phrasing changes", () => {
    const textA = "Under Article 21, which of the following rights is guaranteed by the Indian Constitution?";
    const textB = "Which of the following rights is guaranteed under Article 21 of the Indian Constitution?";
    const sim = calculateTextSimilarity(textA, textB);
    expect(sim).toBeGreaterThan(0.75);
  });

  it("should distinguish completely different exam questions", () => {
    const textA = "What is the worst-case time complexity of inserting n keys into an AVL tree?";
    const textB = "A shopkeeper sells an article at a discount of 15% on marked price.";
    const sim = calculateTextSimilarity(textA, textB);
    expect(sim).toBeLessThan(0.2);
  });
});
