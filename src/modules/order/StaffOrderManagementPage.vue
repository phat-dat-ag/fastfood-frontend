<script setup lang="ts">
import { useApiHandler } from '../../composables/useApiHandler';
import { STAFF_MANAGEMENT_ORDER_MESSAGE } from '../../constants/messages';
import { cancelOrderByStaff, confirmOrder, getUnfinishedOrder, markAsDelivered, markAsDelivering } from '../../service/order.service';
import { onMounted, ref } from 'vue';
import type { Order, OrderResponse } from '../../types/order.types';
import StaffOrderTable from './components/StaffOrderTable.vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import StaffOrderModal from './components/OrderModal.vue';
import { openCancelOrderConfirm } from '../../utils/confirmation.utils';

const orders = ref<Order[]>([]);

async function loadUnfinishedOrders() {
    await useApiHandler<OrderResponse>(
        getUnfinishedOrder,
        {
            loading: STAFF_MANAGEMENT_ORDER_MESSAGE.get,
            error: STAFF_MANAGEMENT_ORDER_MESSAGE.getError,
        },
        (data: OrderResponse) => orders.value = data.orders,
    )
}

onMounted(loadUnfinishedOrders);

const isStaffOrderModalVisible = ref<boolean>(false);

const selectedOrder = ref<Order | null>(null);

function handleUpdateOrder(order: Order) {
    isStaffOrderModalVisible.value = true;
    selectedOrder.value = order;
}

async function handleCancelOrder(order: Order) {
    const reason: string | null = await openCancelOrderConfirm();
    if (!reason) return;
    await useApiHandler<Order>(
        () => cancelOrderByStaff(order.id, reason),
        {
            loading: "Đang hủy đơn cho khách",
            error: "Lỗi hủy đơn cho khách",
            success: "Hủy đơn cho khách thành công",
        },
        () => { },
        loadUnfinishedOrders
    )
}

async function handleConfirmOrder(orderId: number) {
    await useApiHandler<Order>(
        () => confirmOrder(orderId),
        {
            loading: "Đang xác nhận đơn hàng",
            error: "Lỗi xác nhận đơn hàng",
            success: "Đơn hàng đã được xác nhận",
        },
        () => isStaffOrderModalVisible.value = false,
        loadUnfinishedOrders
    )
}

async function handleMarkDelivering(orderId: number) {
    await useApiHandler<Order>(
        () => markAsDelivering(orderId),
        {
            loading: "Đang đánh dấu đơn hàng",
            error: "Lỗi đánh dấu đơn hàng",
            success: "Đơn hàng đã được đánh dấu là đang giao hàng",
        },
        () => isStaffOrderModalVisible.value = false,
        loadUnfinishedOrders
    )
}

async function handleMarkDelivered(orderId: number) {
    await useApiHandler<Order>(
        () => markAsDelivered(orderId),
        {
            loading: "Đang đánh dấu đơn hàng",
            error: "Lỗi đánh dấu đơn hàng",
            success: "Đơn hàng đã được đánh dấu là đã giao thành công",
        },
        () => isStaffOrderModalVisible.value = false,
        loadUnfinishedOrders
    )
}

</script>
<template>
    <div class="mx-auto space-y-6">
        <div
            class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold drop-shadow-md">📦 Quản lý đơn hàng</h1>
                <p class="text-white/90 mt-1">Theo dõi, cập nhật và quản lý đơn hàng tại đây!</p>
            </div>
            <div class="w-[20%]">
                <PrimaryButton label="Làm mới danh sách" :onClick="loadUnfinishedOrders" />
            </div>
        </div>
        <StaffOrderTable :orders="orders" :handleUpdateOrder="handleUpdateOrder"
            :handleCancelOrder="handleCancelOrder" />
    </div>
    <StaffOrderModal v-if="isStaffOrderModalVisible && selectedOrder" :order="selectedOrder" :isStaff=true
        @close="isStaffOrderModalVisible = false" @confirm-order="handleConfirmOrder"
        @mark-delivered="handleMarkDelivered" @mark-delivering="handleMarkDelivering" />
</template>