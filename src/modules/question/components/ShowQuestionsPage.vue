<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import AddButton from '../../../components/buttons/AddButton.vue';
import { ROUTE_NAMES } from '../../../constants/route-names';
import { useApiHandler } from '../../../composables/useApiHandler';
import type { QuestionResponse } from '../../../types/question.types';
import { activateQuestion, deactivateQuestion, deleteQuestion, getAllQuestionByTopicDifficulty } from '../../../service/question.service';
import { QUESTION_MESSAGE } from '../../../constants/messages';
import { onMounted, ref } from 'vue';
import { ElCard } from 'element-plus';
import { Delete } from "@element-plus/icons-vue";
import type { PageRequest } from '../../../types/pagination.types';
import { PAGE_SIZE } from '../../../constants/pagination';
import Pagination from '../../../components/Pagination.vue';
import Switch from '../../../components/buttons/Switch.vue';
import { openConfirmDeleteMessage } from '../../../utils/confirmation.utils';
import type { SwitchResponse } from '../../../types/switch-button.types';

const route = useRoute();
const router = useRouter();

const questionResponse = ref<QuestionResponse | null>(null);

async function loadQuestions(page: number = 0) {
  const slug = route.params.slug?.toString() || "";
  const request: PageRequest = {
    page,
    size: PAGE_SIZE.QUESTION,
  }
  await useApiHandler<QuestionResponse>(
    () => getAllQuestionByTopicDifficulty(slug, request),
    {
      loading: QUESTION_MESSAGE.get,
      error: QUESTION_MESSAGE.getError,
    },
    (data: QuestionResponse) => questionResponse.value = data,
  );
}

onMounted(loadQuestions);

async function handleActivateQuestion(payload: SwitchResponse) {
  const page = questionResponse.value?.currentPage || 0;
  await useApiHandler(
    () => activateQuestion(payload.targetId),
    {
      loading: "Đang kích hoạt câu hỏi",
      error: "Lỗi kích hoạt câu hỏi",
    },
    () => { },
    () => loadQuestions(page)
  )
}

async function handleDeactivateQuestion(payload: SwitchResponse) {
  const page = questionResponse.value?.currentPage || 0;
  await useApiHandler(
    () => deactivateQuestion(payload.targetId),
    {
      loading: "Đang hủy kích hoạt câu hỏi",
      error: "Lỗi hủy kích hoạt câu hỏi",
    },
    () => { },
    () => loadQuestions(page)
  )
}

async function handleDeleteQuestion(questionId: number) {
  const confirmed = await openConfirmDeleteMessage("Xóa vĩnh viễn câu hỏi này?");
  if (!confirmed) return;
  await useApiHandler(
    () => deleteQuestion(questionId),
    {
      loading: "Đang xóa câu hỏi",
      error: "Lỗi xóa câu hỏi",
    },
    () => { },
    loadQuestions
  )
}

async function handlePageChange(page: number) {
  await loadQuestions(page);
}
</script>

<template>
  <AddButton label="Thêm các câu hỏi cho độ khó này"
    :onClick="() => router.push({ name: ROUTE_NAMES.ADMIN.ADD_QUESTION_PAGE })" />

  <div v-if="questionResponse && questionResponse.questions.length > 0" class="space-y-6 mt-4">
    <el-card v-for="(question, qIndex) in questionResponse.questions" :key="qIndex"
      class="shadow-md p-4 rounded-2xl border border-gray-200">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold mb-2">Câu hỏi {{ questionResponse.currentPage * questionResponse.pageSize
            + qIndex + 1 }}</h3>
          <div class="prose max-w-none" v-html="question.content"></div>

          <div v-if="question.imageUrl" class="mt-3">
            <img :src="question.imageUrl" alt="Question Image" class="max-h-60 rounded-lg object-contain border" />
          </div>

          <div v-if="question.audioUrl" class="mt-3">
            <audio :src="question.audioUrl" controls></audio>
          </div>
        </div>

        <div class="ml-4 flex items-center gap-4">
          <Switch :isActive="question.activated" :targetId="question.id" @activate="handleActivateQuestion"
            @deactivate="handleDeactivateQuestion" />
          <Delete @click="() => handleDeleteQuestion(question.id)" class="w-6 h-6" />
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

    <Pagination :totalItem="questionResponse.totalItems" :pageSize="questionResponse.pageSize"
      :currentPage="questionResponse.currentPage" @change-page="handlePageChange" />
  </div>

  <div v-else class="text-center text-gray-500 mt-6">
    Chưa có câu hỏi nào cho độ khó này.
  </div>
</template>