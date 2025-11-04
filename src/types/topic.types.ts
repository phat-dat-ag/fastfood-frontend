import type { TopicDifficulty } from "./topic-difficulty.types";

export interface TopicCreateRequest {
  name: string;
  description: string;
  isActivated: boolean;
}

export interface TopicUpdateRequest {
  id: number;
  name: string;
  description: string;
  isActivated: boolean;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  activated: boolean;
  topicDifficulties: TopicDifficulty[];
  createdAt: string;
  updatedAt: string;
}
