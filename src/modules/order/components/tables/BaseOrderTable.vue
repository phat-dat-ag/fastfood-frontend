<script setup lang="ts">
import { ElTable, ElTableColumn, ElTag } from 'element-plus';
import type { Order } from '../../../../types/order.types';
import { formatDateTimeString } from '../../../../utils/time.utils';
import { getOrderTagType, getPaymentTagType, ORDER_STATUS_TEXT, PAYMENT_METHOD_TEXT, PAYMENT_STATUS_TEXT } from '../../../../utils/order-display.utils';
import { formatCurrencyVND } from '../../../../utils/currency.utils';
import { getDetailAddress } from '../../../../utils/geocode.utils';

const props = defineProps<{
    orders: Order[];
    showOrderId?: boolean;
    showCustomer?: boolean;
    showPayment?: boolean;
    showAddress?: boolean;
    enableActions?: boolean;
}>();
</script>
<template>
    <div class="bg-white/95 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
        <ElTable :data="props.orders" border stripe class="w-full" :header-cell-style="{
            background: '#FFF3E0',
            color: '#B45309',
            fontWeight: 600,
            fontSize: '14px'
        }">
            <ElTableColumn v-if="props.showOrderId" label="Mã ĐH" width="72">
                <template #default="{ row }">
                    <span class="font-semibold text-gray-700">#{{ row.id }}</span>
                </template>
            </ElTableColumn>

            <ElTableColumn v-if="props.showCustomer" label="Khách hàng" prop="user.name" min-width="120"
                show-overflow-tooltip />

            <ElTableColumn label="Ngày đặt" width="160">
                <template #default="{ row }">
                    {{ formatDateTimeString(row.placedAt) }}
                </template>
            </ElTableColumn>

            <ElTableColumn label="Trạng thái" width="130">
                <template #default="{ row }">
                    <ElTag :type="getOrderTagType(row.orderStatus)" effect="light" size="small">
                        {{ ORDER_STATUS_TEXT[row.orderStatus] }}
                    </ElTag>
                </template>
            </ElTableColumn>

            <ElTableColumn v-if="props.showPayment" label="Thanh toán" width="180">
                <template #default="{ row }">
                    <div class="flex flex-col">
                        <ElTag :type="getPaymentTagType(row.paymentStatus)" size="small">
                            {{ PAYMENT_STATUS_TEXT[row.paymentStatus] }}
                        </ElTag>
                        <span class="text-xs text-gray-500 mt-1">
                            {{ PAYMENT_METHOD_TEXT[row.paymentMethod] }}
                        </span>
                    </div>
                </template>
            </ElTableColumn>

            <ElTableColumn label="Tổng tiền" width="100" header-align="left" align="right">
                <template #default="{ row }">
                    <span class="font-semibold text-orange-600">
                        {{ formatCurrencyVND(row.totalPrice) }}
                    </span>
                </template>
            </ElTableColumn>

            <ElTableColumn v-if="props.showAddress" label="Địa chỉ" min-width="180" show-overflow-tooltip>
                <template #default="{ row }">
                    {{ getDetailAddress(row.address) }}
                </template>
            </ElTableColumn>

            <ElTableColumn v-if="props.enableActions" label="Hành động" width="150" fixed="right" align="center">
                <template #default="{ row }">
                    <div class="flex flex-col gap-2 items-center">
                        <slot name="actions" :row="row"></slot>
                    </div>
                </template>
            </ElTableColumn>
        </ElTable>
    </div>
</template>
