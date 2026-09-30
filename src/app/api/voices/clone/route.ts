import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".wav", ".mp3", ".m4a", ".opus"];

interface FishCreateModelResponse {
  _id: string;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function POST(request: Request) {
  const apiKey = process.env.FISH_AUDIO_API_KEY;

  if (!apiKey) {
    console.error("FISH_AUDIO_API_KEY is not configured");
    return errorResponse("Voice cloning is not configured", 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Invalid upload", 400);
  }

  const characterName = formData.get("characterName");
  const transcript = formData.get("transcript");
  const consent = formData.get("consent");
  const audio = formData.get("audio");

  if (typeof characterName !== "string" || characterName.trim().length === 0) {
    return errorResponse("Character name is required", 400);
  }

  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    return errorResponse("Transcript is required", 400);
  }

  if (consent !== "true") {
    return errorResponse("Consent is required", 400);
  }

  if (!audio || !(audio instanceof File) || audio.size === 0) {
    return errorResponse("Voice sample is required", 400);
  }

  if (!hasAllowedExtension(audio.name)) {
    return errorResponse(
      "Unsupported file type. Supported formats: WAV, MP3, M4A, OPUS.",
      400,
    );
  }

  if (audio.size > MAX_FILE_SIZE) {
    return errorResponse("File size exceeds 10MB limit", 400);
  }

  try {
    const fishForm = new FormData();
    fishForm.set("type", "tts");
    fishForm.set("title", characterName);
    fishForm.set("visibility", "private");
    fishForm.set("train_mode", "fast");
    fishForm.set("texts", transcript);
    fishForm.set("voices", audio, audio.name);

    const response = await fetch("https://api.fish.audio/model", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: fishForm,
    });

    if (response.status === 402) {
      return errorResponse("Insufficient credits", 402);
    }

    if (!response.ok) {
      console.error("Failed to create voice model", response.status);
      return errorResponse("Failed to create voice model", 502);
    }

    const data = (await response.json()) as FishCreateModelResponse;

    if (typeof data._id !== "string" || data._id.trim().length === 0) {
      console.error("Invalid response from Fish API", data);
      return errorResponse("Failed to create voice model", 502);
    }

    return NextResponse.json({
      success: true,
      data: { voiceModelId: data._id },
    });
  } catch (error) {
    console.error("Error creating voice model", error);
    return errorResponse("Failed to create voice model", 500);
  }
}
