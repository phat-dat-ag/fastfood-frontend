<script setup lang="ts">
import type { Order } from '../../../types/order.types';
import { getDetailAddress } from '../../../utils/geocode.utils';
import { PAYMENT_METHOD_TEXT, PAYMENT_STATUS_TEXT } from '../../../utils/order-display.utils';

const props = defineProps<{ order: Order }>()
</script>
<template>
    <div class="space-y-6">
        <div class="section-content">
            <h3 class="section-title">Thông tin khách hàng</h3>
            <p><span class="label">Khách hàng:</span> {{ props.order.user.name }}</p>
            <p><span class="label">SĐT:</span> {{ props.order.user.phone }}</p>
            <p><span class="label">Email:</span> {{ props.order.user.email }}</p>
            <p><span class="label">Chi tiết:</span> {{ getDetailAddress(props.order.address) }}</p>
            <p><span class="label">Phương thức thanh toán: </span>
                {{ PAYMENT_METHOD_TEXT[props.order.paymentMethod] }}
            </p>
            <p><span class="label">Trạng thái thanh toán: </span>
                {{ PAYMENT_STATUS_TEXT[props.order.paymentStatus] }}
            </p>
        </div>
    </div>
</template>
<style lang="postcss" scoped src="../../../styles/order-modal.css"></style>