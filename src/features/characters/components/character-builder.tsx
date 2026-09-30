"use client";
import { useState, useEffect } from "react";
import { CharacterForm } from "@/features/characters/components/character-form";
import { CharacterPreview } from "@/features/characters/components/character-preview";
import {
  EMPTY_CHARACTER_FORM,
  type Character,
  type CharacterFormErrors,
  type CharacterFormValues,
} from "../types/character.types";
import { VoiceClonePanel } from "@/features/characters/components/voice-clone-panel";

const SESSION_STORAGE_KEY = "voicedirector:character";

const MAX_LENGTHS: Record<keyof CharacterFormValues, number> = {
  name: 60,
  description: 300,
  speakingStyle: 120,
  defaultEmotion: 80,
  sampleDialogue: 200,
};

const FIELD_LABELS: Record<keyof CharacterFormValues, string> = {
  name: "Character Name",
  description: "Character Description",
  speakingStyle: "Speaking Style",
  defaultEmotion: "Default Emotion",
  sampleDialogue: "Sample Dialogue",
};

function validateCharacterForm(
  values: CharacterFormValues,
): CharacterFormErrors {
  const errors: CharacterFormErrors = {};

  (Object.keys(values) as (keyof CharacterFormValues)[]).forEach((field) => {
    const value = values[field].trim();

    if (value.length === 0) {
      errors[field] = `${FIELD_LABELS[field]} is required`;
      return;
    }

    if (value.length > MAX_LENGTHS[field]) {
      errors[field] =
        `${FIELD_LABELS[field]} must be less than ${MAX_LENGTHS[field]} characters`;
    }
  });

  return errors;
}

function toFormValues(character: Character): CharacterFormValues {
  return {
    name: character.name,
    description: character.description,
    speakingStyle: character.speakingStyle,
    defaultEmotion: character.defaultEmotion,
    sampleDialogue: character.sampleDialogue,
  };
}

export function CharacterBuilder() {
  const [formValues, setFormValues] =
    useState<CharacterFormValues>(EMPTY_CHARACTER_FORM);
  const [errors, setErrors] = useState<CharacterFormErrors>({});
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as Character;

      queueMicrotask(() => {
        setCharacter(parsed);
        setFormValues(toFormValues(parsed));
      });
    } catch (error) {
      console.error("Error loading character from session storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (character) {
        window.sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(character),
        );
      } else {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving character to session storage:", error);
    }
  }, [character]);

  function handleStartOver() {
    setFormValues(EMPTY_CHARACTER_FORM);
    setErrors({});
    setCharacter(null);
  }

  function handleFieldChange(field: keyof CharacterFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit() {
    const validationErrors = validateCharacterForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setCharacter((previous) => ({
      id: previous?.id ?? crypto.randomUUID(),
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      speakingStyle: formValues.speakingStyle.trim(),
      defaultEmotion: formValues.defaultEmotion.trim(),
      sampleDialogue: formValues.sampleDialogue.trim(),
      voiceModelId: previous?.voiceModelId,
    }));
  }

  function handleVoiceCloned(voiceModelId: string) {
    setCharacter((previous) =>
      previous ? { ...previous, voiceModelId } : previous,
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CharacterForm
        values={formValues}
        errors={errors}
        hasCharacter={character !== null}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        onStartOver={handleStartOver}
      />
      <CharacterPreview character={character} />

      {character && (
        <VoiceClonePanel character={character} onCloned={handleVoiceCloned} />
      )}
    </div>
  );
}
