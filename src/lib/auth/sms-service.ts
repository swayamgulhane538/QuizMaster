import crypto from "crypto";
import { db } from "@/lib/db";
import { validatePhoneNumber, maskPhoneNumber } from "./phone-utils";

export { validatePhoneNumber, maskPhoneNumber };

export interface SendOtpResult {
  success: boolean;
  message: string;
  devOtp?: string;
  cooldownSeconds?: number;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  isNewUser?: boolean;
  profile?: any;
}

const OTP_EXPIRY_MINUTES = 5;
const HASH_SALT = process.env.AUTH_SECRET || "quizmaster-secret-salt-2026";

export function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", HASH_SALT).update(otp).digest("hex");
}

export class SmsService {
  private static generateOtpCode(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }

  static async sendOtp(normalizedPhone: string): Promise<SendOtpResult> {
    const otp = this.generateOtpCode();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Persist OTP record in permanent database
    await db.saveOtp(normalizedPhone, otpHash, expiresAt);

    const provider = process.env.SMS_PROVIDER || "development";

    // 1. Twilio Provider
    if (provider === "twilio" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
        const body = new URLSearchParams({
          To: normalizedPhone,
          From: process.env.TWILIO_PHONE_NUMBER || "",
          Body: `Your QuizMaster verification code is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`,
        });

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("Twilio SMS send error:", errText);
          return { success: false, message: "Failed to dispatch SMS via Twilio. Check provider configuration." };
        }

        return { success: true, message: `OTP sent successfully via SMS to ${maskPhoneNumber(normalizedPhone)}` };
      } catch (err: any) {
        console.error("Twilio network error:", err);
        return { success: false, message: "Network error contacting SMS gateway." };
      }
    }

    // 2. Fast2SMS Provider (for Indian Numbers)
    if (provider === "fast2sms" && process.env.FAST2SMS_API_KEY) {
      try {
        const rawNumber = normalizedPhone.replace("+91", "");
        const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variables_values: otp,
            route: "otp",
            numbers: rawNumber,
          }),
        });
        const data = await res.json();
        if (!data.return) {
          return { success: false, message: data.message || "Fast2SMS delivery failed." };
        }
        return { success: true, message: `OTP sent successfully via SMS to ${maskPhoneNumber(normalizedPhone)}` };
      } catch (err: any) {
        return { success: false, message: "Fast2SMS connection failed." };
      }
    }

    // 3. MSG91 Provider
    if (provider === "msg91" && process.env.MSG91_AUTH_KEY) {
      try {
        const rawNumber = normalizedPhone.replace("+", "");
        const res = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${rawNumber}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`, {
          method: "POST",
        });
        const data = await res.json();
        if (data.type !== "success") {
          return { success: false, message: data.message || "MSG91 delivery failed." };
        }
        return { success: true, message: `OTP sent successfully via SMS to ${maskPhoneNumber(normalizedPhone)}` };
      } catch (err: any) {
        return { success: false, message: "MSG91 connection failed." };
      }
    }

    // 4. Development / Test Mode fallback
    console.log(`\n======================================================`);
    console.log(`[QUIZMASTER AUTH] SMS OTP for ${normalizedPhone}: >>> ${otp} <<<`);
    console.log(`[QUIZMASTER AUTH] Valid for 5 minutes. (Provider: ${provider})`);
    console.log(`======================================================\n`);

    return {
      success: true,
      message: `OTP sent to ${maskPhoneNumber(normalizedPhone)} (Test Mode Active)`,
      devOtp: otp,
      cooldownSeconds: 60,
    };
  }

  static async verifyOtp(normalizedPhone: string, otpCode: string): Promise<VerifyOtpResult> {
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return { success: false, message: "OTP must be a valid 6-digit numeric code" };
    }

    const verification = await db.verifyOtpHash(normalizedPhone, (storedHash) => {
      const computedHash = hashOtp(cleanOtp);
      return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(computedHash));
    });

    if (!verification.success) {
      return { success: false, message: verification.message || "Invalid OTP code" };
    }

    // Check if profile exists
    const existingProfile = await db.getProfileByMobile(normalizedPhone);
    if (existingProfile) {
      return {
        success: true,
        message: "Verification successful. Welcome back!",
        isNewUser: false,
        profile: existingProfile,
      };
    }

    return {
      success: true,
      message: "Mobile verified. Please complete your profile to continue.",
      isNewUser: true,
    };
  }
}