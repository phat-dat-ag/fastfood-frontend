import type { Promotion } from "./promotion.types";
import type { Question } from "./question.types";
import type { QuizQuestionSubmitRequest } from "./quiz-question.types";
import type { TopicDifficulty } from "./topic-difficulty.types";

export interface Quiz {
  id: number;
  startedAt: string;
  completedAt: string;
  expiredAt: string;
  topicDifficulty: TopicDifficulty;
  promotion: Promotion;
  questions: Question[];
}

export interface QuizSubmitRequest {
  quizId: number;
  topicDifficultySlug: string;
  quizQuestions: QuizQuestionSubmitRequest[];
}
