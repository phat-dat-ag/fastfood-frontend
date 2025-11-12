<script setup lang="ts">
import { useRouter } from 'vue-router';
import AddButton from '../../../../components/buttons/AddButton.vue';
import { ROUTE_NAMES } from '../../../../constants/route-names';
import type { Promotion } from '../../../../types/promotion.types';
import { formatDateTimeString } from '../../../../utils/time.utils';
import { formatCurrencyVND } from '../../../../utils/currency.utils';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';
import { ElTable, ElTableColumn } from 'element-plus';
import type { SwitchResponse } from '../../../../types/switch-button.types';
import Switch from '../../../../components/buttons/Switch.vue';

const router = useRouter();

const props = defineProps<{
    promotions: Array<Promotion>;
    handleDeletePromotionProduct: (promotionId: number) => Promise<void>;
}>();
const emit = defineEmits(["activate-promotion", "deactivate-promotion"]);

async function handleActivateAccount(payload: SwitchResponse) {
    if (payload.isActive) {
        emit("activate-promotion", payload.targetId);
    }
}

async function handleDeactivateAccount(payload: SwitchResponse) {
    if (!payload.isActive) {
        emit("deactivate-promotion", payload.targetId);
    }
}
</script>

<template>
    <div class="py-2 flex justify-end">
        <AddButton :onClick="() => router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_PRODUCT_ADD })"
            label="Thêm mã khuyến mãi cho sản phẩm" />
    </div>
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
        <ElTable :data="props.promotions" border class="w-full">
            <ElTableColumn label="Mã KM" prop="code" show-overflow-tooltip />
            <ElTableColumn label="Áp dụng cho" prop="name" show-overflow-tooltip />
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
            <ElTableColumn label="Đã áp dụng" header-align="left" align="right">
                <template #default="scope">
                    <span>
                        {{ scope.row.usedQuantity }} / {{ scope.row.quantity }}
                    </span>
                </template>
            </ElTableColumn>
            <ElTableColumn width="100" label="Trạng thái" prop="activated">
                <template #default="scope">
                    <Switch :isActive="scope.row.activated" :targetId="scope.row.id" @activate="handleActivateAccount"
                        @deactivate="handleDeactivateAccount" />
                </template>
            </ElTableColumn>
            <ElTableColumn label="Thao tác">
                <template #default="scope">
                    <DeleteButton :onClick="() => props.handleDeletePromotionProduct(scope.row.id)" label="Xóa" />
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>