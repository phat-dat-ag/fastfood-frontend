import type { Answer, AnswerCreateRequest } from "./answer.types";

export interface QuestionPrimaryData {
  content: string;
  imageUrl: File | null;
  audioUrl: File | null;
  activated: boolean;
  answerType: "text" | "image";
  answers: AnswerCreateRequest[];
}

export interface QuestionCreateRequest {
  content: string;
  imageUrl: File | null;
  audioUrl: File | null;
  activated: boolean;
  answers: AnswerCreateRequest[];
}

export interface Question {
  id: number;
  content: string;
  imageUrl: string | null;
  audioUrl: string | null;
  activated: boolean;
  answers: Answer[];
}

export interface QuestionPageResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  questions: Question[];
}
