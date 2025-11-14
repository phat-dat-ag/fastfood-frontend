<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import type { Quiz } from '../../../types/quiz.types';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { formatDateTimeString } from '../../../utils/time.utils';
import { ElDialog } from 'element-plus';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue';

const props = defineProps<{
    quiz: Quiz | null;
}>();
const emit = defineEmits(["close", "review-quiz"]);

const isVisible = ref(true);

function goToReview() {
    if (!props.quiz?.id) return;
    emit("review-quiz", props.quiz.id);
}
</script>
<template>
    <ElDialog v-model="isVisible" width="500px" @close="emit('close')">
        <template #title>
            <div class="flex items-center justify-center">
                <h2 class="text-3xl font-bold">
                    <span v-if="quiz?.promotion">🎉 Chiến Công Lẫy Lừng!</span>
                    <span v-else>😢 Chia buồn!</span>
                </h2>
            </div>
        </template>

        <div v-if="quiz" class="space-y-4 p-4">
            <p class="text-center text-gray-700 text-lg">
                <span v-if="quiz.promotion">Đây là phần thưởng của bạn!</span>
                <span v-else>Đừng buồn, hãy thử lại lần sau nhé!</span>
            </p>

            <div v-if="quiz.promotion"
                class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm space-y-1">
                <p>
                    <strong>Code:</strong> <span class="text-green-700 font-semibold">{{ quiz.promotion.code }}</span>
                </p>
                <p>
                    <strong>Giảm: </strong>
                    <span class="text-green-700 font-semibold">
                        {{ quiz.promotion.type === "FIXED_AMOUNT" ? formatCurrencyVND(quiz.promotion.value.toString()) :
                            quiz.promotion.value + '%' }}
                    </span>
                </p>
                <p><strong>Cho đơn từ:</strong> {{ formatCurrencyVND(quiz.promotion.minSpendAmount.toString()) }}</p>
                <p>
                    <strong>Giảm tối đa:</strong> {{ formatCurrencyVND(quiz.promotion.maxDiscountAmount.toString()) }}
                </p>
                <p><strong>Bắt đầu:</strong> {{ formatDateTimeString(quiz.promotion.startAt) }}</p>
                <p><strong>Kết thúc:</strong> {{ formatDateTimeString(quiz.promotion.endAt) }}</p>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1 border border-gray-100 shadow-inner">
                <p><strong>Chủ đề:</strong> {{ quiz.topicDifficulty.topicName || '...' }}</p>
                <p><strong>Độ khó:</strong> {{ quiz.topicDifficulty.name || '...' }}</p>
                <p><strong>Bắt đầu:</strong> {{ formatDateTimeString(quiz.startedAt) }}</p>
                <p><strong>Nộp bài:</strong>
                    {{ quiz.completedAt ? formatDateTimeString(quiz.completedAt) : "Không xácđịnh" }}
                </p>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-center space-x-4">
                <SecondaryButton label="Đóng" :onClick="() => emit('close')" />
                <PrimaryButton label="Xem lại bài" :onClick="() => goToReview()" />
            </div>
        </template>
    </ElDialog>
</template>