import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    const response = await fetch("http://localhost:8000/rebuild", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText }),
    });

    // Explicitly check if the Python server failed
    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI Backend Error:", errorText);
      return NextResponse.json({ error: "Backend failed", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Next.js API Route Error:", error.message);
    return NextResponse.json({ error: "Failed to connect to backend." }, { status: 500 });
  }
}
