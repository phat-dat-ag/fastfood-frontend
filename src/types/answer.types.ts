export interface AnswerCreateRequest {
  content: string;
  imageUrl: File | null;
  isCorrect: boolean;
}

export interface Answer {
  id: number;
  content: string;
  imageUrl: string | null;
  correct: boolean;
}

export interface AnswerInQuiz {
  id: number;
  content: string;
  imageUrl: string;
}
