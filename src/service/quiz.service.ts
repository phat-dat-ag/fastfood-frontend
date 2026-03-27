import api from "../api/axios";
import type { PageRequest } from "../types/pagination.types";
import type {
  QuizAddFeedbackRequest,
  QuizSubmitRequest,
} from "../types/quiz.types";

export const submitQuiz = (quizSubmitRequest: QuizSubmitRequest) => {
  return api.post(`/quizzes`, quizSubmitRequest);
};

export const addFeedback = (addFeedbackRequest: QuizAddFeedbackRequest) => {
  return api.put(
    `/quizzes/${addFeedbackRequest.quizId}/feedback`,
    addFeedbackRequest,
  );
};
export const getQuizHistories = (request: PageRequest) => {
  return api.get(`/quizzes`, { params: request });
};

export const getQuizHistory = (quizId: number) => {
  return api.get(`/quizzes/${quizId}`);
};
