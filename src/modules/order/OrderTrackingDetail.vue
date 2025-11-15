<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notifyError } from '../../utils/notification.utils';
import { useApiHandler } from '../../composables/useApiHandler';
import type { Order } from '../../types/order.types';
import { cancelOrder, getActiveOrder, getPaymentIntent } from '../../service/order.service';
import { ORDER_TRACKING_DETAIL_MESSAGE } from '../../constants/messages';
import { PAYMENT_STATUS } from '../../constants/payment-status';
import { PAYMENT_METHODS } from '../../constants/payment-methods';
import { openCancelOrderConfirm } from '../../utils/confirmation.utils';
import OrderTimeline from './components/OrderTimeline.vue';
import DeleteButton from '../../components/buttons/DeleteButton.vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { ORDER_STATUS } from '../../constants/order-status';
import CheckoutModal from '../cart/components/CheckoutModal.vue';
import OrderCustomerInformation from './components/OrderCustomerInformation.vue';
import OrderInvoiceSummary from './components/OrderInvoiceSummary.vue';

const order = ref<Order | null>(null);

const route = useRoute();

async function loadActiveOrder() {
    const orderIdParam = route.params.orderId;
    const orderId = Number(orderIdParam);
    if (!orderIdParam || Number.isNaN(orderId) || orderId <= 0) {
        notifyError('Không thể xem chi tiết đơn hàng: mã đơn hàng không hợp lệ');
        router.back();
        return;
    }
    await useApiHandler<Order>(
        () => getActiveOrder(orderId),
        {
            loading: ORDER_TRACKING_DETAIL_MESSAGE.get,
            error: ORDER_TRACKING_DETAIL_MESSAGE.getError,
        },
        (data: Order) => order.value = data,
    )
}
const router = useRouter();

onMounted(loadActiveOrder);

const canCheckout = computed<boolean>(() => {
    if (!order.value) return false;
    return (order.value.orderStatus === ORDER_STATUS.PENDING
        && order.value.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER
        && order.value.paymentStatus !== PAYMENT_STATUS.PAID);
})

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
    await loadActiveOrder();
}

async function handleCancelOrder(order: Order) {
    const reason: string | null = await openCancelOrderConfirm();
    if (!reason) return;
    await useApiHandler<Order>(
        () => cancelOrder(order.id, reason),
        {
            loading: "Đang hủy đơn",
            error: "Lỗi hủy đơn",
            success: "Đã hủy đơn",
        },
        () => router.back(),
    )
}
</script>
<template>
    <div v-if="order" class="grid grid-cols-2 gap-8 text-gray-700">
        <div class="space-y-6">
            <OrderCustomerInformation :order="order" />
            <OrderInvoiceSummary :order="order" />
        </div>
        <div class="flex flex-col justify-between">
            <OrderTimeline :order="order" />
            <section class="mt-5 flex flex-col gap-3">
                <PrimaryButton v-if="canCheckout" label="Thanh toán ngay" :onClick="() => handleCheckout(order!.id)" />
                <DeleteButton
                    v-if="!order.deliveringAt && !(order.paymentStatus === PAYMENT_STATUS.PAID && order.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER)"
                    label="Hủy đơn hàng" :onClick="() => handleCancelOrder(order!)" />
            </section>
        </div>
    </div>
    <CheckoutModal v-if="isCheckoutModalVisible" :clientSecret="clientSecret" @close="handleCloseCheckoutModal" />
</template>

<style lang="postcss" scoped src="../../styles/order-modal.css"></style>