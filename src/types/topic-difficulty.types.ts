import type { Award } from "./award.types";

export interface TopicDifficulty {
  id: number;
  name: string;
  description: string;
  duration: number;
  questionCount: number;
  minCorrectToReward: number;
  awards: Award[];
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}
