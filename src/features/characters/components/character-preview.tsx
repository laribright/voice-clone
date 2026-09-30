import { Character } from "../types/character.types";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface CharacterPreviewProps {
  character: Character | null;
}

const PREVIEW_FIELDS: { key: keyof Character; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "speakingStyle", label: "Speaking Style" },
  { key: "defaultEmotion", label: "Default Emotion" },
  { key: "sampleDialogue", label: "Sample Dialogue" },
];

export function CharacterPreview({ character }: CharacterPreviewProps) {
  if (!character) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex min-h-70 flex-col items-center justify-center gap-3 py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full text-center">
            <Sparkles className="size-5 text-muted-foreground" />
          </span>
          <h2 className="text-sm font-medium">No character created yet</h2>
          <p className="max-w-xs text-xs text-muted-foreground">
            Fill in the form and select Create Character to see the finised
            profile here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{character.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <dl className="flex flex-col gap-4">
          {PREVIEW_FIELDS.map((field) => (
            <div key={field.key}>
              <dt className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {field.label}
              </dt>

              <dd className="mt-1 text-sm text-muted-foreground">
                {character[field.key]}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>

      {character.voiceModelId && (
        <CardFooter>
          <Button variant="outline" className="text-xs font-normal">
            Voice Cloned see the panel below
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
