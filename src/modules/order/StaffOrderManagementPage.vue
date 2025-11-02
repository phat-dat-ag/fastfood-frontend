<script setup lang="ts">
import { useApiHandler } from '../../composables/useApiHandler';
import { STAFF_MANAGEMENT_ORDER_MESSAGE } from '../../constants/messages';
import { cancelOrderByStaff, getAllUnfinishedOrders } from '../../service/order.service';
import { onMounted, ref } from 'vue';
import type { Order, OrderResponse } from '../../types/order.types';
import StaffOrderTable from './components/tables/StaffOrderTable.vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { openCancelOrderConfirm } from '../../utils/confirmation.utils';
import { useUserStore } from '../../store/useUserStore.store';
import { useRouter } from 'vue-router';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';

const orders = ref<Order[]>([]);

async function loadUnfinishedOrders() {
    await useApiHandler<OrderResponse>(
        getAllUnfinishedOrders,
        {
            loading: STAFF_MANAGEMENT_ORDER_MESSAGE.get,
            error: STAFF_MANAGEMENT_ORDER_MESSAGE.getError,
        },
        (data: OrderResponse) => orders.value = data.orders,
    )
}

onMounted(loadUnfinishedOrders);

const userStore = useUserStore();
const router = useRouter();

function handleUpdateOrder(order: Order) {
    const role = userStore.user?.role;
    if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.ORDER_DETAIL_MANAGEMENT, params: { orderId: order.id } });
    else notifyError("Tài khoản không đủ quyền để xem chi tiết đơn hàng");
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
</template>