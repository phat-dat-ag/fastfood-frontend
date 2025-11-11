<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { ORDER_TRACKING_MESSAGE } from '../../constants/messages';
import { getAllActiveOrders, getPaymentIntent } from '../../service/order.service';
import { type Order, type OrderResponse } from '../../types/order.types';
import OrderTrackingTable from './components/tables/OrderTrackingTable.vue';
import { useUserStore } from '../../store/useUserStore.store';
import { useRouter } from 'vue-router';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';
import { notifyError } from '../../utils/notification.utils';
import CheckoutModal from '../cart/components/CheckoutModal.vue';
import Pagination from '../../components/Pagination.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';

const orderResponse = ref<OrderResponse | null>(null);

async function loadTrackingOrders(page: number = 0) {
    const pageRequest: PageRequest = {
        page,
        size: PAGE_SIZE.ORDERS.TRACKING,
    }
    await useApiHandler<OrderResponse>(
        () => getAllActiveOrders(pageRequest),
        {
            loading: ORDER_TRACKING_MESSAGE.get,
            error: ORDER_TRACKING_MESSAGE.getError,
        },
        (data: OrderResponse) => orderResponse.value = data,
    )
}

onMounted(loadTrackingOrders);

const userStore = useUserStore();
const router = useRouter();

const isCheckoutModalVisible = ref<boolean>(false);
const clientSecret = ref<string | null>(null);

async function handleCheckout(orderId: number) {
    isCheckoutModalVisible.value = true;
    await useApiHandler<Order>(
        () => getPaymentIntent(orderId),
        {
            loading: "Đang chuẩn bị thanh toán qua Stripe",
            error: "Chuẩn bị thanh toán thất bại",
        },
        (data: Order) => clientSecret.value = data.clientSecret,
    )
}

async function handleCloseCheckoutModal() {
    isCheckoutModalVisible.value = false;
    await nextTick();
    // Wait a bit for Stripe webhook to update payment status in backend
    await new Promise(res => setTimeout(res, 1500));
    await loadTrackingOrders();
}

function handleUpdateOrder(order: Order) {
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.ORDER_TRACKING_DETAIL, params: { orderId: order.id } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.ORDER_TRACKING_DETAIL, params: { orderId: order.id } });
    else notifyError("Tài khoản không đủ quyền để xem chi tiết đơn hàng");
}

async function handlePageChange(page: number) {
    await loadTrackingOrders(page);
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
        <div v-if="orderResponse">
            <OrderTrackingTable :orders="orderResponse.orders" :handleCheckout="handleCheckout"
                :handleUpdateOrder="handleUpdateOrder" />
            <Pagination :totalItem="orderResponse.totalItems" :pageSize="orderResponse.pageSize"
                :currentPage="orderResponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
    <CheckoutModal v-if="isCheckoutModalVisible" :clientSecret="clientSecret" @close="handleCloseCheckoutModal" />
</template>