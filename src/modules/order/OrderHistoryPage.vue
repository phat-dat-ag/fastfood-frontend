<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { ORDER_HISTORY_MESSAGE } from '../../constants/messages';
import { getAllOrderHistory } from '../../service/order.service';
import { type Order, type OrderResponse } from '../../types/order.types';
import { useUserStore } from '../../store/useUserStore.store';
import { USER_ROLES } from '../../constants/user-roles';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';
import OrderHistoryTable from './components/tables/OrderHistoryTable.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';
import HeaderCard from '../../components/HeaderCard.vue';
import EmptyPage from '../../components/EmptyPage.vue';
import OrderHistoryCardList from './components/OrderHistoryCardList.vue';

const orderResponse = ref<OrderResponse | null>(null);

async function loadOrders(page: number = 0) {
    const pageRequest: PageRequest = {
        page,
        size: PAGE_SIZE.ORDERS.HISTORY,
    }
    await useApiHandler<OrderResponse>(
        () => getAllOrderHistory(pageRequest),
        {
            loading: ORDER_HISTORY_MESSAGE.get,
            error: ORDER_HISTORY_MESSAGE.getError,
        },
        (data: OrderResponse) => orderResponse.value = data,
    )
}

onMounted(loadOrders);

const userStore = useUserStore();
const router = useRouter();

function handleViewOrderHistoryDetail(order: Order) {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.ORDER_HISTORY_DETAIL, params: { orderId: order.id } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.ORDER_HISTORY_DETAIL, params: { orderId: order.id } });
    else notifyError("Tài khoản không đủ quyền để xem chi tiết đơn hàng");
}

async function handlePageChange(page: number) {
    await loadOrders(page);
}
</script>
<template>
    <div v-if="orderResponse" class="mx-auto space-y-8">
        <HeaderCard title="Lịch sử mua hàng"
            description="Tại đây bạn có thể xem tất cả các đơn gồm đã giao thành công, đã hủy."
            buttonLabel="Làm mới danh sách" :onClick="loadOrders" />
        <div>
            <div class="hidden lg:block">
                <OrderHistoryTable :orders="orderResponse.orders" :handleUpdateOrder="handleViewOrderHistoryDetail" />
            </div>

            <div class="block lg:hidden">
                <OrderHistoryCardList :orders="orderResponse.orders"
                    :handleUpdateOrder="handleViewOrderHistoryDetail" />
            </div>
            <Pagination :totalItem="orderResponse.totalItems" :pageSize="orderResponse.pageSize"
                :currentPage="orderResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
    <EmptyPage v-else />
</template>