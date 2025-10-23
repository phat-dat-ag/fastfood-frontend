<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { CartResponse, PromotionCodeCheckResult } from '../../types/cart.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteProductFromCart, getCartDetail, updateCart } from '../../service/cart.service';
import { CART_MESSAGE, PROMOTION_ORDER_MESSAGE } from '../../constants/messages';
import CartList from './components/CartList.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import CheckoutSummary from './components/CheckoutSummary.vue';
import { getValidPromotionOrder } from '../../service/promotion.service';
import type { Promotion, PromotionResponse } from '../../types/promotion.types';
import { notifyError, notifySuccess } from '../../utils/notification.utils';

const selectedPromotionCode = ref<string>("");

const cartDetail = ref<CartResponse | null>(null);

function handleCartResponse(data: CartResponse) {
    cartDetail.value = data;
    if (cartDetail.value.applyPromotionResult) {
        const result: PromotionCodeCheckResult = cartDetail.value.applyPromotionResult;
        if (result.success)
            notifySuccess(result.message);
        else
            notifyError(result.message);
    }
}

async function loadCarts() {
    await useApiHandler<CartResponse>(
        () => getCartDetail(selectedPromotionCode.value),
        {
            loading: CART_MESSAGE.get,
            error: CART_MESSAGE.getError,
        },
        (data: CartResponse) => handleCartResponse(data),
    )
}
onMounted(loadCarts);

const promotions = ref<Promotion[]>([]);
async function loadPromotions() {
    await useApiHandler<PromotionResponse>(
        getValidPromotionOrder,
        {
            loading: PROMOTION_ORDER_MESSAGE.get,
            error: PROMOTION_ORDER_MESSAGE.getError,
        },
        (data: PromotionResponse) => promotions.value = data.promotions,
    )
}
onMounted(loadPromotions);

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

async function onPromotionCodeChange(promotionCode: string) {
    const code: string = promotionCode ?? "";
    selectedPromotionCode.value = code;
    await loadCarts();
}

</script>
<template>
    <div v-if="cartDetail && cartDetail.carts.length > 0" class="grid grid-cols-[6fr_4fr] gap-4">
        <CartList :carts="cartDetail.carts" @delete-product="handleDeleteProduct"
            @quantity-change="handleQuantityChange" />
        <CheckoutSummary :cartDetail="cartDetail" :promotions="promotions" @change-promotion="onPromotionCodeChange" />
    </div>
    <div v-else>
        Giỏ hàng trống, hãy mua sắm thôi nào
    </div>
</template>