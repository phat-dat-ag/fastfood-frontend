<script setup lang="ts">
import { ref, computed } from "vue";
import type { Order } from "../../../types/order.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";

const props = defineProps<{ order: Order }>();

const LIMIT = 3;
const expanded = ref(false);

const visibleItems = computed(() => {
    if (expanded.value) return props.order.orderDetails;
    return props.order.orderDetails.slice(0, LIMIT);
});

const remainingCount = computed(() =>
    props.order.orderDetails.length - LIMIT
);
</script>
<template>
    <div v-if="props.order.orderDetails.length > 0" class="space-y-3">
        <h3 class="section-title">Thông tin đơn hàng</h3>

        <div class="max-h-[unset] md:max-h-72 overflow-y-auto pr-1 space-y-3 custom-scrollbar"
            v-for="orderDetail in visibleItems" :key="orderDetail.product.id">
            <div
                class="flex items-center justify-between p-3 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                <div class="flex-1">
                    <p class="font-medium text-gray-800 text-base mb-1">
                        {{ orderDetail.product.name }}
                    </p>

                    <div class="text-sm text-gray-600 space-x-2">
                        <template v-if="Number(orderDetail.discountedPrice) < Number(orderDetail.product.price)">
                            <span class="line-through text-gray-400">
                                {{ formatCurrencyVND(orderDetail.product.price.toString()) }}
                            </span>
                            <span class="text-red-500 font-semibold">
                                {{ formatCurrencyVND(orderDetail.discountedPrice.toString()) }}
                            </span>
                        </template>

                        <template v-else>
                            <span class="text-gray-700 font-semibold">
                                {{ formatCurrencyVND(orderDetail.product.price.toString()) }}
                            </span>
                        </template>

                        <span>× {{ orderDetail.quantity }}</span>
                    </div>
                </div>

                <div class="text-right">
                    <p class="text-orange-600 font-semibold text-base">
                        {{
                            formatCurrencyVND(
                                (Number(orderDetail.discountedPrice) *
                                    Number(orderDetail.quantity)).toString()
                            )
                        }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if="remainingCount > 0" class="text-center mt-2">
            <button class="text-orange-600 font-medium hover:underline" @click="expanded = !expanded">
                <template v-if="!expanded">
                    Xem thêm {{ remainingCount }} sản phẩm
                </template>
                <template v-else>Thu gọn</template>
            </button>
        </div>

        <div class="space-y-3 border-t mt-4 pt-3 text-sm">
            <div class="flex justify-between text-gray-700">
                <span>Giá gốc:</span>
                <span class="font-semibold">{{ formatCurrencyVND(props.order.originalPrice) }}</span>
            </div>

            <div v-if="props.order.originalPrice !== props.order.subtotalPrice"
                class="flex justify-between text-gray-500">
                <span>Giảm giá sản phẩm:</span>
                <span class="text-red-500">
                    -{{ formatCurrencyVND((Number(props.order.originalPrice) -
                        Number(props.order.subtotalPrice)).toString()) }}
                </span>
            </div>

            <div class="flex justify-between text-gray-700">
                <span>Phí giao hàng:</span>
                <span class="font-medium">{{ formatCurrencyVND(props.order.deliveryFee) }}</span>
            </div>

            <div v-if="props.order.promotion" class="flex justify-between text-green-600">
                <span>Khuyến mãi:</span>
                <span class="font-medium">
                    -{{ formatCurrencyVND((Number(props.order.subtotalPrice) - (Number(props.order.totalPrice) -
                        Number(props.order.deliveryFee))).toString()) }}
                </span>
            </div>

            <div class="flex justify-between text-lg font-bold border-t border-dashed pt-3 mt-2 text-gray-800">
                <span>Tổng thanh toán:</span>
                <span class="text-orange-600">{{ formatCurrencyVND(props.order.totalPrice) }}</span>
            </div>
        </div>
    </div>

    <div v-else>Không có sản phẩm nào trong đơn hàng</div>
</template>
<style lang="postcss" scoped src="../../../styles/order-modal.css"></style>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>