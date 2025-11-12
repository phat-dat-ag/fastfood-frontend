<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ReviewResponse } from '../../types/review.types';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteReview, getAllReviewsByAdmin } from '../../service/review.service';
import { ADMIN_MANAGEMENT_REVIEW_MESSAGE } from '../../constants/messages';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import Pagination from '../../components/Pagination.vue';
import ProductReviewList from './components/ProductReviewList.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const reviewResponse = ref<ReviewResponse | null>(null);

async function loadAllReviews(page: number = 0) {
    const request: PageRequest = {
        page,
        size: PAGE_SIZE.REIVEWS.ADMIN,
    }
    await useApiHandler<ReviewResponse>(
        () => getAllReviewsByAdmin(request),
        {
            loading: ADMIN_MANAGEMENT_REVIEW_MESSAGE.get,
            error: ADMIN_MANAGEMENT_REVIEW_MESSAGE.getError,
        },
        (data: ReviewResponse) => reviewResponse.value = data,
    )
}

onMounted(loadAllReviews);

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
    await loadAllReviews(page);
}

async function handleDeleteReview(reviewId: number) {
    const confirmed = await openConfirmDeleteMessage("Sau khi xóa, người dùng vĩnh không thể xem đánh giá nữa?");
    if (!confirmed) return
    await useApiHandler(
        () => deleteReview(reviewId),
        {
            loading: ADMIN_MANAGEMENT_REVIEW_MESSAGE.delete,
            error: ADMIN_MANAGEMENT_REVIEW_MESSAGE.deleteError,
            success: ADMIN_MANAGEMENT_REVIEW_MESSAGE.deleteSuccess,
        },
        () => { },
        loadAllReviews,
    )
}
</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý đơn hàng hệ thống
        </h2>
        <div v-if="reviewResponse">
            <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
                @update:filter="handleFilterChange" />

            <ProductReviewList :reviews="reviewResponse.reviews" :showViewAllButton="false"
                :canDeleteReviewByAdmin="true" @delete-review="handleDeleteReview" />

            <Pagination :totalItem="reviewResponse.totalItems" :pageSize="reviewResponse.pageSize"
                :currentPage="reviewResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
</template>