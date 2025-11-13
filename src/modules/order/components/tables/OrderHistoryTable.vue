<script setup lang="ts">
import { ElTable, ElTableColumn, ElTag } from 'element-plus';
import type { Order } from '../../../../types/order.types';
import { formatDateTimeString } from '../../../../utils/time.utils';
import { formatCurrencyVND } from '../../../../utils/currency.utils';
import { getOrderTagType, getPaymentTagType, ORDER_STATUS_TEXT, PAYMENT_METHOD_TEXT, PAYMENT_STATUS_TEXT } from '../../../../utils/order-display.utils';
import { getDetailAddress } from '../../../../utils/geocode.utils';
import EditButton from '../../../../components/buttons/EditButton.vue';

const props = defineProps<{
    orders: Order[];
    handleUpdateOrder: (order: Order) => void;
}>();
</script>

<template>
    <div>
        <div class="bg-white/95 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <ElTable :data="props.orders" border stripe class="w-full"
                :header-cell-style="{ background: '#FFF3E0', color: '#B45309', fontWeight: 600, fontSize: '14px' }">
                <ElTableColumn label="Khách hàng" prop="user.name" show-overflow-tooltip />
                <ElTableColumn label="Ngày đặt" width="160">
                    <template #default="scope">
                        <span class="text-gray-600">{{ formatDateTimeString(scope.row.placedAt) }}</span>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Trạng thái" width="130">
                    <template #default="scope">
                        <ElTag :type="getOrderTagType(scope.row.orderStatus)" effect="light" size="small">
                            {{ ORDER_STATUS_TEXT[scope.row.orderStatus] || scope.row.orderStatus }}
                        </ElTag>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thanh toán" width="180">
                    <template #default="scope">
                        <div class="flex flex-col">
                            <ElTag :type="getPaymentTagType(scope.row.paymentStatus)" size="small">
                                {{ PAYMENT_STATUS_TEXT[scope.row.paymentStatus] }}
                            </ElTag>
                            <span class="text-xs text-gray-500 mt-1">
                                {{ PAYMENT_METHOD_TEXT[scope.row.paymentMethod] }}
                            </span>
                        </div>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Tổng tiền" width="140" header-align="left" align="right">
                    <template #default="scope">
                        <span class="font-semibold text-orange-600">
                            {{ formatCurrencyVND(scope.row.totalPrice) }}
                        </span>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Địa chỉ" min-width="180" show-overflow-tooltip>
                    <template #default="scope">
                        {{ getDetailAddress(scope.row.address) }}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Hành động" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <EditButton label="Chi tiết" :onClick="() => handleUpdateOrder(scope.row)" />
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>

<style scoped src="../../../../styles/order-modal.css"></style>
