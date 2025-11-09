<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useApiHandler } from "../../composables/useApiHandler";
import { getQuiz } from "../../service/quiz.service";
import { CHANLLENGE_MESSAGE } from "../../constants/messages";
import type { Quiz } from "../../types/quiz.types";
import QuizProgress from "./components/QuizProgress.vue";
import QuizQuestion from "./components/QuizQuestion.vue";
import type { QuestionInQuiz } from "../../types/question.types";

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

async function submitQuiz() {
  console.log("Kết quả nộp bài:");
  for (const [questionId, answerId] of Object.entries(selectedAnswers.value)) {
    console.log(`Question ${questionId}: Answer ${answerId}`);
  }
}

const currentIndex = ref<number>(0);

const currentQuestion = computed<QuestionInQuiz | null>(() => {
  if (!quiz.value) return null;
  return quiz.value.questions[currentIndex.value];
});

</script>
<template>
  <div v-if="quiz" class="grid grid-cols-[4fr_1fr] gap-4">
    <QuizQuestion :currentQuestion="currentQuestion" :currentIndex="currentIndex" :questionCount="questionCount"
      :selectedAnswers="selectedAnswers" :goToQuestion="goToQuestion" :selectAnswer="selectAnswer" />

    <QuizProgress :selectedAnswers="selectedAnswers" :questions="quiz.questions" :goToQuestion="goToQuestion"
      :submitQuiz="submitQuiz" :remainingTime="remainingTime" />
  </div>
</template>