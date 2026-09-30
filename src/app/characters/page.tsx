import { Metadata } from "next";
import { CharacterBuilder } from "@/features/characters/components/character-builder";

export const metadata: Metadata = {
  title: "Character Builder - VoiceDirector AI",
};

export default function CharactersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Character Builder
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create characters, clone voices and generate expressive voiceovers.
          Start by describing who this character is and how they speak.
        </p>
      </div>

      <CharacterBuilder />
    </div>
  );
}
