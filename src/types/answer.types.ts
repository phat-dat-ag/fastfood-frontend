export interface AnswerCreateRequest {
  content: string;
  imageUrl: File | null;
  correct: boolean;
}

export interface Answer {
  id: number;
  content: string;
  imageUrl: string | null;
  correct: boolean;
  selectedByUser: boolean;
}
