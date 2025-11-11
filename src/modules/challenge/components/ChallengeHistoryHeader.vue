<script setup lang="ts">
import { computed } from 'vue';
import type { Quiz } from '../../../types/quiz.types';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { formatDateTimeString } from '../../../utils/time.utils';
import type { Answer } from '../../../types/answer.types';

const props = defineProps<{
    quizHistory: Quiz;
}>();

const totalScore = computed(() => {
    if (!props.quizHistory) return { correct: 0, total: 0 };
    const questions = props.quizHistory.questions || [];
    let correct = 0;
    for (const q of questions) {
        const found = q.answers.find((a: Answer) => a.selectedByUser && a.correct);
        if (found) correct += 1;
    }
    return { correct, total: questions.length };
});
</script>
<template>
    <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="space-y-2">
            <h1 class="text-2xl font-bold text-orange-600">Chi tiết thử thách</h1>

            <p class="text-gray-700 leading-relaxed">
                <span class="block">
                    <span class="font-semibold text-gray-800">Chủ đề:</span>
                    {{ props.quizHistory.topicDifficulty.topicName || props.quizHistory.topicDifficulty.name }}
                </span>
                <span class="block">
                    <span class="font-semibold text-gray-800">Độ khó:</span>
                    {{ props.quizHistory.topicDifficulty.name }}
                </span>
            </p>

            <p class="text-gray-500 text-sm mt-1">
                ⏱ <span class="font-medium">{{ props.quizHistory.topicDifficulty.duration }} giây</span>
                • 🧩 <span class="font-medium">
                    {{ props.quizHistory.topicDifficulty.questionCount }} câu hỏi
                </span>
                • 🎯 Điểm cần đạt:
                <span class="font-medium">{{ props.quizHistory.topicDifficulty.minCorrectToReward }}</span>
            </p>

            <p class="text-gray-500 text-sm">
                🕒 Bắt đầu:
                <span class="font-medium">
                    {{ formatDateTimeString(props.quizHistory.startedAt) }}
                </span>
                • Nộp bài:
                <span class="font-medium">
                    {{ formatDateTimeString(props.quizHistory.completedAt) }}
                </span>
            </p>
        </div>

        <div class="flex flex-col md:items-end gap-4">
            <div v-if="quizHistory?.user" class="flex items-center gap-3">
                <img :src="quizHistory.user.avatarUrl || '/default-avatar.png'" alt="avatar"
                    class="w-10 h-10 rounded-full border object-cover" />
                <div>
                    <div class="font-semibold text-gray-800">{{ props.quizHistory.user.name }}</div>
                    <div class="text-xs text-gray-500">{{ props.quizHistory.user.email }}</div>
                </div>
            </div>

            <div class="text-center">
                <div class="text-sm text-gray-500">Tổng điểm</div>
                <div class="text-3xl font-bold text-orange-600">
                    {{ totalScore.correct }} / {{ totalScore.total }}
                </div>
            </div>

            <div v-if="props.quizHistory.promotion"
                class="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-gray-700 w-full md:w-72">
                <div class="flex items-center justify-between">
                    <div class="font-semibold text-orange-700">🎁 Phần thưởng</div>
                    <el-tag type="warning" class="bg-orange-100 text-orange-700 border-orange-300">
                        {{ props.quizHistory.promotion.code }}
                    </el-tag>
                </div>

                <div class="mt-2">
                    <div class="font-medium">{{ props.quizHistory.promotion.name }}</div>
                    <div class="text-xs text-gray-600 mt-1">
                        Giá trị:
                        <span v-if="props.quizHistory.promotion.type === 'FIXED_AMOUNT'">
                            {{ formatCurrencyVND(props.quizHistory.promotion.value.toString()) }}
                        </span>
                        <span v-else-if="props.quizHistory.promotion.type === 'PERCENTAGE'">
                            {{ props.quizHistory.promotion.value }}%
                        </span>
                    </div>

                    <div class="text-xs text-gray-600 mt-1">
                        Áp dụng cho đơn tối thiểu:
                        {{ formatCurrencyVND(props.quizHistory.promotion.minSpendAmount.toString()) }}
                    </div>

                    <div class="text-xs text-gray-600 mt-1">
                        Giảm tối đa:
                        {{ formatCurrencyVND(props.quizHistory.promotion.maxDiscountAmount.toString()) }}
                    </div>

                    <div class="text-xs text-gray-500 mt-1">
                        Hiệu lực:
                        {{ formatDateTimeString(props.quizHistory.promotion.startAt) }}
                        –
                        {{ formatDateTimeString(props.quizHistory.promotion.endAt) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>