import api from "../api/axios";
import type { TopicDifficultyUpdateRequest } from "../types/topic-difficulty.types";

export const updateTopicDifficulty = (data: TopicDifficultyUpdateRequest) => {
  const { id, ...request } = data;
  return api.put(`/admin/topic-difficulties/${id}`, request);
};

export const getTopicDifficultyBySlug = (topicDifficultySlug: string) => {
  return api.get(`/admin/topic-difficulties/slug/${topicDifficultySlug}`);
};

export const updateTopicDifficultyActivation = (
  topicDifficultyId: number,
  activated: boolean,
) => {
  return api.patch(`/admin/topic-difficulties/${topicDifficultyId}`, {
    activated,
  });
};

export const deleteTopicDifficulty = (topicDifficultyId: number) => {
  return api.delete(`/admin/topic-difficulties/${topicDifficultyId}`);
};
