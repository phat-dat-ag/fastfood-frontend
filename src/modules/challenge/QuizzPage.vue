<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiHandler } from "../../composables/useApiHandler";
import { getQuiz, submitQuiz } from "../../service/quiz.service";
import { CHALLENGE_MESSAGE } from "../../constants/messages";
import type { Quiz, QuizSubmitRequest } from "../../types/quiz.types";
import QuizProgress from "./components/QuizProgress.vue";
import QuizQuestion from "./components/QuizQuestion.vue";
import type { Question } from "../../types/question.types";
import { notifyError } from "../../utils/notification.utils";
import type { QuizQuestionSubmitRequest } from "../../types/quiz-question.types";
import QuizResultModal from "./components/QuizResultModal.vue";
import { useUserStore } from "../../store/useUserStore.store";
import { USER_ROLES } from "../../constants/user-roles";
import { ROUTE_NAMES } from "../../constants/route-names";

const route = useRoute();
const quiz = ref<Quiz | null>(null);
const selectedAnswers = ref<Record<number, number | null>>({});
const remainingTime = ref<number>(0);

async function loadQuiz() {
  const slug = route.params.slug?.toString() || "";
  await useApiHandler<Quiz>(
    () => getQuiz(slug),
    {
      loading: CHALLENGE_MESSAGE.get,
      error: CHALLENGE_MESSAGE.getError,
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

let timer: number | null = null;

onMounted(() => {
  loadQuiz();
  timer = setInterval(async () => {
    if (remainingTime.value === 0) {
      if (timer) clearInterval(timer);
      await handleSubmitQuiz();
      return;
    }
    if (remainingTime.value === 10)
      notifyError(
        "Hệ thống sẽ tự nộp bài khi hết giờ nha cưng ơi cưng!",
        "Sắp hết giờ rồi nhé cưng"
      );
    remainingTime.value--;
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

const isResultModalVisible = ref(false);
const quizResult = ref<Quiz | null>(null);

function handleQuizResult(result: Quiz) {
  quizResult.value = result;
  isResultModalVisible.value = true;
}

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

  await useApiHandler<Quiz>(
    () => submitQuiz(dataRequest),
    {
      loading: "Đang nộp bài",
      error: "Lỗi nộp bài"
    },
    (data: Quiz) => handleQuizResult(data),
  )
}

const userStore = useUserStore();

function goToReviewQuizPage(quizId: number) {
  const role = userStore.user?.role;
  if (role === USER_ROLES.USER)
    router.push({ name: ROUTE_NAMES.USER.CHALLENGE_HISTORY_DETAIL, params: { quizId } });
  else if (role === USER_ROLES.STAFF)
    router.push({ name: ROUTE_NAMES.STAFF.CHALLENGE_HISTORY_DETAIL, params: { quizId } });
  else notifyError("Tài khoản không đủ quyền để xem lại thử thách đã tham gia");
}

function handleCloseResultModal() {
  isResultModalVisible.value = false;
  const role = userStore.user?.role;
  if (role === USER_ROLES.USER)
    router.push({ name: ROUTE_NAMES.USER.CHALLENGE });
  else if (role === USER_ROLES.STAFF)
    router.push({ name: ROUTE_NAMES.STAFF.CHALLENGE });
  else router.back();
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

  <QuizResultModal v-if="isResultModalVisible" :quiz="quizResult" @close="handleCloseResultModal"
    @review-quiz="goToReviewQuizPage" />
</template>