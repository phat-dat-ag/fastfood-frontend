<script setup lang="ts">
import { ElCard } from "element-plus";
import type { Product } from "../../../types/product.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import NumberInput from "../../../components/inputs/NumberInput.vue";
import { ref } from "vue";

interface ProductCardProps {
    product: Product;
}
const props = defineProps<ProductCardProps>();
const emit = defineEmits(["add-to-cart"]);

const quantity = ref<number>(0);

function onQuantityChange(newQuantity: number) {
    quantity.value = newQuantity;
}

function onClickAddButton() {
    emit('add-to-cart', { product: props.product, quantity: quantity.value })
}

</script>
<template>
    <ElCard shadow="hover" class="w-full h-full flex flex-col justify-between transition-transform hover:scale-[1.02]">
        <img :src="props.product.imageUrl" alt="product" class="w-full h-40 object-cover rounded-lg" />
        <div class="mt-3">
            <h3 class="text-base font-semibold line-clamp-1">
                {{ props.product.name }}
            </h3>
            <div class="flex justify-between items-center mt-3">
                <span class="text-blue-600 font-semibold text-base">
                    {{ formatCurrencyVND(props.product.price) }}
                </span>
            </div>
            <NumberInput :min="0" :max="100" :step="1" @quantity-change="onQuantityChange" />
            <PrimaryButton label="Thêm vào giỏ hàng" :onClick="onClickAddButton" />
        </div>
    </ElCard>
</template>
<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
