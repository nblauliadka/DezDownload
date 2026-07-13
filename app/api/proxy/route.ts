import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "download";

    if (!url) {
      return NextResponse.json({ Status: false, Error: "URL is required" }, { status: 400 });
    }

    // Fetch the media resource
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch media: ${res.statusText}`);
    }

    const headers = new Headers();
    // Sanitize filename to avoid header issues
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    headers.set("Content-Disposition", `attachment; filename="${safeFilename}"`);
    
    // Copy relevant content headers if they exist in upstream response
    const contentType = res.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    const contentLen = res.headers.get("content-length");
    if (contentLen) {
      headers.set("Content-Length", contentLen);
    }

    // Return the readable stream directly to browser
    return new Response(res.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ Status: false, Error: error.message || "Failed to download media file" }, { status: 500 });
  }
}
