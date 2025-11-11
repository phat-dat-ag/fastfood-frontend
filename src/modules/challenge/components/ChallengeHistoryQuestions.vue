<script setup lang="ts">
import type { Answer } from '../../../types/answer.types';
import type { Quiz } from '../../../types/quiz.types';
import type { Question } from '../../../types/question.types';

const props = defineProps<{
    quizHistory: Quiz;
    withinOneDay: boolean;
}>();

function scoreForQuestion(q: Question) {
    const correctSelected = q.answers.find(a => a.selectedByUser && a.correct);
    return correctSelected ? 1 : 0;
}

function answerClasses(answer: Answer) {
    const classes = [
        'p-3',
        'rounded-lg',
        'border',
        'transition-all',
        'duration-200',
        'text-sm',
        'flex',
        'items-center',
        'justify-center',
        'min-h-[56px]',
        'whitespace-pre-wrap',
    ];

    if (props.withinOneDay) {
        if (answer.correct) {
            classes.push('border-green-600', 'bg-green-50');
        } else {
            classes.push('border-gray-200', 'bg-white');
        }

        if (answer.selectedByUser && !answer.correct) {
            classes.push('border-red-500', 'bg-red-50');
        }
    } else {
        if (answer.selectedByUser) {
            classes.push('border-orange-500', 'bg-orange-50');
        } else {
            classes.push('border-gray-200', 'bg-white');
        }
    }
    return classes.join(' ');
}
</script>
<template>
    <div v-if="props.quizHistory.questions.length > 0" class="space-y-4">
        <el-card v-for="(question, questionIndex) in props.quizHistory.questions" :key="question.id"
            class="p-4 rounded-xl border-gray-200">
            <div class="flex flex-col md:flex-row md:justify-between gap-3">
                <div class="flex-1">
                    <div>
                        <div class="w-full flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-800">
                                Câu {{ questionIndex + 1 }}.
                            </h3>
                            <span class="text-lg font-bold"
                                :class="scoreForQuestion(question) ? 'text-green-600' : 'text-gray-700'">
                                Điểm: {{ scoreForQuestion(question) }} / 1
                            </span>
                        </div>

                        <div class="prose max-w-none mt-2" v-html="question.content"></div>

                        <div v-if="question.imageUrl" class="mt-3">
                            <img :src="question.imageUrl" alt="Ảnh câu hỏi"
                                class="max-h-48 rounded-md object-contain border" />
                        </div>

                        <div v-if="question.audioUrl" class="mt-3">
                            <audio :src="question.audioUrl" controls></audio>
                        </div>
                    </div>

                    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div v-for="(answer) in question.answers" :key="answer.id" :class="answerClasses(answer)">
                            <template v-if="answer.imageUrl">
                                <img :src="answer.imageUrl" alt="answer-image"
                                    class="max-h-40 object-contain rounded-md" />
                            </template>
                            <template v-else>
                                <div class="w-full text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <span class="text-base break-words">{{ answer.content }}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
    <div v-else class="text-center text-gray-500 py-8">
        Không có câu hỏi nào.
    </div>
</template>