<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { ref } from 'vue';
import type { Order } from '../../../../types/order.types';
import { getDetailAddress } from '../../../../utils/geocode.utils';
import OrderTimeline from '../OrderTimeline.vue';
import OrderInvoiceSummary from '../OrderInvoiceSummary.vue';
import PrimaryButton from '../../../../components/buttons/PrimaryButton.vue';
import { ORDER_STATUS } from '../../../../constants/order-status';

const props = defineProps<{ order: Order }>();
const emit = defineEmits(["close", "review-order"]);

const isVisible = ref(true);

</script>

<template>
    <ElDialog v-model="isVisible" width="950px" @close="emit('close')" class="order-detail-modal">
        <div class="grid grid-cols-2 gap-8 text-gray-700">
            <div class="space-y-6">
                <section>
                    <h3 class="section-title">Thông tin đơn hàng</h3>
                    <div class="section-content">
                        <p><span class="label">Khách hàng:</span> {{ props.order.user.name }}</p>
                        <p><span class="label">SĐT:</span> {{ props.order.user.phone }}</p>
                        <p><span class="label">Địa chỉ:</span> {{ getDetailAddress(props.order.address) }}</p>
                    </div>
                </section>

                <section v-if="props.order.orderDetails.length > 0">
                    <h3 class="section-title">Sản phẩm đã mua</h3>
                    <OrderInvoiceSummary :order="props.order" />
                </section>
            </div>
            <section>
                <h3 class="section-title">Hành trình đơn hàng</h3>
                <div class="p-2">
                    <OrderTimeline :order="props.order" />
                </div>
                <div v-if="props.order.orderStatus === ORDER_STATUS.DELIVERED && props.order.reviews.length == 0">
                    <PrimaryButton label="Đánh giá ngay" :onClick="() => emit('review-order', props.order.id)" />
                </div>
            </section>
        </div>
    </ElDialog>
</template>

<style lang="postcss" scoped src="../../../../styles/order-modal.css"></style>
