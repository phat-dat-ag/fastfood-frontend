<script setup lang="ts">
import { ElCard } from "element-plus";
import type { Product } from "../../../types/product.types";
import { formatCurrencyVND } from "../../../utils/currency.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import NumberInput from "../../../components/inputs/NumberInput.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../../store/useUserStore.store";
import { ROUTE_NAMES } from "../../../constants/route-names";

interface ProductCardProps {
  product: Product;
}
const props = defineProps<ProductCardProps>();
const emit = defineEmits(["add-to-cart"]);

const router = useRouter();

const quantity = ref<number>(0);

function onQuantityChange(newQuantity: number) {
  quantity.value = newQuantity;
}

function onClickAddButton() {
  emit('add-to-cart', { product: props.product, quantity: quantity.value });
  quantity.value = 0;
}

const userStore = useUserStore();

function showProductDetail() {
  const role = userStore.user?.role;
  if (role === "ADMIN") {
    router.push({ name: ROUTE_NAMES.ADMIN.PRODUCT_DETAIL, params: { slug: props.product.slug } });
  }
  else if (role === "USER") {
    router.push({ name: ROUTE_NAMES.USER.PRODUCT_DETAIL, params: { slug: props.product.slug } });
  } else if (role === "STAFF") {
    router.push({ name: ROUTE_NAMES.STAFF.PRODUCT_DETAIL, params: { slug: props.product.slug } });
  } else {
    router.push({ name: ROUTE_NAMES.GUEST.PRODUCT_DETAIL, params: { slug: props.product.slug } });
  }
}

</script>
<template>
  <ElCard shadow="hover"
    class="w-full h-full flex flex-col justify-between transition-transform hover:scale-[1.02] rounded-2xl overflow-hidden">
    <img :src="props.product.imageUrl" alt="product" class="w-full h-44 object-cover" @click="showProductDetail" />

    <div class="flex flex-col flex-1 justify-between p-3" @click="showProductDetail">
      <h3 class="text-base font-semibold line-clamp-1 mb-2 text-gray-800">
        {{ props.product.name }}
      </h3>

      <div class="flex items-center gap-2 mb-3">
        <template v-if="props.product.price !== props.product.discountedPrice">
          <span class="text-red-600 font-bold text-lg">
            {{ formatCurrencyVND(props.product.discountedPrice) }}
          </span>
          <span class="line-through text-gray-400 text-sm">
            {{ formatCurrencyVND(props.product.price) }}
          </span>
          <span class="ml-auto bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            -{{ Math.round(((Number(props.product.price) - Number(props.product.discountedPrice)) /
              Number(props.product.price)) * 100) }}%
          </span>
        </template>

        <template v-else>
          <span class="text-blue-600 font-semibold text-lg">
            {{ formatCurrencyVND(props.product.price) }}
          </span>
        </template>
      </div>
    </div>
    <div class="flex items-center justify-between gap-2">
      <NumberInput :value="quantity" :min="0" :max="100" :step="1" @quantity-change="onQuantityChange" />
      <PrimaryButton label="Thêm" :onClick="onClickAddButton" class="flex-1" />
    </div>
  </ElCard>

</template>
<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
