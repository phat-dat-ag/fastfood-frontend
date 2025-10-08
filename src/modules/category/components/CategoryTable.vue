<script setup lang="ts">
import { ElButton, ElTable, ElTableColumn } from 'element-plus';
import type { Category } from '../../../types/category.types';
import { formatDateTimeString } from '../../../utils/time.utils';

interface CategoryTableProps {
    categories: Array<Category>;
    openCreateCategoryModal: () => void;
    openUpdateCategoryModal: (category: Category) => void;
    handleDeleteCategory: (id: number) => void;
}
const props = defineProps<CategoryTableProps>();
</script>
<template>
    <div>
        <div class="py-2 flex justify-end">
            <ElButton type="warning" plain
                class="!bg-orange-500 hover:!bg-orange-600 !text-white !border-none !font-medium"
                @click="openCreateCategoryModal">
                + Thêm danh mục
            </ElButton>
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <ElTable :data="props.categories" border class="w-full">
                <ElTableColumn label="ID" prop="id"></ElTableColumn>
                <ElTableColumn label="Ảnh">
                    <template #default="scope">
                        <img :src="scope.row.categoryImageUrl" alt="Ảnh danh mục"
                            class="w-12 h-12 object-cover rounded-md" />
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Tên danh mục" prop="name" />
                <ElTableColumn label="Ra mắt">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.createdAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Cập nhật">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.updatedAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Trạng thái" prop="deleted">
                    <template #default="scope">
                        <span v-if="scope.row.deleted" class="text-red-500 font-medium">
                            Đã xóa
                        </span>
                        <span v-else class="text-green-500 font-medium">
                            Hoạt động
                        </span>
                    </template>
                </ElTableColumn>

                <ElTableColumn align="right">
                    <template #default="scope">
                        <ElButton size="small" type="warning" plain class="!text-orange-600 !border-orange-300"
                            @click="openUpdateCategoryModal(scope.row)">
                            Cập nhật
                        </ElButton>
                        <ElButton size="small" type="danger" plain @click="handleDeleteCategory(scope.row.id)">
                            Xóa
                        </ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>