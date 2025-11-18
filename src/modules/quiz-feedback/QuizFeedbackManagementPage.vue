<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QuizFeedbackResponse } from '../../types/quiz-feedback.types';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import { useApiHandler } from '../../composables/useApiHandler';
import { getAllFeedbackByAdmin } from '../../service/quiz.service';
import { QUIZ_FEEDBACK_MESSAGE } from '../../constants/messages';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import Pagination from '../../components/Pagination.vue';
import type { Filter } from '../../types/filter.types';
import FeedbackList from './components/FeedbackList.vue';

const feedbackResponse = ref<QuizFeedbackResponse | null>(null);

async function loadFeedbacks(page: number = 0) {
    const request: PageRequest = {
        page,
        size: PAGE_SIZE.QUIZ_FEEDBACK,
    }
    await useApiHandler<QuizFeedbackResponse>(
        () => getAllFeedbackByAdmin(request),
        {
            loading: QUIZ_FEEDBACK_MESSAGE.get,
            error: QUIZ_FEEDBACK_MESSAGE.getError,
        },
        (data: QuizFeedbackResponse) => feedbackResponse.value = data,
    )
}

onMounted(loadFeedbacks);

const filterOptions: Filter[] = [
    { label: 'Dưới 2 sao', value: 'less-then-2-start' },
    { label: 'Dưới 3 sao', value: 'less-then-3-start' },
    { label: 'Gần đây', value: 'recently' },
];

const activeFilters = ref<any[]>([]);

function handleFilterChange(filters: any[]) {
    activeFilters.value = filters;
    console.log(activeFilters.value);
}

const search = ref<string>("");

function handleSearchChange(searchText: string) {
    search.value = searchText;
    console.log(search.value);
}

async function handlePageChange(page: number) {
    await loadFeedbacks(page);
}
</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý các góp ý trò chơi
        </h2>
        <div v-if="feedbackResponse">
            <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
                @update:filter="handleFilterChange" />

            <FeedbackList :feedbacks="feedbackResponse.feedbacks" />

            <Pagination :totalItem="feedbackResponse.totalItems" :pageSize="feedbackResponse.pageSize"
                :currentPage="feedbackResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
</template>