import api from "../api/axios";
import type { AwardCreateRequest } from "../types/award.types";

export const createAward = (
  topicDifficultySlug: string,
  data: AwardCreateRequest
) => {
  return api.post("/award", data, { params: { topicDifficultySlug } });
};

export const getAllAwardsByTopicDifficulty = (topicDifficultySlug: string) => {
  return api.get("/award", { params: { topicDifficultySlug } });
};

export const deleteAward = (awardId: number) => {
  return api.delete("/award", { params: { awardId } });
};
