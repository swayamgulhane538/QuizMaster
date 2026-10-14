import { describe, it, expect } from "vitest";
import { validatePhoneNumber, maskPhoneNumber, hashOtp } from "../../src/lib/auth/sms-service";

describe("Phone Validator & SMS Helper Tests", () => {
  it("should validate correct 10-digit Indian phone numbers with +91", () => {
    const result = validatePhoneNumber("+91", "9876543210");
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe("+919876543210");
  });

  it("should reject Indian phone numbers not starting with 6, 7, 8, or 9", () => {
    const result = validatePhoneNumber("+91", "1234567890");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("must start with 6, 7, 8, or 9");
  });

  it("should reject Indian phone numbers with incorrect digit length", () => {
    const shortResult = validatePhoneNumber("+91", "987654321");
    expect(shortResult.valid).toBe(false);

    const longResult = validatePhoneNumber("+91", "987654321012");
    expect(longResult.valid).toBe(false);
  });

  it("should mask phone numbers for student privacy", () => {
    const masked = maskPhoneNumber("+919876543210");
    expect(masked).toContain("+91");
    expect(masked).toContain("10");
    expect(masked).toContain("•");
    expect(masked).not.toBe("+919876543210");
  });

  it("should generate deterministic SHA-256 OTP hashes", () => {
    const hash1 = hashOtp("123456");
    const hash2 = hashOtp("123456");
    const hash3 = hashOtp("654321");
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });
});
