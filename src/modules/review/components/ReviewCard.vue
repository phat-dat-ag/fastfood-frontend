<script setup lang="ts">
import { ElRate, ElButton, ElTooltip } from "element-plus";
import { Hide } from "@element-plus/icons-vue";
import type { Review } from "../../../types/review.types";
import { formatDateTimeString } from "../../../utils/time.utils";

const props = defineProps<{
    review: Review;
    canDeleteReview: boolean;
}>();
const emit = defineEmits(["delete-review"]);

function onHideReview() {
    emit("delete-review", props.review.id);
}
</script>

<template>
    <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
            <div class="relative">
                <img v-if="props.review.userAvatar" :src="props.review.userAvatar" alt="User Avatar"
                    class="w-10 h-10 rounded-full object-cover border border-amber-200" />
                <div v-else
                    class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold">
                    {{ props.review.userName.charAt(0).toUpperCase() }}
                </div>
            </div>
            <div>
                <p class="font-semibold text-gray-800">{{ props.review.userName }}</p>
                <p class="text-sm text-gray-400">
                    {{ formatDateTimeString(props.review.createdAt) }}
                </p>
            </div>
        </div>

        <ElTooltip v-if="props.canDeleteReview" content="Ẩn đánh giá này vĩnh viễn" placement="top">
            <ElButton circle type="default" size="small"
                class="!border-gray-300 !text-gray-500 hover:!bg-gray-100 hover:!text-gray-700 transition-all"
                @click="onHideReview">
                <Hide class="w-4 h-4" />
            </ElButton>
        </ElTooltip>
    </div>

    <ElRate v-model="props.review.rating" disabled :max="5" show-text
        :texts="['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời']" class="text-amber-500 mb-3" />

    <p class="text-gray-700 leading-relaxed mb-3">
        {{ props.review.comment }}
    </p>

    <div v-if="props.review.reviewImages && props.review.reviewImages.length > 0" class="flex gap-2 mt-2">
        <img v-for="(image, index) in props.review.reviewImages" :key="index" :src="image.imageUrl" alt="Review Image"
            class="w-1/5 h-24 object-cover rounded-lg border border-gray-100 hover:scale-105 transition-transform cursor-pointer" />
    </div>
</template>
