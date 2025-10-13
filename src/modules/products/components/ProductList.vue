<script setup lang="ts">
import type { Product } from "../../../types/product.types";
import ProductCard from "./ProductCard.vue";

interface Props {
    products: Product[];
}
const props = defineProps<Props>();
const emit = defineEmits(["add-to-cart"]);

function handleAdd(product: Product) {
    emit("add-to-cart", product);
}
</script>
<template>
    <div class="grid grid-cols-4 gap-4">
        <div v-for="product in props.products" :key="product.id">
            <ProductCard :product="product" @add-to-cart="handleAdd" />
        </div>
    </div>
</template>
