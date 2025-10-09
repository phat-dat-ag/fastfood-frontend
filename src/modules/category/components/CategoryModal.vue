<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { ElDialog, ElButton, ElUpload } from 'element-plus'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from "yup"
import type { CategoryCreateRequest, CategoryUpdateRequest } from '../../../types/category.types'
import { useCategoryStore } from '../../../store/useCategoryStore.store'
import { notifyError } from '../../../utils/notification.utils'
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'


interface CategoryModalProps {
    isCreatingCategory: boolean;
}

const props = defineProps<CategoryModalProps>();
const emit = defineEmits(['close', 'create-category', 'update-category']);

const categoryStore = useCategoryStore();

const isVisible = ref(true);

const previewUrl = ref('');
const selectedFile = ref<File | null>(null);

const handleImageChange = (file: any) => {
    selectedFile.value = file.raw;
    previewUrl.value = URL.createObjectURL(file.raw);
}

const schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên danh mục").test("check-category-name", "Tên danh mục từ 2 đến 15 ký tự", function (value) {
        if (!value) return true;
        const categoryName = value.trim();
        return categoryName.length > 2 && categoryName.length <= 15;
    }),
    description: yup.string().required("Vui lòng nhập mô tả danh mục").test("check-category-description", "Mô tả danh mục nên ít hơn 100 ký tự", function (value) {
        if (!value) return true;
        const categoryName = value.trim();
        return categoryName.length <= 100;
    })
})

const handleSubmit = (formValues: any) => {
    if (props.isCreatingCategory) {
        const formData: CategoryCreateRequest = {
            name: formValues.name,
            categoryImageUrl: selectedFile.value,
            description: formValues.description,
        }
        emit('create-category', formData);
    }
    else {
        if (!categoryStore.category) {
            notifyError("Không tìm thấy thông tin danh mục");
            return;
        }
        const formData: CategoryUpdateRequest = {
            id: categoryStore.category.id,
            name: formValues.name,
            categoryImageUrl: selectedFile.value,
            description: formValues.description,
        }
        emit('update-category', formData);
    }
    emit('close');
}
</script>

<template>
    <ElDialog v-model="isVisible" :title="props.isCreatingCategory ? 'Thêm mới' : 'Cập nhật nè'" width="450px"
        @close="emit('close')">
        <Form :validation-schema="schema" @submit="handleSubmit" :initial-values="{
            name: props.isCreatingCategory ? '' : (categoryStore.category?.name || 'Không xác định'),
            description: props.isCreatingCategory ? '' : (categoryStore.category?.description || 'Không xác định'),
        }" class="space-y-4">
            <div>
                <label for="name" class="block text-gray-700 font-medium mb-1">Tên danh mục</label>
                <Field id="name" name="name" type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tên danh mục">
                </Field>
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label for="description" class="block text-gray-700 font-medium mb-1">Mô tả danh mục</label>
                <Field id="description" name="description" as="textarea"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Mô tả danh mục">
                </Field>
                <ErrorMessage name="description" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div class="mt-3">
                <label>Ảnh danh mục</label>
                <ElUpload class="mt-1" action="" :auto-upload="false" :on-change="handleImageChange">
                    <ElButton type="warning">Chọn ảnh</ElButton>
                </ElUpload>
                <ErrorMessage name="image" class="text-red-500 text-sm" />
                <img v-if="previewUrl" :src="previewUrl" class="mt-2 w-24 h-24 object-cover rounded" />
            </div>

            <div class="flex justify-end space-x-2">
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
