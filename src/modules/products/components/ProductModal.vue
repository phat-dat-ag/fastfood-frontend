<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { ElDialog, ElButton, ElUpload } from 'element-plus'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from "yup"
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import type { ProductCreateRequest, ProductUpdateRequest } from '../../../types/product.types'
import type { Category } from '../../../types/category.types'
import { useProductStore } from '../../../store/useProductStore.store'
import { notifyError } from '../../../utils/notification.utils'
import Container3D from '../../3DModel/Container3D.vue'


interface ProductModalProps {
    isCreatingProduct: boolean;
    categories: Category[];
}

const props = defineProps<ProductModalProps>();
const emit = defineEmits(['close', 'create-product', 'update-product']);

const productStore = useProductStore();

const isVisible = ref(true);

const previewUrl = ref('');
const selectedFile = ref<File | null>(null);

const handleImageChange = (file: any) => {
    selectedFile.value = file.raw;
    previewUrl.value = URL.createObjectURL(file.raw);
}

const selected3DFile = ref<File | null>(null);

const handele3DModelChange = (file3D: any) => {
    selected3DFile.value = file3D.raw;
}
const schema = yup.object({
    category_id: yup.number().required("Vui lòng chọn danh mục"),
    name: yup.string().required("Vui lòng nhập tên sản phẩm").test("check-category-name", "Tên sản phẩm từ 2 đến 80 ký tự", function (value) {
        if (!value) return true;
        const productName = value.trim();
        return productName.length > 2 && productName.length <= 80;
    }),
    description: yup.string().required("Vui lòng nhập mô tả sản phẩm").test("check-category-description", "Mô tả sản phẩm nên ít hơn 100 ký tự", function (value) {
        if (!value) return true;
        const productDescription = value.trim();
        return productDescription.length <= 100;
    }),
    price: yup.number().required("Vui lòng nhập giá sản phẩm"),
    activated: yup.boolean(),
})

const handleSubmit = (formValues: any) => {
    if (props.isCreatingProduct) {
        const formData: ProductCreateRequest = {
            category_id: formValues.category_id,
            name: formValues.name,
            description: formValues.description,
            price: formValues.price,
            activated: formValues.activated,
            imageUrl: selectedFile.value,
            modelUrl: selected3DFile.value,
        }
        emit('create-product', formData);
    } else {
        if (!productStore.product) {
            notifyError("Không tìm thấy thông tin sản phẩm");
            return;
        }
        const formData: ProductUpdateRequest = {
            id: productStore.product.id,
            name: formValues.name,
            description: formValues.description,
            activated: formValues.activated,
            imageUrl: selectedFile.value,
            modelUrl: selected3DFile.value,
        }
        emit('update-product', formData);
    }
    emit('close');
}
</script>

<template>
    <ElDialog v-model="isVisible" :title="props.isCreatingProduct ? 'Thêm mới' : 'Cập nhật nè'" width="450px"
        @close="emit('close')">
        <Form :validation-schema="schema" @submit="handleSubmit" :initial-values="{
            category_id: isCreatingProduct ? '' : (String(productStore.product?.categoryId) || ''),
            name: isCreatingProduct ? '' : (productStore.product?.name || 'Không xác định'),
            description: isCreatingProduct ? '' : (productStore.product?.description || 'Không xác định'),
            price: isCreatingProduct ? null : (productStore.product?.price || null),
            activated: isCreatingProduct ? true : (productStore.product?.activated || 'Không xác định'),
        }" class="grid grid-cols-2 gap-4 items-start">
            <div v-if="categories && categories.length">
                <label for="category_id" class="block text-gray-700 font-medium mb-1">Danh mục sản phẩm</label>
                <Field id="category_id" name="category_id" as="select" :disabled="!isCreatingProduct"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">-- Chọn danh mục --</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                    </option>
                </Field>
                <ErrorMessage name="category_id" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label class="block text-gray-700 font-medium mb-1">Kích hoạt sản phẩm</label>
                <Field name="activated" v-slot="{ field }">
                    <ElSwitch :model-value="field.value" @update:model-value="field.onChange" />
                </Field>
                <ErrorMessage name="activated" class="text-red-500 text-sm mt-1 block" />
            </div>

            <div>
                <label for="name" class="block text-gray-700 font-medium mb-1">Tên sản phẩm</label>
                <Field id="name" name="name" type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Tên sản phẩm">
                </Field>
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div>
                <label for="price" class="block text-gray-700 font-medium mb-1">Giá sản phẩm</label>
                <Field id="price" name="price" type="number" :readonly="!isCreatingProduct"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                </Field>
                <ErrorMessage name="price" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div class="col-span-2">
                <label for="description" class="block text-gray-700 font-medium mb-1">Mô tả sản phẩm</label>
                <Field id="description" name="description" as="textarea"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Mô tả sản phẩm">
                </Field>
                <ErrorMessage name="description" class="text-red-500 text-sm mt-1 block"></ErrorMessage>
            </div>

            <div class="col-span-2 flex gap-4">
                <div class="grow">
                    <label>Ảnh sản phẩm</label>
                    <ElUpload class="mt-1" action="" :auto-upload="false" :on-change="handleImageChange">
                        <ElButton type="warning">Chọn ảnh</ElButton>
                    </ElUpload>
                    <ErrorMessage name="image" class="text-red-500 text-sm" />
                </div>
                <img v-if="previewUrl" :src="previewUrl" class="grow mt-2 w-24 h-24 object-cover rounded" />
            </div>

            <div class="col-span-2 flex gap-4">
                <div class="grow">
                    <label>Mô hình 3D</label>
                    <ElUpload class="mt-1" action="" accept=".glb" :auto-upload="false"
                        :on-change="handele3DModelChange">
                        <ElButton type="warning">Chọn mô hình</ElButton>
                    </ElUpload>
                    <ErrorMessage name="model3D" class="text-red-500 text-sm" />
                </div>
                <div v-if="selected3DFile" class="h-[100px] w-[100px]">
                    <Container3D :modelFile="selected3DFile" />
                </div>
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
