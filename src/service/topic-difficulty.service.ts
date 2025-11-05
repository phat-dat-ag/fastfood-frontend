import api from "../api/axios";
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

export const getAllTopicDifficultiesByTopic = (topicSlug: string) => {
  return api.get("/topic-difficulty/by-topic-slug", { params: { topicSlug } });
};

export const deleteTopicDifficulty = (topicDifficultyId: number) => {
  return api.delete("/topic-difficulty", { params: { topicDifficultyId } });
};
