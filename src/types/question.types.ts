import type { Answer, AnswerCreateRequest, AnswerInQuiz } from "./answer.types";

export interface QuestionPrimaryData {
  content: string;
  imageUrl: File | null;
  audioUrl: File | null;
  isActivated: boolean;
  answerType: "text" | "image";
  answers: AnswerCreateRequest[];
}

export interface QuestionCreateRequest {
  content: string;
  imageUrl: File | null;
  audioUrl: File | null;
  isActivated: boolean;
  answers: AnswerCreateRequest[];
}

export interface Question {
  content: string;
  imageUrl: string | null;
  audioUrl: string | null;
  activated: boolean;
  answers: Answer[];
}

export interface QuestionInQuiz {
  id: number;
  content: string;
  imageUrl: string;
  audioUrl: string;
  activated: boolean;
  answers: AnswerInQuiz[];
}
