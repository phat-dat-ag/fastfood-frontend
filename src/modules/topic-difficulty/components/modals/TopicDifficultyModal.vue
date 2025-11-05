<script setup lang="ts">
import * as yup from "yup"
import { ErrorMessage, Field, Form } from 'vee-validate';
import PrimaryButton from '../../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../../components/buttons/SecondaryButton.vue';
import { ElDialog, ElSwitch } from 'element-plus';
import { ref } from 'vue';
import { notifyError } from "../../../../utils/notification.utils";
import type { TopicDifficultyCreateRequest, TopicDifficultyUpdateRequest } from "../../../../types/topic-difficulty.types";
import { useTopicDifficultyStore } from "../../../../store/useTopicDifficultyStore.store";

interface TopicDifficultyModalPorps {
    isCreatingTopicDifficulty: boolean;
}

const props = defineProps<TopicDifficultyModalPorps>();
const emit = defineEmits(["create-topic-difficulty", "update-topic-difficulty", "close"]);

const isVisible = ref<boolean>(true);

const schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên độ khó chủ đề").test("check-topic-difficulty-name", "Tên độ khó chủ đề từ 2 đến 60 ký tự", function (value) {
        if (!value) return true;
        const topicName = value.trim();
        return topicName.length > 2 && topicName.length <= 60;
    }),
    isActivated: yup.boolean(),
    duration: yup.number().required("Vui lòng nhập thời lượng trò chơi").test("check-valid-duration", "Thời lượng trò chơi từ 30 đến 900 giây (15 phút)", function (value) {
        if (!value) return true;
        return value >= 30 && value <= 900;
    }),
    questionCount: yup.number().required("Vui lòng nhập số lượng câu hỏi/ lượt chơi").test("check-valid-question-count", "Số lượng câu hỏi từ 1 đến 100", function (value) {
        if (!value) return true;
        return value >= 1 && value <= 100;
    }),
    minCorrectToReward: yup.number().required("Vui lòng nhập số điểm cần đạt").test("check-valid-min-correct-to-reward", "Số điểm cần đạt phải nhỏ hơn hoặc bằng số câu hỏi, từ 1 đến 100", function (value) {
        if (!value) return true;
        const { questionCount } = this.parent;
        return value >= 1 && value <= 100 && value <= questionCount;
    }),
    description: yup.string().required("Vui lòng nhập mô tả độ khó chủ đề").test("check-topic-difficulty-description", "Mô tả độ khó chủ đề từ 2 đến 2000 ký tự", function (value) {
        if (!value) return true;
        const topicDifficultyDescription = value.trim();
        return topicDifficultyDescription.length >= 2 && topicDifficultyDescription.length <= 2000;
    }),
})

const topicDifficultyStore = useTopicDifficultyStore();

const handleSubmit = (formValues: any) => {
    if (props.isCreatingTopicDifficulty) {
        const formData: TopicDifficultyCreateRequest = {
            name: formValues.name,
            description: formValues.description,
            isActivated: formValues.isActivated,
            duration: formValues.duration,
            questionCount: formValues.questionCount,
            minCorrectToReward: formValues.minCorrectToReward,
        }
        emit('create-topic-difficulty', formData);
    } else {
        if (!topicDifficultyStore.topicDifficulty) {
            notifyError("Không tìm thấy thông tin độ khó chủ đề cần cập nhật");
            return;
        }
        const formData: TopicDifficultyUpdateRequest = {
            id: topicDifficultyStore.topicDifficulty.id,
            name: formValues.name,
            description: formValues.description,
            isActivated: formValues.isActivated,
        }
        emit('update-topic-difficulty', formData);
    }
    emit('close');
}
</script>

<template>
    <ElDialog v-model="isVisible"
        :title="props.isCreatingTopicDifficulty ? 'Thêm độ khó chủ đề mới' : 'Cập nhật độ khó chủ đề'" width="800px"
        @close="emit('close')">
        <Form :validation-schema="schema" @submit="handleSubmit" :initial-values="{
            name: props.isCreatingTopicDifficulty ? '' : (topicDifficultyStore.topicDifficulty?.name || 'Không xác định'),
            description: props.isCreatingTopicDifficulty ? '' : (topicDifficultyStore.topicDifficulty?.description || 'Không xác định'),
            duration: props.isCreatingTopicDifficulty ? 30 : (topicDifficultyStore.topicDifficulty?.duration || 30),
            questionCount: props.isCreatingTopicDifficulty ? 1 : (topicDifficultyStore.topicDifficulty?.questionCount || 1),
            minCorrectToReward: props.isCreatingTopicDifficulty ? 1 : (topicDifficultyStore.topicDifficulty?.minCorrectToReward || 1),
            isActivated: props.isCreatingTopicDifficulty ? true : (topicDifficultyStore.topicDifficulty?.activated || false)
        }" class="grid grid-cols-3 gap-4 items-start">
            <div class="col-span-2">
                <label for="name" class="block text-gray-700 font-medium mb-1">Tên độ khó chủ đề</label>
                <Field id="name" name="name" type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tên độ khó chủ đề">
                </Field>
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label class="block text-gray-700 font-medium mb-1">Kích hoạt độ khó chủ đề</label>
                <Field name="isActivated" v-slot="{ field }">
                    <ElSwitch :model-value="field.value" @update:model-value="field.onChange" />
                </Field>
                <ErrorMessage name="isActivated" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div>
                <label for="duration" class="block text-gray-700 font-medium mb-1">Thời lượng trò chơi (giây)</label>
                <Field id="duration" name="duration" type="number" min="30" max="900"
                    :disabled="!props.isCreatingTopicDifficulty"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                </Field>
                <ErrorMessage name="duration" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label for="questionCount" class="block text-gray-700 font-medium mb-1">Số câu hỏi/ lượt chơi</label>
                <Field id="questionCount" name="questionCount" type="number" min="1" max="100"
                    :disabled="!props.isCreatingTopicDifficulty"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                </Field>
                <ErrorMessage name="questionCount" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label for="minCorrectToReward" class="block text-gray-700 font-medium mb-1">
                    Số câu tối thiểu cần đúng</label>
                <Field id="minCorrectToReward" name="minCorrectToReward" type="number" min="1" max="100"
                    :disabled="!props.isCreatingTopicDifficulty"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                </Field>
                <ErrorMessage name="minCorrectToReward" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div class="col-span-3">
                <label for="description" class="block text-gray-700 font-medium mb-1">Mô tả độ khó chủ đề</label>
                <Field id="description" name="description" as="textarea" rows="8"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Mô tả độ khó chủ đề">
                </Field>
                <ErrorMessage name="description" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div class="col-start-3 flex justify-end space-x-2">
                <SecondaryButton :onClick="() => emit('close')" label="Hủy" />
                <PrimaryButton label="Lưu" />
            </div>
        </Form>
    </ElDialog>
</template>

<style lang="postcss" scoped>
:deep(.el-button--warning) {
    @apply bg-orange-500 hover:bg-orange-600 border-none text-white;
}
</style>
