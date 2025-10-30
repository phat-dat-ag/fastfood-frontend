<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { ref } from 'vue';
import type { Order } from '../../../../types/order.types';
import { formatCurrencyVND } from '../../../../utils/currency.utils';
import { PAYMENT_METHOD_TEXT } from '../../../../utils/order-display.utils';
import { getDetailAddress } from '../../../../utils/geocode.utils';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';
import OrderTimeline from '../OrderTimeline.vue';
import { PAYMENT_STATUS } from '../../../../constants/payment-status';
import { PAYMENT_METHODS } from '../../../../constants/payment-methods';

const props = defineProps<{ order: Order }>();
const emit = defineEmits(["close", "cancel-order"]);

const isVisible = ref(true);

</script>

<template>
    <ElDialog v-model="isVisible" width="950px" @close="emit('close')" class="order-detail-modal">
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
                        <p><span class="label">Khách hàng:</span> {{ props.order.user.name }} <span
                                class="label">SĐT:</span> {{ props.order.user.phone }}</p>
                        <p><span class="label">Địa chỉ:</span> {{ getDetailAddress(props.order.address) }}</p>
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

                <DeleteButton
                    v-if="!props.order.deliveringAt && !(props.order.paymentStatus === PAYMENT_STATUS.PAID && props.order.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER)"
                    label="Hủy đơn hàng" :onClick="() => emit('cancel-order', props.order)" />
            </div>
        </div>
    </ElDialog>
</template>

<style lang="postcss" scoped src="../../../../styles/order-modal.css"></style>
