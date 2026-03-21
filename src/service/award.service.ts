import api from "../api/axios";
import type { AwardCreateRequest } from "../types/award.types";
import type { PageRequest } from "../types/pagination.types";

export const createAward = (
  topicDifficultySlug: string,
  data: AwardCreateRequest,
) => {
  return api.post("/award", data, { params: { topicDifficultySlug } });
};

export const getAllAwardsByTopicDifficulty = (
  topicDifficultySlug: string,
  request: PageRequest,
) => {
  return api.get("/award", { params: { topicDifficultySlug, ...request } });
};

export const updateAwardActivation = (awardId: number, activated: boolean) => {
  return api.patch(`/award/${awardId}/activation`, { activated });
};

export const deleteAward = (awardId: number) => {
  return api.delete("/award", { params: { awardId } });
};
