import api from "../api/axios";
import type { AwardCreateRequest } from "../types/award.types";
import type { PageRequest } from "../types/pagination.types";
import type { QuestionCreateRequest } from "../types/question.types";
import type { TopicDifficultyUpdateRequest } from "../types/topic-difficulty.types";

export const updateTopicDifficulty = (data: TopicDifficultyUpdateRequest) => {
  const { id, ...request } = data;
  return api.put(`/admin/topic-difficulties/${id}`, request);
};

export const getTopicDifficultyBySlug = (topicDifficultySlug: string) => {
  return api.get(`/admin/topic-difficulties/slug/${topicDifficultySlug}`);
};

export const updateTopicDifficultyActivation = (
  topicDifficultyId: number,
  activated: boolean,
) => {
  return api.patch(`/admin/topic-difficulties/${topicDifficultyId}`, {
    activated,
  });
};

export const deleteTopicDifficulty = (topicDifficultyId: number) => {
  return api.delete(`/admin/topic-difficulties/${topicDifficultyId}`);
};

export const getTopicDifficultyStats = () => {
  return api.get("/admin/topic-difficulties/stats");
};

export const createQuestions = (
  questions: QuestionCreateRequest[],
  topicDifficultySlug: string,
) => {
  const formData = new FormData();

  questions.forEach((question, i) => {
    formData.append(`questions[${i}].content`, question.content);
    formData.append(`questions[${i}].activated`, String(question.activated));

    if (question.imageUrl)
      formData.append(`questions[${i}].imageUrl`, question.imageUrl);
    if (question.audioUrl)
      formData.append(`questions[${i}].audioUrl`, question.audioUrl);

    question.answers.forEach((answer, j) => {
      formData.append(`questions[${i}].answers[${j}].content`, answer.content);
      formData.append(
        `questions[${i}].answers[${j}].correct`,
        String(answer.correct),
      );
      if (answer.imageUrl)
        formData.append(
          `questions[${i}].answers[${j}].imageUrl`,
          answer.imageUrl,
        );
    });
  });

  return api.post(
    `/admin/topic-difficulties/${topicDifficultySlug}/questions`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};

export const getAllQuestionByTopicDifficulty = (
  topicDifficultySlug: string,
  request: PageRequest,
) => {
  return api.get(`/admin/topic-difficulties/${topicDifficultySlug}/questions`, {
    params: request,
  });
};

export const createAward = (
  topicDifficultySlug: string,
  data: AwardCreateRequest,
) => {
  return api.post(
    `/admin/topic-difficulties/${topicDifficultySlug}/awards`,
    data,
  );
};

export const getAllAwardsByTopicDifficulty = (
  topicDifficultySlug: string,
  request: PageRequest,
) => {
  return api.get(`/admin/topic-difficulties/${topicDifficultySlug}/awards`, {
    params: request,
  });
};
