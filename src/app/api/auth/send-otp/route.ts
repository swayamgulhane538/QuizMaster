import { NextResponse } from "next/server";
import { SmsService, validatePhoneNumber } from "@/lib/auth/sms-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { countryCode = "+91", phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    const validation = validatePhoneNumber(countryCode, phone);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await SmsService.sendOtp(validation.normalized);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      normalizedPhone: validation.normalized,
      devOtp: result.devOtp, // Only in dev mode
      cooldownSeconds: result.cooldownSeconds || 60,
    });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
