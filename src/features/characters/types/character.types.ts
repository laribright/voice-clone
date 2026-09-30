export type Character = {
  id: string;
  name: string;
  description: string;
  speakingStyle: string;
  defaultEmotion: string;
  sampleDialogue: string;
  voiceModelId?: string;
};

export type VoiceoverSegmentStatus =
  | "draft"
  | "generating"
  | "completed"
  | "error";

export type VoiceoverSegment = {
  id: string;
  order: number;
  text: string;
  emotionDirection: string;
  status: VoiceoverSegmentStatus;
  audioUrl?: string;
};

export type CharacterFormValues = Omit<Character, "id" | "voiceModelId">;

export type CharacterFormErrors = Partial<
  Record<keyof CharacterFormValues, string>
>;

export const EMPTY_CHARACTER_FORM: CharacterFormValues = {
  name: "",
  description: "",
  speakingStyle: "",
  defaultEmotion: "",
  sampleDialogue: "",
};
