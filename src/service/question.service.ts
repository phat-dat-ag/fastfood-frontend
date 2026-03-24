import api from "../api/axios";

export const updateQuestionActivation = (
  questionId: number,
  activated: boolean,
) => {
  return api.patch(`/admin/questions/${questionId}`, { activated });
};

export const deleteQuestion = (questionId: number) => {
  return api.delete(`/admin/questions/${questionId}`);
};
