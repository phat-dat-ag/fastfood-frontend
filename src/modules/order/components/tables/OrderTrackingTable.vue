<script setup lang="ts">
import EditButton from "../../../../components/buttons/EditButton.vue";
import { ORDER_STATUS } from "../../../../constants/order-status";
import { PAYMENT_METHODS } from "../../../../constants/payment-methods";
import { PAYMENT_STATUS } from "../../../../constants/payment-status";
import type { Order } from "../../../../types/order.types";
import BaseOrderTable from "./BaseOrderTable.vue";

const props = defineProps<{
    orders: Order[];
    handleCheckout: (id: number) => Promise<void>;
    handleUpdateOrder: (order: Order) => void;
}>();
</script>
<template>
    <BaseOrderTable :orders="props.orders" showPayment showAddress enableActions>
        <template #actions="{ row }">
            <EditButton label="Chi tiết" @click="() => props.handleUpdateOrder(row)" />

            <EditButton v-if="row.orderStatus === ORDER_STATUS.PENDING
                && row.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER
                && row.paymentStatus !== PAYMENT_STATUS.PAID" label="Thanh toán ngay"
                @click="() => props.handleCheckout(row.id)" />
        </template>
    </BaseOrderTable>
</template>