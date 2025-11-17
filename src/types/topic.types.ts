import type { TopicDifficultyDisplay } from "./topic-difficulty.types";

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
  slug: string;
  description: string;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TopicDisplay {
  id: number;
  name: string;
  slug: string;
  description: string;
  difficulties: TopicDifficultyDisplay[];
}

export interface TopicResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  topics: Topic[];
}
