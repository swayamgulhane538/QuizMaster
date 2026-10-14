import { NextResponse } from "next/server";
import { SmsService } from "@/lib/auth/sms-service";
import { db } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp, displayName, targetExams } = body;

    if (!phone || !otp) {
      return NextResponse.json({ error: "Mobile number and OTP are required" }, { status: 400 });
    }

    const result = await SmsService.verifyOtp(phone, otp);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    let profile = result.profile;

    if (result.isNewUser) {
      // Profile registration
      profile = await db.upsertProfile({
        mobile: phone,
        display_name: displayName || `Aspirant_${phone.slice(-4)}`,
        target_exams: targetExams || ["UPSC Civil Services"],
        role: "student",
      });
    }

    // Set persistent session cookie
    if (profile) {
      await createSessionCookie(profile);
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      profile,
      isNewUser: result.isNewUser,
    });
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
