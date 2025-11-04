<script setup lang="ts">
import * as yup from "yup"
import { ErrorMessage, Field, Form } from 'vee-validate';
import PrimaryButton from '../../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../../components/buttons/SecondaryButton.vue';
import { ElDialog, ElSwitch } from 'element-plus';
import { ref } from 'vue';
import type { TopicCreateRequest, TopicUpdateRequest } from "../../../../types/topic.types";
import { useTopicStore } from "../../../../store/useTopicStore.store";
import { notifyError } from "../../../../utils/notification.utils";

interface TopicModalPorps {
    isCreatingTopic: boolean;
}

const props = defineProps<TopicModalPorps>();
const emit = defineEmits(["create-topic", "update-topic", "close"]);

const isVisible = ref<boolean>(true);

const schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên chủ đề").test("check-topic-name", "Tên chủ đề từ 2 đến 60 ký tự", function (value) {
        if (!value) return true;
        const topicName = value.trim();
        return topicName.length > 2 && topicName.length <= 60;
    }),
    description: yup.string().required("Vui lòng nhập mô tả chủ đề").test("check-topic-description", "Mô tả chủ từ 2 đến 2000 ký tự", function (value) {
        if (!value) return true;
        const topicDescription = value.trim();
        return topicDescription.length >= 2 && topicDescription.length <= 2000;
    }),
    isActivated: yup.boolean(),
})

const topicStore = useTopicStore();

const handleSubmit = (formValues: any) => {
    if (props.isCreatingTopic) {
        const formData: TopicCreateRequest = {
            name: formValues.name,
            description: formValues.description,
            isActivated: formValues.isActivated,
        }
        emit('create-topic', formData);
    } else {
        if (!topicStore.topic) {
            notifyError("Không tìm thấy thông tin chủ đề cần cập nhật");
            return;
        }
        const formData: TopicUpdateRequest = {
            id: topicStore.topic.id,
            name: formValues.name,
            description: formValues.description,
            isActivated: formValues.isActivated,
        }
        emit('update-topic', formData);
    }
    emit('close');
}
</script>

<template>
    <ElDialog v-model="isVisible" :title="props.isCreatingTopic ? 'Thêm chủ đề mới' : 'Cập nhật chủ đề'" width="800px"
        @close="emit('close')">
        <Form :validation-schema="schema" @submit="handleSubmit" :initial-values="{
            name: props.isCreatingTopic ? '' : (topicStore.topic?.name || 'Không xác định'),
            description: props.isCreatingTopic ? '' : (topicStore.topic?.description || 'Không xác định'),
            isActivated: props.isCreatingTopic ? true : (topicStore.topic?.activated || false)
        }" class="grid grid-cols-2 gap-4 items-start">
            <div>
                <label for="name" class="block text-gray-700 font-medium mb-1">Tên chủ đề</label>
                <Field id="name" name="name" type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tên chủ đề">
                </Field>
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label class="block text-gray-700 font-medium mb-1">Kích hoạt chủ đề</label>
                <Field name="isActivated" v-slot="{ field }">
                    <ElSwitch :model-value="field.value" @update:model-value="field.onChange" />
                </Field>
                <ErrorMessage name="isActivated" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div class="col-span-2">
                <label for="description" class="block text-gray-700 font-medium mb-1">Mô tả chủ đề</label>
                <Field id="description" name="description" as="textarea" rows="8"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Mô tả chủ đề">
                </Field>
                <ErrorMessage name="description" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div class="col-start-2 flex justify-end space-x-2">
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
