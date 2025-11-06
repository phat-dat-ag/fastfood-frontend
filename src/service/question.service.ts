import api from "../api/axios";
import type { QuestionCreateRequest } from "../types/question.types";

export const createQuestions = (
  questions: QuestionCreateRequest[],
  topicDifficultySlug: string
) => {
  const formData = new FormData();

  questions.forEach((question, i) => {
    formData.append(`questions[${i}].content`, question.content);
    formData.append(
      `questions[${i}].isActivated`,
      String(question.isActivated)
    );

    if (question.imageUrl)
      formData.append(`questions[${i}].imageUrl`, question.imageUrl);
    if (question.audioUrl)
      formData.append(`questions[${i}].audioUrl`, question.audioUrl);

    question.answers.forEach((answer, j) => {
      formData.append(`questions[${i}].answers[${j}].content`, answer.content);
      formData.append(
        `questions[${i}].answers[${j}].isCorrect`,
        String(answer.isCorrect)
      );
      if (answer.imageUrl)
        formData.append(
          `questions[${i}].answers[${j}].imageUrl`,
          answer.imageUrl
        );
    });
  });

  formData.append("topicDifficultySlug", topicDifficultySlug);

  return api.post("/question", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllQuestionByTopicDifficulty = (
  topicDifficultySlug: string
) => {
  return api.get("/question", { params: { topicDifficultySlug } });
};
