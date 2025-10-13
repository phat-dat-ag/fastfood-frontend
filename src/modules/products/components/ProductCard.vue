<script setup lang="ts">
import { ElCard } from "element-plus";
import type { Product } from "../../../types/product.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";

interface ProductCardProps {
    product: Product;
}
const props = defineProps<ProductCardProps>();
const emit = defineEmits(["add-to-cart"]);
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
            <PrimaryButton label="Thêm vào giỏ hàng" :onClick="() => emit('add-to-cart', product)" />
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
