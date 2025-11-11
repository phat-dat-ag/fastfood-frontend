<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElCard, ElDivider } from 'element-plus';
import type { Quiz } from '../../types/quiz.types';
import { getQuizHistoryDetailByUser } from '../../service/quiz.service';
import { useApiHandler } from '../../composables/useApiHandler';
import { CHALLENGE_HISTORY_DETAIL_MESSAGE } from '../../constants/messages';
import { notifyError } from '../../utils/notification.utils';
import ChallengeHistoryHeader from './components/ChallengeHistoryHeader.vue';
import ChallengeHistoryQuestions from './components/ChallengeHistoryQuestions.vue';
import ChallengeHistoryFeedback from './components/ChallengeHistoryFeedback.vue';

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
    console.log("Feedback: ", feedbackMessage);
}
</script>
<template>
    <div>
        <el-card v-if="quizHistory" class="rounded-2xl shadow-lg p-6">
            <ChallengeHistoryHeader :quizHistory="quizHistory" />

            <el-divider class="my-4" />

            <ChallengeHistoryQuestions :quizHistory="quizHistory" :withinOneDay="withinOneDay" />

            <el-divider class="my-4" />

            <ChallengeHistoryFeedback :withinOneDay="withinOneDay" @send-feedback="hadnleSendFeedback" />
        </el-card>
    </div>
</template>
