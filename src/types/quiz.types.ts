import type { Promotion } from "./promotion.types";
import type { Question } from "./question.types";
import type { QuizQuestionSubmitRequest } from "./quiz-question.types";
import type { TopicDifficulty } from "./topic-difficulty.types";
import type { User } from "./user.types";

export interface Quiz {
  id: number;
  startedAt: string;
  completedAt: string | null;
  expiredAt: string;
  user: User;
  topicDifficulty: TopicDifficulty;
  promotion: Promotion | null;
  questions: Question[];
  feedback: string | null;
  feedbackAt: string | null;
}

export interface QuizSubmitRequest {
  quizId: number;
  topicDifficultySlug: string;
  quizQuestions: QuizQuestionSubmitRequest[];
}

export interface QuizAddFeedbackRequest {
  quizId: number;
  feedback: string;
}

export interface QuizHistoryResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  quizzes: Quiz[];
}
