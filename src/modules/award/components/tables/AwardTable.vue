<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../../components/buttons/AddButton.vue';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';
import type { Award } from '../../../../types/award.types';
import { formatCurrencyVND } from '../../../../utils/currency.utils';

interface AwardTableProps {
    awards: Array<Award>;
    openCreateAwardModal: () => void;
    handleDeleteAward: (awardId: number) => Promise<void>;
}
const props = defineProps<AwardTableProps>();
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
                <ElTableColumn label="Đã thưởng" prop="usedQuantity" />
                <ElTableColumn label="Số phần thưởng" prop="quantity" />
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
                        <DeleteButton :onClick="() => props.handleDeleteAward(scope.row.id)" label="Xóa" />
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>