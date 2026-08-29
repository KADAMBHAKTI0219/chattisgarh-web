import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GUIDELINES_PDF_BASE64 } from "@/assets/guidelinesPdfBase64";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "en";
    const isChhattisgarhi = lang === "cg" || lang === "hne";
    const isHindi = lang === "hi";

    let pdfFileName = "Guidelines.pdf";
    let downloadHeaderFilename = "State_Creator_Awards_2026_Guidelines.pdf";

    if (isChhattisgarhi) {
      pdfFileName = "Chhattisgarh_Content_Creator_Awards_2026_Guidelines_Chhattisgarhi.pdf";
      downloadHeaderFilename = "Chhattisgarh_Content_Creator_Awards_2026_Guidelines_Chhattisgarhi.pdf";
    } else if (isHindi) {
      pdfFileName = "Chhattisgarh_Content_Creator_Awards_2026_Guidelines_Hindi.pdf";
      downloadHeaderFilename = "Chhattisgarh_Content_Creator_Awards_2026_Guidelines_Hindi.pdf";
    }

    let fileBuffer = null;

    // 1. Try local filesystem (fastest if present)
    const possiblePaths = [
      path.join(process.cwd(), "public", "assets", pdfFileName),
      path.join(process.cwd(), "assets", pdfFileName),
      path.join(__dirname, "..", "..", "..", "..", "public", "assets", pdfFileName),
    ];

    for (const p of possiblePaths) {
      try {
        if (fs.existsSync(p)) {
          fileBuffer = fs.readFileSync(p);
          break;
        }
      } catch (e) {}
    }

    // Fallback path search if Chhattisgarhi file fails on filesystem
    if (!fileBuffer && isChhattisgarhi) {
      const fallbackPaths = [
        path.join(process.cwd(), "public", "assets", "Guidelines.pdf"),
        path.join(process.cwd(), "assets", "Guidelines.pdf"),
      ];
      for (const p of fallbackPaths) {
        try {
          if (fs.existsSync(p)) {
            fileBuffer = fs.readFileSync(p);
            break;
          }
        } catch (e) {}
      }
    }

    // 2. Try fetching from public URL
    if (!fileBuffer) {
      try {
        const host = request.headers.get("host") || "localhost:3000";
        const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
        const staticUrl = `${protocol}://${host}/assets/${pdfFileName}`;

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
        "Content-Disposition": `attachment; filename="${downloadHeaderFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download Guidelines PDF Error:", error);
    return new NextResponse("Internal Server Error while downloading guidelines", { status: 500 });
  }
}
