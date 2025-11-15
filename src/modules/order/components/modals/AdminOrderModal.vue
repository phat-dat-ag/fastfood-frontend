<script setup lang="ts">
import { ElDialog, ElTag } from 'element-plus';
import type { Order } from '../../../../types/order.types';
import { getDetailAddress } from '../../../../utils/geocode.utils';
import OrderInvoiceSummary from '../OrderInvoiceSummary.vue';
import { ref } from 'vue';
import { formatDateTimeString } from '../../../../utils/time.utils';
import { getOrderTagType, ORDER_STATUS_TEXT } from '../../../../utils/order-display.utils';

const props = defineProps<{
    order: Order;
}>();
const emit = defineEmits(["close"]);

const isVisible = ref<boolean>(true);
</script>
<template>
    <ElDialog v-model="isVisible" class="min-w-[900px] rounded-2xl" @close="emit('close')">
        <div v-if="props.order" class="grid grid-cols-2 gap-4 p-4">
            <section>
                <h3 class="section-title">Thông tin khách hàng</h3>
                <div class="section-content">
                    <p><span class="label">Khách hàng:</span> {{ props.order.user.name }}</p>
                    <p><span class="label">SĐT:</span> {{ props.order.user.phone }}</p>
                    <p><span class="label">Địa chỉ:</span> {{ getDetailAddress(props.order.address) }}</p>
                    <p><span class="label">Trạng thái: </span>
                        <ElTag :type="getOrderTagType(props.order.orderStatus)" effect="light" size="small">
                            {{ ORDER_STATUS_TEXT[props.order.orderStatus] || props.order.orderStatus }}
                        </ElTag>
                    </p>
                    <p><span class="label">Ngày đặt:</span> {{ formatDateTimeString(props.order.placedAt) }}</p>
                    <p v-if="props.order.deliveredAt"><span class="label">Ngày nhận:</span>
                        {{ formatDateTimeString(props.order.deliveredAt) }}
                    </p>
                    <p v-else-if="props.order.cancelledAt"><span class="label">Ngày hủy:</span>
                        {{ formatDateTimeString(props.order.cancelledAt) }}
                    </p>
                </div>
            </section>
            <OrderInvoiceSummary :order="props.order" />
        </div>
    </ElDialog>
</template>
<style lang="postcss" scoped src="../../../../styles/order-modal.css"></style>