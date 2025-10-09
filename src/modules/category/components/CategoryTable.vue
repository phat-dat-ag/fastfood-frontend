<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import type { Category } from '../../../types/category.types';
import { formatDateTimeString } from '../../../utils/time.utils';
import AddButton from '../../../components/buttons/AddButton.vue';
import EditButton from '../../../components/buttons/EditButton.vue';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';

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
            <AddButton :onClick="openCreateCategoryModal" label="+ Thêm danh mục" />
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
                        <div class="flex gap-2 justify-evenly">
                            <EditButton :onClick="() => openUpdateCategoryModal(scope.row)" label="Cập nhật" />
                            <DeleteButton :onClick="() => handleDeleteCategory(scope.row.id)" label="Xóa" />
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>