<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Order } from '../../types/order.types';
import { useRoute, useRouter } from 'vue-router';
import { notifyError } from '../../utils/notification.utils';
import { useApiHandler } from '../../composables/useApiHandler';
import { cancelOrderByStaff, confirmOrder, getUnfinishedOrder, markAsDelivered, markAsDelivering } from '../../service/order.service';
import { STAFF_MANAGEMENT_ORDER_DETAIL_MESSAGE } from '../../constants/messages';
import { PAYMENT_METHOD_TEXT } from '../../utils/order-display.utils';
import { formatCurrencyVND } from '../../utils/currency.utils';
import { PAYMENT_STATUS } from '../../constants/payment-status';
import { PAYMENT_METHODS } from '../../constants/payment-methods';
import { ORDER_STATUS } from '../../constants/order-status';
import { getDetailAddress } from '../../utils/geocode.utils';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import DeleteButton from '../../components/buttons/DeleteButton.vue';
import { openCancelOrderConfirm } from '../../utils/confirmation.utils';
import OrderTimeline from './components/OrderTimeline.vue';

const order = ref<Order | null>(null);

const route = useRoute();
const router = useRouter();

async function loadUnfinishedOrder() {
    const orderIdParam = route.params.orderId;
    const orderId = Number(orderIdParam);
    if (!orderIdParam || Number.isNaN(orderId) || orderId <= 0) {
        notifyError('Không thể xem chi tiết đơn hàng: mã đơn hàng không hợp lệ');
        router.back();
        return;
    }
    await useApiHandler<Order>(
        () => getUnfinishedOrder(orderId),
        {
            loading: STAFF_MANAGEMENT_ORDER_DETAIL_MESSAGE.get,
            error: STAFF_MANAGEMENT_ORDER_DETAIL_MESSAGE.getError,
        },
        (data: Order) => order.value = data,
    )
}

onMounted(loadUnfinishedOrder);

async function handleConfirmOrder(orderId: number) {
    await useApiHandler<Order>(
        () => confirmOrder(orderId),
        {
            loading: "Đang xác nhận đơn hàng",
            error: "Lỗi xác nhận đơn hàng",
            success: "Đơn hàng đã được xác nhận",
        },
        () => { },
        loadUnfinishedOrder,
    )
}

async function handleMarkDelivering(orderId: number) {
    await useApiHandler<Order>(
        () => markAsDelivering(orderId),
        {
            loading: "Đang đánh dấu đơn hàng",
            error: "Lỗi đánh dấu đơn hàng",
            success: "Đơn hàng đã được đánh dấu là đang giao hàng",
        },
        () => { },
        loadUnfinishedOrder,
    )
}

async function handleMarkDelivered(orderId: number) {
    await useApiHandler<Order>(
        () => markAsDelivered(orderId),
        {
            loading: "Đang đánh dấu đơn hàng",
            error: "Lỗi đánh dấu đơn hàng",
            success: "Đơn hàng đã được đánh dấu là đã giao thành công",
        },
        () => router.back(),
    )
}

async function handleCancelOrder(orderId: number) {
    const reason: string | null = await openCancelOrderConfirm();
    if (!reason) return;
    await useApiHandler<Order>(
        () => cancelOrderByStaff(orderId, reason),
        {
            loading: "Đang hủy đơn cho khách",
            error: "Lỗi hủy đơn cho khách",
            success: "Hủy đơn cho khách thành công",
        },
        () => router.back(),
    )
}
</script>
<template>
    <div v-if="order" class="grid grid-cols-2 gap-8 text-gray-700">
        <div class="space-y-6">
            <section>
                <h3 class="section-title">Thông tin đơn hàng</h3>
                <div class="section-content">
                    <p><span class="label">Phương thức thanh toán: </span>{{
                        PAYMENT_METHOD_TEXT[order.paymentMethod] }}</p>
                    <p><span class="label">Tổng tiền: </span>
                        <span class="text-orange-600 font-bold">
                            {{ formatCurrencyVND(order.subtotalPrice) }}
                        </span>
                    </p>
                </div>
            </section>

            <ElDivider />

            <section>
                <h3 class="section-title">Khách hàng</h3>
                <div class="section-content">
                    <p><span class="label">Tên:</span> {{ order.user.name }}</p>
                    <p><span class="label">SĐT:</span> {{ order.user.phone }}</p>
                    <p><span class="label">Email:</span> {{ order.user.email }}</p>
                </div>
            </section>

            <ElDivider />

            <section>
                <h3 class="section-title">Địa chỉ giao hàng</h3>
                <div class="section-content">
                    <p><span class="label">Tỉnh/TP:</span> {{ order.address.province }}</p>
                    <p><span class="label">Quận/Huyện:</span> {{ order.address.district }}</p>
                    <p><span class="label">Chi tiết:</span> {{ getDetailAddress(order.address) }}</p>
                </div>
            </section>
        </div>

        <div class="flex flex-col justify-between">
            <section>
                <h3 class="section-title">Hành trình đơn hàng</h3>
                <div class="p-2">
                    <OrderTimeline :order="order" />
                </div>
            </section>

            <section class="mt-5 flex flex-col gap-3">
                <PrimaryButton v-if="order.orderStatus === ORDER_STATUS.PENDING" label="Xác nhận đơn"
                    :onClick="() => handleConfirmOrder(order!.id)" />
                <PrimaryButton v-else-if="order.orderStatus === ORDER_STATUS.CONFIRMED" label="Giao hàng ngay"
                    :onClick="() => handleMarkDelivering(order!.id)" />
                <PrimaryButton v-else label="Đánh dấu đã giao" :onClick="() => handleMarkDelivered(order!.id)" />
                <DeleteButton
                    v-if="!order.deliveringAt && !(order.paymentStatus === PAYMENT_STATUS.PAID && order.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER)"
                    label="Hủy đơn hàng" :onClick="() => handleCancelOrder(order!.id)" />
            </section>
        </div>
    </div>
</template>

<style lang="postcss" scoped src="../../styles/order-modal.css"></style>