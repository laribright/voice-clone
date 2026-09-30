"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { CheckCircle2, Mic2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import type {
  Character,
  VoiceoverSegmentStatus,
} from "../types/character.types";

interface VoiceClonePanelProps {
  character: Character;
  onCloned: (voiceModelId: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".wav", ".mp3", ".m4a", ".opus"];

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface CloneVoiceApiResponse {
  success: boolean;
  data?: {
    voiceModelId: string;
  };
  error?: string;
}

export function VoiceClonePanel({ character, onCloned }: VoiceClonePanelProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [consent, setConsent] = useState(false);
  const [cloneStatus, setCloneStatus] =
    useState<VoiceoverSegmentStatus>("draft");
  const [cloneError, setCloneError] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState("");
  const [previewStatus, setPreviewStatus] =
    useState<VoiceoverSegmentStatus>("draft");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewAudioUrl) {
        URL.revokeObjectURL(previewAudioUrl);
      }
    };
  }, [previewAudioUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setAudioFile(event.target.files?.[0] || null);
  }

  async function handleGeneratePreview() {
    if (!character.voiceModelId) {
      setPreviewStatus("error");
      setPreviewError("Please clone your voice first.");
      return;
    }

    if (previewText.trim().length === 0) {
      setPreviewStatus("error");
      setPreviewError("Please enter text to preview the voice.");
      return;
    }

    setPreviewStatus("generating");
    setPreviewError(null);

    try {
      const response = await fetch("/api/voices/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: previewText.trim(),
          referenceId: character.voiceModelId,
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setPreviewStatus("error");
        setPreviewError(result?.error || "Failed to generate preview");
        return;
      }

      const audioBlob = await response.blob();
      setPreviewAudioUrl(URL.createObjectURL(audioBlob));
      setPreviewStatus("completed");
    } catch {
      setPreviewStatus("error");
      setPreviewError("Failed to generate preview");
    }
  }

  async function handleClone() {
    if (!audioFile) {
      setCloneError("Please upload a voice sample first.");
      return;
    }

    if (transcript.trim().length === 0) {
      setCloneError("Please enter a transcript first.");
      return;
    }

    if (!consent) {
      setCloneError(
        "Please confirm that you have permission to use this audio for voice cloning or that you own the voice sample.",
      );
      return;
    }

    if (!hasAllowedExtension(audioFile.name)) {
      setCloneError(
        "Please upload a file in one of the supported formats: WAV, MP3, M4A, OPUS.",
      );
      return;
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      setCloneError("Please upload a file smaller than 10MB.");
      return;
    }

    setCloneStatus("generating");
    setCloneError(null);

    try {
      const formData = new FormData();
      formData.set("characterName", character.name);
      formData.set("transcript", transcript.trim());
      formData.set("consent", "true");
      formData.set("audio", audioFile);

      const response = await fetch("/api/voices/clone", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as CloneVoiceApiResponse;

      if (!result.success || !result.data) {
        setCloneStatus("error");
        setCloneError(result.error || "Failed to clone voice");
        return;
      }

      setCloneStatus("completed");
      onCloned(result.data.voiceModelId);
    } catch {
      setCloneStatus("error");
      setCloneError("Failed to clone voice");
    }
  }

  const isCloned = Boolean(character.voiceModelId);
  const isCloning = cloneStatus === "generating";
  const isPreviewing = previewStatus === "generating";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Cloning</CardTitle>
        <CardDescription>
          Upload a short recording of a voice you own or have permission to
          clone, then preview it in the {`${character.name}`} preview.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {!isCloned ? (
          <div className="flex-col flex gap-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="audio-sample">Voice Sample</Label>
              <Input
                type="file"
                id="audio-sample"
                accept=".wav, .mp3, .m4a, .opus"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: WAV, MP3, M4A, OPUS. 10 - 60 seconds of
                clear, single speaker audio, works best.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="transcript">Transcript</Label>
              <Textarea
                id="transcript"
                value={transcript}
                placeholder="Type exactly what is spoken in the recording."
                onChange={(event) => setTranscript(event.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
              />
              <Label htmlFor="consent">
                I have permission to use this audio for voice cloning or I own
                the voice sample.
              </Label>
            </div>

            {cloneStatus === "error" && cloneError && (
              <p className="text-destructive text-xs">{cloneError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <Badge variant="outline" className="text-xs font-normal">
              Voice Cloned
            </Badge>
          </div>
        )}

        {isCloned && (
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preview-text">Preview Text</Label>
              <Textarea
                id="preview-text"
                value={previewText}
                onChange={(event) => setPreviewText(event.target.value)}
                rows={2}
                placeholder="Enter text to preview the voice."
                className="resize-none"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGeneratePreview}
              disabled={isPreviewing}
              className="w-fit gap-2"
            >
              <Play className="w-4 h-4" />
              {isPreviewing ? "Generating Preview..." : "Generate Preview"}
            </Button>

            {previewStatus === "error" && previewError && (
              <p className="text-destructive text-xs">{previewError}</p>
            )}

            {previewAudioUrl && (
              <audio src={previewAudioUrl} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </CardContent>

      {!isCloned && (
        <CardFooter>
          <Button
            type="button"
            disabled={isCloning}
            onClick={handleClone}
            className="gap-2"
          >
            <Mic2 className="w-4 h-4" />
            {isCloning ? "Cloning..." : "Clone Voice"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
