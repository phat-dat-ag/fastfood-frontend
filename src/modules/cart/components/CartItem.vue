<script setup lang="ts">
import NumberInput from "../../../components/inputs/NumberInput.vue";
import type { Cart } from "../../../types/cart.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import DeleteButton from "../../../components/buttons/DeleteButton.vue";

const props = defineProps<{ cart: Cart }>();
const emit = defineEmits(["delete-product-from-cart", "quantity-change-from-cart"]);

function onQuantityChange(newQuantity: number) {
    emit("quantity-change-from-cart", { newQuantity, productId: props.cart.product.id })
}
</script>
<template>
    <div class="grid grid-cols-[5fr_2fr_2fr_1fr] gap-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <div class="flex items-center gap-4">
            <img :src="props.cart.product.imageUrl" alt="product image" class="w-16 h-16 object-cover rounded-lg" />
            <div>
                <p class="font-semibold text-gray-800">{{ props.cart.product.name }}</p>
                <p class="text-sm text-gray-500">{{ props.cart.product.categoryName }}</p>

                <div class="flex items-baseline gap-2 mt-1">
                    <template v-if="props.cart.product.price !== props.cart.product.discountedPrice">
                        <span class="text-red-600 font-bold text-base">
                            {{ formatCurrencyVND(props.cart.product.discountedPrice) }}
                        </span>
                        <span class="line-through text-gray-400 text-sm">
                            {{ formatCurrencyVND(props.cart.product.price) }}
                        </span>
                    </template>
                    <template v-else>
                        <span class="text-emerald-600 font-semibold text-base">
                            {{ formatCurrencyVND(props.cart.product.price) }}
                        </span>
                    </template>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-center">
            <NumberInput :value="props.cart.quantity" :min="0" :max="100" :step="1"
                @quantity-change="onQuantityChange" />
        </div>

        <div class="flex flex-col justify-center text-center">
            <template v-if="props.cart.product.price !== props.cart.product.discountedPrice">
                <p class="line-through text-gray-400 text-sm">
                    {{ formatCurrencyVND((Number(props.cart.product.price) * Number(props.cart.quantity)).toString()) }}
                </p>
                <p class="text-red-600 font-bold text-base">
                    {{ formatCurrencyVND((Number(props.cart.product.discountedPrice) *
                        Number(props.cart.quantity)).toString()) }}
                </p>
            </template>
            <template v-else>
                <p class="text-emerald-600 font-semibold text-base">
                    {{ formatCurrencyVND((Number(props.cart.product.price) * Number(props.cart.quantity)).toString()) }}
                </p>
            </template>
        </div>

        <div class="flex items-center justify-center">
            <DeleteButton :onClick="() => emit('delete-product-from-cart', props.cart.product.id)" label="Xóa" />
        </div>
    </div>
</template>
