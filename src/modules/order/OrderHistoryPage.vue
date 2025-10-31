<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { ORDER_HISTORY_MESSAGE } from '../../constants/messages';
import { getAllOrderByUser } from '../../service/order.service';
import { type Order, type OrderResponse } from '../../types/order.types';
import OrderTrackingTable from './components/tables/OrderTrackingTable.vue';
import OrderHistoryModal from './components/modals/OrderHistoryModal.vue';
import { useUserStore } from '../../store/useUserStore.store';
import { USER_ROLES } from '../../constants/user-roles';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';

const orders = ref<Order[]>([]);

async function loadOrders() {
    await useApiHandler<OrderResponse>(
        getAllOrderByUser,
        {
            loading: ORDER_HISTORY_MESSAGE.get,
            error: ORDER_HISTORY_MESSAGE.getError,
        },
        (data: OrderResponse) => orders.value = data.orders,
    )
}

onMounted(loadOrders);

const isTrackingOrderModalVisible = ref<boolean>(false);

const selectedOrder = ref<Order | null>(null);

function handleUpdateOrder(order: Order) {
    isTrackingOrderModalVisible.value = true;
    selectedOrder.value = order;
}

const userStore = useUserStore();
const router = useRouter();

function handleReviewOrder(orderId: number) {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.PRODUCT_REVIEW, params: { orderId } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.PRODUCT_REVIEW, params: { orderId } });
    else notifyError("Tài khoản không đủ quyền để đánh giá sản phẩm");
}
</script>

<template>
    <div class="mx-auto space-y-6">
        <div
            class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold drop-shadow-md">Lịch sử mua hàng</h1>
                <p class="text-white/90 mt-1">Tại đây bạn có thể xem tất cả các đơn gồm đã giao thành công, đã hủy.</p>
            </div>
            <div class="w-[20%]">
                <PrimaryButton label="Làm mới" :onClick="loadOrders" />
            </div>
        </div>
        <OrderTrackingTable :orders="orders" :handleUpdateOrder="handleUpdateOrder" />
    </div>
    <OrderHistoryModal v-if="isTrackingOrderModalVisible && selectedOrder" :order="selectedOrder"
        @review-order="handleReviewOrder" @close="isTrackingOrderModalVisible = false" />
</template>