<script setup lang="ts">
import { ElDialog, ElDivider } from 'element-plus';
import { ref } from 'vue';
import type { Order } from '../../../types/order.types';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { PAYMENT_METHOD_TEXT } from '../../../utils/order-display.utils';
import { getDetailAddress } from '../../../utils/geocode.utils';
import { ORDER_STATUS } from '../../../constants/order-status';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import OrderTimeline from './OrderTimeline.vue';
import { PAYMENT_STATUS } from '../../../constants/payment-status';
import { PAYMENT_METHODS } from '../../../constants/payment-methods';

const props = defineProps<{ order: Order; isStaff: boolean; canCancelOrder: boolean }>();
const emit = defineEmits([
    "close",
    "update-status",
    "confirm-order",
    "mark-delivering",
    "mark-delivered",
    "cancel-order",
]);

const isVisible = ref(true);

</script>

<template>
    <ElDialog v-model="isVisible" width="950px" :title="`Đơn hàng #${props.order.id}`" @close="emit('close')"
        class="order-detail-modal">
        <div class="grid grid-cols-2 gap-8 text-gray-700">
            <div class="space-y-6">
                <section>
                    <h3 class="section-title">Thông tin đơn hàng</h3>
                    <div class="section-content">
                        <p><span class="label">Phương thức thanh toán: </span>{{
                            PAYMENT_METHOD_TEXT[props.order.paymentMethod] }}</p>
                        <p><span class="label">Tổng tiền: </span>
                            <span class="text-orange-600 font-bold">
                                {{ formatCurrencyVND(props.order.subtotalPrice) }}
                            </span>
                        </p>
                    </div>
                </section>

                <ElDivider />

                <section>
                    <h3 class="section-title">Khách hàng</h3>
                    <div class="section-content">
                        <p><span class="label">Tên:</span> {{ props.order.user.name }}</p>
                        <p><span class="label">SĐT:</span> {{ props.order.user.phone }}</p>
                        <p><span class="label">Email:</span> {{ props.order.user.email }}</p>
                    </div>
                </section>

                <ElDivider />

                <section>
                    <h3 class="section-title">Địa chỉ giao hàng</h3>
                    <div class="section-content">
                        <p><span class="label">Tỉnh/TP:</span> {{ props.order.address.province }}</p>
                        <p><span class="label">Quận/Huyện:</span> {{ props.order.address.district }}</p>
                        <p><span class="label">Chi tiết:</span> {{ getDetailAddress(props.order.address) }}</p>
                    </div>
                </section>
            </div>

            <div class="flex flex-col justify-between">
                <section>
                    <h3 class="section-title">Hành trình đơn hàng</h3>
                    <div class="p-2">
                        <OrderTimeline :order="props.order" />
                    </div>
                </section>

                <section class="mt-5 flex flex-col gap-3">
                    <PrimaryButton v-if="props.isStaff && props.order.orderStatus === ORDER_STATUS.PENDING"
                        label="Xác nhận đơn" :onClick="() => emit('confirm-order', props.order.id)" />
                    <PrimaryButton v-else-if="props.isStaff && props.order.orderStatus === ORDER_STATUS.CONFIRMED"
                        label="Giao hàng ngay" :onClick="() => emit('mark-delivering', props.order.id)" />
                    <PrimaryButton v-else-if="props.isStaff" label="Đánh dấu đã giao"
                        :onClick="() => emit('mark-delivered', props.order.id)" />
                    <DeleteButton
                        v-if="props.canCancelOrder && !props.order.deliveringAt && !(props.order.paymentStatus === PAYMENT_STATUS.PAID && props.order.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER)"
                        label="Hủy đơn hàng" :onClick="() => emit('cancel-order', props.order)" />
                </section>
            </div>
        </div>
    </ElDialog>
</template>

<style lang="postcss" scoped>
.order-detail-modal :deep(.el-dialog__body) {
    background-color: #fffdf8;
    border-radius: 1rem;
    padding: 1.75rem;
}

.order-detail-modal :deep(.el-dialog__header) {
    background: linear-gradient(to right, #fb923c, #f59e0b);
    color: white;
    border-radius: 1rem 1rem 0 0;
    padding: 1.25rem 1.5rem;
    font-weight: bold;
    letter-spacing: 0.3px;
}

.section-title {
    @apply font-semibold text-orange-600 text-lg mb-2;
}

.section-content {
    @apply space-y-1 text-sm leading-relaxed;
}

.label {
    @apply font-semibold text-gray-800;
}
</style>
