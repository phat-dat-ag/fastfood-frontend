<script setup lang="ts">
import type { QuizFeedback } from '../../../types/quiz-feedback.types';
import { formatDateTimeString } from '../../../utils/time.utils';

const props = defineProps<{ feedbacks: QuizFeedback[] }>();

</script>
<template>
    <div class="grid gap-4 mt-6">
        <div v-for="item in props.feedbacks" :key="item.quizId + '-' + item.userName + '-' + item.feedbackAt"
            class="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition duration-200 border border-orange-100">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-orange-600">
                    {{ item.topicName }} ({{ item.topicDifficultyName }})
                </h3>
                <span class="text-sm text-gray-500">{{ formatDateTimeString(item.feedbackAt) }}</span>
            </div>

            <span class="mt-3 text-gray-60">Người gửi: <strong>{{ item.userName }}</strong></span>

            <p class="text-gray-700 leading-relaxed break-words">{{ item.feedback }}</p>
        </div>
    </div>
</template>