<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QuizHistoryResponse } from '../../types/quiz.types';
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
import EmptyPage from '../../components/EmptyPage.vue';
import Pagination from '../../components/Pagination.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import ChallengeHistoryCardList from './components/ChallengeHistoryCardList.vue';

const historyQuizResponse = ref<QuizHistoryResponse | null>(null);
async function loadHistoryQuizzes(page: number = 0) {
    const request: PageRequest = {
        page,
        size: PAGE_SIZE.QUIZ_HISTORY,
    }
    await useApiHandler<QuizHistoryResponse>(
        () => getAllReviewQuizzesByUser(request),
        {
            loading: CHALLENGE_HISTORY_MESSAGE.get,
            error: CHALLENGE_HISTORY_MESSAGE.getError,
        },
        (data: QuizHistoryResponse) => historyQuizResponse.value = data,
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

async function handlePageChange(page: number) {
    await loadHistoryQuizzes(page);
}
</script>
<template>
    <div v-if="historyQuizResponse && historyQuizResponse.quizzes.length > 0" class="mx-auto space-y-8">
        <HeaderCard title="Lịch sử tham gia thách thức"
            description="Tại đây bạn có thể xem tất cả thách thức đã tham gia." buttonLabel="Làm mới"
            :onClick="loadHistoryQuizzes" />
        <div class="hidden lg:block">
            <ChallengeHistoryTable :quizzes="historyQuizResponse.quizzes"
                :handleViewChallengeHistoryDetail="handleViewChallengeHistoryDetail" />
        </div>

        <div class="block lg:hidden">
            <ChallengeHistoryCardList :quizzes="historyQuizResponse.quizzes"
                :handleViewChallengeHistoryDetail="handleViewChallengeHistoryDetail" />
        </div>
        <Pagination :totalItem="historyQuizResponse.totalItems" :pageSize="historyQuizResponse.pageSize"
            :currentPage="historyQuizResponse.currentPage" @change-page="handlePageChange" />
    </div>
    <EmptyPage v-else />
</template>