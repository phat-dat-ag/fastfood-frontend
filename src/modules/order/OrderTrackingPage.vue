<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { ORDER_TRACKING_MESSAGE } from '../../constants/messages';
import { getAllActiveOrders } from '../../service/order.service';
import { type Order, type OrderResponse } from '../../types/order.types';
import OrderTrackingTable from './components/tables/OrderTrackingTable.vue';
import { useUserStore } from '../../store/useUserStore.store';
import { useRouter } from 'vue-router';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';

const orders = ref<Order[]>([]);

async function loadTrackingOrders() {
    await useApiHandler<OrderResponse>(
        getAllActiveOrders,
        {
            loading: ORDER_TRACKING_MESSAGE.get,
            error: ORDER_TRACKING_MESSAGE.getError,
        },
        (data: OrderResponse) => orders.value = data.orders,
    )
}

onMounted(loadTrackingOrders);

const userStore = useUserStore();
const router = useRouter();

function handleUpdateOrder(order: Order) {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.ORDER_TRACKING_DETAIL, params: { orderId: order.id } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.ORDER_TRACKING_DETAIL, params: { orderId: order.id } });
    else notifyError("Tài khoản không đủ quyền để xem chi tiết đơn hàng");
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
</template>