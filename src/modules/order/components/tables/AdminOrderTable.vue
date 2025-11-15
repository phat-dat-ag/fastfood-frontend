<script setup lang="ts">
import EditButton from "../../../../components/buttons/EditButton.vue";
import type { Order } from "../../../../types/order.types";
import BaseOrderTable from "./BaseOrderTable.vue";

const props = defineProps<{
    orders: Order[];
    handleUpdateOrder: (order: Order) => void;
}>();
</script>
<template>
    <BaseOrderTable :orders="props.orders" showOrderId showCustomer showPayment showAddress enableActions>
        <template #actions="{ row }">
            <EditButton label="Chi tiết" @click="() => props.handleUpdateOrder(row)" />
        </template>
    </BaseOrderTable>
</template>