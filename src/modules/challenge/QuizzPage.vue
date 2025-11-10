<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiHandler } from "../../composables/useApiHandler";
import { getQuiz, submitQuiz } from "../../service/quiz.service";
import { CHANLLENGE_MESSAGE } from "../../constants/messages";
import type { Quiz, QuizSubmitRequest } from "../../types/quiz.types";
import QuizProgress from "./components/QuizProgress.vue";
import QuizQuestion from "./components/QuizQuestion.vue";
import type { Question } from "../../types/question.types";
import { notifyError } from "../../utils/notification.utils";
import type { QuizQuestionSubmitRequest } from "../../types/quiz-question.types";

const route = useRoute();
const quiz = ref<Quiz | null>(null);
const selectedAnswers = ref<Record<number, number | null>>({});
const remainingTime = ref<number>(0);

async function loadQuiz() {
  const slug = route.params.slug?.toString() || "";
  await useApiHandler<Quiz>(
    () => getQuiz(slug),
    {
      loading: CHANLLENGE_MESSAGE.get,
      error: CHANLLENGE_MESSAGE.getError,
    },
    (data: Quiz) => {
      quiz.value = data;
      const answers: Record<number, number | null> = {};
      for (const q of data.questions) {
        answers[q.id] = null;
      }
      selectedAnswers.value = answers;

      const now = new Date();
      const expired = new Date(data.expiredAt);
      remainingTime.value = Math.max(Math.floor((expired.getTime() - now.getTime()) / 1000), 0);
    }
  );
}

onMounted(() => {
  loadQuiz();
  setInterval(() => {
    if (remainingTime.value > 0) remainingTime.value--;
  }, 1000);
});

const questionCount = computed<number>(() => {
  if (!quiz.value) return 0;
  return quiz.value.questions.length;
})

function goToQuestion(index: number) {
  if (!quiz.value) return;
  if (index >= 0 && index < questionCount.value) {
    currentIndex.value = index;
  }
}

function selectAnswer(questionId: number, answerId: number) {
  selectedAnswers.value[questionId] =
    selectedAnswers.value[questionId] === answerId ? null : answerId;
}

const router = useRouter();

async function handleSubmitQuiz() {
  if (!quiz.value) {
    notifyError("Lỗi nộp bài: không thấy bài kiểm tra");
    return;
  }
  const slug = route.params.slug?.toString() || "";
  const quizQuestions: QuizQuestionSubmitRequest[] = [];
  for (const [questionId, answerId] of Object.entries(selectedAnswers.value)) {
    quizQuestions.push({ questionId: Number(questionId), answerId });
  }
  const dataRequest: QuizSubmitRequest = {
    quizId: quiz.value.id,
    topicDifficultySlug: slug,
    quizQuestions,
  };

  await useApiHandler(
    () => submitQuiz(dataRequest),
    {
      loading: "Đang nộp bài",
      error: "Lỗi nộp bài"
    },
    (data) => { console.log("Nộp bài thành công: ", data); router.back() },
  )
}

const currentIndex = ref<number>(0);

const currentQuestion = computed<Question | null>(() => {
  if (!quiz.value) return null;
  return quiz.value.questions[currentIndex.value];
});

</script>
<template>
  <div v-if="quiz" class="grid grid-cols-[4fr_1fr] gap-4">
    <QuizQuestion :currentQuestion="currentQuestion" :currentIndex="currentIndex" :questionCount="questionCount"
      :selectedAnswers="selectedAnswers" :goToQuestion="goToQuestion" :selectAnswer="selectAnswer" />

    <QuizProgress :selectedAnswers="selectedAnswers" :questions="quiz.questions" :goToQuestion="goToQuestion"
      :handleSubmitQuiz="handleSubmitQuiz" :remainingTime="remainingTime" />
  </div>
</template>