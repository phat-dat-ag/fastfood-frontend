<script setup lang="ts">
import { ElRate } from 'element-plus';
import type { Review } from '../../../types/review.types';
import { formatDateTimeString } from '../../../utils/time.utils';

const props = defineProps<{
    reviews: Review[];
    showViewAllButton: boolean;
}>();

const emit = defineEmits(["view-all-reviews"]);

</script>

<template>
    <div class="space-y-6">
        <div v-if="props.reviews.length > 0" class="flex flex-col gap-4">
            <div v-for="review in props.reviews" :key="review.id"
                class="bg-white shadow rounded-2xl p-4 border border-gray-100">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <img v-if="review.userAvatar" :src="review.userAvatar" alt="User Avatar"
                                class="w-10 h-10 rounded-full object-cover border border-amber-200" />
                            <div v-else
                                class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold">
                                {{ review.userName.charAt(0).toUpperCase() }}
                            </div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">{{ review.userName }}</p>
                            <p class="text-sm text-gray-400">
                                {{ formatDateTimeString(review.createdAt) }}
                            </p>
                        </div>
                    </div>
                </div>

                <ElRate v-model="review.rating" disabled :max="5" show-text
                    :texts="['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời']" class="text-amber-500 mb-3" />

                <p class="text-gray-700 leading-relaxed mb-3">
                    {{ review.comment }}
                </p>

                <div v-if="review.reviewImages && review.reviewImages.length > 0" class="flex gap-2 mt-2">
                    <img v-for="(image, index) in review.reviewImages" :key="index" :src="image.imageUrl"
                        alt="Review Image"
                        class="w-1/5 h-24 object-cover rounded-lg border border-gray-100 hover:scale-105 transition-transform cursor-pointer" />
                </div>
            </div>

            <div v-if="props.showViewAllButton" class="text-center mt-4">
                <button class="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    @click="emit('view-all-reviews')">
                    Xem tất cả đánh giá →
                </button>
            </div>
        </div>

        <div v-else class="text-center py-8 text-gray-400 italic">
            Chưa có đánh giá nào cho sản phẩm này.
        </div>
    </div>
</template>

<style scoped>
.el-rate {
    --el-rate-icon-size: 22px;
}
</style>
