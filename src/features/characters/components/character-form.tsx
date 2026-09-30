"use client";

import type { ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { RotateCcw, Sparkles } from "lucide-react";
import {
  CharacterFormErrors,
  CharacterFormValues,
} from "../types/character.types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CharacterFormProps {
  values: CharacterFormValues;
  errors: CharacterFormErrors;
  hasCharacter: boolean;
  onFieldChange: (field: keyof CharacterFormValues, value: string) => void;
  onSubmit: () => void;
  onStartOver: () => void;
}

export const MAX_LENGTHS: Record<keyof CharacterFormValues, number> = {
  name: 60,
  description: 300,
  speakingStyle: 120,
  defaultEmotion: 80,
  sampleDialogue: 200,
};

export function CharacterForm({
  values,
  errors,
  hasCharacter,
  onFieldChange,
  onSubmit,
  onStartOver,
}: CharacterFormProps) {
  const handleChange =
    (field: keyof CharacterFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onFieldChange(field, event.target.value);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character Details</CardTitle>
        <CardDescription>
          Fill in all five fields to build your character.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={handleChange("name")}
            maxLength={MAX_LENGTHS.name}
            placeholder="Commander Aria Vale"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `name-error` : undefined}
          />
          {errors.name && (
            <p className="text-xs text-destructive" id="name-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Character Description</Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={handleChange("description")}
            maxLength={MAX_LENGTHS.description}
            rows={3}
            placeholder="A battle-worn spaceship commander who remains calm during emergencies."
            className="resize-none"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? `description-error` : undefined
            }
          />
          {errors.description && (
            <p className="text-xs text-destructive" id="description-error">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="speakingStyle">Speaking Style</Label>
          <Input
            id="speakingStyle"
            value={values.speakingStyle}
            onChange={handleChange("speakingStyle")}
            maxLength={MAX_LENGTHS.speakingStyle}
            placeholder="Controlled, measured and authoritative"
            aria-invalid={Boolean(errors.speakingStyle)}
            aria-describedby={
              errors.speakingStyle ? `speakingStyle-error` : undefined
            }
          />
          {errors.speakingStyle && (
            <p className="text-xs text-destructive" id="speakingStyle-error">
              {errors.speakingStyle}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="defaultEmotion">Default Emotion</Label>
          <Input
            id="defaultEmotion"
            value={values.defaultEmotion}
            onChange={handleChange("defaultEmotion")}
            maxLength={MAX_LENGTHS.defaultEmotion}
            placeholder="Calm with restrained sadness"
            aria-invalid={Boolean(errors.defaultEmotion)}
            aria-describedby={
              errors.defaultEmotion ? `defaultEmotion-error` : undefined
            }
          />
          {errors.defaultEmotion && (
            <p className="text-xs text-destructive" id="defaultEmotion-error">
              {errors.defaultEmotion}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sampleDialogue">Sample Dialogue</Label>
          <Textarea
            id="sampleDialogue"
            value={values.sampleDialogue}
            onChange={handleChange("sampleDialogue")}
            maxLength={MAX_LENGTHS.sampleDialogue}
            rows={2}
            placeholder="Stay focused. We bring everyone home this time."
            className="resize-none"
            aria-invalid={Boolean(errors.sampleDialogue)}
            aria-describedby={
              errors.sampleDialogue ? `sampleDialogue-error` : undefined
            }
          />
          {errors.sampleDialogue && (
            <p className="text-xs text-destructive" id="sampleDialogue-error">
              {errors.sampleDialogue}
            </p>
          )}
        </div>

        <CardFooter className="flex flex-wrap gap-3">
          <Button type="button" onClick={onSubmit} className="gap-2">
            <Sparkles className="size-4" />
            {hasCharacter ? "Update Character" : "Create Character"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onStartOver}
            className="gap-2"
          >
            <RotateCcw className="size-4" />
            Start Over
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
