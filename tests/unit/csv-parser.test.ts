import { describe, it, expect } from "vitest";

describe("CSV Question Importer Parsing Logic", () => {
  function parseCsvRows(csvText: string) {
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) return { parsed: [], errors: ["Empty CSV"] };

    const parsed: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const delimiter = line.includes("|") ? "|" : ",";
      const parts = line.split(delimiter).map((s) => s.trim().replace(/^"|"$/g, ""));

      if (parts.length < 6) {
        errors.push(`Row ${i + 1}: Insufficient columns`);
        continue;
      }

      const [questionText, optA, optB, optC, optD, correctChar, explanation = "", diff = "medium"] = parts;
      const upper = (correctChar || "").toUpperCase();
      if (!["A", "B", "C", "D"].includes(upper)) {
        errors.push(`Row ${i + 1}: Invalid correct option '${correctChar}'`);
        continue;
      }

      parsed.push({ questionText, optA, optB, optC, optD, correct: upper, explanation, diff });
    }

    return { parsed, errors };
  }

  it("should parse valid CSV rows accurately", () => {
    const csv = `question,a,b,c,d,correct,explanation,diff
"What is 2+2?","1","2","4","5","C","Basic math","easy"
"Capital of India?","Mumbai","New Delhi","Kolkata","Chennai","B","Administrative capital","easy"`;

    const result = parseCsvRows(csv);
    expect(result.errors.length).toBe(0);
    expect(result.parsed.length).toBe(2);
    expect(result.parsed[0].correct).toBe("C");
    expect(result.parsed[1].correct).toBe("B");
  });

  it("should reject rows with invalid correct option characters", () => {
    const csv = `question,a,b,c,d,correct,explanation,diff
"Invalid test?","1","2","3","4","Z","No Z option","hard"`;

    const result = parseCsvRows(csv);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("Invalid correct option 'Z'");
    expect(result.parsed.length).toBe(0);
  });
});
