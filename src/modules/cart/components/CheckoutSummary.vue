<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Cart } from "../../../types/cart.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import type { Promotion } from "../../../types/promotion.types";
import AddressSelection from "../../../components/addresses/AddressSelection.vue";
import type { Address, AddressResponse } from "../../../types/geocode.types";
import { useApiHandler } from "../../../composables/useApiHandler";
import { getAddresses } from "../../../service/address.service";
import { ADDRESS_MESSAGE } from "../../../constants/messages";

const props = defineProps<{ carts: Cart[]; promotions: Promotion[] }>();

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

const selectedPromotionCode = ref<string>("");

async function onPromotionCodeChange() {
  console.log("Mã được chọn: ", selectedPromotionCode.value);
}

const selectedAddressId = ref<number | null>(null);

function onAddressIdChange(id: number) {
  selectedAddressId.value = id;
  console.log("Địa chỉ được chọn nè: ", id);
}

const subtotal = computed(() =>
  props.carts.reduce((sum, cart) => sum + Number(cart.product.discountedPrice) * cart.quantity, 0)
);

function placeOrder() {
  console.log("Đặt hàng");
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
    <h2 class="text-2xl font-semibold">Tóm tắt đơn hàng</h2>

    <div v-if="props.promotions.length > 0" class="space-y-2">
      <select v-model="selectedPromotionCode" class="w-full border rounded-lg p-2 mt-2" @change="onPromotionCodeChange">
        <option value="" disabled selected>Chọn mã có sẵn</option>
        <option v-for="promotion in props.promotions" :key="promotion.id" :value="promotion.code">
          {{ promotion.code }}: Giảm {{ promotion.type === "FIXED_AMOUNT" ?
            formatCurrencyVND(promotion.value.toString()) :
            `${promotion.value}%` }} cho đơn từ {{ formatCurrencyVND(promotion.minSpendAmount.toString()) }}
        </option>
      </select>
    </div>
    <div v-else>
      Quý khách thông cảm, hiện tại không có chương trình khuyến mãi nào phù hợp
    </div>

    <div>
      <AddressSelection :addresses="addresses" @change-address="onAddressIdChange" />
    </div>

    <div class="space-y-1">
      <p>Tạm tính: <span class="font-semibold">{{ formatCurrencyVND(subtotal.toString()) }}</span></p>
      <p class="text-xl font-bold">Tổng cộng: <span>{{ formatCurrencyVND(subtotal.toString()) }}</span></p>
    </div>

    <PrimaryButton label="Đặt hàng" :onClick="placeOrder" />
  </div>
</template>
