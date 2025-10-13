<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Cart, CartResponse } from '../../types/cart.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteProductFromCart, getCartDetail } from '../../service/cart.service';
import { CART_MESSAGE } from '../../constants/messages';
import CartList from './components/CartList.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

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

async function handleDeleteProduct(productId: number) {
    const confirmed: boolean = await openConfirmDeleteMessage("Xác nhận xóa sản phẩm này khỏi giỏ hàng?");
    if (!confirmed) return;
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
}
</script>
<template>
    <div>
        <CartList :carts="carts" @delete-product="handleDeleteProduct" />
    </div>
</template>