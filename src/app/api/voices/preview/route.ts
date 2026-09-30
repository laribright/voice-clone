import { NextResponse } from "next/server";

interface TtsPreviewRequestBody {
  text: string;
  referenceId: string;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) {
    console.error("FISH_AUDIO_API_KEY is not configured");
    return errorResponse("TTS preview is not configured", 500);
  }

  let body: Partial<TtsPreviewRequestBody>;

  try {
    body = (await request.json()) as Partial<TtsPreviewRequestBody>;
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  const { text, referenceId } = body;

  if (typeof text !== "string" || text.trim().length === 0) {
    return errorResponse("Text is required", 400);
  }

  if (typeof referenceId !== "string" || referenceId.trim().length === 0) {
    return errorResponse("Reference ID is required", 400);
  }

  try {
    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        model: "s2.1-pro-free",
      },
      body: JSON.stringify({
        text,
        reference_id: referenceId,
        format: "mp3",
      }),
    });

    if (response.status === 402) {
      return errorResponse("Insufficient credits", 402);
    }

    if (!response.ok) {
      console.error("Failed to generate TTS preview", response.status);
      return errorResponse("Failed to generate TTS preview", 502);
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating TTS preview", error);
    return errorResponse("Failed to generate TTS preview", 500);
  }
}
