<script setup lang="ts">
import TextButton from '../../../components/buttons/TextButton.vue';
import type { Quiz } from '../../../types/quiz.types';
import { formatDateTimeString } from '../../../utils/time.utils';

const props = defineProps<{
    quizzes: Quiz[];
    handleViewChallengeHistoryDetail: (quizId: number) => void;
}>();
</script>

<template>
    <div class="space-y-4">
        <div v-for="item in props.quizzes" :key="item.id"
            class="bg-white rounded-2xl shadow-md border border-orange-200 p-4">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg text-gray-800">
                    {{ item.topicDifficulty.topicName }}
                </h3>

                <TextButton label="Chi tiết" :onClick="() => props.handleViewChallengeHistoryDetail(item.id)" />
            </div>

            <p class="text-sm text-gray-600 mt-2">
                <span class="font-medium">Độ khó:</span>
                {{ item.topicDifficulty.name }}
            </p>

            <p class="text-sm text-gray-600">
                <span class="font-medium">Bắt đầu:</span>
                {{ formatDateTimeString(item.startedAt) }}
            </p>

            <p class="text-sm text-gray-600">
                <span class="font-medium">Nộp bài:</span>
                {{ formatDateTimeString(item.completedAt || "") }}
            </p>

            <p class="text-sm text-gray-600" v-if="item.promotion">
                <span class="font-medium">Mã khuyến mãi:</span>
                {{ item.promotion.code }}
            </p>
        </div>
    </div>
</template>
