import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GUIDELINES_PDF_BASE64 } from "@/assets/guidelinesPdfBase64";

export async function GET(request) {
  try {
    let fileBuffer = null;

    // 1. Try local filesystem (fastest if present)
    const possiblePaths = [
      path.join(process.cwd(), "public", "assets", "Guidelines.pdf"),
      path.join(process.cwd(), "assets", "Guidelines.pdf"),
      path.join(__dirname, "..", "..", "..", "..", "public", "assets", "Guidelines.pdf"),
    ];

    for (const p of possiblePaths) {
      try {
        if (fs.existsSync(p)) {
          fileBuffer = fs.readFileSync(p);
          break;
        }
      } catch (e) {}
    }

    // 2. Try fetching from public URL
    if (!fileBuffer) {
      try {
        const host = request.headers.get("host") || "localhost:3000";
        const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
        const staticUrl = `${protocol}://${host}/assets/Guidelines.pdf`;

        const res = await fetch(staticUrl);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          fileBuffer = Buffer.from(arrayBuffer);
        }
      } catch (e) {}
    }

    // 3. Guaranteed Bulletproof Fallback: Embedded Base64 binary
    if (!fileBuffer && GUIDELINES_PDF_BASE64) {
      fileBuffer = Buffer.from(GUIDELINES_PDF_BASE64, "base64");
    }

    if (!fileBuffer) {
      return new NextResponse("Guidelines PDF file not found on server", { status: 404 });
    }

    const pdfUint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(pdfUint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="State_Creator_Awards_2026_Guidelines.pdf"',
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download Guidelines PDF Error:", error);
    return new NextResponse("Internal Server Error while downloading guidelines", { status: 500 });
  }
}
