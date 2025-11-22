<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElCard, ElDivider } from 'element-plus';
import type { Quiz, QuizAddFeedbackRequest } from '../../types/quiz.types';
import { addFeedback, getQuizHistoryDetailByUser } from '../../service/quiz.service';
import { useApiHandler } from '../../composables/useApiHandler';
import { CHALLENGE_HISTORY_DETAIL_MESSAGE, QUIZ_FEEDBACK_MESSAGE } from '../../constants/messages';
import { notifyError } from '../../utils/notification.utils';
import ChallengeHistoryHeader from './components/ChallengeHistoryHeader.vue';
import ChallengeHistoryQuestions from './components/ChallengeHistoryQuestions.vue';
import ChallengeHistoryFeedback from './components/ChallengeHistoryFeedback.vue';
import { formatDateTimeString } from '../../utils/time.utils';
import EmptyPage from '../../components/EmptyPage.vue';

const route = useRoute();
const router = useRouter();

const quizHistory = ref<Quiz | null>(null);

async function loadQuizHistory() {
    const quizIdParam = route.params.quizId;
    const quizId = Number(quizIdParam);
    if (!quizIdParam || Number.isNaN(quizId) || quizId <= 0) {
        notifyError('Không thể xem chi tiết lịch sử thử thách: mã bài làm không hợp lệ');
        router.back();
        return;
    }

    await useApiHandler<Quiz>(
        () => getQuizHistoryDetailByUser(quizId),
        {
            loading: CHALLENGE_HISTORY_DETAIL_MESSAGE.get,
            error: CHALLENGE_HISTORY_DETAIL_MESSAGE.getError,
        },
        (data: Quiz) => {
            quizHistory.value = data;
        }
    );
}

onMounted(loadQuizHistory);

const withinOneDay = computed(() => {
    if (!quizHistory.value?.completedAt) return false;
    const completed = new Date(quizHistory.value.completedAt).getTime();
    const now = Date.now();
    return (now - completed) <= 24 * 60 * 60 * 1000;
});

async function hadnleSendFeedback(feedbackMessage: string) {
    if (!quizHistory.value) {
        notifyError("Không tìm thấy bài làm để thêm góp ý");
        return;
    }
    const addFeedbackRequest: QuizAddFeedbackRequest = {
        quizId: quizHistory.value.id,
        feedback: feedbackMessage,
    }
    await useApiHandler(
        () => addFeedback(addFeedbackRequest),
        {
            loading: QUIZ_FEEDBACK_MESSAGE.create,
            error: QUIZ_FEEDBACK_MESSAGE.createError,
        },
        () => { },
        loadQuizHistory
    )
}
</script>
<template>
    <div v-if="quizHistory">
        <el-card class="rounded-2xl shadow-lg lg:p-6">
            <ChallengeHistoryHeader :quizHistory="quizHistory" />

            <el-divider class="my-4" />

            <ChallengeHistoryQuestions :quizHistory="quizHistory" :withinOneDay="withinOneDay" />

            <el-divider class="my-4" />

            <ChallengeHistoryFeedback v-if="!quizHistory.feedback" :withinOneDay="withinOneDay"
                @send-feedback="hadnleSendFeedback" />
            <div v-else class="space-y-1 text-sm">
                <p>
                    <span class="font-medium">Góp ý lúc:</span>
                    {{ quizHistory.feedbackAt ? formatDateTimeString(quizHistory.feedbackAt) : "Không xác định" }}
                </p>
                <p>
                    <span class="font-medium">Nội dung góp ý:</span>
                    {{ quizHistory.feedback || "Không có nội dung" }}
                </p>
            </div>
        </el-card>
    </div>
    <EmptyPage v-else />
</template>
