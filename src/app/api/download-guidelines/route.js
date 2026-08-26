import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "assets", "Guidelines.pdf");

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Guidelines PDF file not found on server", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="State_Creator_Awards_2026_Guidelines.pdf"',
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download Guidelines PDF Error:", error);
    return new NextResponse("Internal Server Error while downloading guidelines", { status: 500 });
  }
}
