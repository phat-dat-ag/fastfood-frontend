<script setup lang="ts">
import { useApiHandler } from '../../composables/useApiHandler';
import { getAllOrdersByAdmin } from '../../service/order.service';
import { onMounted, ref } from 'vue';
import type { Order, OrderResponse } from '../../types/order.types';
import OrderHistoryTable from './components/tables/OrderHistoryTable.vue';
import { ADMIN_MANAGEMENT_ORDER_MESSAGE } from '../../constants/messages';
import AdminOrderModal from './components/modals/AdminOrderModal.vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import Pagination from '../../components/Pagination.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';

const orderResponse = ref<OrderResponse | null>(null);

async function loadAllOrders(page: number = 0) {
    const pageRequest: PageRequest = {
        page,
        size: PAGE_SIZE.ORDERS.ADMIN,
    }
    await useApiHandler<OrderResponse>(
        () => getAllOrdersByAdmin(pageRequest),
        {
            loading: ADMIN_MANAGEMENT_ORDER_MESSAGE.get,
            error: ADMIN_MANAGEMENT_ORDER_MESSAGE.getError,
        },
        (data: OrderResponse) => orderResponse.value = data,
    )
}

onMounted(loadAllOrders);

const filterOptions: Filter[] = [
    { label: 'Trên 100 000đ', value: 'over-100K' },
    { label: 'Trên 500 000đ', value: 'over-500K' },
    { label: 'Gần đây', value: 'recently' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đang giao', value: 'delivering' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' },
];

const activeFilters = ref<any[]>([]);

function handleFilterChange(filters: any[]) {
    activeFilters.value = filters;
    console.log(activeFilters.value);
}

const search = ref<string>("");

function handleSearchChange(searchText: string) {
    search.value = searchText;
    console.log(search.value);
}

const isOrderModalVisible = ref<boolean>(false);
const selectedOrder = ref<Order | null>(null);

function handleOpenOrderModal(order: Order) {
    isOrderModalVisible.value = true;
    selectedOrder.value = order;
}

async function handlePageChange(page: number) {
    await loadAllOrders(page);
}

</script>
<template>
    <div class="p-6">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý đơn hàng hệ thống
        </h2>
        <div v-if="orderResponse">
            <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
                @update:filter="handleFilterChange" />

            <OrderHistoryTable :orders="orderResponse?.orders" :handleUpdateOrder="handleOpenOrderModal" />

            <Pagination :totalItem="orderResponse.totalItems" :pageSize="orderResponse.pageSize"
                :currentPage="orderResponse.currentPage" @change-page="handlePageChange" />

            <AdminOrderModal v-if="selectedOrder && isOrderModalVisible" :order="selectedOrder"
                @close="isOrderModalVisible = false" />
        </div>
    </div>
</template>