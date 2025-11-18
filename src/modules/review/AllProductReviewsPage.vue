<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notifyError } from '../../utils/notification.utils';
import { useApiHandler } from '../../composables/useApiHandler';
import type { Review } from '../../types/review.types';
import { getAllReviewsByProduct } from '../../service/review.service';
import { ALL_PRODUCT_REVIEW_MESSAGE } from '../../constants/messages';
import ProductReviewList from './components/ProductReviewList.vue';
import HeaderCard from '../../components/HeaderCard.vue';

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
    <div v-if="reviews.length > 0" class="mx-auto space-y-8">
        <HeaderCard title="Đánh giá sản phẩm" description="Các đánh giá về sản phẩm tại đây" />
        <ProductReviewList v-if="reviews.length > 0" :reviews="reviews" :showViewAllButton="false" />
    </div>
</template>