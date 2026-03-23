import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type { TopicDifficultyCreateRequest } from "../types/topic-difficulty.types";
import type {
  TopicCreateRequest,
  TopicUpdateRequest,
} from "../types/topic.types";

export const createTopic = (data: TopicCreateRequest) => {
  return api.post("/admin/topics", data);
};

export const updateTopic = (data: TopicUpdateRequest) => {
  const { id, ...request } = data;
  return api.put(`/admin/topics/${data.id}`, request);
};

export const getTopicBySlug = (slug: string) => {
  return api.get(`/admin/topics/${slug}`);
};

export const getTopics = (pageRequest: PageRequest) => {
  return api.get("/admin/topics", { params: pageRequest });
};

export const updateTopicActivation = (topicId: number, activated: boolean) => {
  return api.patch(`/admin/topics/${topicId}`, { activated });
};

export const deleteTopic = (topicId: number) => {
  return api.delete(`/admin/topics/${topicId}`);
};

export const createTopicDifficulty = (
  topicSlug: string,
  data: TopicDifficultyCreateRequest,
) => {
  return api.post(`/admin/topics/${topicSlug}/difficulties`, data);
};

export const getAllTopicDifficultiesByTopic = (
  topicSlug: string,
  pageRequest: PageRequest,
) => {
  return api.get(`/admin/topics/${topicSlug}/difficulties`, {
    params: pageRequest,
  });
};
