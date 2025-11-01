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
    handleDeleteCategory: (id: number) => Promise<void>;
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
                <ElTableColumn width="100" label="Ảnh">
                    <template #default="scope">
                        <img :src="scope.row.imageUrl" alt="Ảnh danh mục" class="w-12 h-12 object-cover rounded-md" />
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
                <ElTableColumn width="100" label="Trạng thái" prop="activated">
                    <template #default="scope">
                        <span v-if="scope.row.activated" class="text-green-500 font-medium">
                            Hoạt động
                        </span>
                        <span v-else class="text-red-500 font-medium">
                            Đã ẩn
                        </span>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thao tác">
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