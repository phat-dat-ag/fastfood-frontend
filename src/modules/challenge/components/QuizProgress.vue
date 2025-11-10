<script setup lang="ts">
import { ElCard } from 'element-plus';
import type { QuestionInQuiz } from '../../../types/question.types';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import { computed } from 'vue';

interface QuizPogressPorps {
    selectedAnswers: Record<number, number | null>;
    questions: QuestionInQuiz[];
    goToQuestion: (index: number) => void;
    handleSubmitQuiz: () => Promise<void>;
    remainingTime: number;
}
const props = defineProps<QuizPogressPorps>();

const formattedTime = computed(() => {
    const min = Math.floor(props.remainingTime / 60);
    const sec = props.remainingTime % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
});

</script>

<template>
    <ElCard class="p-4 border border-gray-200 rounded-2xl shadow-sm">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Tiến độ</h3>

        <div class="flex flex-wrap gap-2 mb-4">
            <div v-for="(question, index) in props.questions" :key="question.id"
                class="w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold cursor-pointer" :class="props.selectedAnswers[question.id] !== null
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700'" @click="props.goToQuestion(index)">
                {{ index + 1 }}
            </div>
        </div>

        <h4 class="mt-2 font-semibold">Thời gian còn lại: </h4>
        <p class="my-2 text-xl font-bold text-red-600">{{ formattedTime }}</p>

        <PrimaryButton label="Nộp bài" :onClick="props.handleSubmitQuiz" />
    </ElCard>
</template>