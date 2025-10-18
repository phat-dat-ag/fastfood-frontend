<script setup lang="ts">
import { useRouter } from 'vue-router';
import AddButton from '../../../components/buttons/AddButton.vue';
import { ROUTE_NAMES } from '../../../constants/route-names';
import type { Promotion } from '../../../types/promotion.types';
import { ElTable, ElTableColumn } from 'element-plus';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import { formatDateTimeString } from '../../../utils/time.utils';
import { formatCurrencyVND } from '../../../utils/currency.utils';

const router = useRouter();

const props = defineProps<{
    promotions: Array<Promotion>;
    handleDeletePromotionOrder: (promotionId: number) => Promise<void>;
}>();

</script>

<template>
    <div class="py-2 flex justify-end">
        <AddButton :onClick="() => router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_ORDER_ADD })"
            label="Thêm mã khuyến mãi cho đơn hàng" />
    </div>
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
        <ElTable :data="props.promotions" border class="w-full">
            <ElTableColumn label="Mã KM" prop="code" />
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
            <ElTableColumn label="Cho đơn từ" prop="minSpendAmount" header-align="left" align="right"/>
            <ElTableColumn label="Đã áp dụng" header-align="left" align="right">
                <template #default="scope">
                    <span>
                        {{ scope.row.usedQuantity }} / {{ scope.row.quantity }}
                    </span>
                </template>
            </ElTableColumn>
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
                    <DeleteButton :onClick="() => props.handleDeletePromotionOrder(scope.row.id)" label="Xóa" />
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>