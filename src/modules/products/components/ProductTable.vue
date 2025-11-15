<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../components/buttons/AddButton.vue';
import type { Product } from '../../../types/product.types';
import { formatDateTimeString } from '../../../utils/time.utils';
import EditButton from '../../../components/buttons/EditButton.vue';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import Switch from '../../../components/buttons/Switch.vue';
import type { SwitchResponse } from '../../../types/switch-button.types';

interface CategoryTableProps {
    products: Array<Product>;
    openCreateProductModal: () => void;
    openUpdateProductModal: (product: Product) => void;
    handleDeleteProduct: (id: number) => Promise<void>;
}
const props = defineProps<CategoryTableProps>();
const emit = defineEmits(["activate-product", "deactivate-product"]);

async function handleActivateProduct(payload: SwitchResponse) {
    if (payload.isActive) {
        emit("activate-product", payload.targetId);
    }
}

async function handleDeactivateProduct(payload: SwitchResponse) {
    if (!payload.isActive) {
        emit("deactivate-product", payload.targetId);
    }
}
</script>
<template>
    <div>
        <div class="py-2 flex justify-end">
            <AddButton :onClick="props.openCreateProductModal" label="+ Thêm sản phẩm" />
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <ElTable :data="props.products" border class="w-full">
                <ElTableColumn width="100" label="Ảnh">
                    <template #default="scope">
                        <img :src="scope.row.imageUrl" alt="Ảnh sản phẩm" class="w-12 h-12 object-cover rounded-md" />
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Tên sản phẩm" prop="name" show-overflow-tooltip />
                <ElTableColumn label="Danh mục" prop="categoryName" show-overflow-tooltip />
                <ElTableColumn width="100" label="Giá">
                    <template #default="scope">
                        {{ formatCurrencyVND(scope.row.price) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Ra mắt" width="160">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.createdAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Cập nhật" width="160">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.updatedAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn width="160" label="Trạng thái" prop="activated">
                    <template #default="scope">
                        <Switch :isActive="scope.row.activated" :targetId="scope.row.id"
                            @activate="handleActivateProduct" @deactivate="handleDeactivateProduct" />
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thao tác">
                    <template #default="scope">
                        <div class="flex gap-2 justify-evenly">
                            <EditButton :onClick="() => openUpdateProductModal(scope.row)" label="Cập nhật" />
                            <DeleteButton :onClick="() => handleDeleteProduct(scope.row.id)" label="Xóa" />
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>