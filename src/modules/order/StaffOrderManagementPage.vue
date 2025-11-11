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
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';

const orderResponse = ref<OrderResponse | null>(null);

async function loadUnfinishedOrders(page: number = 0) {
    const pageRequest: PageRequest = {
        page,
        size: PAGE_SIZE.ORDERS.STAFF,
    }
    await useApiHandler<OrderResponse>(
        () => getAllUnfinishedOrders(pageRequest),
        {
            loading: STAFF_MANAGEMENT_ORDER_MESSAGE.get,
            error: STAFF_MANAGEMENT_ORDER_MESSAGE.getError,
        },
        (data: OrderResponse) => orderResponse.value = data,
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
async function handlePageChange(page: number) {
    await loadUnfinishedOrders(page);
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
        <div v-if="orderResponse">
            <StaffOrderTable :orders="orderResponse.orders" :handleUpdateOrder="handleUpdateOrder"
                :handleCancelOrder="handleCancelOrder" />
            <Pagination :totalItem="orderResponse.totalItems" :pageSize="orderResponse.pageSize"
                :currentPage="orderResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
</template>