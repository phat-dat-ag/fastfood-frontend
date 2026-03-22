import api from "../api/axios";
import type { AwardCreateRequest } from "../types/award.types";
import type { PageRequest } from "../types/pagination.types";

export const createAward = (
  topicDifficultySlug: string,
  data: AwardCreateRequest,
) => {
  return api.post(`/awards/${topicDifficultySlug}`, data);
};

export const getAllAwardsByTopicDifficulty = (
  topicDifficultySlug: string,
  request: PageRequest,
) => {
  return api.get("/awards", { params: { topicDifficultySlug, ...request } });
};

export const updateAwardActivation = (awardId: number, activated: boolean) => {
  return api.patch(`/awards/${awardId}`, { activated });
};

export const deleteAward = (awardId: number) => {
  return api.delete(`/awards/${awardId}`);
};
