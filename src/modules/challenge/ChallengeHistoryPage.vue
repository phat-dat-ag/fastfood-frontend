<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Quiz } from '../../types/quiz.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getAllReviewQuizzesByUser } from '../../service/quiz.service';
import { CHALLENGE_HISTORY_MESSAGE } from '../../constants/messages';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import ChallengeHistoryTable from './components/ChallengeHistoryTable.vue';

const historyQuizzes = ref<Quiz[]>([]);
async function loadHistoryQuizzes() {
    await useApiHandler<Quiz[]>(
        getAllReviewQuizzesByUser,
        {
            loading: CHALLENGE_HISTORY_MESSAGE.get,
            error: CHALLENGE_HISTORY_MESSAGE.getError,
        },
        (data: Quiz[]) => historyQuizzes.value = data,
    )
}

onMounted(loadHistoryQuizzes);
</script>
<template>
    <div class="mx-auto space-y-6">
        <div
            class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold drop-shadow-md">Lịch sử thách thức</h1>
                <p class="text-white/90 mt-1">Tại đây bạn có thể xem tất cả thách thức đã tham gia.</p>
            </div>
            <div class="w-[20%]">
                <PrimaryButton label="Làm mới" :onClick="loadHistoryQuizzes" />
            </div>
        </div>
        <ChallengeHistoryTable :quizzes="historyQuizzes" />
    </div>
</template>