<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import AddButton from '../../../components/buttons/AddButton.vue';
import { ROUTE_NAMES } from '../../../constants/route-names';
import { useApiHandler } from '../../../composables/useApiHandler';
import type { Question } from '../../../types/question.types';
import { getAllQuestionByTopicDifficulty } from '../../../service/question.service';
import { QUESTION_MESSAGE } from '../../../constants/messages';
import { onMounted, ref } from 'vue';
import { ElSwitch, ElCard } from 'element-plus';

const route = useRoute();
const router = useRouter();

const questions = ref<Question[]>([]);

async function loadQuestions() {
  const slug = route.params.slug?.toString() || "";
  await useApiHandler<Question[]>(
    () => getAllQuestionByTopicDifficulty(slug),
    {
      loading: QUESTION_MESSAGE.get,
      error: QUESTION_MESSAGE.getError,
    },
    (data: Question[]) => {
      questions.value = data.map((q) => ({
        ...q,
        isActivated: Boolean(q.activated),
      }));
    }
  );
}

onMounted(loadQuestions);
</script>

<template>
  <AddButton label="Thêm các câu hỏi cho độ khó này"
    :onClick="() => router.push({ name: ROUTE_NAMES.ADMIN.ADD_QUESTION_PAGE })" />

  <div v-if="questions && questions.length > 0" class="space-y-6 mt-4">
    <el-card v-for="(question, qIndex) in questions" :key="qIndex"
      class="shadow-md p-4 rounded-2xl border border-gray-200">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold mb-2">Câu hỏi {{ qIndex + 1 }}</h3>
          <div class="prose max-w-none" v-html="question.content"></div>

          <div v-if="question.imageUrl" class="mt-3">
            <img :src="question.imageUrl" alt="Question Image" class="max-h-60 rounded-lg object-contain border" />
          </div>

          <div v-if="question.audioUrl" class="mt-3">
            <audio :src="question.audioUrl" controls></audio>
          </div>
        </div>

        <div class="ml-4 flex flex-col items-center">
          <span class="text-sm text-gray-600 mb-1">Kích hoạt</span>
          <el-switch v-model="question.activated" active-color="#13ce66" inactive-color="#dcdfe6" disabled />
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <div v-for="(answer, aIndex) in question.answers" :key="aIndex"
          class="p-3 rounded-lg flex flex-col items-center justify-center text-center border transition-all duration-200"
          :class="[
            answer.correct
              ? 'border-green-600 bg-green-100 shadow-sm'
              : 'border-gray-200 bg-white',
          ]">
          <template v-if="answer.imageUrl">
            <img :src="answer.imageUrl" alt="Answer Image" class="max-h-40 object-contain rounded-md" />
          </template>

          <template v-else>
            <p class="text-base">{{ answer.content }}</p>
          </template>
        </div>
      </div>
    </el-card>
  </div>

  <div v-else class="text-center text-gray-500 mt-6">
    Chưa có câu hỏi nào cho độ khó này.
  </div>
</template>