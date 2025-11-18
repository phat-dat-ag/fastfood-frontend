export interface QuizFeedback {
  quizId: number;
  userName: string;
  topicName: string;
  topicDifficultyName: string;
  feedback: string;
  feedbackAt: string;
}

export interface QuizFeedbackResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  feedbacks: QuizFeedback[];
}
