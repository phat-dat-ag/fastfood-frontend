<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { CartDetailResponse } from '../../types/cart.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteProductFromCart, getCartDetail, updateCart } from '../../service/cart.service';
import { ADDRESS_MESSAGE, CART_MESSAGE, CASH_ON_DELIVERY_ORDER, PROMOTION_ORDER_MESSAGE, STRIPE_PAYMENT_ORDER } from '../../constants/messages';
import CartList from './components/CartList.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import CheckoutSummary from './components/CheckoutSummary.vue';
import type { Promotion, PromotionOrderResponse } from '../../types/promotion.types';
import { notifyError, notifySuccess } from '../../utils/notification.utils';
import type { Address, AddressesResponse } from '../../types/geocode.types';
import { getAddresses } from '../../service/address.service';
import { PAYMENT_METHODS, type PaymentMethodType } from '../../constants/payment-methods';
import CheckoutModal from './components/CheckoutModal.vue';
import type { Order, OrderCreateRequest, OrderResponse } from '../../types/order.types';
import { createOrder } from '../../service/order.service';
import { useRouter } from 'vue-router';
import { CART_AMOUNT_LIMIT } from '../../constants/cart';
import { formatCurrencyVND } from '../../utils/currency.utils';
import EmptyPage from '../../components/EmptyPage.vue';
import { getValidPromotions } from '../../service/user.service';

const router = useRouter();

const selectedPromotionCode = ref<string>("");

const cartDetail = ref<CartDetailResponse | null>(null);

const addressId = ref<number | null>(null);

const selectedPaymentMethod = ref<PaymentMethodType | null>(null);

function handleCartResponse(data: CartDetailResponse) {
    cartDetail.value = data;
    if (cartDetail.value.promotion) {
        notifySuccess("Đã áp dụng khuyến mãi");
    }
    const deliveryMessage: string = cartDetail.value.deliveryInformation.message;
    if (cartDetail.value.deliveryInformation.success) {
        notifySuccess(deliveryMessage);
    } else {
        if (addressId.value)
            notifyError(deliveryMessage);
    }
}

async function loadCarts() {
    await useApiHandler<CartDetailResponse>(
        () => getCartDetail(selectedPromotionCode.value, addressId.value),
        {
            loading: CART_MESSAGE.get,
            error: CART_MESSAGE.getError,
        },
        (data: CartDetailResponse) => handleCartResponse(data),
    )
}
onMounted(loadCarts);

const promotions = ref<Promotion[]>([]);
async function loadPromotions() {
    await useApiHandler<PromotionOrderResponse>(
        getValidPromotions,
        {
            loading: PROMOTION_ORDER_MESSAGE.get,
            error: PROMOTION_ORDER_MESSAGE.getError,
        },
        (data: PromotionOrderResponse) => promotions.value = data.promotionOrders,
    )
}
onMounted(loadPromotions);

const addresses = ref<Address[]>([]);

async function loadAddresses() {
    await useApiHandler<AddressesResponse>(
        getAddresses,
        {
            loading: ADDRESS_MESSAGE.get,
            error: ADDRESS_MESSAGE.getError,
        },
        (data: AddressesResponse) => addresses.value = data.addresses,
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
        () => updateCart(productId, newQuantity),
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

async function onAddressChange(newAddressId: number) {
    addressId.value = newAddressId;
    await loadCarts();
}

function onPaymentMethodChange(paymentMethod: string) {
    if (paymentMethod === PAYMENT_METHODS.BANK_TRANSFER || paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY)
        selectedPaymentMethod.value = paymentMethod;
    else {
        selectedPaymentMethod.value = null;
        notifyError("Lỗi chọn phương thức thanh toán. Hãy thử lại")
    }
}

const isCheckoutModalVisible = ref(false);
const clientSecret = ref<string | null>(null);

async function placeOrder(userNote: string) {
    if (!addressId.value) {
        notifyError("Vui lòng chọn địa chỉ giao hàng!");
        return;
    }
    if (!selectedPaymentMethod.value) {
        notifyError("Vui lòng chọn hình thức thanh toán!");
        return;
    }
    if (!cartDetail.value) {
        notifyError("Không tìm thấy giỏ hàng để thanh toán");
        return;
    }
    if (Number(cartDetail.value.totalPrice) > CART_AMOUNT_LIMIT.MAX_TOTAL_AMOUNT) {
        notifyError(`Tổng đơn hàng không vượt quá ${formatCurrencyVND(CART_AMOUNT_LIMIT.MAX_TOTAL_AMOUNT.toString())}`);
        return;
    }
    const dataRequest: OrderCreateRequest = {
        promotionCode: selectedPromotionCode.value,
        addressId: addressId.value,
        userNote,
        paymentMethod: selectedPaymentMethod.value
    }
    if (selectedPaymentMethod.value == PAYMENT_METHODS.CASH_ON_DELIVERY) {
        if (Number(cartDetail.value.totalPrice) > CART_AMOUNT_LIMIT.MAX_CASH_ON_DELIVERY_AMOUNT) {
            notifyError(`Tổng đơn từ ${formatCurrencyVND(CART_AMOUNT_LIMIT.MAX_CASH_ON_DELIVERY_AMOUNT.toString())} phải thanh toán trước`);
            return;
        }
        await useApiHandler<Order>(
            () => createOrder(dataRequest),
            {
                loading: CASH_ON_DELIVERY_ORDER.create,
                error: CASH_ON_DELIVERY_ORDER.createError,
                success: CASH_ON_DELIVERY_ORDER.createSuccess,
            },
            () => router.back(),
        )
    } else {
        await useApiHandler<OrderResponse>(
            () => createOrder(dataRequest),
            {
                loading: STRIPE_PAYMENT_ORDER.create,
                error: STRIPE_PAYMENT_ORDER.createError,
                success: STRIPE_PAYMENT_ORDER.createSuccess,
            },
            (data: OrderResponse) => { clientSecret.value = data.order.clientSecret },
        )
        if (clientSecret.value)
            isCheckoutModalVisible.value = true;
    }
}

async function handleCloseCheckoutModal() {
    isCheckoutModalVisible.value = false;
    router.back();
}

</script>
<template>
    <div v-if="cartDetail && cartDetail.carts.length > 0" class="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-4">
        <CartList :carts="cartDetail.carts" @delete-product="handleDeleteProduct"
            @quantity-change="handleQuantityChange" class="w-full" />

        <CheckoutSummary :cartDetail="cartDetail" :promotions="promotions" :addresses="addresses"
            @change-promotion="onPromotionCodeChange" @change-address="onAddressChange"
            @change-payment-method="onPaymentMethodChange" @place-order="placeOrder"
            class="w-full lg:w-auto mt-6 lg:mt-0" />
    </div>

    <EmptyPage v-else title="Giỏ hàng trống, mua sắm thôi nào" />

    <CheckoutModal v-if="isCheckoutModalVisible" :clientSecret="clientSecret" @close="handleCloseCheckoutModal" />
</template>
<style scoped>
@media (max-width: 1024px) {
    .grid {
        grid-template-columns: 1fr !important;
    }
}

@media (max-width: 640px) {
    .grid {
        gap: 1.5rem;
    }
}
</style>