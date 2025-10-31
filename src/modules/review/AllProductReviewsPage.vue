<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notifyError } from '../../utils/notification.utils';
import { useApiHandler } from '../../composables/useApiHandler';
import type { Review } from '../../types/review.types';
import { getAllReviewsByProduct } from '../../service/review.service';
import { ALL_PRODUCT_REVIEW_MESSAGE } from '../../constants/messages';
import ProductReviewList from './components/ProductReviewList.vue';

const route = useRoute();
const router = useRouter();

const reviews = ref<Review[]>([]);

async function loadReviews(productId: number) {
    await useApiHandler<Review[]>(
        () => getAllReviewsByProduct(productId),
        {
            loading: ALL_PRODUCT_REVIEW_MESSAGE.get,
            error: ALL_PRODUCT_REVIEW_MESSAGE.getError,
        },
        (data: Review[]) => reviews.value = data,
    )
}

onMounted(() => {
    const productIdParam = route.params.productId;
    const productId = Number(productIdParam);

    if (!productIdParam || Number.isNaN(productId) || productId <= 0) {
        notifyError('Không thể xem các đánh giá: mã sản phẩm không hợp lệ');
        router.back();
        return;
    }
    loadReviews(productId);
})
</script>
<template>
    <div class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg">
        <div>
            <h1 class="text-3xl font-bold drop-shadow-md">Đánh giá sản phẩm</h1>
            <p class="text-white/90 mt-1">Các đánh giá về sản phẩm tại đây</p>
        </div>
    </div>
    <div class="mt-4">
        <ProductReviewList v-if="reviews.length > 0" :reviews="reviews" :showViewAllButton="false" />
    </div>
</template>