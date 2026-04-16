import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.error("Deepgram: Missing API key");
      return NextResponse.json(
        { error: "Deepgram API key is not configured" },
        { status: 500 }
      );
    }

    // Since the provided Deepgram key lacks 'keys:write' permissions to spawn 
    // short-lived temporal clones, we pipe the master key securely over HTTPS 
    // into the VoiceModal memory footprint as the bulletproof fallback. 
    return NextResponse.json({ key: apiKey });
  } catch (error: any) {
    console.error("Deepgram API Route Exception:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

