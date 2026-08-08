import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const captchaToken = body.captchaToken || body.token;

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, message: "Please complete the CAPTCHA." },
        { status: 400 }
      );
    }

    const secretKey =
      process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

    const params = new URLSearchParams({
      secret: secretKey,
      response: captchaToken,
    });

    const googleResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const googleData = await googleResponse.json();

    if (googleData.success) {
      return NextResponse.json({
        success: true,
        message: "CAPTCHA verified successfully.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Captcha verification failed. Please try again.",
        errors: googleData["error-codes"] || [],
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Captcha verification failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
