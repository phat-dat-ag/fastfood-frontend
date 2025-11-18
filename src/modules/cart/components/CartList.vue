<script setup lang="ts">
import type { Cart } from "../../../types/cart.types";
import CartItem from "./CartItem.vue";

const props = defineProps<{ carts: Cart[] }>();
const emit = defineEmits(["delete-product", "quantity-change"]);

function handleQuantityChange({ newQuantity, productId }: { newQuantity: number, productId: number }) {
  emit("quantity-change", { newQuantity, productId });
}
function handleDeleteProduct(productId: number) {
  emit("delete-product", productId);
}
</script>
<template>
  <div class="p-4 sm:p-6 bg-gray-50 rounded-2xl shadow-sm">
    <h2 class="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h2>
    <div class="space-y-4">
      <CartItem v-for="cart in props.carts" :key="cart.product.id" :cart="cart"
        @quantity-change-from-cart="handleQuantityChange" @delete-product-from-cart="handleDeleteProduct" />
    </div>
  </div>
</template>
<style scoped>
@media (max-width: 640px) {
  .p-4 {
    padding: 1rem;
  }
}
</style>
