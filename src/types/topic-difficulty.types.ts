export interface TopicDifficultyCreateRequest {
  name: string;
  description: string;
  activated: boolean;
  duration: number;
  questionCount: number;
  minCorrectToReward: number;
}

export interface TopicDifficultyUpdateRequest {
  id: number;
  name: string;
  description: string;
  activated: boolean;
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
  topicDifficulty: TopicDifficulty;
}

export interface TopicDifficultyPageResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  topicDifficulties: TopicDifficulty[];
}

export interface TopicDifficultyStats {
  id: number;
  name: string;
  totalQuizzesPlayed: number;
  totalPromotionsReceived: number;
  avgDurationSeconds: number;
}

export interface TopicDifficultyStatsResponse {
  topicDifficultyStats: TopicDifficultyStats[];
}
