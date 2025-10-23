<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { CartResponse } from "../../../types/cart.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import type { Promotion } from "../../../types/promotion.types";
import AddressSelection from "../../../components/addresses/AddressSelection.vue";
import type { Address, AddressResponse } from "../../../types/geocode.types";
import { useApiHandler } from "../../../composables/useApiHandler";
import { getAddresses } from "../../../service/address.service";
import { ADDRESS_MESSAGE } from "../../../constants/messages";
import { ElOption, ElSelect } from "element-plus";

const props = defineProps<{ cartDetail: CartResponse; promotions: Promotion[] }>();
const emit = defineEmits(["change-promotion"]);

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
  const code: string = selectedPromotionCode.value ?? "";
  emit("change-promotion", code);
}

const selectedAddressId = ref<number | null>(null);

function onAddressIdChange(id: number) {
  selectedAddressId.value = id;
  console.log("Địa chỉ được chọn nè: ", id);
}

function placeOrder() {
  console.log("Đặt hàng");
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
      <AddressSelection :addresses="addresses" @change-address="onAddressIdChange" />
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

      <p v-if="cartDetail.applyPromotionResult && cartDetail.applyPromotionResult.promotion"
        class="flex justify-between text-green-600">
        <span>Khuyến mãi:</span>
        <span>
          -{{ formatCurrencyVND((Number(cartDetail.subtotalPrice) - Number(cartDetail.totalPrice)).toString()) }}
        </span>
      </p>

      <p class="flex justify-between text-xl font-bold border-t pt-2">
        <span>Tổng thanh toán:</span>
        <span>{{ formatCurrencyVND(cartDetail.totalPrice) }}</span>
      </p>
    </div>

    <PrimaryButton label="Đặt hàng" :onClick="placeOrder" />
  </div>
</template>
