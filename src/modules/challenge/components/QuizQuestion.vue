<script setup lang="ts">
import { ElCard } from 'element-plus';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import type { Question } from '../../../types/question.types';

interface QuizPaginationProps {
    currentQuestion: Question | null;
    currentIndex: number;
    questionCount: number;
    selectedAnswers: Record<number, number | null>;
    goToQuestion: (index: number) => void;
    selectAnswer: (questionId: number, answerId: number) => void;
}

const props = defineProps<QuizPaginationProps>();

</script>
<template>
    <ElCard v-if="props.currentQuestion" class="p-4 border border-gray-200 rounded-2xl shadow-sm">
        <h3 class="text-lg font-semibold mb-2 text-gray-800">
            Câu {{ currentIndex + 1 }} / {{ props.questionCount }}
        </h3>
        <div class="prose max-w-none mb-3" v-html="props.currentQuestion.content"></div>

        <div v-if="props.currentQuestion.imageUrl" class="my-3 text-center">
            <img :src="props.currentQuestion.imageUrl" alt="Question Image"
                class="max-h-60 rounded-lg mx-auto border object-contain" />
        </div>

        <div v-if="props.currentQuestion.audioUrl" class="my-3">
            <audio :src="props.currentQuestion.audioUrl" controls class="w-full"></audio>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
            <div v-for="answer in props.currentQuestion.answers" :key="answer.id"
                class="cursor-pointer p-4 border rounded-xl flex flex-col items-center justify-center transition-all duration-200"
                :class="props.selectedAnswers[props.currentQuestion.id] === answer.id
                    ? 'bg-orange-100 border-orange-500 shadow'
                    : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50'"
                @click="props.selectAnswer(props.currentQuestion.id, answer.id)">
                <template v-if="answer.imageUrl">
                    <img :src="answer.imageUrl" alt="Answer Image" class="max-h-32 object-contain rounded-md" />
                </template>
                <template v-else>
                    <p class="text-base text-center">{{ answer.content }}</p>
                </template>
            </div>
        </div>

        <div class="flex justify-between gap-4 mt-6">
            <div class="w-full lg:w-[20%]">
                <PrimaryButton label="Câu trước" @click="goToQuestion(props.currentIndex - 1)" />
            </div>
            <div class="w-full lg:w-[20%]">
                <PrimaryButton label="Câu tiếp theo" @click="goToQuestion(props.currentIndex + 1)" />
            </div>
        </div>
    </ElCard>
</template>