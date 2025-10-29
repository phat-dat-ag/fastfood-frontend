<script setup lang="ts">
import { ElDialog, ElTag, ElDivider } from 'element-plus';
import { ref } from 'vue';
import type { Order } from '../../../types/order.types';
import { formatDateTimeString } from '../../../utils/time.utils';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import {
    PAYMENT_METHOD_TEXT,
    PAYMENT_STATUS_TEXT,
    getPaymentTagType
} from '../../../utils/order-display.utils';
import { getDetailAddress } from '../../../utils/geocode.utils';
import { ORDER_STATUS } from '../../../constants/order-status';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import OrderTimeline from './OrderTimeline.vue';

const props = defineProps<{
    order: Order;
}>();

const emit = defineEmits(["close", "update-status", "confirm-order", "mark-delivering", "mark-delivered"]);

const isVisible = ref<boolean>(true);

</script>

<template>
    <ElDialog v-model="isVisible" width="600px" :title="`Đơn hàng #${props.order.id}`" @close="emit('close')"
        class="order-detail-modal">
        <div class="space-y-4 text-gray-700">
            <section>
                <h3 class="font-semibold text-orange-600 text-lg mb-2">Thông tin đơn hàng</h3>
                <div class="space-y-1 text-sm">
                    <p><span class="font-semibold">Ngày đặt:</span> {{ formatDateTimeString(props.order.placedAt) }}</p>
                    <p>
                        <span class="font-semibold">Trạng thái thanh toán:</span>
                        <ElTag :type="getPaymentTagType(props.order.paymentStatus)" size="small">
                            {{ PAYMENT_STATUS_TEXT[props.order.paymentStatus] }}
                        </ElTag>
                    </p>
                    <p><span class="font-semibold">Phương thức thanh toán:</span> {{
                        PAYMENT_METHOD_TEXT[props.order.paymentMethod] }}</p>
                    <p>
                        <span class="font-semibold">Tổng tiền:</span>
                        <span class="text-orange-600 font-bold">{{ formatCurrencyVND(props.order.subtotalPrice)
                        }}</span>
                    </p>
                </div>
            </section>

            <ElDivider />

            <section>
                <h3 class="font-semibold text-orange-600 text-lg mb-2">Khách hàng</h3>
                <div class="space-y-1 text-sm">
                    <p><span class="font-semibold">Tên:</span> {{ props.order.user.name }}</p>
                    <p><span class="font-semibold">SĐT:</span> {{ props.order.user.phone }}</p>
                    <p><span class="font-semibold">Email:</span> {{ props.order.user.email }}</p>
                </div>
            </section>

            <ElDivider />

            <section>
                <h3 class="font-semibold text-orange-600 text-lg mb-2">Địa chỉ giao hàng</h3>
                <div class="space-y-1 text-sm">
                    <p><span class="font-semibold">Tỉnh/TP:</span> {{ props.order.address.province }}</p>
                    <p><span class="font-semibold">Quận/Huyện:</span> {{ props.order.address.district }}</p>
                    <p><span class="font-semibold">Chi tiết:</span> {{ getDetailAddress(props.order.address) }}</p>
                </div>
            </section>

            <ElDivider />

            <section>
                <h3 class="font-semibold text-orange-600 text-lg mb-2">Trạng thái đơn hàng</h3>
                <div class="flex flex-col gap-2">
                    <div>
                        <OrderTimeline :order="props.order" />
                    </div>

                    <div class="flex mt-2">
                        <PrimaryButton v-if="props.order.orderStatus === ORDER_STATUS.PENDING" label="Xác nhận ngay"
                            :onClick="() => emit('confirm-order', props.order.id)" />
                        <PrimaryButton v-else-if="props.order.orderStatus === ORDER_STATUS.CONFIRMED"
                            label="Giao hàng ngay" :onClick="() => emit('mark-delivering', props.order.id)" />
                        <PrimaryButton v-else label="Đã giao" :onClick="() => emit('mark-delivered', props.order.id)" />
                    </div>

                    <div class="flex mt-2">
                        <DeleteButton label="Hủy đơn" :onClick="() => { console.log('Hủy đơn') }" />
                    </div>
                </div>
            </section>
        </div>
    </ElDialog>
</template>

<style scoped>
.order-detail-modal :deep(.el-dialog__body) {
    background-color: #fffdf8;
    border-radius: 1rem;
    padding: 1.5rem;
}

.order-detail-modal :deep(.el-dialog__header) {
    background: linear-gradient(to right, #fb923c, #fbbf24);
    color: white;
    border-radius: 1rem 1rem 0 0;
    padding: 1rem 1.25rem;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}
</style>
