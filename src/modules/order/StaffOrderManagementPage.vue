<script setup lang="ts">
import { useApiHandler } from '../../composables/useApiHandler';
import { STAFF_MANAGEMENT_ORDER_MESSAGE } from '../../constants/messages';
import { cancelOrderByStaff, getAllUnfinishedOrders } from '../../service/order.service';
import { onMounted, ref } from 'vue';
import type { Order, OrderResponse } from '../../types/order.types';
import StaffOrderTable from './components/tables/StaffOrderTable.vue';
import { openCancelOrderConfirm } from '../../utils/confirmation.utils';
import { useUserStore } from '../../store/useUserStore.store';
import { useRouter } from 'vue-router';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';
import HeaderCard from '../../components/HeaderCard.vue';
import EmptyPage from '../../components/EmptyPage.vue';
import StaffOrderCardList from './components/StaffOrderCardList.vue';

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
    <div v-if="orderResponse && orderResponse.orders.length > 0" class="mx-auto space-y-8">
        <HeaderCard title="Quản lý đơn hàng" description="Theo dõi, cập nhật và quản lý đơn hàng tại đây!"
            buttonLabel="Làm mới danh sách" :onClick="loadUnfinishedOrders" />
        <div>
            <div class="hidden lg:block">
                <StaffOrderTable :orders="orderResponse.orders" :handleUpdateOrder="handleUpdateOrder"
                    :handleCancelOrder="handleCancelOrder" />
            </div>

            <div class="block lg:hidden">
                <StaffOrderCardList :orders="orderResponse.orders" :handleUpdateOrder="handleUpdateOrder"
                    :handleCancelOrder="handleCancelOrder" />
            </div>
            <Pagination :totalItem="orderResponse.totalItems" :pageSize="orderResponse.pageSize"
                :currentPage="orderResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
    <EmptyPage v-else title="Không có đơn hàng nào cần quản lý" />
</template>