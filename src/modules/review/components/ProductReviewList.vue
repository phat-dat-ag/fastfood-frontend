<script setup lang="ts">
import { computed } from 'vue';
import type { Review } from '../../../types/review.types';
import ReviewCard from './ReviewCard.vue';

const props = defineProps<{
    reviews: Review[];
    showViewAllButton: boolean;
    canDeleteReviewByAdmin?: boolean;
}>();

const canHide = computed(() => props.canDeleteReviewByAdmin ?? false);
const emit = defineEmits(["view-all-reviews", "delete-review"]);

function onHideReview(reviewId: number) {
    emit("delete-review", reviewId);
}
</script>

<template>
    <div class="space-y-6">
        <div v-if="props.reviews.length > 0" class="flex flex-col gap-4">
            <div v-for="review in props.reviews" :key="review.id"
                class="bg-white shadow rounded-2xl p-4 border border-gray-100">
                <ReviewCard :review="review" :canDeleteReview="canHide" @delete-review="onHideReview" />
            </div>

            <div v-if="props.showViewAllButton" class="text-center mt-4">
                <button class="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    @click="emit('view-all-reviews')">
                    Xem tất cả đánh giá →
                </button>
            </div>
        </div>

        <div v-else class="text-center py-8 text-gray-400 italic">
            Chưa có đánh giá nào.
        </div>
    </div>
</template>

<style scoped>
.el-rate {
    --el-rate-icon-size: 22px;
}
</style>
