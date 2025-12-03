<script setup lang="ts">
import TextButton from "../../../components/buttons/TextButton.vue";
import EditButton from "../../../components/buttons/EditButton.vue";
import type { Order } from "../../../types/order.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import { getDetailAddress } from "../../../utils/geocode.utils";
import { ORDER_STATUS_TEXT, PAYMENT_METHOD_TEXT, PAYMENT_STATUS_TEXT } from "../../../utils/order-display.utils";
import { formatDateTimeString } from "../../../utils/time.utils";
import { ORDER_STATUS } from "../../../constants/order-status";
import { PAYMENT_METHODS } from "../../../constants/payment-methods";
import { PAYMENT_STATUS } from "../../../constants/payment-status";

const props = defineProps<{
    orders: Order[];
    handleUpdateOrder: (order: Order) => void;
    handleCheckout: (id: number) => Promise<void>;
}>();
</script>

<template>
    <div class="space-y-4">
        <div v-for="item in props.orders" :key="item.id"
            class="bg-white shadow-md rounded-xl p-4 border border-orange-100">

            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg text-gray-800">
                    Đơn hàng #{{ item.id }}
                </h3>

                <TextButton label="Chi tiết" :onClick="() => props.handleUpdateOrder(item)" />
            </div>

            <p class="text-sm text-gray-600 mt-2">
                <span class="font-medium">Ngày đặt:</span>
                {{ formatDateTimeString(item.placedAt) }}
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
                <span class="font-medium">Tổng tiền: </span>
                <span class="text-orange-600 font-semibold">
                    {{ formatCurrencyVND(item.totalPrice) }}
                </span>
            </p>

            <p class="text-sm text-gray-600" v-if="item.address">
                <span class="font-medium">Địa chỉ:</span>
                {{ getDetailAddress(item.address) }}
            </p>

            <div class="mt-3" v-if="
                item.orderStatus === ORDER_STATUS.PENDING &&
                item.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER &&
                item.paymentStatus !== PAYMENT_STATUS.PAID
            ">
                <EditButton label="Thanh toán ngay" @click="() => props.handleCheckout(item.id)" />
            </div>
        </div>
    </div>
</template>
