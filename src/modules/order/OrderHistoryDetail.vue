<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notifyError } from '../../utils/notification.utils';
import { useApiHandler } from '../../composables/useApiHandler';
import { getOrderHistory } from '../../service/order.service';
import { ORDER_HISTORY_DETAIL_MESSAGE } from '../../constants/messages';
import type { Order } from '../../types/order.types';
import OrderInvoiceSummary from './components/OrderInvoiceSummary.vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import OrderTimeline from './components/OrderTimeline.vue';
import { useUserStore } from '../../store/useUserStore.store';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';
import OrderCustomerInformation from './components/OrderCustomerInformation.vue';

const order = ref<Order | null>(null);

async function loadOrderHistory(orderId: number) {
    await useApiHandler<Order>(
        () => getOrderHistory(orderId),
        {
            loading: ORDER_HISTORY_DETAIL_MESSAGE.get,
            error: ORDER_HISTORY_DETAIL_MESSAGE.getError,
        },
        (data: Order) => order.value = data,
    )
}

const isReviewAllowed = computed<boolean>(() => {
    if (!order.value) return false;

    const { deliveredAt, reviews } = order.value;

    if (!deliveredAt || reviews.length !== 0) return false;

    const now = new Date();
    const deliveredDate = new Date(deliveredAt);
    const diffDays = (now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays <= 2;
});

const route = useRoute();
const router = useRouter();

onMounted(() => {
    const orderIdParam = route.params.orderId;
    const orderId = Number(orderIdParam);
    if (!orderIdParam || Number.isNaN(orderId) || orderId <= 0) {
        notifyError('Không thể xem chi tiết đơn hàng đã mua: mã đơn hàng không hợp lệ');
        router.back();
        return;
    }
    loadOrderHistory(orderId);
});

const userStore = useUserStore();

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
    <div v-if="order" class="grid grid-cols-2 gap-8 text-gray-700">
        <div class="space-y-6">
            <OrderCustomerInformation :order="order" />
            <OrderInvoiceSummary :order="order" />
        </div>
        <section>
            <OrderTimeline :order="order" />
            <div v-if="isReviewAllowed">
                <PrimaryButton label="Đánh giá ngay" :onClick="() => handleReviewOrder(order!.id)" />
            </div>
        </section>
    </div>
</template>

<style lang="postcss" scoped src="../../styles/order-modal.css"></style>