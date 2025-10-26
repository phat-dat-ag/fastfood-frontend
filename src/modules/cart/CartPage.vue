<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { CartResponse, PromotionCodeCheckResult } from '../../types/cart.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteProductFromCart, getCartDetail, updateCart } from '../../service/cart.service';
import { ADDRESS_MESSAGE, CART_MESSAGE, PROMOTION_ORDER_MESSAGE, STRIPE_PAYMENT_MESSAGE } from '../../constants/messages';
import CartList from './components/CartList.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import CheckoutSummary from './components/CheckoutSummary.vue';
import { getValidPromotionOrder } from '../../service/promotion.service';
import type { Promotion, PromotionResponse } from '../../types/promotion.types';
import { notifyError, notifySuccess } from '../../utils/notification.utils';
import type { Address, AddressResponse } from '../../types/geocode.types';
import { getAddresses } from '../../service/address.service';
import type { DeliveryRequest } from '../../types/delivery.types';
import { PAYMENT_METHODS } from '../../constants/payment-methods';
import { createPaymentIntentApi } from '../../service/payment.service';
import type { PaymentResponse } from '../../types/payment.types';
import CheckoutModal from './components/CheckoutModal.vue';

const selectedPromotionCode = ref<string>("");

const cartDetail = ref<CartResponse | null>(null);

const deliveryRequest = ref<DeliveryRequest | null>(null);

const selectedPaymentMethod = ref<string>("");

function handleCartResponse(data: CartResponse) {
    cartDetail.value = data;
    if (cartDetail.value.applyPromotionResult) {
        const result: PromotionCodeCheckResult = cartDetail.value.applyPromotionResult;
        if (result.success)
            notifySuccess(result.message);
        else
            notifyError(result.message);
    }
    const deliveryMessage: string = cartDetail.value.deliveryInformation.message;
    if (cartDetail.value.deliveryInformation.success) {
        notifySuccess(deliveryMessage);
    } else {
        if (deliveryRequest.value)
            notifyError(deliveryMessage);
    }
}

async function loadCarts() {
    await useApiHandler<CartResponse>(
        () => getCartDetail(selectedPromotionCode.value, deliveryRequest.value),
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

const addresses = ref<Address[]>([]);

async function loadAddresses() {
    await useApiHandler<AddressResponse>(
        getAddresses,
        {
            loading: ADDRESS_MESSAGE.get,
            error: ADDRESS_MESSAGE.getError,
        },
        (data: AddressResponse) => addresses.value = data.addresses,
    )
}

onMounted(loadAddresses);

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

async function onAddressChange(address: Address) {
    const dataRequest: DeliveryRequest = {
        customerLatitude: address.latitude,
        customerLongitude: address.longitude,
    };
    deliveryRequest.value = dataRequest;
    await loadCarts();
}

function onPaymentMethodChange(paymentMethod: string) {
    if (paymentMethod === PAYMENT_METHODS.BANK_TRANSFER || paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY)
        selectedPaymentMethod.value = paymentMethod;
    else {
        selectedPaymentMethod.value = "";
        notifyError("Lỗi chọn phương thức thanh toán. Hãy thử lại")
    }
}

const isCheckoutModalVisible = ref(false);
const clientSecret = ref<string | null>(null);

async function createPaymentIntent() {
    await useApiHandler<PaymentResponse>(
        () => createPaymentIntentApi(selectedPromotionCode.value, deliveryRequest.value),
        {
            loading: STRIPE_PAYMENT_MESSAGE.create,
            error: STRIPE_PAYMENT_MESSAGE.createError,
        },
        (data: PaymentResponse) => clientSecret.value = data.clientSecret,
    )
}

async function placeOrder() {
    if (!deliveryRequest.value) {
        notifyError("Vui lòng chọn địa chỉ giao hàng!");
        return;
    }
    if (!selectedPaymentMethod.value) {
        notifyError("Vui lòng chọn hình thức thanh toán!");
        return;
    }
    if (selectedPaymentMethod.value !== PAYMENT_METHODS.BANK_TRANSFER) return;

    await createPaymentIntent();
    isCheckoutModalVisible.value = true;
}

</script>
<template>
    <div v-if="cartDetail && cartDetail.carts.length > 0" class="grid grid-cols-[6fr_4fr] gap-4">
        <CartList :carts="cartDetail.carts" @delete-product="handleDeleteProduct"
            @quantity-change="handleQuantityChange" />
        <CheckoutSummary :cartDetail="cartDetail" :promotions="promotions" :addresses="addresses"
            @change-promotion="onPromotionCodeChange" @change-address="onAddressChange"
            @change-payment-method="onPaymentMethodChange" @place-order="placeOrder" />
    </div>
    <div v-else>
        Giỏ hàng trống, hãy mua sắm thôi nào
    </div>

    <CheckoutModal v-if="isCheckoutModalVisible" :clientSecret="clientSecret" @close="isCheckoutModalVisible = false" />
</template>