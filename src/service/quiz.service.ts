import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type {
  QuizAddFeedbackRequest,
  QuizSubmitRequest,
} from "../types/quiz.types";

export const getQuiz = (topicDifficultySlug: string) => {
  return api.get("/quiz", { params: { topicDifficultySlug } });
};

export const submitQuiz = (quizSubmitRequest: QuizSubmitRequest) => {
  return api.post("/quiz", quizSubmitRequest);
};

export const addFeedback = (addFeedbackRequest: QuizAddFeedbackRequest) => {
  return api.put("/quiz", addFeedbackRequest);
};
export const getAllReviewQuizzesByUser = () => {
  return api.get("/quiz/by-user");
};

export const getQuizHistoryDetailByUser = (quizId: number) => {
  return api.get("/quiz/by-user/detail", { params: { quizId } });
};

export const getAllFeedbackByAdmin = (request: PageRequest) => {
  return api.get("/quiz/manage", { params: request });
};
