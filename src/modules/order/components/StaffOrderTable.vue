<script setup lang="ts">
import { ElTable, ElTableColumn, ElTag, ElAvatar, ElTooltip } from 'element-plus';
import type { Order } from '../../../types/order.types';
import { formatDateTimeString } from '../../../utils/time.utils';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { getOrderTagType, getPaymentTagType, ORDER_STATUS_TEXT, PAYMENT_METHOD_TEXT, PAYMENT_STATUS_TEXT } from '../../../utils/order-display.utils';
import EditButton from '../../../components/buttons/EditButton.vue';
import { getDetailAddress } from '../../../utils/geocode.utils';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';

const props = defineProps<{
    orders: Order[];
    handleUpdateOrder: (order: Order) => void;
    handleCancelOrder: (order: Order) => Promise<void>;
}>();
</script>

<template>
    <div class="min-h-screen">


        <div class="bg-white/95 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <ElTable :data="props.orders" border stripe class="w-full" :header-cell-style="{
                background: '#FFF3E0',
                color: '#B45309',
                fontWeight: 600,
                fontSize: '14px'
            }">

                <ElTableColumn label="Mã ĐH" prop="id" width="100">
                    <template #default="scope">
                        <span class="font-semibold text-gray-700">#{{ scope.row.id }}</span>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Khách hàng" min-width="180">
                    <template #default="scope">
                        <div class="flex items-center space-x-2">
                            <ElAvatar :src="scope.row.user.avatarUrl" size="small">{{ scope.row.user.name[0] }}
                            </ElAvatar>
                            <div>
                                <p class="font-medium text-gray-700">{{ scope.row.user.name }}</p>
                                <p class="text-xs text-gray-500">{{ scope.row.user.phone }}</p>
                            </div>
                        </div>
                    </template>
                </ElTableColumn>

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

                <ElTableColumn label="Tổng tiền" width="140">
                    <template #default="scope">
                        <span class="font-semibold text-orange-600">
                            {{ formatCurrencyVND(scope.row.totalPrice) }}
                        </span>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Địa chỉ" min-width="180">
                    <template #default="scope">
                        <ElTooltip :content="getDetailAddress(scope.row.address)" placement="top">
                            <span class="text-gray-600 truncate">
                                {{ scope.row.address.district }}, {{ scope.row.address.province }}
                            </span>
                        </ElTooltip>
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Hành động" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <div class="flex flex-col gap-2">
                            <EditButton label="Cập nhật" :onClick="() => handleUpdateOrder(scope.row)" />
                            <DeleteButton label="Hủy đơn" :onClick="() => handleCancelOrder(scope.row)" />
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>

<style scoped>
.el-table .cell {
    white-space: nowrap;
}

.el-table {
    border-radius: 1rem;
    overflow: hidden;
}

.el-table__body tr:hover>td {
    background-color: #fff7ed !important;
    transition: background-color 0.3s ease;
}
</style>
