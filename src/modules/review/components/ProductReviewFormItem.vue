<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue';
import type { OrderDetail } from '../../../types/order-detail.types';
import type { ReviewCreateRequest, ReviewImageCreateRequest } from '../../../types/review.types';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { computed } from 'vue';

interface Props {
    detail: OrderDetail;
    reviewData: ReviewCreateRequest;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:reviewData']);

function updateField<K extends keyof ReviewCreateRequest>(field: K, value: ReviewCreateRequest[K]) {
    emit('update:reviewData', { ...props.reviewData, [field]: value });
}

function handlePreview(file: any) {
    window.open(file.url || file.previewUrl);
}

function handleRemoveImage(file: any) {
    const newImages = props.reviewData.images.filter(
        (img) => img.previewUrl !== file.url && img.previewUrl !== file.previewUrl
    );
    updateField('images', newImages);
}

function handleUpload(files: File[]) {
    const remaining = 5 - props.reviewData.images.length;
    const newFiles = Array.from(files)
        .slice(0, remaining)
        .map((file) => ({
            imageFile: file,
            previewUrl: URL.createObjectURL(file),
            name: file.name,
        }));
    updateField('images', [...props.reviewData.images, ...newFiles]);
}

const fileList = computed(() =>
    props.reviewData.images.map((img: ReviewImageCreateRequest) => ({
        name: img.name || 'Ảnh',
        url: img.previewUrl,
    }))
);
</script>

<template>
    <div
        class="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col md:flex-row gap-4">
        <div class="flex-shrink-0">
            <img :src="detail.product.imageUrl" :alt="detail.product.name"
                class="w-24 h-24 object-cover rounded-xl border border-gray-200" />
        </div>

        <div class="flex-1">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ detail.product.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">
                        Số lượng: {{ detail.quantity }} — Giá: {{ formatCurrencyVND(detail.discountedPrice) }}
                    </p>
                </div>

                <el-rate v-model="props.reviewData.rating" :texts="['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời']"
                    show-text class="text-amber-500" @change="(val: number) => updateField('rating', val)" />
            </div>

            <div class="mt-3">
                <el-input type="textarea" :rows="3" v-model="props.reviewData.comment"
                    placeholder="Nhập nhận xét của bạn (tối đa 500 ký tự)" maxlength="500" show-word-limit
                    @input="(val: string) => updateField('comment', val)" />
            </div>

            <div class="mt-4">
                <p class="text-gray-700 text-sm font-medium mb-1">Thêm ảnh minh họa (tối đa 5)</p>

                <el-upload class="upload-demo" :file-list="fileList" list-type="picture-card" :auto-upload="false"
                    :on-preview="handlePreview" :on-remove="handleRemoveImage"
                    :on-change="(uploadFile: any) => handleUpload(uploadFile.raw ? [uploadFile.raw] : [])">
                    <el-icon>
                        <Plus />
                    </el-icon>

                    <template #file="{ file }">
                        <div class="relative group">
                            <img :src="file.url" class="w-full h-full object-cover rounded-lg" />
                            <div class="absolute top-1 right-1 bg-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                @click="handleRemoveImage(file)">
                                <el-icon color="red">
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                    </template>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<style scoped>
.upload-demo {
    --el-upload-list-picture-card-size: 80px;
}

.el-rate__icon {
    color: #f59e0b !important;
}
</style>
