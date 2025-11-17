<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../../components/buttons/AddButton.vue';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';
import type { Award } from '../../../../types/award.types';
import { formatCurrencyVND } from '../../../../utils/currency.utils';
import Switch from '../../../../components/buttons/Switch.vue';
import type { SwitchResponse } from '../../../../types/switch-button.types';

interface AwardTableProps {
    awards: Array<Award>;
    openCreateAwardModal: () => void;
    handleDeleteAward: (awardId: number) => Promise<void>;
}
const props = defineProps<AwardTableProps>();
const emit = defineEmits(["activate-award", "deactivate-award"]);

async function handleActivateAward(payload: SwitchResponse) {
    if (payload.isActive) {
        emit("activate-award", payload.targetId);
    }
}

async function handleDeactivateAward(payload: SwitchResponse) {
    if (!payload.isActive) {
        emit("deactivate-award", payload.targetId);
    }
}
</script>
<template>
    <div>
        <div class="py-2 flex justify-end">
            <AddButton :onClick="props.openCreateAwardModal" label="+ Thêm phần thưởng" />
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <ElTable :data="props.awards" border class="w-full">
                <ElTableColumn label="Thưởng ít nhất">
                    <template #default="scope">
                        <span v-if="scope.row.type === 'FIXED_AMOUNT'">
                            {{ formatCurrencyVND(scope.row.minValue) }}
                        </span>
                        <span v-else>
                            {{ scope.row.minValue }}%
                        </span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Thưởng nhiều nhất">
                    <template #default="scope">
                        <span v-if="scope.row.type === 'FIXED_AMOUNT'">
                            {{ formatCurrencyVND(scope.row.maxValue) }}
                        </span>
                        <span v-else>
                            {{ scope.row.maxValue }}%
                        </span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Thưởng tối đa">
                    <template #default="scope">
                        {{ formatCurrencyVND(scope.row.maxDiscountAmount) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Cho hóa đơn từ">
                    <template #default="scope">
                        {{ formatCurrencyVND(scope.row.minSpendAmount) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Đã thưởng" prop="usedQuantity" width="100" />
                <ElTableColumn label="Số phần thưởng" prop="quantity" />
                <ElTableColumn width="160" label="Trạng thái" prop="activated">
                    <template #default="scope">
                        <Switch :isActive="scope.row.activated" :targetId="scope.row.id" @activate="handleActivateAward"
                            @deactivate="handleDeactivateAward" />
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thao tác">
                    <template #default="scope">
                        <DeleteButton :onClick="() => props.handleDeleteAward(scope.row.id)" label="Xóa" />
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>