import api from "../api/axios";

export const updateAwardActivation = (awardId: number, activated: boolean) => {
  return api.patch(`/admin/awards/${awardId}`, { activated });
};

export const deleteAward = (awardId: number) => {
  return api.delete(`/admin/awards/${awardId}`);
};
