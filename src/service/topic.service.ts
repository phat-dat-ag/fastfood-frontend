import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
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

export const getAllTopics = (pageRequest: PageRequest) => {
  return api.get("/topic", { params: pageRequest });
};

export const getAllDisplayableTopics = () => {
  return api.get("/topic/display");
};

export const deleteTopic = (topicId: number) => {
  return api.delete("/topic", { params: { topicId } });
};

export const activateTopic = (topicId: number) => {
  return api.put("/topic/activate", null, { params: { topicId } });
};

export const deactivateTopic = (topicId: number) => {
  return api.put("/topic/deactivate", null, { params: { topicId } });
};
