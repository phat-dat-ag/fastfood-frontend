<script setup lang="ts">
import NumberInput from "../../../components/inputs/NumberInput.vue";
import type { Cart } from "../../../types/cart.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import DeleteButton from "../../../components/buttons/DeleteButton.vue";

const props = defineProps<{ cart: Cart }>();
const emit = defineEmits(["delete-product-from-cart"]);

function onQuantityChange(value: number) {
    console.log("Cập nhật số lượng: ", value);
}
</script>
<template>
    <div class="grid grid-cols-[5fr_2fr_2fr_1fr] gap-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <div class="flex items-center gap-4">
            <img :src="props.cart.product.imageUrl" alt="product image" class="w-16 h-16 object-cover rounded-lg" />
            <div>
                <p class="font-semibold text-gray-800">{{ props.cart.product.name }}</p>
                <p class="text-sm text-gray-500">{{ props.cart.product.categoryName }}</p>
                <p class="text-base font-medium text-emerald-600">
                    {{ formatCurrencyVND(props.cart.product.price) }}
                </p>
            </div>
        </div>

        <div class="flex items-center">
            <NumberInput :initialValue="props.cart.quantity" :min="0" :max="100" :step="1"
                @quantity-change="onQuantityChange" />
        </div>

        <div class="flex flex-col justify-center text-center">
            <p class="line-through">
                {{ formatCurrencyVND((Number(props.cart.product.price) * props.cart.quantity).toString()) }}
            </p>
            <p class="text-gray-700 font-semibold">
                {{ formatCurrencyVND((Number(props.cart.product.price) * props.cart.quantity).toString()) }}
            </p>
        </div>

        <div class="flex items-center">
            <DeleteButton :onClick="() => emit('delete-product-from-cart', props.cart.product.id)" label="Xóa" />
        </div>
    </div>
</template>
