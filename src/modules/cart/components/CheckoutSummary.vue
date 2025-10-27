<script setup lang="ts">
import { ref } from "vue";
import type { CartResponse } from "../../../types/cart.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import type { Promotion } from "../../../types/promotion.types";
import AddressSelection from "../../../components/addresses/AddressSelection.vue";
import type { Address } from "../../../types/geocode.types";
import { ElInput, ElOption, ElSelect } from "element-plus";
import { PAYMENT_METHODS } from "../../../constants/payment-methods";

const props = defineProps<{ cartDetail: CartResponse; promotions: Promotion[]; addresses: Address[] }>();
const emit = defineEmits(["change-promotion", "change-address", "change-payment-method", "place-order"]);

const selectedPromotionCode = ref<string>("");

async function onPromotionCodeChange() {
  const code: string = selectedPromotionCode.value ?? "";
  emit("change-promotion", code);
}

function onAddressChange(addressId: number) {
  emit("change-address", addressId);
}

const selectedPaymentMethod = ref<string>("");

function onPaymentMethodChange() {
  if (selectedPaymentMethod.value)
    emit("change-payment-method", selectedPaymentMethod.value);
}

const userNote = ref<string>("");

function placeOrder() {
  emit("place-order", userNote.value);
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
    <h2 class="text-2xl font-semibold">Tóm tắt đơn hàng</h2>

    <div v-if="props.promotions.length > 0" class="space-y-2">
      <ElSelect v-model="selectedPromotionCode" placeholder="Áp dụng mã khuyến mãi ngay!" clearable filterable
        class="w-full" @change="onPromotionCodeChange">
        <ElOption v-for="promotion in props.promotions" :key="promotion.id" :value="promotion.code">
          {{ promotion.code }}: Giảm {{ promotion.type === "FIXED_AMOUNT" ?
            formatCurrencyVND(promotion.value.toString()) :
            `${promotion.value}%` }} cho đơn từ {{ formatCurrencyVND(promotion.minSpendAmount.toString()) }}
        </ElOption>
      </ElSelect>
    </div>
    <div v-else>
      Quý khách thông cảm, hiện tại không có chương trình khuyến mãi nào phù hợp
    </div>

    <div>
      <AddressSelection :addresses="props.addresses" @change-address="onAddressChange" />
    </div>

    <div class="space-y-2">
      <p class="flex justify-between">
        <span>Tạm tính:</span>
        <span class="font-semibold">{{ formatCurrencyVND(cartDetail.originalPrice) }}</span>
      </p>

      <p v-if="cartDetail.originalPrice !== cartDetail.subtotalPrice" class="flex justify-between text-gray-600">
        <span>Giảm giá sản phẩm:</span>
        <span>
          -{{ formatCurrencyVND((Number(cartDetail.originalPrice) - Number(cartDetail.subtotalPrice)).toString()) }}
        </span>
      </p>

      <p v-if="cartDetail.originalPrice !== cartDetail.subtotalPrice" class="flex justify-between text-lg font-bold">
        <span>Tổng cộng:</span>
        <span>{{ formatCurrencyVND(cartDetail.subtotalPrice) }}</span>
      </p>

      <p v-if="cartDetail.deliveryInformation.success" class="flex justify-between text-lg font-bold">
        <span>Phí giao hàng</span>
        <span>{{ formatCurrencyVND(cartDetail.deliveryFee) }}</span>
      </p>

      <p v-if="cartDetail.applyPromotionResult && cartDetail.applyPromotionResult.promotion"
        class="flex justify-between text-green-600">
        <span>Khuyến mãi:</span>
        <span>
          -{{ formatCurrencyVND((Number(cartDetail.subtotalPrice) - (Number(cartDetail.totalPrice) -
            Number(cartDetail.deliveryFee))).toString()) }}
        </span>
      </p>

      <p class="flex justify-between text-xl font-bold border-t pt-2">
        <span>Tổng thanh toán:</span>
        <span>{{ formatCurrencyVND(cartDetail.totalPrice) }}</span>
      </p>
    </div>

    <ElSelect v-model="selectedPaymentMethod" placeholder="Hình thức thanh toán" filterable class="w-full"
      @change="onPaymentMethodChange">
      <ElOption :value="PAYMENT_METHODS.BANK_TRANSFER" label="Thanh toán trực tuyến" />
      <ElOption :value="PAYMENT_METHODS.CASH_ON_DELIVERY" label="Thanh toán khi nhận hàng" />
    </ElSelect>

    <ElInput v-model="userNote" type="textarea" :rows="2" maxlength="100" show-word-limit
      placeholder="Ghi chú, ví dụ: Giao sau 18h, Lấy dụng cụ ăn uống,..." />

    <PrimaryButton label="Đặt hàng" :onClick="placeOrder" />
  </div>
</template>
