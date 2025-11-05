import api from "../api/axios";
import type {
  TopicCreateRequest,
  TopicUpdateRequest,
} from "../types/topic.types";

export const createTopic = (data: TopicCreateRequest) => {
  return api.post("/topic", data);
};

export const updateTopic = (data: TopicUpdateRequest) => {
  const { id, ...request } = data;
  return api.put("/topic", request, { params: { topicId: id } });
};

export const getTopicBySlug = (slug: string) => {
  return api.get("/topic/by-slug", { params: { slug } });
};

export const getAllTopics = () => {
  return api.get("/topic");
};

export const deleteTopic = (topicId: number) => {
  return api.delete("/topic", { params: { topicId } });
};
