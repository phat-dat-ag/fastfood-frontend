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
  topicName: string;
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

export interface TopicDifficultyDisplay {
  id: number;
  name: string;
  slug: string;
  description: string;
  duration: number;
  questionCount: number;
  minCorrectToReward: number;
}

export interface TopicDifficultyResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  topicDifficulties: TopicDifficulty[];
}
