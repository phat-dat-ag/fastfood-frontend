<script setup lang="ts">
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import TextButton from '../../../components/buttons/TextButton.vue';
import type { Order } from '../../../types/order.types';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { getDetailAddress } from '../../../utils/geocode.utils';
import { ORDER_STATUS_TEXT, PAYMENT_METHOD_TEXT, PAYMENT_STATUS_TEXT } from '../../../utils/order-display.utils';
import { formatDateTimeString } from '../../../utils/time.utils';


const props = defineProps<{
    orders: Order[];
    handleUpdateOrder: (order: Order) => void;
    handleCancelOrder: (order: Order) => Promise<void>;
}>();
</script>
<template>
    <div class="space-y-4">
        <div v-for="item in props.orders" :key="item.id"
            class="bg-white shadow-md rounded-xl p-4 border border-orange-100 flex flex-col justify-between">
            <div>
                <h3 class="font-semibold text-lg text-gray-800 mb-2">
                    Đơn hàng #{{ item.id }}
                </h3>

                <p class="text-sm text-gray-600">
                    <span class="font-medium">Ngày đặt:</span>
                    {{ formatDateTimeString(item.placedAt) }}
                </p>

                <p class="text-sm text-gray-600" v-if="item.user">
                    <span class="font-medium">Khách hàng:</span>
                    {{ item.user.name }}
                </p>

                <p class="text-sm text-gray-600">
                    <span class="font-medium">Trạng thái:</span>
                    {{ ORDER_STATUS_TEXT[item.orderStatus] }}
                </p>

                <p class="text-sm text-gray-600">
                    <span class="font-medium">Thanh toán:</span>
                    {{ PAYMENT_STATUS_TEXT[item.paymentStatus] }} -
                    {{ PAYMENT_METHOD_TEXT[item.paymentMethod] }}
                </p>

                <p class="text-sm text-gray-600">
                    <span class="font-medium">Tổng tiền:</span>
                    <span class="text-orange-600 font-semibold">
                        {{ formatCurrencyVND(item.totalPrice) }}
                    </span>
                </p>

                <p class="text-sm text-gray-600" v-if="item.address">
                    <span class="font-medium">Địa chỉ:</span>
                    {{ getDetailAddress(item.address) }}
                </p>
            </div>

            <div class="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
                <TextButton class="w-1/2" label="Cập nhật" :onClick="() => props.handleUpdateOrder(item)" />
                <DeleteButton class="w-1/2" label="Hủy đơn" :onClick="() => props.handleCancelOrder(item)" />
            </div>
        </div>
    </div>
</template>