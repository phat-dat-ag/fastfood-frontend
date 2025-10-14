<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Cart, CartResponse } from '../../types/cart.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteProductFromCart, getCartDetail, updateCart } from '../../service/cart.service';
import { CART_MESSAGE } from '../../constants/messages';
import CartList from './components/CartList.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import CheckoutSummary from './components/CheckoutSummary.vue';

const carts = ref<Cart[]>([]);
async function loadCarts() {
    await useApiHandler<CartResponse>(
        getCartDetail,
        {
            loading: CART_MESSAGE.get,
            error: CART_MESSAGE.getError,
        },
        (data: CartResponse) => carts.value = data.carts,
    )
}
onMounted(loadCarts);

async function handleQuantityChange({ newQuantity, productId }: { newQuantity: number, productId: number }) {
    if (newQuantity == 0) {
        const isDeleted: boolean = await handleDeleteProduct(productId);
        if (!isDeleted)
            await loadCarts();
        return;
    }
    await useApiHandler(
        () => updateCart({ productId, quantity: newQuantity }),
        {
            loading: CART_MESSAGE.update,
            success: CART_MESSAGE.updateSuccess,
            error: CART_MESSAGE.updateError,
        },
        () => { },
        loadCarts,
    )
}

async function handleDeleteProduct(productId: number): Promise<boolean> {
    const confirmed: boolean = await openConfirmDeleteMessage("Xác nhận xóa sản phẩm này khỏi giỏ hàng?");
    if (!confirmed) return false;
    await useApiHandler(
        () => deleteProductFromCart(productId),
        {
            loading: CART_MESSAGE.delete,
            success: CART_MESSAGE.deleteSuccess,
            error: CART_MESSAGE.deleteError,
        },
        () => { },
        loadCarts,
    )
    return true;
}
</script>
<template>
    <div class="grid grid-cols-[6fr_4fr] gap-4">
        <CartList :carts="carts" @delete-product="handleDeleteProduct" @quantity-change="handleQuantityChange" />
        <CheckoutSummary :carts="carts"/>
    </div>
</template>