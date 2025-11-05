export interface TopicDifficultyCreateRequest {
  name: string;
  description: string;
  isActivated: boolean;
  duration: number;
  questionCount: number;
  minCorrectToReward: number;
}

export interface TopicDifficultyUpdateRequest {
  id: number;
  name: string;
  description: string;
  isActivated: boolean;
}

export interface TopicDifficulty {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration: number;
  questionCount: number;
  minCorrectToReward: number;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}
