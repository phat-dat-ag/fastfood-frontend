<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Quiz } from '../../types/quiz.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getAllReviewQuizzesByUser } from '../../service/quiz.service';
import { CHALLENGE_HISTORY_MESSAGE } from '../../constants/messages';
import ChallengeHistoryTable from './components/ChallengeHistoryTable.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/useUserStore.store';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';
import HeaderCard from '../../components/HeaderCard.vue';

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

const router = useRouter();
const userStore = useUserStore();

function handleViewChallengeHistoryDetail(quizId: number) {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.CHALLENGE_HISTORY_DETAIL, params: { quizId } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.CHALLENGE_HISTORY_DETAIL, params: { quizId } });
    else notifyError("Tài khoản không đủ quyền để xem chi tiết tham gia thử thách");
}

onMounted(loadHistoryQuizzes);
</script>
<template>
    <div class="mx-auto space-y-8">
        <HeaderCard title="Lịch sử tham gia thách thức"
            description="Tại đây bạn có thể xem tất cả thách thức đã tham gia." buttonLabel="Làm mới"
            :onClick="loadHistoryQuizzes" />
        <ChallengeHistoryTable :quizzes="historyQuizzes"
            :handleViewChallengeHistoryDetail="handleViewChallengeHistoryDetail" />
    </div>
</template>