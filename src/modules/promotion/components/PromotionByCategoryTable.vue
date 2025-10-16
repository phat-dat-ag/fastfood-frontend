<script setup lang="ts">
import { useRouter } from 'vue-router';
import AddButton from '../../../components/buttons/AddButton.vue';
import { ROUTE_NAMES } from '../../../constants/route-names';
import type { Promotion } from '../../../types/promotion.types';
import { formatDateTimeString } from '../../../utils/time.utils';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';

const router = useRouter();

const props = defineProps<{
    promotions: Array<Promotion>;
    handleDeletePromotionCategory: (promotionId: number) => Promise<void>;
}>();
</script>

<template>
    <div class="py-2 flex justify-end">
        <AddButton :onClick="() => router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_CATEGORY_ADD })"
            label="Thêm mã khuyến mãi cho danh mục" />
    </div>
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
        <ElTable :data="props.promotions" border class="w-full">
            <ElTableColumn width="100" label="Mã KM" prop="code" />
            <ElTableColumn label="Áp dụng cho" prop="category.name" />
            <ElTableColumn label="Từ ngày">
                <template #default="scope">
                    {{ formatDateTimeString(scope.row.startAt) }}
                </template>
            </ElTableColumn>
            <ElTableColumn label="Đến ngày">
                <template #default="scope">
                    {{ formatDateTimeString(scope.row.endAt) }}
                </template>
            </ElTableColumn>
            <ElTableColumn label="Giá trị" header-align="left" align="right">
                <template #default="scope">
                    <span v-if="scope.row.type === 'FIXED_AMOUNT'">
                        {{ formatCurrencyVND(scope.row.value) }}
                    </span>
                    <span v-else-if="scope.row.type === 'PERCENTAGE'">
                        {{ scope.row.value }}%
                    </span>
                </template>
            </ElTableColumn>

            <ElTableColumn label="Giảm tối đa" header-align="left" align="right">
                <template #default="scope">
                    {{ formatCurrencyVND(scope.row.maxDiscountAmount) }}
                </template>
            </ElTableColumn>
            <ElTableColumn width="100" label="Số lượng" prop="quantity" header-align="left" align="right" />
            <ElTableColumn label="Đã áp dụng" prop="usedQuantity" header-align="left" align="right" />
            <ElTableColumn width="100" label="Trạng thái" prop="activated">
                <template #default="scope">
                    <span v-if="scope.row.activated" class="text-green-500 font-medium">
                        Hoạt động
                    </span>
                    <span v-else class="text-red-500 font-medium">
                        Tạm dừng
                    </span>
                </template>
            </ElTableColumn>
            <ElTableColumn label="Thao tác">
                <template #default="scope">
                    <DeleteButton :onClick="() => props.handleDeletePromotionCategory(scope.row.id)" label="Xóa" />
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>