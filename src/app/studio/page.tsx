import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Voiceover Studio - VoiceDirector AI",
};

export default function StudioPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Voiceover Studio
        </h1>
        <p className="mt-2 text-muted-foreground">
          This is where you&apos;ll paste a script, direct the performance, and
          generate expressive voiceover audio with Fish Audio. The script studio
          is a placeholder until a character has a cloned voice.
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Users className="size-5 text-muted-foreground" />
          </span>
          <h2 className="text-sm font-medium">No voiceover tools yet</h2>
          <p className="max-w-xs text-xs text-muted-foreground">
            Head back to the Character Builder to create a character first.
          </p>
          <Button
            className="gap-2 mt-2"
            nativeButton={false}
            render={<Link href="/characters" />}
          >
            Back to Character Builder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
