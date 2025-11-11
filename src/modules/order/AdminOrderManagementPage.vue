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

const orders = ref<Order[]>([]);

async function loadAllOrders() {
    await useApiHandler<OrderResponse>(
        getAllOrdersByAdmin,
        {
            loading: ADMIN_MANAGEMENT_ORDER_MESSAGE.get,
            error: ADMIN_MANAGEMENT_ORDER_MESSAGE.getError,
        },
        (data: OrderResponse) => orders.value = data.orders,
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

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý đơn hàng hệ thống
        </h2>

        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <OrderHistoryTable :orders="orders" :handleUpdateOrder="handleOpenOrderModal" />

        <AdminOrderModal v-if="selectedOrder && isOrderModalVisible" :order="selectedOrder"
            @close="isOrderModalVisible = false" />
    </div>
</template>