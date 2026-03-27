import api from "../api/axios";

export const getQuiz = (topicDifficultySlug: string) => {
  return api.get(`/topic-difficulties/${topicDifficultySlug}/quizzes`);
};
