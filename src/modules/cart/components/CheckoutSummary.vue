<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Cart } from "../../../types/cart.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";

const props = defineProps<{ carts: Cart[] }>();
const emit = defineEmits<{
  (e: "place-order", payload: { addressId: number; promoCode?: string }): void;
}>();

const userAddresses = ref([
  { id: 1, label: "Nhà riêng", detail: "123 Lê Lợi, Quận 1" },
  { id: 2, label: "Cơ quan", detail: "456 Hai Bà Trưng, Quận 3" },
  { id: 3, label: "Bạn bè", detail: "789 Nguyễn Huệ, Quận 1" },
]);

const promoCodes = ref([
  { id: 1, code: "SALE10", discount: 10 },
  { id: 2, code: "FREESHIP", discount: 5 },
]);

const selectedAddressId = ref<number>(userAddresses.value[0].id);
const promoInput = ref("");
const selectedPromoId = ref<number | null>(null);

watch(selectedPromoId, (id) => {
  const promo = promoCodes.value.find(p => p.id === id);
  promoInput.value = promo ? promo.code : "";
});

const subtotal = computed(() =>
  props.carts.reduce((sum, cart) => sum + Number(cart.product.price) * cart.quantity, 0)
);

const discount = computed(() => {
  if (!promoInput.value) return 0;
  const promo = promoCodes.value.find(p => p.code === promoInput.value);
  return promo ? (subtotal.value * promo.discount) / 100 : 0;
});

const total = computed(() => subtotal.value - discount.value);

function placeOrder() {
  if (!selectedAddressId.value) return alert("Vui lòng chọn địa chỉ giao hàng");
  emit("place-order", { addressId: selectedAddressId.value, promoCode: promoInput.value || undefined });
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
    <h2 class="text-2xl font-semibold">Tóm tắt đơn hàng</h2>

    <div class="space-y-2">
      <label class="font-medium">Địa chỉ giao hàng</label>
      <select v-model="selectedAddressId" class="w-full border rounded-lg p-2">
        <option v-for="addr in userAddresses" :key="addr.id" :value="addr.id">
          {{ addr.label }} - {{ addr.detail }}
        </option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="font-medium">Mã khuyến mãi</label>
      <input
        v-model="promoInput"
        type="text"
        placeholder="Nhập mã khuyến mãi"
        class="w-full border rounded-lg p-2"
      />

      <select v-model="selectedPromoId" class="w-full border rounded-lg p-2 mt-2">
        <option value="" disabled selected>Chọn mã có sẵn</option>
        <option v-for="promo in promoCodes" :key="promo.id" :value="promo.id">
          {{ promo.code }} ({{ promo.discount }}%)
        </option>
      </select>
    </div>

    <div class="space-y-1">
      <p>Tiền hàng: <span class="font-semibold">{{ formatCurrencyVND(subtotal.toString()) }}</span></p>
      <p v-if="discount > 0">Giảm giá: <span class="font-semibold text-emerald-600">-{{ formatCurrencyVND(discount.toString()) }}</span></p>
      <p class="text-xl font-bold">Tổng cộng: <span>{{ formatCurrencyVND(total.toString()) }}</span></p>
    </div>

    <PrimaryButton label="Đặt hàng" :onClick="placeOrder"/>
  </div>
</template>
