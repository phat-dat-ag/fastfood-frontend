import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type {
  TopicDifficultyCreateRequest,
  TopicDifficultyUpdateRequest,
} from "../types/topic-difficulty.types";

export const createTopicDifficulty = (
  topicSlug: string,
  data: TopicDifficultyCreateRequest
) => {
  return api.post("/topic-difficulty", data, { params: { topicSlug } });
};

export const updateTopicDifficulty = (data: TopicDifficultyUpdateRequest) => {
  const { id, ...request } = data;
  return api.put("/topic-difficulty", request, {
    params: { topicDifficultyId: id },
  });
};

export const getTopicDifficultyBySlug = (topicDifficultySlug: string) => {
  return api.get("/topic-difficulty/by-slug", {
    params: { topicDifficultySlug },
  });
};

export const getAllTopicDifficultiesByTopic = (
  topicSlug: string,
  pageRequest: PageRequest
) => {
  return api.get("/topic-difficulty/by-topic-slug", {
    params: { topicSlug, ...pageRequest },
  });
};

export const activateTopicDifficulty = (topicDifficultyId: number) => {
  return api.put("/topic-difficulty/activate", null, {
    params: { topicDifficultyId },
  });
};

export const deactivateTopicDifficulty = (topicDifficultyId: number) => {
  return api.put("/topic-difficulty/deactivate", null, {
    params: { topicDifficultyId },
  });
};

export const deleteTopicDifficulty = (topicDifficultyId: number) => {
  return api.delete("/topic-difficulty", { params: { topicDifficultyId } });
};
