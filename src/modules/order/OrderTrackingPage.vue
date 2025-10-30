<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { ORDER_TRACKING_MESSAGE } from '../../constants/messages';
import { cancelOrder, getUnfinishedOrderByUser } from '../../service/order.service';
import { type Order, type OrderResponse } from '../../types/order.types';
import OrderTrackingTable from './components/tables/OrderTrackingTable.vue';
import { openCancelOrderConfirm } from '../../utils/confirmation.utils';
import OrderTrackingModal from './components/modals/OrderTrackingModal.vue';

const orders = ref<Order[]>([]);

async function loadTrackingOrders() {
    await useApiHandler<OrderResponse>(
        getUnfinishedOrderByUser,
        {
            loading: ORDER_TRACKING_MESSAGE.get,
            error: ORDER_TRACKING_MESSAGE.getError,
        },
        (data: OrderResponse) => orders.value = data.orders,
    )
}

onMounted(loadTrackingOrders);

const isTrackingOrderModalVisible = ref<boolean>(false);

const selectedOrder = ref<Order | null>(null);

function handleUpdateOrder(order: Order) {
    isTrackingOrderModalVisible.value = true;
    selectedOrder.value = order;
}

async function handleCancelOrder(order: Order) {
    const reason: string | null = await openCancelOrderConfirm();
    if (!reason) return;
    await useApiHandler<Order>(
        () => cancelOrder(order.id, reason),
        {
            loading: "Đang hủy đơn",
            error: "Lỗi hủy đơn",
            success: "Đã hủy đơn",
        },
        () => isTrackingOrderModalVisible.value = false,
        loadTrackingOrders
    )
}
</script>

<template>
    <div class="mx-auto space-y-6">
        <div
            class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold drop-shadow-md">Theo dõi đơn hàng</h1>
                <p class="text-white/90 mt-1">Tại đây bạn có thể theo dõi các đơn hàng đang được vận chuyển đến bạn.</p>
            </div>
            <div class="w-[20%]">
                <PrimaryButton label="Làm mới" :onClick="loadTrackingOrders" />
            </div>
        </div>
        <OrderTrackingTable :orders="orders" :handleUpdateOrder="handleUpdateOrder" />
    </div>
    <OrderTrackingModal v-if="isTrackingOrderModalVisible && selectedOrder" :order="selectedOrder"
        @cancel-order="handleCancelOrder" @close="isTrackingOrderModalVisible = false" />
</template>